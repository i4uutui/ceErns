const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取后台用户列表（分页）
router.get('/user', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;

  const { id: userId, company_id } = req.user;
  // 查询当前页的数据，排除当前登录用户，只显示其创建的用户
  const [rows] = await pool.execute(
    'SELECT * FROM ad_user WHERE is_deleted = 1 and type = 2 and company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [company_id, parseInt(pageSize), offset]
  );
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM ad_user WHERE is_deleted = 1 and company_id = ?', [company_id]);
  const total = countRows[0].total;
  // 计算总页数
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
});

// 添加用户
router.post('/user', authMiddleware, async (req, res) => {
  const { username, password, name, power, status } = req.body;
  
  const { id: parent_id, company_id } = req.user
  // 检查用户名是否已存在
  const [existingUser] = await pool.execute(
    'SELECT id FROM ad_user WHERE username = ?',
    [username]
  );
  if (existingUser.length > 0) {
    return res.json({ message: '用户名已被使用，请输入其他用户名', code: 401 });
  }
  if(password.length < 6){
    return res.json({ message: '密码长度需大于等于6位，请重新输入', code: 401 })
  }
  
    // 对密码进行加密
  const hashedPassword = await bcrypt.hash(password, 10);
  const type = 2
  
  const [result] = await pool.execute(
    'INSERT INTO ad_user (username, password, name, power, status, parent_id, company_id, type ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [username, hashedPassword, name, power, status, parent_id, company_id, type]
  );
  
  res.json({ message: '添加成功', code: 200 });
});

// 更新子管理员接口
router.put('/user', authMiddleware, async (req, res) => {
  const { username, password, name, power, status, id } = req.body;
  
  const { id: parent_id, company_id } = req.user
  
  // 检查新用户名是否已被其他用户使用
  if (username) {
    const [usernameCheck] = await pool.execute(
      'SELECT id FROM ad_user WHERE username = ? AND id != ?',
      [username, id]
    );
    
    if (usernameCheck.length > 0) {
      return res.json({ 
        code: 400, 
        message: '用户名已被其他用户使用' 
      });
    }
  }

  // 先查询原始密码
  const [adminRows] = await pool.execute(
    'SELECT password FROM ad_user WHERE id = ?',
    [id]
  );
  
  // 如果密码字段存在且不为空，则加密新密码
  // 否则使用原始密码
  const passwordToUpdate = password ? await bcrypt.hash(password, 10) : adminRows[0].password;
  const type = 2

  // 更新管理员信息（updated_at 会自动更新）
  await pool.execute(
    'UPDATE ad_user SET username = ?, password = ?, name = ?, power = ?, type = ?, company_id = ?, parent_id = ?, status = ? WHERE id = ?',
    [username, passwordToUpdate, name, power, type, company_id, parent_id, status, id]
  );
  
  res.json({ message: "修改成功", code: 200 });
});

// 删除子后台用户
router.delete('/user/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  const [result] = await pool.execute(
    'UPDATE ad_user SET is_deleted = 0 WHERE id = ? AND is_deleted = 1',
    [id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '用户不存在或已被删除', code: 401 });
  }
  
  await pool.execute(
    'UPDATE ad_user SET is_deleted = 0 WHERE parent_id = ? AND is_deleted = 1',
    [id]
  );
  
  res.json({ message: '删除成功', code: 200 });
});

module.exports = router;   