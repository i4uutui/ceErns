const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { SubSupplierInfo, Op } = require('../models')
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

// 添加客户信息
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

// 更新客户信息接口
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
  
  // 更新客户信息
  const updateResult = await SubSupplierInfo.update({
    supplier_code, supplier_abbreviation, contact_person, contact_information, supplier_full_name, supplier_address, supplier_category, supply_method, transaction_method, transaction_currency, other_transaction_terms, company_id,
    user_id: userId
  }, {
    where: { id }
  })
  if (updateResult.length == 0) {
    return res.json({ message: '未找到该客户信息', code: 404 });
  }
  
  res.json({ message: "修改成功", code: 200 });
});

module.exports = router;