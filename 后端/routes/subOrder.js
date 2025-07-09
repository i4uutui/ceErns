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
      { model: SubProductsCode },
      { model: SubCustomerInfo }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  
  const totalPages = Math.ceil(count / pageSize);
  
  const fromData = rows.map(item => item.dataValues)
  
  // const [rows] = await pool.execute(
  //   `
  //   select
  //     spq.id as q_id,
  //     spq.model as q_model,
  //     spq.other_transaction_terms as q_orderText,
  //     spq.transaction_currency as q_transaction_currency,
  //     spq.created_at as q_created_at,
  //     spq.updated_at as q_updated_at,
  //     spq.*,
  //     sci.id as c_id,
  //     sci.other_transaction_terms as c_orderText,
  //     sci.transaction_currency as c_transaction_currency,
  //     sci.*,
  //     spc.id as p_id,
  //     spc.model as p_model,
  //     spc.*
  //   from
  //     sub_product_quotation spq
  //   join
  //     sub_customer_info sci on spq.customer_id = sci.id
  //   join
  //     sub_products_code spc on spq.product_id = spc.id
  //   where spq.is_deleted = 1 and spq.company_id = ?
  //   ORDER BY spq.created_at DESC
  //   LIMIT ? offset ?
  //   `, 
  //   [company_id, parseInt(pageSize), offset]
  // )
  
  // // 查询总记录数
  // const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_product_quotation WHERE is_deleted = 1 and company_id = ?', [company_id]);
  // const total = countRows[0].total;
  // // 计算总页数
  // const totalPages = Math.ceil(total / pageSize);
  
  // function formatResult(row) {
  //   return {
  //     id: row.q_id,
  //     other_transaction_terms: row.q_orderText,
  //     company_id: row.company_id,
  //     user_id: row.user_id,
  //     customer_id: row.customer_id,
  //     product_id: row.product_id,
  //     model: row.q_model,
  //     spec: row.spec,
  //     order_char: row.order_char,
  //     customer_order: row.customer_order,
  //     order_number: row.order_number,
  //     product_unit: row.product_unit,
  //     product_price: row.product_price,
  //     transaction_currency: row.q_transaction_currency,
  //     created_at: row.q_created_at,
  //     updated_at: row.q_updated_at,
  //     customer: {
  //       id: row.c_id,
  //       other_transaction_terms: row.c_orderText,
  //       customer_code: row.customer_code,
  //       customer_abbreviation: row.customer_abbreviation,
  //       contact_person: row.contact_person,
  //       contact_information: row.contact_information,
  //       company_full_name: row.company_full_name,
  //       company_address: row.company_address,
  //       delivery_address: row.delivery_address,
  //       tax_registration_number: row.tax_registration_number,
  //       transaction_method: row.transaction_method,
  //       transaction_currency: row.c_transaction_currency,
  //     },
  //     product: {
  //       id: row.p_id,
  //       product_code: row.product_code,
  //       product_name: row.product_name,
  //       model: row.p_model,
  //       specification: row.specification,
  //       other_features: row.other_features,
  //       component_structure: row.component_structure,
  //       unit: row.unit,
  //       unit_price: row.unit_price,
  //       currency: row.currency,
  //       production_requirements: row.production_requirements,
  //     }
  //   };
  // }

  // const formattedData = rows.map(row => {
  //   return formatResult(row)
  // });
  
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


