const express = require('express');
const router = express.Router();
const { SubMaterialBom, SubPartCode, SubProductsCode, SubProcessBom, Op } = require('../models');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取材料BOM信息表
router.get('/material_bom', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10, archive, product_code } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const productWhere = {}
  if(product_code) productWhere.product_code = product_code
  const { count, rows } = await SubMaterialBom.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
      archive,
    },
    include: [
      { model: SubPartCode, as: 'part' },
      { model: SubProductsCode, as: 'product', where: productWhere}
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
  const { product_id, part_id, textJson, archive } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  await SubMaterialBom.create({
    product_id, part_id, textJson, company_id, archive,
    user_id: userId
  })
  
  res.json({ message: '添加成功', code: 200 });
});

// 更新材料BOM
router.put('/material_bom', authMiddleware, async (req, res) => {
  const { product_id, part_id, textJson, archive, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const updateResult = await SubMaterialBom.update({
    product_id, part_id, textJson, archive, company_id,
    user_id: userId
  }, {
    where: {
      id
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
});
// 添加材料BOM存档
router.put('/material_bom_archive', authMiddleware, async (req, res) => {
  const { archive, ids } = req.body;
  const updateResult = await SubMaterialBom.update({
    archive
  }, {
    where: {
      id: ids
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
});
router.delete('/material_bom', authMiddleware, async (req, res) => {
  const { id } = req.query
  const updateResult = await SubMaterialBom.update({
    is_deleted: 0
  }, {
    where: {
      id
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  res.json({ message: '删除成功', code: 200 });
})


// 获取工艺BOM信息表
router.get('/process_bom', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10, archive } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubProcessBom.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
      archive
    },
    include: [
      { model: SubPartCode, as: 'part' },
      { model: SubProductsCode, as: 'product'}
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
// 添加工艺BOM
router.post('/process_bom', authMiddleware, async (req, res) => {
  const { product_id, part_id, make_time, textJson, archive } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  await SubProcessBom.create({
    product_id, part_id, make_time, textJson, archive, company_id,
    user_id: userId
  })
  
  res.json({ message: '添加成功', code: 200 });
});
// 更新工艺BOM
router.put('/process_bom', authMiddleware, async (req, res) => {
  const { product_id, part_id, make_time, textJson, archive, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const updateResult = await SubProcessBom.update({
    product_id, part_id, make_time, textJson, archive, company_id,
    user_id: userId
  }, {
    where: {
      id
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
});
// 添加工艺BOM存档
router.put('/process_bom_archive', authMiddleware, async (req, res) => {
  const { archive, ids } = req.body;
  const updateResult = await SubProcessBom.update({
    archive
  }, {
    where: {
      id: ids
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
});
router.delete('/process_bom', authMiddleware, async (req, res) => {
  const { id } = req.query
  const updateResult = await SubProcessBom.update({
    is_deleted: 0
  }, {
    where: {
      id
    }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  res.json({ message: '删除成功', code: 200 });
})

module.exports = router; 