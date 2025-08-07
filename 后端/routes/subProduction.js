const express = require('express');
const router = express.Router();
const { SubProductionProgress, SubProductNotice, SubProductsCode, SubCustomerInfo, SubSaleOrder, SubPartCode, Op } = require('../models');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取生产进度表列表
router.get('/production_progress', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubProductionProgress.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    include: [
      { model: SubProductNotice, as: 'notice' },
      { model: SubProductsCode, as: 'product' },
      { model: SubCustomerInfo, as: 'customer' },
      { model: SubSaleOrder, as: 'sale' },
      { model: SubPartCode, as: 'part' }
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
router.put('/production_progress', authMiddleware, async (req, res) => {
  const { id, part_id, out_number, order_number, remarks } = req.body
  const { id: userId, company_id } = req.user;
  
  const row = await SubProductionProgress.findAll({
    where: { id }
  })
  if(row.length == 0){
    return res.json({ message: '数据不存在，或已被删除', code: 401 })
  }
  await SubProductionProgress.update({
    part_id, out_number, order_number, remarks
  }, {
    where: { id, company_id }
  })
  
  res.json({ message: '修改成功', code: 200 });
})

module.exports = router;