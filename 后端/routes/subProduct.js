const express = require('express');
const router = express.Router();
const { SubMaterialBom, SubPartCode, SubMaterialCode, Op } = require('../models');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取材料BOM信息表
router.get('/material_bom', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubMaterialBom.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    include: [
      { model: SubPartCode, as: 'part' },
      { model: SubMaterialCode, as: 'material'}
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
})

// 添加材料BOM
router.post('/material_bom', authMiddleware, async (req, res) => {
  const { number, part_id, material_id, model_spec, other_features, send_receiving_units, purchasing_unit, quantity_used, loss_rate, purchase_quantity } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  await SubMaterialBom.create({
    number, part_id, material_id, model_spec, other_features, send_receiving_units, purchasing_unit, quantity_used, loss_rate, purchase_quantity, company_id,
    user_id: userId
  })
  
  res.json({ message: '添加成功', code: 200 });
});

// 更新材料BOM
router.put('/material_bom', authMiddleware, async (req, res) => {
  const { number, part_id, material_id, model_spec, other_features, send_receiving_units, purchasing_unit, quantity_used, loss_rate, purchase_quantity, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const updateResult = await SubMaterialBom.update({
    number, part_id, material_id, model_spec, other_features, send_receiving_units, purchasing_unit, quantity_used, loss_rate, purchase_quantity, company_id,
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