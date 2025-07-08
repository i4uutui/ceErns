const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ message: '认证失败', code: 402 });
  
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ message: '认证失败', code: 402 });
    
    const [rows] = await pool.execute(
      'SELECT * FROM ad_user WHERE id = ? and status = 1 and is_deleted = 1',
      [decoded.id]
    );
    if (rows.length === 0) {
      return res.json({ message: '账号已失效，请联系管理员', code: 402 });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;    