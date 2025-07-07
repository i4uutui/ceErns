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
    'SELECT * FROM ad_user WHERE username = ?',
    [username]
  );
  if (rows.length === 0) {
    return res.json({ message: '账号或密码错误', code: 401 });
  }
  if(rows[0].status == 0){
    return res.json({ message: '账号已被禁用，请联系管理员', code: 401 });
  }
  
  const isPasswordValid = await bcrypt.compare(password, rows[0].password);
  
  if (!isPasswordValid) {
    return res.json({ message: '账号或密码错误', code: 401 });
  }

  const [companyRows] = await pool.execute(
    'SELECT * FROM ad_company_info WHERE id = ?',
    [rows[0].company_id]
  );
  
  const token = jwt.sign({ ...rows[0] }, process.env.JWT_SECRET);
  
  const { password: _, ...userWithoutPassword } = rows[0];

  res.json({ 
    token, 
    user: formatObjectTime(userWithoutPassword), 
    company: companyRows.length > 0 ? formatObjectTime(companyRows[0]) : null, 
    code: 200 
  });
});

module.exports = router;    