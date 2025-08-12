const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { SubProductCode, SubPartCode, SubMaterialCode, SubProcessCode, SubEquipmentCode, SubEmployeeInfo, Op } = require('../models')
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
  const { product_code, product_name, drawing, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const rows = await SubProductCode.findAll({ where: { product_code, company_id } })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  const newProduct = await SubProductCode.create({
    product_code, product_name, drawing, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新产品编码接口
router.put('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, drawing, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  // 验证产品是否存在
  const product = await SubProductCode.findByPk(id);
  if (!product) {
    return res.json({ message: '产品不存在', code: 401 });
  }
  
  const row = await SubProductCode.findOne({
    where: { product_code, company_id, id: { [Op.ne]: id } }
  })
  if(row){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  await product.update({
    product_code, product_name, drawing, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, company_id,
    user_id: userId
  }, { where: { id } })
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除产品编码
router.delete('/products_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  // 验证产品是否存在
  const product = await SubProductCode.findByPk(id);
  if (!product) {
    return res.json({ message: '产品不存在', code: 401 });
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
  const { part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks } = req.body;
  const { id: userId, company_id } = req.user;
  
  const rows = await SubPartCode.findAll({ where: { part_code, company_id } })
  if(rows.length != 0) return res.json({ message: '编码不能重复', code: 401 })
  
  const newProduct = await SubPartCode.create({
    part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新部件编码接口
router.put('/part_code', authMiddleware, async (req, res) => {
  const { part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  // 验证部件是否存在
  const part = await SubPartCode.findByPk(id);
  if (!part) return res.status(404).json({ message: '部件不存在' });
  
  const row = await SubPartCode.findOne({
    where: { part_code, company_id, id: { [Op.ne]: id } }
  })
  if(row) return res.json({ message: '编码不能重复', code: 401 })
  
  await part.update({
    part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, company_id,
    user_id: userId
  }, { where: { id } })
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除部件编码
router.delete('/part_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  // 验证部件是否存在
  const part = await SubPartCode.findByPk(id);
  if (!part) return res.json({ message: '部件不存在', code: 401 });
  
  await SubPartCode.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
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
  if(rows.length != 0) return res.json({ message: '编码不能重复', code: 401 })
  
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
  
  // 验证材料是否存在
  const material = await SubMaterialCode.findByPk(id);
  if (!material) return res.json({ message: '材料不存在', code: 401 });
  
  const rows = await SubMaterialCode.findAll({
    where: { material_code, company_id, id: { [Op.ne]: id } }
  })
  if(rows.length != 0) return res.json({ message: '编码不能重复', code: 401 })
  
  await SubMaterialCode.update({
    material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, company_id,
    user_id: userId
  }, { where: { id } })
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除材料编码
router.delete('/material_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  // 验证材料是否存在
  const part = await SubMaterialCode.findByPk(id);
  if (!part) return res.json({ message: '材料不存在', code: 401 });
  
  await SubMaterialCode.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
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
  if(rows.length != 0) return res.json({ message: '编码不能重复', code: 401 })
  
  await SubProcessCode.create({
    process_code, process_name, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, equipment_id, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新工艺编码接口
router.put('/process_code', authMiddleware, async (req, res) => {
  const { process_code, process_name, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, equipment_id, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  // 验证工艺是否存在
  const process = await SubProcessCode.findByPk(id);
  if (!process) return res.json({ message: '工艺不存在', code: 401 });
  
  const rows = await SubProcessCode.findAll({
    where: { process_code, company_id, id: { [Op.ne]: id } }
  })
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  await SubProcessCode.update({
    process_code, process_name, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, equipment_id, company_id,
    user_id: userId
  }, { where: { id } })
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除工艺编码
router.delete('/process_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  // 验证工艺是否存在
  const process = await SubProcessCode.findByPk(id);
  if (!process) return res.json({ message: '工艺不存在', code: 401 });
  
  await SubProcessCode.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
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
  if(rows.length != 0) return res.json({ message: '编码不能重复', code: 401 })
  
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
  
  // 验证设备是否存在
  const equipment = await SubEquipmentCode.findByPk(id);
  if (!equipment) return res.json({ message: '设备不存在', code: 401 });
  
  const rows = await SubEquipmentCode.findAll({
    where: { equipment_code, company_id, id: { [Op.ne]: id } }
  })
  if(rows.length != 0) return res.json({ message: '编码不能重复', code: 401 })
  
  await SubEquipmentCode.update({
    equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, company_id,
    user_id: userId
  }, { where: { id } })
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除设备信息
router.delete('/equipment_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  // 验证设备是否存在
  const equipment = await SubEquipmentCode.findByPk(id);
  if (!equipment) return res.json({ message: '设备不存在', code: 401 });
  
  await SubEquipmentCode.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
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
  if(rows.length != 0) return res.json({ message: '编码不能重复', code: 401 })
  
  await SubEmployeeInfo.create({
    employee_id, name, department, production_position, salary_attribute, remarks, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新员工信息接口
router.put('/employee_info', authMiddleware, async (req, res) => {
  const { employee_id, name, department, production_position, salary_attribute, remarks, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  // 验证员工信息是否存在
  const employee = await SubEmployeeInfo.findByPk(id);
  if (!employee) return res.json({ message: '员工信息不存在', code: 401 });
  
  const rows = await SubEmployeeInfo.findAll({
    where: { employee_id, company_id, id: { [Op.ne]: id } }
  })
  if(rows.length != 0){
    return res.json({ message: '员工编码不能重复', code: 401 })
  }
  
  await SubEmployeeInfo.update({
    employee_id, name, department, production_position, salary_attribute, remarks, company_id,
    user_id: userId
  }, { where: { id } })
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除员工信息
router.delete('/employee_info/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  // 验证员工信息是否存在
  const employee = await SubEmployeeInfo.findByPk(id);
  if (!employee) return res.json({ message: '员工信息不存在', code: 401 });
  
  await SubEmployeeInfo.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1, company_id } })
  
  res.json({ message: '删除成功', code: 200 });
});

module.exports = router;