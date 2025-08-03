const express = require('express');
const router = express.Router();
const { SubSupplierInfo, SubMaterialQuote, SubMaterialCode, SubProductNotice, SubProductsCode, Op } = require('../models')
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取供应商列表（分页）
router.get('/supplier_info', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubSupplierInfo.findAndCountAll({
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

// 添加供应商信息
router.post('/supplier_info', authMiddleware, async (req, res) => {
  const { supplier_code, supplier_abbreviation, contact_person, contact_information, supplier_full_name, supplier_address, supplier_category, supply_method, transaction_method, transaction_currency, other_transaction_terms } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubSupplierInfo.findAll({
    where: {
      supplier_code,
      company_id
    }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  const result = await SubSupplierInfo.create({
    supplier_code, supplier_abbreviation, contact_person, contact_information, supplier_full_name, supplier_address, supplier_category, supply_method, transaction_method, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  })

  res.json({ message: "添加成功", code: 200 });
});

// 更新供应商信息接口
router.put('/supplier_info', authMiddleware, async (req, res) => {
  const { supplier_code, supplier_abbreviation, contact_person, contact_information, supplier_full_name, supplier_address, supplier_category, supply_method, transaction_method, transaction_currency, other_transaction_terms, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubSupplierInfo.findAll({
    where: {
      supplier_code,
      company_id,
      id: {
        [Op.ne]: id
      }
    }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  const updateResult = await SubSupplierInfo.update({
    supplier_code, supplier_abbreviation, contact_person, contact_information, supplier_full_name, supplier_address, supplier_category, supply_method, transaction_method, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  }, {
    where: { id }
  })
  if (updateResult.length == 0) {
    return res.json({ message: '未找到该供应商信息', code: 404 });
  }
  
  res.json({ message: "修改成功", code: 200 });
});




// 材料报价
router.get('/material_quote', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10, supplier_abbreviation, product_code, product_name, notice } = req.query;
  const offset = (page - 1) * pageSize;
  const { company_id } = req.user;
  
  const { count, rows } = await SubMaterialQuote.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    include: [
      { model: SubMaterialCode, as: 'material' },
      { model: SubSupplierInfo, as: 'supplier' },
      { model: SubProductNotice, as: 'notice' },
      { model: SubProductsCode, as: 'product' }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  const totalPages = Math.ceil(count / pageSize)
  const fromData = rows.map(item => item.dataValues)
  const rs = fromData.map(item => {
    item.notice = formatObjectTime(item.notice.dataValues)
    return item
  })
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(rs), 
    total: count, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
});
router.post('/material_quote', authMiddleware, async (req, res) => {
  const { supplier_id, notice_id, material_id, delivery, number, packaging, transaction_currency, other_transaction_terms, remarks } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  let product_id = ''
  const quote = await SubProductNotice.findOne({
    where: { id: notice_id },
    raw: true
  })
  if(quote){
    product_id = quote.product_id
  }else{
    return res.json({ code: 401, message: '数据出错，请联系管理员' })
  }
  const result = await SubMaterialQuote.create({
    supplier_id, notice_id, material_id, product_id, delivery, number, packaging, transaction_currency, other_transaction_terms, remarks, company_id,
    user_id: userId
  })

  res.json({ message: "添加成功", code: 200 });
});
router.put('/material_quote', authMiddleware, async (req, res) => {
  const { supplier_id, notice_id, material_id, delivery, number, packaging, transaction_currency, other_transaction_terms, remarks, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  let product_id = ''
  const quote = await SubProductNotice.findOne({
    where: { id: notice_id },
    raw: true
  })
  if(quote){
    product_id = quote.product_id
  }else{
    return res.json({ code: 401, message: '数据出错，请联系管理员' })
  }
  const updateResult = await SubMaterialQuote.update({
    supplier_id, notice_id, material_id, product_id, delivery, number, packaging, transaction_currency, other_transaction_terms, remarks, company_id,
    user_id: userId
  }, {
    where: { id }
  })
  if (updateResult.length == 0) {
    return res.json({ message: '未找到该材料报价信息', code: 404 });
  }
  
  res.json({ message: "修改成功", code: 200 });
});

module.exports = router;