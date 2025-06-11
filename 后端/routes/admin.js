// ceErns/后端/routes/admin.js
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
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM super_admin WHERE username = ?',
      [username]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: '账号或密码错误' });
    }

    const isPasswordValid = await bcrypt.compare(password, rows[0].password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: '账号或密码错误' });
    }
    
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET);
    
    res.json({ token, code: 200 });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取子后台用户列表（分页）
router.get('/sub-admins', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_admins LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );

    // 查询总记录数
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_admins');
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
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加子后台用户
router.post('/sub-admins', authMiddleware, async (req, res) => {
  const { username, password, company } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO sub_admins (username, password, company) VALUES (?, ?, ?)',
      [username, password, company]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_admins WHERE id = ?',
      [result.insertId]
    );
    
    res.json({ data: rows[0], code: 200 });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新子管理员接口
router.put('/sub-admins', authMiddleware, async (req, res) => {
  const { username, password, company, id } = req.body;
  
  try {
    // 更新管理员信息（updated_at 会自动更新）
    await pool.execute(
      'UPDATE sub_admins SET username = ?, password = ?, company = ? WHERE id = ?',
      [username, password, company, id]
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
router.delete('/sub-admins/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute(
      'DELETE FROM sub_admins WHERE id = ?',
      [id]
    );
    res.json({ message: '删除成功', code: 200 });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;