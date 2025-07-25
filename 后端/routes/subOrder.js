const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const pool = require('../config/database');
const { SubCustomerInfo, SubProductQuotation, SubProductsCode, SubSaleOrder, SubProductNotice, Op } = require('../models')
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
  const totalPages = Math.ceil(count / pageSize)
  
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




// 获取销售订单列表（分页）
router.get('/sale_order', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubSaleOrder.findAndCountAll({
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
  
  row = rows.map(e => e.toJSON())
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(row), 
    total: count, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
});

// 添加销售订单
router.post('/sale_order', authMiddleware, async (req, res) => {
  const { customer_id, product_id, rece_time, customer_order, product_req, order_number, unit, delivery_time, goods_time, goods_address } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  await SubSaleOrder.create({
    customer_id, product_id, rece_time, customer_order, product_req, order_number, unit, delivery_time, goods_time, goods_address, company_id,
    user_id: userId
  })
  
  res.json({ message: '添加成功', code: 200 });
});

// 更新产品报价
router.put('/sale_order', authMiddleware, async (req, res) => {
  const { customer_id, product_id, rece_time, customer_order, product_req, order_number, unit, delivery_time, goods_time, goods_address, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const updateResult = await SubSaleOrder.update({
    customer_id, product_id, rece_time, customer_order, product_req, order_number, unit, delivery_time, goods_time, goods_address, company_id,
    user_id: userId
  }, {
    where: {
      id
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
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
      {
        model: SubSaleOrder,
        as: 'sale',
        include: [
          { model: SubProductsCode, as: 'product' }
        ]
      },
      {
        model: SubCustomerInfo,
        as: 'customer'
      }
    ],
    order: [
      [{ model: SubSaleOrder, as: 'sale' }, { model: SubProductsCode, as: 'product' }, 'product_name', 'DESC'],
      ['created_at', 'DESC']
    ],
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
  const { sale_id, notice, product_price, transaction_currency, other_transaction_terms } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  let customer_id = ''
  const saleOrder = await SubSaleOrder.findOne({
    where: { id: sale_id },
    raw: true
  })
  if(saleOrder){
    customer_id = saleOrder.customer_id
  }else{
    return res.json({ code: 401, message: '数据出错，请联系管理员' })
  }
  
  const create = {
    customer_id, sale_id, notice, product_price, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  }
  console.log(create);
  return
  await SubProductQuotation.create(create)
  
  res.json({ message: '添加成功', code: 200 });
});
// 更新产品报价
router.put('/product_quotation', authMiddleware, async (req, res) => {
  const { sale_id, notice, product_price, transaction_currency, other_transaction_terms, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const updateResult = await SubProductQuotation.update({
    sale_id, notice, product_price, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  }, {
    where: { id }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
});



// 生产通知单
router.get('/product_notice', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10, customer_abbreviation, customer_order, goods_address } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const saleOrderWhere = {}
  if(customer_order) saleOrderWhere.customer_order = { [Op.like]: `%${customer_order}%` }
  if(goods_address) {
    saleOrderWhere[Op.or] = [
      { goods_address: { [Op.like]: `%${goods_address}%` } },
      { id: Sequelize.col('quote.sale_id') }
    ]
  }
  const customerInfoWhere = {}
  if(customer_abbreviation) {
    customerInfoWhere[Op.or] = [
      { customer_abbreviation: { [Op.like]: `%${customer_abbreviation}%` } },
      { id: Sequelize.col('quote->sale.customer_id') }
    ];
  }
  const { count, rows } = await SubProductNotice.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    attributes: ['id', 'quote_id', 'notice', 'delivery_time', 'created_at'],
    include: [
      {
        model: SubProductQuotation,
        as: 'quote',
        attributes: ['id','product_price'],
        required: false,
        include: [
          {
            model: SubSaleOrder,
            as: 'sale',
            attributes: ['id','order_number','unit','goods_address', 'customer_order', 'rece_time', 'product_req'],
            where: saleOrderWhere,
            required: false,
            include: [
              {
                model: SubCustomerInfo, 
                as: 'customer',
                attributes: ['id', 'customer_code','customer_abbreviation'],
                where: customerInfoWhere,
                required: false,
              },
              {
                model: SubProductsCode,
                as: 'product',
                attributes: ['id', 'product_code','product_name','model','specification', 'other_features', 'drawing', 'component_structure'],
                required: false
              }
            ]
          },
        ]
      }
    ],
    order: [
      ['created_at', 'DESC']
    ],
    limit: parseInt(pageSize),
    offset,
    nest: true,
  })
  const totalPages = Math.ceil(count / pageSize);
  
  const fromData = rows.map(item => item.dataValues)
  
  res.json({ 
    data: formatArrayTime(fromData), 
    total: count, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
})
router.post('/product_notice', authMiddleware, async (req, res) => {
  const { notice, quote_id, delivery_time } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  await SubProductNotice.create({
    notice, quote_id, delivery_time, company_id,
    user_id: userId
  })
  
  res.json({ message: '添加成功', code: 200 });
});
router.put('/product_notice', authMiddleware, async (req, res) => {
  const { notice, quote_id, delivery_time, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const updateResult = await SubProductNotice.update({
    notice, quote_id, delivery_time, company_id,
    user_id: userId
  }, {
    where: {
      id
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
});

module.exports = router;


