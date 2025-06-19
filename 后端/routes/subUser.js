const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 添加用户
router.post('/user', authMiddleware, async (req, res) => {
  const { username, password, name, company, uid, power, status, attr } = req.body;
    // 对密码进行加密
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO sub_admins (username, password, name, company, uid, power, status, attr) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, name, company, uid, power, status, attr]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_admins WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: rows[0], code: 200 });
});

// 获取后台用户列表（分页）
router.get('/user', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const currentUserId = req.user.id;
  // 查询当前页的数据，排除当前登录用户，只显示其创建的用户
  const [rows] = await pool.execute(
    'SELECT id, username, name, company, avatar_url, attr, power, uid, status, created_at, updated_at FROM sub_admins WHERE uid = ? AND deleted_at IS NULL LIMIT ? OFFSET ?',
    [currentUserId, parseInt(pageSize), offset]
  );
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_admins WHERE uid = ? AND deleted_at IS NULL', [currentUserId]);
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

// 更新子管理员接口
router.put('/user', authMiddleware, async (req, res) => {
  const { username, password, name, power, status, id } = req.body;
  
  try {
    // 先查询原始密码
    const [adminRows] = await pool.execute(
      'SELECT password FROM sub_admins WHERE id = ?',
      [id]
    );
    
    if (adminRows.length === 0) {
      return res.json({ message: '管理员不存在', code: 404 });
    }
    
    // 如果密码字段存在且不为空，则加密新密码
    // 否则使用原始密码
    const passwordToUpdate = password ? await bcrypt.hash(password, 10) : adminRows[0].password;

    // 更新管理员信息（updated_at 会自动更新）
    await pool.execute(
      'UPDATE sub_admins SET username = ?, password = ?, name = ?, power = ?, status = ? WHERE id = ?',
      [username, passwordToUpdate, name, power, status, id]
    );
    
    // 查询更新后的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_admins WHERE id = ?',
      [id]
    );
    
    res.json({ data: rows[0], code: 200 });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除子后台用户
router.delete('/user/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // 更新 deleted_at 为当前时间
    const [result] = await pool.execute(
      'UPDATE sub_admins SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '用户不存在或已被删除' });
    }
    
    res.json({ message: '删除成功', code: 200 });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;   