const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');
const { formatQuotation } = require('../middleware/util')

// 获取客户信息列表（分页）
router.get('/customer_info', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const [rows] = await pool.execute(
    'SELECT * FROM sub_customer_info WHERE is_deleted = 1 and company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [company_id, parseInt(pageSize), offset]
  );
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_customer_info WHERE is_deleted = 1 and company_id = ?', [company_id]);
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
});

// 添加客户信息
router.post('/customer_info', authMiddleware, async (req, res) => {
  const { customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_customer_info where customer_code = ? and company_id = ?',
    [customer_code, company_id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }

    const [result] = await pool.execute(
      'INSERT INTO sub_customer_info (customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms, user_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms, userId, company_id]
    );
    
    res.json({ message: "添加成功", code: 200 });
});

// 更新客户信息接口
router.put('/customer_info', authMiddleware, async (req, res) => {
  const { customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_customer_info where customer_code = ? and company_id = ? and id != ?',
    [customer_code, company_id, id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
    // 更新客户信息
    const [updateResult] = await pool.execute(
      'UPDATE sub_customer_info SET customer_code = ?, customer_abbreviation = ?, contact_person = ?, contact_information = ?, company_full_name = ?, company_address = ?, delivery_address = ?, tax_registration_number = ?, transaction_method = ?, transaction_currency = ?, other_transaction_terms = ?, user_id = ?, company_id = ? WHERE id = ?',
      [customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms, userId, company_id, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '未找到该客户信息', code: 404 });
    }
    
    res.json({ message: "修改成功", code: 200 });
});
// 删除客户信息
router.delete('/customer_info/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  const [result] = await pool.execute(
    'UPDATE sub_customer_info SET is_deleted = 0 WHERE id = ? and is_deleted = 1 and company_id = ?',
    [id, company_id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '客户信息不存在或已被删除', code: 401 });
  }
  
  res.json({ message: '删除成功', code: 200 });
});



// 获取产品报价列表（分页）
router.get('/product_quotation', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const [rows] = await pool.execute(
    `
    select 
      spq.*,
      sci.*,
      spc.*
    from
      sub_product_quotation spq
    join
      sub_customer_info sci on spq.customer_id = sci.id
    join
      sub_products_code spc on spq.product_id = spc.id
    where spq.is_deleted = 1 and spq.company_id = ?
    ORDER BY spq.created_at DESC
    LIMIT ? offset ?
    `, 
    [company_id, parseInt(pageSize), offset]
  )
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_product_quotation WHERE is_deleted = 1 and company_id = ?', [company_id]);
  const total = countRows[0].total;
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  const fieldMap = {
    product: [ 'product_code', 'product_name', 'model', 'specification', 'other_features', 'component_structure', 'unit', 'unit_price', 'currency', 'production_requirements', 'id' ],
    customer: [ 'customer_code', 'customer_abbreviation', 'contact_person', 'contact_information', 'company_full_name', 'company_address', 'delivery_address', 'tax_registration_number', 'transaction_method', 'transaction_currency', 'other_transaction_terms', 'id' ]
  }

  const formData = rows.map(formatQuotation, fieldMap)
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(formData), 
    total, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
});
// 添加产品报价
router.post('/product_quotation', authMiddleware, async (req, res) => {
  const { customer_id, product_id, model, spec, order_char, customer_order, order_number, product_unit, product_price, transaction_currency, other_transaction_terms } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [result] = await pool.execute(
    'INSERT INTO sub_product_quotation (customer_id, product_id, model, spec, order_char, customer_order, order_number, product_unit, product_price, transaction_currency, other_transaction_terms, user_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [customer_id, product_id, model, spec, order_char, customer_order, order_number, product_unit, product_price, transaction_currency, other_transaction_terms, userId, company_id]
  );
  
  res.json({ msg: '添加成功', code: 200 });
});
// 更新产品报价
router.put('/product_quotation', authMiddleware, async (req, res) => {
  const { customer_id, product_id, model, spec, order_char, customer_order, order_number, product_unit, product_price, transaction_currency, other_transaction_terms, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  await pool.execute(
    'UPDATE sub_product_quotation SET customer_id = ?, product_id = ?, model = ?, spec = ?, order_char = ?, customer_order = ?, order_number = ?, product_unit = ?, product_price = ?, transaction_currency = ?, other_transaction_terms = ?, user_id = ?, company_id = ? WHERE id = ?',
    [customer_id, product_id, model, spec, order_char, customer_order, order_number, product_unit, product_price, transaction_currency, other_transaction_terms, userId, company_id, id]
  );
  
  res.json({ msg: '修改成功', code: 200 });
});

module.exports = router;