const express = require('express');
const router = express.Router();
const { SubOutsourcingQuote, SubSupplierInfo, SubProcessBom, SubProcessBomChild, SubProcessCode, SubEquipmentCode, SubProductCode, SubPartCode, SubProductNotice, Op } = require('../models');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 委外报价单
router.get('/outsourcing_quote', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10, supplier_abbreviation, product_code, product_name, notice } = req.query;
  const offset = (page - 1) * pageSize;
  const { company_id } = req.user;
  
  let supplierWhere = {}
  let productWhere = {}
  let noticeWhere = {}
  if(notice) noticeWhere.notice = { [Op.like]: `%${notice}%` }
  if(product_name) productWhere.product_name = { [Op.like]: `%${product_name}%` }
  if(product_code) productWhere.product_code = { [Op.like]: `%${product_code}%` }
  if(supplier_abbreviation) supplierWhere.supplier_abbreviation = { [Op.like]: `%${supplier_abbreviation}%` }
  const { count, rows } = await SubOutsourcingQuote.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    include: [
      { model: SubSupplierInfo, as: 'supplier', attributes: ['id', 'supplier_abbreviation', 'supplier_code'], where: supplierWhere, required: Object.keys(supplierWhere).length > 0 },
      { model: SubProductNotice, as: 'notice', attributes: ['id', 'notice'], where: noticeWhere, required: Object.keys(noticeWhere).length > 0 },
      {
        model: SubProcessBom,
        as: 'processBom',
        attributes: ['id', 'product_id', 'part_id', 'archive'],
        required: Object.keys(productWhere).length > 0,
        include: [
          { model: SubProductCode, as: 'product', attributes: ['id', 'product_name', 'product_code', 'drawing'], where: productWhere, required: Object.keys(productWhere).length > 0 },
          { model: SubPartCode, as: 'part', attributes: ['id', 'part_name', 'part_code'] },
        ]
      },
      {
        model: SubProcessBomChild,
        as: 'processChildren',
        attributes: ['id', 'process_bom_id', 'process_id', 'equipment_id', 'time', 'price', 'long'],
        include: [
          { model: SubProcessCode, as: 'process', attributes: ['id', 'process_code', 'process_name', 'section_points'] },
          { model: SubEquipmentCode, as: 'equipment', attributes: ['id', 'equipment_code', 'equipment_name'] }
        ]
      }
    ],
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
router.post('/outsourcing_quote', authMiddleware, async (req, res) => {
  const { notice_id, supplier_id, process_bom_id, process_bom_children_id, process_index, price, transaction_currency, other_transaction_terms, remarks } = req.body;
  const { id: userId, company_id } = req.user;
  
  await SubOutsourcingQuote.create({
    notice_id, supplier_id, process_bom_id, process_bom_children_id, process_index, price, transaction_currency, other_transaction_terms, remarks, company_id,
    user_id: userId
  })
  
  res.json({ message: '添加成功', code: 200 });
})
router.put('/outsourcing_quote', authMiddleware, async (req, res) => {
  const { notice_id, supplier_id, process_bom_id, process_bom_children_id, process_index, price, transaction_currency, other_transaction_terms, remarks, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  const updateResult = await SubOutsourcingQuote.update({
    notice_id, supplier_id, process_bom_id, process_bom_children_id, process_index, price, transaction_currency, other_transaction_terms, remarks, company_id,
    user_id: userId
  }, {
    where: {
      id
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
})






module.exports = router;