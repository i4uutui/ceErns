const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 子后台登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.execute(
    'SELECT * FROM sub_admins WHERE username = ?',
    [username]
  );
  if (rows.length === 0) {
    return res.json({ message: '账号或密码错误', code: 401 });
  }
  if(rows[0].status == 0){
    return res.json({ message: '账号已被禁用，请联系管理员', code: 401 });
  }
  if(rows[0].deleted_at != null){
    return res.json({ message: '账号已被删除，请联系管理员', code: 401 });
  }
  
  const isPasswordValid = await bcrypt.compare(password, rows[0].password);
  
  if (!isPasswordValid) {
    return res.json({ message: '账号或密码错误', code: 401 });
  }
  
  const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET);
  
  const { password: _, ...userWithoutPassword } = rows[0];
  res.json({ token, user: formatObjectTime(userWithoutPassword), code: 200 });
});

module.exports = router;    