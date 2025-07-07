const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 总后台登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.execute(
    'SELECT * FROM ad_admin WHERE username = ?',
    [username]
  );
  if (rows.length === 0) {
    return res.json({ message: '账号或密码错误', code: 401 });
  }
  const isPasswordValid = await bcrypt.compare(password, rows[0].password);
  if (!isPasswordValid) {
    return res.json({ message: '账号或密码错误', code: 401 });
  }
  const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET);
  res.json({ token, code: 200 });
});

// 获取企业列表
router.get('/company', async (req, res) => {
  const { page = 1, pageSize = 10, name = '' } = req.query;
  const offset = (page - 1) * pageSize;
  
  // 基础SQL和参数
  let querySql = 'select * from ad_company_info';
  let countSql = 'select count(*) as total from ad_company_info';
  const params = [];
  
  // 如果提供了name参数，添加模糊搜索条件
  if (name) {
    querySql += ' where name like ?';
    countSql += ' where name like ?';
    params.push(`%${name}%`); // 模糊匹配前后都加%
  }
  
  // 添加排序和分页
  querySql += ' order by created_at desc limit ? offset ?';
  params.push(parseInt(pageSize), offset);
  
  // 执行查询
  const [rows] = await pool.execute(
    querySql,
    params
  );
  
  // 获取总数（注意这里的参数需要排除分页参数）
  const countParams = name ? [`%${name}%`] : [];
  const [countRows] = await pool.execute(
    countSql,
    countParams
  );
  
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / pageSize);
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(rows), 
    total, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
})
// 添加企业信息
router.post('/company', async (req, res) => {
  const { name, person, contact, address } = req.body
  
  const [rows] = await pool.execute(
    'select id from ad_company_info where name = ?',
    [name]
  )
  if(rows.length != 0){
    return res.json({ message: '该企业已被注册', code: 401 })
  }
  
  await pool.execute(
    'insert into ad_company_info (name, person, contact, address) values (?, ?, ?, ?)',
    [name, person, contact, address]
  )
  
  res.json({ message: '添加成功', code: 200 })
})
// 更新企业信息
router.put('/company', async (req, res) => {
  const { name, person, contact, address, id } = req.body
  
  const [rows] = await pool.execute(
    'select id from ad_company_info where name = ? and id != ?',
    [name, id]
  )
  if(rows.length != 0){
    return res.json({ message: '该企业已被注册', code: 401 })
  }
  
  await pool.execute(
    'update ad_company_info set name = ?, person = ?, contact = ?, address = ? WHERE id = ?',
    [name, person, contact, address, id]
  );
  
  res.json({ message: '修改成功', code: 200 })
})

// 获取子后台用户列表（分页）
router.get('/user', async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  // 查询当前页的数据
  const [rows] = await pool.execute(
    `
    select
    u.id, u.username, u.status, u.company_id, u.created_at, u.updated_at,
    c.id as company_id, c.name as company_name, c.address, c.person, c.contact
    from ad_user u
    left join ad_company_info c on u.company_id = c.id
    order by u.created_at desc
    limit ? offset ?
    `,
    [parseInt(pageSize), offset]
  );
  
  // 查询总记录数
  const [countRows] = await pool.execute('select count(*) as total from ad_user');
  const total = countRows[0].total;
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
  
  const formattedData = rows.map(row => {
    const company = row.company_id ? {
      id: row.company_id,
      name: row.company_name,
      address: row.address,
      person: row.person,
      contact: row.contact
    } : null
    const { company_name, address, person, contact, ...userData } = row;
    return { company, ...userData }
  })

  // 返回所需信息
  res.json({ 
    data: formatArrayTime(formattedData), 
    total, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
});

// 添加子后台用户
router.post('/user', async (req, res) => {
  const { username, password, status, company_id } = req.body;
  
  const [rows] = await pool.execute(
    "SELECT id FROM ad_user WHERE username = ?", 
    [username]
  )
  if (rows.length > 0) {
    return res.json({ message: '用户名不能重复', code: 401 });
  }
  // 对密码进行加密
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.execute(
    'INSERT INTO ad_user (username, password, status, company_id) VALUES (?, ?, ?, ?)',
    [username, password, status, company_id]
  );

  res.json({ data: '添加成功', code: 200 });
});

// 更新子管理员接口
router.put('/user', async (req, res) => {
  const { username, password, status, company_id, id } = req.body;
  
  const [count] = await pool.execute(
    "select id from ad_user WHERE username = ? and id != ?", [username, id]
  )
  if(count.length != 0){
    return res.json({message: '用户名已被使用', code: 401})
  }
  // 先查询原始密码
  const [rows] = await pool.execute(
    'SELECT password FROM ad_user WHERE id = ?',
    [id]
  );
  
  if (rows.length === 0) {
    return res.json({ message: '管理员不存在', code: 401 });
  }
  
  const passwordToUpdate = password ? await bcrypt.hash(password, 10) : rows[0].password;

  // 更新管理员信息（updated_at 会自动更新）
  await pool.execute(
    'UPDATE ad_user SET username = ?, password = ?, status = ?, company_id = ? WHERE id = ?',
    [username, password, status, company_id, id]
  );
  
  res.json({ message: '修改成功', code: 200 });
});

module.exports = router;