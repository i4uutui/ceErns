const express = require('express');
const router = express.Router();
const { AdUser, AdCompanyInfo, Op } = require('../models')
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 子后台登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const rows = await AdUser.findAll({ where: { username } })
  if (rows.length === 0) {
    return res.json({ message: '账号或密码错误', code: 401 });
  }
  row = rows.map(e => e.toJSON())
  if(row[0].status == 0){
    return res.json({ message: '账号已被禁用，请联系管理员', code: 401 });
  }
  const isPasswordValid = await bcrypt.compare(password, row[0].password);
  if (!isPasswordValid) {
    return res.json({ message: '账号或密码错误', code: 401 });
  }

  const companyRows = await AdCompanyInfo.findAll({ where: { id: row[0].company_id }, raw: true });
  
  const token = jwt.sign({ ...row[0] }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  const { password: _, ...user } = row[0];

  res.json({ 
    token, 
    user: formatObjectTime(user), 
    company: companyRows.length > 0 ? formatObjectTime(companyRows[0]) : null, 
    code: 200 
  });
});

module.exports = router;    