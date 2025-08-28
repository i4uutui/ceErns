const express = require('express');
const router = express.Router();
const { SubMaterialBom, SubMaterialCode, SubMaterialBomChild, SubPartCode, SubProductCode, SubProcessBom, SubProcessBomChild, SubProcessCode, SubEquipmentCode, SubProcessCycle, Op, sequelize } = require('../models');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取材料BOM信息表
router.get('/material_bom', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10, archive, product_code, product_name } = req.query;
  const offset = (page - 1) * pageSize;
  const { company_id } = req.user;
  
  const whereIncludeProduct = {
    ...(product_code && {
      product_code: { [Op.like]: `%${product_code}%` } 
    }),
    ...(product_name && { 
      product_name: { [Op.like]: `%${product_name}%` } 
    })
  }
  const { count, rows } = await SubMaterialBom.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
      archive
    },
    attributes: ['id', 'product_id', 'part_id', 'archive'],
    include: [
      { model: SubProductCode, as: 'product', attributes: ['id', 'product_name', 'product_code', 'drawing'], where: whereIncludeProduct},
      { model: SubPartCode, as: 'part', attributes: ['id', 'part_name', 'part_code'] },
      {
        model: SubMaterialBomChild,
        as: 'children',
        attributes: ['id', 'material_bom_id', 'material_id', 'number'],
        include: [
          { model: SubMaterialCode, as: 'material', attributes: ['id', 'material_code', 'material_name', 'specification'] },
        ]
      }
    ],
    order: [
      ['id', 'DESC']
    ],
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
  const { product_id, part_id, archive, children } = req.body;
  const { id: userId, company_id } = req.user;
  
  const material = await SubMaterialBom.create({
    product_id, part_id, archive, company_id,
    user_id: userId
  })
  const childrens = children.map(e => ({ material_bom_id: material.id, ...e }))
  await SubMaterialBomChild.bulkCreate(childrens);
  
  res.json({ message: '添加成功', code: 200 });
});

// 更新材料BOM
router.put('/material_bom', authMiddleware, async (req, res) => {
  const { product_id, part_id, children, archive, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  // 验证材料BOM是否存在
  const material = await SubMaterialBom.findByPk(id);
  if (!material) return res.json({ message: '材料BOM不存在', code: 401 });
  
  const updateResult = await SubMaterialBom.update({
    product_id, part_id, archive, company_id,
    user_id: userId
  }, {
    where: { id }
  })
  
  const childrens = children.map(e => ({ material_bom_id: material.id, ...e }))
  SubMaterialBomChild.bulkCreate(childrens, {
    updateOnDuplicate: ['material_bom_id', 'material_id', 'number']
  })
  
  res.json({ message: '修改成功', code: 200 });
});
// 添加材料BOM存档
router.put('/material_bom_archive', authMiddleware, async (req, res) => {
  const { archive, ids } = req.body;
  const updateResult = await SubMaterialBom.update({
    archive
  }, {
    where: { id: ids }
  })
  if(updateResult.length == 0) return res.json({ message: '数据不存在，或已被删除', code: 401})
  
  res.json({ message: '修改成功', code: 200 });
});
router.delete('/material_bom', authMiddleware, async (req, res) => {
  const { id } = req.query
  
  // 验证材料BOM是否存在
  const material = await SubMaterialBom.findByPk(id);
  if (!material) return res.json({ message: '材料BOM不存在', code: 401 });

  const updateResult = await SubMaterialBom.update({
    is_deleted: 0
  }, {
    where: { id }
  })
  
  res.json({ message: '删除成功', code: 200 });
})


// 获取工艺BOM信息表
router.get('/process_bom', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10, archive, product_code, product_name } = req.query;
  const offset = (page - 1) * pageSize;
  const { company_id } = req.user;
  
  const whereIncludeProduct = {
    ...(product_code && {
      product_code: { [Op.like]: `%${product_code}%` } 
    }),
    ...(product_name && { 
      product_name: { [Op.like]: `%${product_name}%` } 
    })
  }
  const { count, rows } = await SubProcessBom.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id,
      archive
    },
    attributes: ['id', 'archive', 'product_id', 'part_id'],
    include: [
      { model: SubProductCode, as: 'product', attributes: ['id', 'product_name', 'product_code', 'drawing'], where: whereIncludeProduct },
      { model: SubPartCode, as: 'part', attributes: ['id', 'part_name', 'part_code'] },
      {
        model: SubProcessBomChild,
        as: 'children',
        attributes: ['id', 'process_bom_id', 'process_id', 'equipment_id', 'process_index', 'time', 'price'],
        include: [
          { model: SubProcessCode, as: 'process', attributes: ['id', 'process_code', 'process_name', 'section_points'] },
          {
            model: SubEquipmentCode,
            as: 'equipment',
            attributes: ['id', 'equipment_code', 'equipment_name'],
            include: [
              { model: SubProcessCycle, as: 'cycle' }
            ]
          }
        ]
      }
    ],
    order: [
      ['id', 'DESC'],
    ],
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
  const { product_id, part_id, archive, children } = req.body;
  const { id: userId, company_id } = req.user;
  
  const process = await SubProcessBom.create({
    product_id, part_id, archive, company_id,
    user_id: userId
  })
  const childrens = children.map(e => ({ process_bom_id: process.id, ...e }))
  await SubProcessBomChild.bulkCreate(childrens);
  
  res.json({ message: '添加成功', code: 200 });
});
// 更新工艺BOM
router.put('/process_bom', authMiddleware, async (req, res) => {
  const { product_id, part_id, archive, id, children } = req.body;
  const { id: userId, company_id } = req.user;
  
  // 验证工艺BOM是否存在
  const process = await SubProcessBom.findByPk(id);
  if (!process) return res.json({ message: '工艺BOM不存在', code: 401 });
  
  const updateResult = await SubProcessBom.update({
    product_id, part_id, archive, company_id,
    user_id: userId
  }, {
    where: { id }
  })
  SubProcessBomChild.bulkCreate(children, {
    updateOnDuplicate: ['process_bom_id', 'process_id', 'equipment_id', 'process_index', 'time', 'price', 'cycle_id']
  })
  
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
// 删除工艺BOM
router.delete('/process_bom', authMiddleware, async (req, res) => {
  const { id } = req.query
  
  // 验证工艺BOM是否存在
  const process = await SubProcessBom.findByPk(id);
  if (!process) return res.json({ message: '工艺BOM不存在', code: 401 });
  
  const updateResult = await SubProcessBom.update({
    is_deleted: 0
  }, {
    where: {
      id
    }
  })
  
  res.json({ message: '删除成功', code: 200 });
})


// 复制新增
router.post('/cope_bom', authMiddleware, async (req, res) => {
  const { id, type } = req.body;
  const { id: userId, company_id } = req.user;
  
  if(!(type == 'material' || type == 'process')) return res.json({ message: '类型错误，仅支持material或process', code: 401 });
  
  const configMap = {
    material: {
      mainModel: SubMaterialBom,
      childModel: SubMaterialBomChild,
      mainFields: ['product_id', 'part_id', 'archive'], // 主表需复制的字段
      childForeignKey: 'material_bom_id', // 子表外键字段
      childFields: ['material_id', 'number'] // 子表需复制的字段
    },
    process: {
      mainModel: SubProcessBom,
      childModel: SubProcessBomChild,
      mainFields: ['product_id', 'part_id', 'archive'],
      childForeignKey: 'process_bom_id',
      childFields: ['process_id', 'equipment_id', 'time', 'price', 'cycle_id']
    }
  };
  const { mainModel, childModel, mainFields, childForeignKey, childFields } = configMap[type];
  const originalBom = await mainModel.findByPk(id, {
    attributes: mainFields,
    include: [{ model: childModel, as: 'children', attributes: childFields }]
  });
  if (!originalBom) {
    return res.json({ message: `${type === 'material' ? '材料' : '工艺'}BOM不存在`, code: 404 });
  }
  const originalData = originalBom.toJSON();
  const mainData = {
    ...mainFields.reduce((obj, key) => ({ ...obj, [key]: originalData[key] }), {}),
    archive: 1,
    company_id,
    user_id: userId
  };
  const newMainBom = await mainModel.create(mainData);
  const childDataList = originalData.children.map(child => ({
    [childForeignKey]: newMainBom.id,
    ...childFields.reduce((obj, key) => ({ ...obj, [key]: child[key] }), {})
  }));

  await childModel.bulkCreate(childDataList);
  
  return res.json({ message: '复制成功', code: 200 })
})

module.exports = router; 