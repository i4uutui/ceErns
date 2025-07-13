const express = require('express');
const router = express.Router();
const { AdAdmin, AdCompanyInfo, AdUser, Op } = require('../models')
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 总后台登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const rows = await AdAdmin.findAll({
    where: { username }
  })
  if (rows.length == 0) {
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
  
  const { count, rows } = await AdCompanyInfo.findAndCountAll({
    where: {
      name: {
        [Op.like]: `%${name}%`
      }
    },
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  const totalPages = Math.ceil(count / pageSize)  
  const fromData = rows.map(item => item.dataValues)
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(fromData), 
    total: count,
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
})
// 添加企业信息
router.post('/company', async (req, res) => {
  const { logo, name, person, contact, address } = req.body
  
  await AdCompanyInfo.create({
    logo, name, person, contact, address
  })
  
  res.json({ message: '添加成功', code: 200 })
})
// 更新企业信息
router.put('/company', async (req, res) => {
  const { logo, name, person, contact, address, id } = req.body
  
  const updateResult = await AdCompanyInfo.update({
    logo, name, person, contact, address
  }, {
    where: { id }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 })
})

// 获取子后台用户列表（分页）
router.get('/user', async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { count, rows } = await AdUser.findAndCountAll({
    where: {
      type: 1,
      parent_id: 0
    },
    include: [
      { model: AdCompanyInfo, as: 'company' },
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  const totalPages = Math.ceil(count / pageSize)  
  const fromData = rows.map(item => item.dataValues)
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(fromData), 
    total: count, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
});

// 添加子后台用户
router.post('/user', async (req, res) => {
  const { username, password, status, company_id } = req.body;
  
  const rows = await AdUser.findAll({
    attributes: ['id'],
    where: { username }
  })
  if (rows.length > 0) {
    return res.json({ message: '用户名不能重复', code: 401 });
  }
  
  // 对密码进行加密
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const type = 1
  const parent_id = 0
  
  await AdUser.create({ username, password: hashedPassword, status, company_id, type, parent_id })
  
  res.json({ data: '添加成功', code: 200 });
});

// 更新子管理员接口
router.put('/user', async (req, res) => {
  const { username, password, status, company_id, id } = req.body;
  
  const rows = await AdUser.findAll({
    attributes: ['id'],
    where: {
      username,
      id: {
        [Op.ne] : id
      }
    }
  })
  if(rows.length != 0){
    return res.json({message: '用户名已被使用', code: 401})
  }
  
  const hashedPassword = password ? await bcrypt.hash(password, 10) : rows[0].password;
  const type = 1
  const parent_id = 0
  
  await AdUser.update({
    username, password: hashedPassword, status, company_id, type, parent_id
  },{
    where: { id }
  })
  // 如果status等于0的话,同步修改其他parent_id一致的数据
  if(status == 0){
    await AdUser.update({
      status: 0
    }, { where: { parent_id: id } })
  }
  
  res.json({ message: '修改成功', code: 200 });
});

module.exports = router;