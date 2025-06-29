const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取产品编码列表（分页）
router.get('/products_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_products_code LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );
    
    // 查询总记录数
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_products_code');
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
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 添加产品编码
router.post('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO sub_products_code (product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_products_code WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: rows[0], code: 200 });
  } catch(error){
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 更新产品编码接口
router.put('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, id } = req.body;
  
  try {
    // 更新产品编码信息
    const [updateResult] = await pool.execute(
      'UPDATE sub_products_code SET product_code = ?, product_name = ?, model = ?, specification = ?, other_features = ?, component_structure = ?, unit = ?, unit_price = ?, currency = ?, production_requirements = ? WHERE id = ?',
      [product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '未找到该产品编码', code: 404 });
    }
    
    // 查询更新后的完整信息（修复表名错误）
    const [rows] = await pool.execute(
      'SELECT * FROM sub_products_code WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到该产品编码', code: 404 });
    }
    
    res.json({ data: formatObjectTime(rows[0]), code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});