const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取客户信息列表（分页）
router.get('/customer_info', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_customer_info LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );
    
    // 查询总记录数
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_customer_info');
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

// 添加客户信息
router.post('/customer_info', authMiddleware, async (req, res) => {
  const { customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO sub_customer_info (customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_customer_info WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: rows[0], code: 200 });
  } catch(error){
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 更新客户信息接口
router.put('/customer_info', authMiddleware, async (req, res) => {
  const { customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms, id } = req.body;
  
  try {
    // 更新客户信息
    const [updateResult] = await pool.execute(
      'UPDATE sub_customer_info SET customer_code = ?, customer_abbreviation = ?, contact_person = ?, contact_information = ?, company_full_name = ?, company_address = ?, delivery_address = ?, tax_registration_number = ?, transaction_method = ?, transaction_currency = ?, other_transaction_terms = ? WHERE id = ?',
      [customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '未找到该客户信息', code: 404 });
    }
    
    // 查询更新后的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_customer_info WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到该客户信息', code: 404 });
    }
    
    res.json({ data: formatObjectTime(rows[0]), code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});




module.exports = router;