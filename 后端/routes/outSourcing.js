const express = require('express');
const router = express.Router();
const { SubOutsourcingQuote, SubSupplierInfo, SubProductsCode, SubPartCode, SubProcessCode, Op } = require('../models');
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
      { model: SubProductsCode, as: 'product' },
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


module.exports = router;