const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { SubProductCode, SubPartCode, SubMaterialCode, SubProcessCode, SubEquipmentCode, SubEmployeeInfo, SubProcessBom, Op } = require('../models')
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取产品编码列表（分页）
router.get('/products_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubProductCode.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id
    },
    include: [{ 
      model: SubPartCode, 
      as: 'part', 
      attributes: ['id', 'part_name', 'part_code'],
      through: {
        attributes: []
      }
    }],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  const totalPages = Math.ceil(count / pageSize);
  row = rows.map(e => e.toJSON())
  
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

// 添加产品编码
router.post('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, drawing, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, partIds } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubProductCode.findAll({ where: { product_code, company_id } })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 验证所有部件是否存在
  if(partIds.length){
    const parts = await SubPartCode.findAll({ where: { id: partIds } });
    if (parts.length !== partIds.length) {
      return res.json({ message: '部分部件不存在', code: 401 });
    }
  }
  
  const newProduct = await SubProductCode.create({
    product_code, product_name, drawing, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, company_id,
    user_id: userId
  })
  
  // 中间表
  if(partIds.length){
    await newProduct.addPart(partIds);
  }
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新产品编码接口
router.put('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, drawing, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, partIds, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  // 验证产品是否存在
  const product = await SubProductCode.findByPk(id);
  if (!product) {
    return res.status(404).json({ message: '产品不存在' });
  }
  
  const row = await SubProductCode.findOne({
    where: { product_code, company_id, id: { [Op.ne]: id } }
  })
  if(row){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 验证所有部件是否存在
  if(partIds.length){
    const parts = await SubPartCode.findAll({ where: { id: partIds } });
    if (parts.length !== partIds.length) {
      return res.json({ message: '部分部件不存在', code: 401 });
    }
  }
  
  const result = await product.update({
    product_code, product_name, drawing, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, company_id,
    user_id: userId
  }, { where: { id } })
  if (result.length == 0) {
    return res.json({ message: '未找到该产品编码', code: 401 });
  }
  
  // 中间表
  if(partIds.length){
    await product.setPart(partIds);
  }
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除产品编码
router.delete('/products_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  // 验证产品是否存在
  const product = await SubProductCode.findByPk(id);
  if (!product) {
    return res.status(404).json({ message: '产品不存在' });
  }
  
  const result = await SubProductCode.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
  await product.setPart([])
  
  res.json({ message: '删除成功', code: 200 });
});



// 获取部件编码列表（分页）
router.get('/part_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  const { count, rows } = await SubPartCode.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id
    },
    include: [
      {
        model: SubProductCode, 
        as: 'product', 
        attributes: ['id', 'product_name', 'product_code'],
        through: {
          attributes: []
        }
      },
      {
        model: SubMaterialCode,
        as: 'material',
        attributes: ['id', 'material_code', 'material_name'],
        through: {
          attributes: []
        }
      },
      {
        model: SubProcessCode,
        as: 'process',
        attributes: ['id', 'process_code', 'process_name'],
        through: {
          attributes: []
        }
      }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })

  const totalPages = Math.ceil(count / pageSize);
  row = rows.map(e => e.toJSON())
  
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

// 添加部件编码
router.post('/part_code', authMiddleware, async (req, res) => {
  const { part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, materialIds, processIds } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubPartCode.findAll({ where: { part_code, company_id } })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 验证所有部件是否存在
  if(materialIds.length){
    const materials = await SubMaterialCode.findAll({ where: { id: materialIds } });
    if (materials.length !== materialIds.length) {
      return res.json({ message: '部分材料不存在', code: 401 });
    }
  }
  // 验证所有工艺是否存在
  if(processIds.length){
    const process = await SubProcessCode.findAll({ where: { id: processIds } });
    if (process.length !== processIds.length) {
      return res.json({ message: '部分工艺不存在', code: 401 });
    }
  }
  
  const newProduct = await SubPartCode.create({
    part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, company_id,
    user_id: userId
  })
  
  // 中间表
  if(materialIds.length){
    await newProduct.addMaterial(materialIds);
  }
  if(processIds.length){
    await newProduct.addProcess(processIds);
  }
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新部件编码接口
router.put('/part_code', authMiddleware, async (req, res) => {
  const { part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, materialIds, processIds, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  // 验证部件是否存在
  const part = await SubPartCode.findByPk(id);
  if (!part) {
    return res.status(404).json({ message: '部件不存在' });
  }
  
  const row = await SubPartCode.findOne({
    where: { part_code, company_id, id: { [Op.ne]: id } }
  })
  if(row){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 验证所有材料是否存在
  if(materialIds.length){
    const materials = await SubMaterialCode.findAll({ where: { id: materialIds } });
    if (materials.length !== materialIds.length) {
      return res.json({ message: '部分材料不存在', code: 401 });
    }
  }
  // 验证所有工艺是否存在
  if(processIds.length){
    const process = await SubProcessCode.findAll({ where: { id: processIds } });
    if (process.length !== processIds.length) {
      return res.json({ message: '部分工艺不存在', code: 401 });
    }
  }
  
  const result = await part.update({
    part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, company_id,
    user_id: userId
  }, { where: { id } })
  if (result.length == 0) {
    return res.json({ message: '未找到该部件编码', code: 401 });
  }
  
  // 中间表
  if(materialIds.length){
    await part.setMaterial(materialIds);
  }
  if(processIds.length){
    await part.setProcess(processIds);
  }
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除部件编码
router.delete('/part_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  // 验证部件是否存在
  const part = await SubPartCode.findByPk(id);
  if (!part) {
    return res.status(404).json({ message: '部件不存在', code: 401 });
  }
  
  const relatedProducts = await part.getProduct();
  if (relatedProducts.length > 0) {
    return res.json({ message: '该部件已关联产品编码，无法删除', code: 401 });
  }
  
  const result = await SubPartCode.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
  if (result.length == 0) {
    return res.json({ message: '部件编码不存在或已被删除', code: 401 });
  }
  
  await part.setMaterial([])
  
  res.json({ message: '删除成功', code: 200 });
});





// 获取材料编码列表（分页）
router.get('/material_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubMaterialCode.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id
    },
    include: [
      {
        model: SubPartCode, 
        as: 'part', 
        attributes: ['id', 'part_name', 'part_code'],
        through: {
          attributes: []
        }
      },
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  
  const totalPages = Math.ceil(count / pageSize);
  row = rows.map(e => e.toJSON())
  
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

// 添加材料编码
router.post('/material_code', authMiddleware, async (req, res) => {
  const { material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubMaterialCode.findAll({
    where: {
      material_code,
      company_id
    }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  SubMaterialCode.create({
    material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新材料编码接口
router.put('/material_code', authMiddleware, async (req, res) => {
  const { material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubMaterialCode.findAll({
    where: { material_code, company_id, id: { [Op.ne]: id } }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  const result = await SubMaterialCode.update({
    material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, company_id,
    user_id: userId
  }, { where: { id } })
  if (result.length == 0) {
    return res.json({ message: '未找到该材料编码', code: 401 });
  }
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除材料编码
router.delete('/material_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  // 验证材料是否存在
  const part = await SubMaterialCode.findByPk(id);
  if (!part) {
    return res.status(404).json({ message: '材料不存在', code: 401 });
  }
  
  const relatedParts = await part.getPart();
  if (relatedParts.length > 0) {
    return res.json({ message: '该材料已关联部件编码，无法删除', code: 401 });
  }
  
  const result = await SubMaterialCode.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
  if (result.length == 0) {
    return res.json({ message: '材料编码不存在或已被删除', code: 401 });
  }
  
  res.json({ message: '删除成功', code: 200 });
});





// 获取工艺编码列表（分页）
router.get('/process_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubProcessCode.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id
    },
    include: [
      {
        model: SubPartCode,
        as: 'part',
        attributes: ['id', 'part_name', 'part_code'],
        through: {
          attributes: []
        }
      },
      {
        model: SubEquipmentCode,
        as: 'equipment'
      }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  const totalPages = Math.ceil(count / pageSize);
  row = rows.map(e => e.toJSON())
  
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

// 添加工艺编码
router.post('/process_code', authMiddleware, async (req, res) => {
  const { process_code, process_name, piece_working_hours, processing_unit_price, section_points, total_processing_price, equipment_id, remarks } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubProcessCode.findAll({
    where: {
      process_code,
      company_id
    }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  SubProcessCode.create({
    process_code, process_name, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, equipment_id, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新工艺编码接口
router.put('/process_code', authMiddleware, async (req, res) => {
  const { process_code, process_name, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, equipment_id, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubProcessCode.findAll({
    where: { process_code, company_id, id: { [Op.ne]: id } }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  const result = await SubProcessCode.update({
    process_code, process_name, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, equipment_id, company_id,
    user_id: userId
  }, { where: { id } })
  if (result.length == 0) {
    return res.json({ message: '未找到该工艺编码', code: 401 });
  }
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除工艺编码
router.delete('/process_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  const result = await SubProcessCode.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
  if (result.length == 0) {
    return res.json({ message: '工艺编码不存在或已被删除', code: 401 });
  }
  
  res.json({ message: '删除成功', code: 200 });
});





// 获取设备信息列表（分页）
router.get('/equipment_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubEquipmentCode.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id
    },
    include: [
      {
        model: SubProcessCode,
        as: 'process'
      }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  
  const totalPages = Math.ceil(count / pageSize);
  row = rows.map(e => e.toJSON())
  
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

// 添加设备信息
router.post('/equipment_code', authMiddleware, async (req, res) => {
  const { equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubEquipmentCode.findAll({
    where: {
      equipment_code,
      company_id
    }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  SubEquipmentCode.create({
    equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新设备信息接口
router.put('/equipment_code', authMiddleware, async (req, res) => {
  const { equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubEquipmentCode.findAll({
    where: { equipment_code, company_id, id: { [Op.ne]: id } }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  const result = await SubEquipmentCode.update({
    equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, company_id,
    user_id: userId
  }, { where: { id } })
  if (result.length == 0) {
    return res.json({ message: '未找到该设备信息', code: 401 });
  }
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除设备信息
router.delete('/equipment_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  const result = await SubEquipmentCode.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
  if (result.length == 0) {
    return res.json({ message: '设备信息不存在或已被删除', code: 401 });
  }
  
  res.json({ message: '删除成功', code: 200 });
});






// 获取员工信息列表（分页）
router.get('/employee_info', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const { count, rows } = await SubEmployeeInfo.findAndCountAll({
    where: {
      is_deleted: 1,
      company_id
    },
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  
  const totalPages = Math.ceil(count / pageSize);
  row = rows.map(e => e.toJSON())
  
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

// 添加员工信息
router.post('/employee_info', authMiddleware, async (req, res) => {
  const { employee_id, name, department, production_position, salary_attribute, remarks } = req.body;
  const { id: userId, company_id } = req.user;
  
  const rows = await SubEmployeeInfo.findAll({
    where: {
      employee_id,
      company_id
    }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  SubEmployeeInfo.create({
    employee_id, name, department, production_position, salary_attribute, remarks, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新员工信息接口
router.put('/employee_info', authMiddleware, async (req, res) => {
  const { employee_id, name, department, production_position, salary_attribute, remarks, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  const rows = await SubEmployeeInfo.findAll({
    where: { employee_id, company_id, id: { [Op.ne]: id } }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  const result = await SubEmployeeInfo.update({
    employee_id, name, department, production_position, salary_attribute, remarks, company_id,
    user_id: userId
  }, { where: { id } })
  if (result.length == 0) {
    return res.json({ message: '未找到该员工信息', code: 401 });
  }
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除员工信息
router.delete('/employee_info/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  const { company_id } = req.user
  
  const result = await SubEmployeeInfo.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
  if (result.length == 0) {
    return res.json({ message: '员工信息不存在或已被删除', code: 401 });
  }
  
  res.json({ message: '删除成功', code: 200 });
});



// 自动生成工艺BOM表
router.post('/set_process_BOM', authMiddleware, async (req, res) => {
  const { id } = req.body;
  const { id: userId, company_id } = req.user;
  
  // 验证产品是否存在
  const product = await SubProductCode.findByPk(id);
  if (!product) {
    return res.json({ message: '产品不存在', code: 401 });
  }
  // 获取产品关联的所有部件
  const productWithParts = await SubProductCode.findByPk(id, {
    include: [{
      model: SubPartCode,
      as: 'part',
      attributes: ['id', 'part_name', 'part_code'],
      through: { attributes: [] } // 只需要部件数据，不需要中间表数据
    }]
  });
  const productWithPartsJson = productWithParts.toJSON()
  if (!productWithParts.part || productWithParts.part.length === 0) {
    return res.json({ message: '该产品没有关联部件，无法生成工艺BOM', code: 401 });
  }
  // 批量创建BOM数据
  const bomData = productWithParts.part.map(part => ({
    product_id: id,
    part_id: part.id,
    user_id: userId,
    company_id,
    archive: 1
  }));
  await SubProcessBom.bulkCreate(bomData);
  
  return res.json({ message: '操作成功', code: 200 })
})

module.exports = router;