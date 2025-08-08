const express = require('express');
const router = express.Router();
const { SubOutsourcingQuote, SubSupplierInfo, SubProductCode, SubPartCode, SubProcessCode, Op } = require('../models');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');


router.get('/outsourcing_quote', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const { company_id } = req.user;
  
  const { count, rows } = await SubOutsourcingQuote.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    include: [
      { model: SubSupplierInfo, as: 'supplier' },
      { model: SubProductCode, as: 'product' },
      { model: SubPartCode, as: 'part' },
      { model: SubProcessCode, as: 'process' },
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
  const { supplier_id, product_id, part_id, process_id, processing_unit_price, transaction_currency, other_transaction_terms, remarks } = req.body;
  const { id: userId, company_id } = req.user;
  
  await SubOutsourcingQuote.create({
    supplier_id, product_id, part_id, process_id, processing_unit_price, transaction_currency, other_transaction_terms, remarks, company_id,
    user_id: userId
  })
  
  res.json({ message: '添加成功', code: 200 });
})
router.put('/outsourcing_quote', authMiddleware, async (req, res) => {
  const { supplier_id, product_id, part_id, process_id, processing_unit_price, transaction_currency, other_transaction_terms, remarks, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  const updateResult = await SubOutsourcingQuote.update({
    supplier_id, product_id, part_id, process_id, processing_unit_price, transaction_currency, other_transaction_terms, remarks, company_id,
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