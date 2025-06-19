const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: '认证失败' });
  
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: '认证失败' });
    
    const [rows] = await pool.execute(
      'SELECT * FROM sub_admins WHERE id = ? AND deleted_at IS NULL',
      [decoded.id]
    );
    if (rows.length === 0) {
      return res.json({ message: '账号已被禁用，请联系管理员', code: 401 });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;    