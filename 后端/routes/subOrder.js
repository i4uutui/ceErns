const express = require('express');
const router = express.Router();
const { SubCustomerInfo, SubProductQuotation, SubProductCode, SubPartCode, SubSaleOrder, SubProductNotice, SubProductionProgress, SubProcessBom, SubProcessBomChild, SubProcessCode, SubEquipmentCode, SubProcessCycle, Op } = require('../models')
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
      { model: SubCustomerInfo, as: 'customer'},
      { model: SubProductCode, as: 'product' }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  
  const totalPages = Math.ceil(count / pageSize);
  
  const row = rows.map(e => e.toJSON())
  
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
    user_id: userId,
    actual_number: order_number
  })
  
  res.json({ message: '添加成功', code: 200 });
});

// 更新销售订单
router.put('/sale_order', authMiddleware, async (req, res) => {
  const { customer_id, product_id, rece_time, customer_order, product_req, order_number, unit, delivery_time, goods_time, goods_address, actual_number, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const updateResult = await SubSaleOrder.update({
    customer_id, product_id, rece_time, customer_order, product_req, order_number, unit, delivery_time, goods_time, goods_address, actual_number, company_id,
    user_id: userId,
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
      { model: SubSaleOrder, as: 'sale' },
      { model: SubCustomerInfo, as: 'customer' },
      { model: SubProductCode, as: 'product' }
    ],
    order: [
      [{ model: SubProductCode, as: 'product' }, 'product_name', 'DESC'],
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
  let product_id = ''
  const saleOrder = await SubSaleOrder.findOne({
    where: { id: sale_id },
    raw: true
  })
  if(saleOrder){
    customer_id = saleOrder.customer_id
    product_id = saleOrder.product_id
  }else{
    return res.json({ code: 401, message: '数据出错，请联系管理员' })
  }
  const create = {
    sale_id, customer_id, product_id, notice, product_price, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  }
  await SubProductQuotation.create(create)
  
  res.json({ message: '添加成功', code: 200 });
});
// 更新产品报价
router.put('/product_quotation', authMiddleware, async (req, res) => {
  const { sale_id, notice, product_price, transaction_currency, other_transaction_terms, id } = req.body;
  
  const { id: userId, company_id } = req.user;

  let customer_id = ''
  let product_id = ''
  const saleOrder = await SubSaleOrder.findOne({
    where: { id: sale_id },
    raw: true
  })
  if(saleOrder){
    customer_id = saleOrder.customer_id
    product_id = saleOrder.product_id
  }else{
    return res.json({ code: 401, message: '数据出错，请联系管理员' })
  }
  
  const updateResult = await SubProductQuotation.update({
    sale_id, customer_id, product_id, notice, product_price, transaction_currency, other_transaction_terms, company_id,
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
  let saleOrderWhere = {}
  let customerInfoWhere = {}
  if(customer_order) saleOrderWhere.customer_order = { [Op.like]: `%${customer_order}%` }
  if(goods_address) saleOrderWhere.goods_address = { [Op.like]: `%${goods_address}%` }
  if(customer_abbreviation) customerInfoWhere.customer_abbreviation = { [Op.like]: `%${customer_abbreviation}%` }
  
  const { count, rows } = await SubProductNotice.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    include: [
      { model: SubSaleOrder, as: 'sale', where: saleOrderWhere },
      { model: SubCustomerInfo, as: 'customer', where: customerInfoWhere },
      { model: SubProductCode, as: 'product' }
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
  const { sale_id, notice, delivery_time } = req.body;
  
  const { id: userId, company_id } = req.user;

  let customer_id = ''
  let product_id = ''
  const quote = await SubSaleOrder.findOne({
    where: { id: sale_id },
    raw: true
  })
  if(quote){
    customer_id = quote.customer_id
    product_id = quote.product_id
  }else{
    return res.json({ code: 401, message: '数据出错，请联系管理员' })
  }
  
  await SubProductNotice.create({
    notice, customer_id, product_id, sale_id, delivery_time, company_id,
    user_id: userId
  })
  
  res.json({ message: '添加成功', code: 200 });
});
router.put('/product_notice', authMiddleware, async (req, res) => {
  const { notice, sale_id, delivery_time, id } = req.body;
  
  const { id: userId, company_id } = req.user;

  let customer_id = ''
  let product_id = ''
  const quote = await SubSaleOrder.findOne({
    where: { id: sale_id },
    raw: true
  })
  if(quote){
    customer_id = quote.customer_id
    product_id = quote.product_id
  }else{
    return res.json({ code: 401, message: '数据出错，请联系管理员' })
  }
  
  const updateResult = await SubProductNotice.update({
    notice, customer_id, product_id, sale_id, delivery_time, company_id,
    user_id: userId
  }, {
    where: {
      id
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
});
// 通知单排产
router.post('/set_production_progress', authMiddleware, async (req, res) => {
  const { id } = req.body;
  const { id: userId, company_id } = req.user;
  
  // 验证数据是否存在
  const notice = await SubProductNotice.findOne({
    where: { id },
    include: [
      { model: SubSaleOrder, as: 'sale' },
      { model: SubCustomerInfo, as: 'customer' },
      { model: SubProductCode, as: 'product' }
    ]
  });
  if (!notice) return res.json({ message: '数据不存在，或已被删除', code: 401 });
  const noticeRow = notice.toJSON()
  if(noticeRow.is_notice == 0) return res.json({ message: '此订单已有排产记录，不能重复排产', code: 401 })
  
  // 通过产品id查找工艺BOSS中相同的产品id数据
  const bom = await SubProcessBom.findAll({
    where: {
      product_id: noticeRow.product_id,
      archive: 0
    },
    attributes: ['id', 'archive', 'product_id', 'part_id'],
    include: [
      { model: SubProductCode, as: 'product', attributes: ['id', 'product_name', 'product_code', 'drawing'] },
      { model: SubPartCode, as: 'part', attributes: ['id', 'part_name', 'part_code'] },
      {
        model: SubProcessBomChild,
        as: 'children',
        attributes: ['id', 'process_bom_id', 'process_id', 'equipment_id', 'process_index', 'time', 'price', 'cycle_id', 'all_time', 'all_load', 'add_finish', 'order_number'],
        include: [
          { model: SubProcessCode, as: 'process', attributes: ['id', 'process_code', 'process_name', 'section_points'] },
          { model: SubEquipmentCode, as: 'equipment', attributes: ['id', 'equipment_code', 'equipment_name'] },
          { model: SubProcessCycle, as: 'cycle', attributes: ['id', 'name'] }
        ]
      }
    ],
    order: [
      ['id', 'DESC'],
    ],
  })
  let wait = []
  const bomRows = bom.map(e => {
    const data = e.toJSON()
    data.children.forEach(o => {
      if(o.order_number == null){
        wait.push({ ...o, order_number: noticeRow.sale.order_number })
        o.order_number = noticeRow.sale.order_number
      }
    })
    return data
  })
  if(wait.length != 0){
    SubProcessBomChild.bulkCreate(wait, {updateOnDuplicate:["order_number"]})
  }
  noticeRow.bom = bomRows
  
  const objData = []
  bomRows.forEach(item => {
    const obj = {
      company_id,
      user_id: userId,
      notice_id: id,
      customer_id: noticeRow.customer_id,
      product_id: item.product_id,
      part_id: item.part_id,
      bom_id: item.id,
      order_number: noticeRow.sale.order_number,
      out_number: null,
      start_date: null,
      remarks: null
    }
    objData.push(obj)
  })
  const result = await SubProductionProgress.bulkCreate(objData, {updateOnDuplicate:['company_id', 'user_id', 'notice_id', 'customer_id', 'product_id', 'part_id', 'bom_id', 'order_number', 'out_number', 'remarks']})
  
  if(objData.length){
    // 设置此数据为已排产
    await SubProductNotice.update({
      is_notice: 0
    }, { where: { id } })
  }
  
  res.json({ message: '操作成功', code: 200 });
})

module.exports = router;


