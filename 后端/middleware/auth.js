const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ message: '认证失败', code: 401 });
  
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ message: '认证失败', code: 401 });
    
    let user = []
    if(decoded.type == 1){
      const [rows] = await pool.execute(
        'SELECT * FROM ad_user WHERE id = ?',
        [decoded.id]
      );
      user = rows
    }else{
      const [rows] = await pool.execute(
        'SELECT * FROM sub_user WHERE id = ? AND is_deleted = 0',
        [decoded.id]
      );
      user = rows
    }
    if (user.length === 0) {
      return res.status(401).json({ message: '账号已失效，请联系管理员', code: 401 });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;    