// ceErns/后端/routes/admin.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取子后台用户列表（分页）
router.get('/sub-admins', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM sub_admins LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_admins');
    res.json({ data: rows, total: countRows[0].total });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加子后台用户
router.post('/sub-admins', authMiddleware, async (req, res) => {
  const { username, password } = req.body;
  try {
    await pool.execute(
      'INSERT INTO sub_admins (username, password) VALUES (?, ?)',
      [username, password]
    );
    res.json({ message: '添加成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;