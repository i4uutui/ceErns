const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { SubCustomerInfo, SubProductQuotation, SubProductsCode, Op } = require('../models')
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取客户信息列表（分页）
router.get('/customer_info', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubCustomerInfo.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  const totalPages = Math.ceil(total / pageSize)
  
  const fromData = rows.map(item => item.dataValues)
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(fromData), 
    total: count, 
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
  
  const rows = await SubCustomerInfo.findAll({
    where: {
      customer_code,
      company_id
    }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  const result = await SubCustomerInfo.create({
    customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  })

  res.json({ message: "添加成功", code: 200 });
});

// 更新客户信息接口
router.put('/customer_info', authMiddleware, async (req, res) => {
  const { customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubCustomerInfo.findAll({
    where: {
      customer_code,
      company_id,
      id: {
        [Op.ne]: id
      }
    }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 更新客户信息
  const updateResult = await SubCustomerInfo.update({
    customer_code, customer_abbreviation, contact_person, contact_information, company_full_name, company_address, delivery_address, tax_registration_number, transaction_method, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  }, {
    where: { id }
  })
  if (updateResult.length == 0) {
    return res.json({ message: '未找到该客户信息', code: 404 });
  }
  
  res.json({ message: "修改成功", code: 200 });
});
// 删除客户信息
router.delete('/customer_info/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  const updateResult = await SubCustomerInfo.update({
    is_deleted: 0
  }, {
    where: {
      is_deleted: 1,
      id,
      company_id
    }
  })
  
  if (updateResult.length == 0) {
    return res.json({ message: '客户信息不存在或已被删除', code: 401 });
  }
  
  res.json({ message: '删除成功', code: 200 });
});



// 获取产品报价列表（分页）
router.get('/product_quotation', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubProductQuotation.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    include: [
      { model: SubProductsCode, as: 'product' },
      { model: SubCustomerInfo, as: 'customer'}
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  
  const totalPages = Math.ceil(count / pageSize);
  
  const fromData = rows.map(item => item.dataValues)
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(fromData), 
    total: count, 
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
  
  await SubProductQuotation.create({
    customer_id, product_id, model, spec, order_char, customer_order, order_number, product_unit, product_price, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
});
// 更新产品报价
router.put('/product_quotation', authMiddleware, async (req, res) => {
  const { customer_id, product_id, model, spec, order_char, customer_order, order_number, product_unit, product_price, transaction_currency, other_transaction_terms, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  await SubProductQuotation.update({
    customer_id, product_id, model, spec, order_char, customer_order, order_number, product_unit, product_price, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  }, {
    where: {
      id
    }
  })
  
  res.json({ msg: '修改成功', code: 200 });
});

module.exports = router;


