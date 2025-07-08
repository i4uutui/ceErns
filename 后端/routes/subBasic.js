const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取产品编码列表（分页）
router.get('/products_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;

  const [rows] = await pool.execute(
    'SELECT * FROM sub_products_code WHERE is_deleted = 1 and company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [company_id, parseInt(pageSize), offset]
  );
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_products_code WHERE is_deleted = 1 and company_id = ?', [company_id]);
  const total = countRows[0].total;
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(rows), 
    total, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
});

// 添加产品编码
router.post('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_products_code where product_code = ? and company_id = ?',
    [product_code, company_id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  const [result] = await pool.execute(
    'INSERT INTO sub_products_code (product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, user_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, userId, company_id]
  );
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新产品编码接口
router.put('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_products_code where product_code = ? and company_id = ? and id != ?',
    [product_code, company_id, id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 更新产品编码信息
  const [updateResult] = await pool.execute(
    'UPDATE sub_products_code SET product_code = ?, product_name = ?, model = ?, specification = ?, other_features = ?, component_structure = ?, unit = ?, unit_price = ?, currency = ?, production_requirements = ?, user_id = ?, company_id = ? WHERE id = ?',
    [product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, userId, company_id, id]
  );
  
  if (updateResult.affectedRows === 0) {
    return res.json({ message: '未找到该产品编码', code: 401 });
  }
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除产品编码
router.delete('/products_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user

  const [result] = await pool.execute(
    'UPDATE sub_products_code SET is_deleted = 0 WHERE id = ? AND is_deleted = 1 and company_id = ?',
    [id, company_id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '产品编码不存在或已被删除', code: 401 });
  }

  res.json({ message: '删除成功', code: 200 });
});



// 获取部件编码列表（分页）
router.get('/part_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;

  const [rows] = await pool.execute(
    'SELECT * FROM sub_part_code WHERE is_deleted = 1 and company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [company_id, parseInt(pageSize), offset]
  );
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_part_code WHERE is_deleted = 1 and company_id = ?', [company_id]);
  const total = countRows[0].total;
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(rows), 
    total, 
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
  
  const [rows] = await pool.execute(
    'select * from sub_part_code where part_code = ? and company_id = ?',
    [part_code, company_id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }

  const [result] = await pool.execute(
    'INSERT INTO sub_part_code (part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, user_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, userId, company_id]
  );
  
  res.json({ message: '添加成功', code: 200 });
});

// 更新部件编码接口
router.put('/part_code', authMiddleware, async (req, res) => {
  const { part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_part_code where part_code = ? and company_id = ? and id != ?',
    [part_code, company_id, id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 更新部件编码信息
  const [updateResult] = await pool.execute(
    'UPDATE sub_part_code SET part_code = ?, part_name = ?, model = ?, specification = ?, other_features = ?, unit = ?, unit_price = ?, currency = ?, production_requirements = ?, remarks = ?, user_id = ?, company_id = ? WHERE id = ?',
    [part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, userId, company_id, id]
  );
  
  if (updateResult.affectedRows === 0) {
    return res.json({ message: '未找到该部件编码', code: 401 });
  }
  
  res.json({ message: '更新成功', code: 200 });
});

// 删除部件编码
router.delete('/part_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  const [result] = await pool.execute(
    'UPDATE sub_part_code SET is_deleted = 0 where id = ? and is_deleted = 1 and company_id = ?',
    [id, company_id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '部件编码不存在或已被删除', code: 401 });
  }
  
  res.json({ message: '删除成功', code: 200 });
});





// 获取材料编码列表（分页）
router.get('/material_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const [rows] = await pool.execute(
    'SELECT * FROM sub_material_code WHERE is_deleted = 1 and company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [company_id, parseInt(pageSize), offset]
  );
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_material_code WHERE is_deleted = 1 and company_id = ?', [company_id]);
  const total = countRows[0].total;
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(rows), 
    total, 
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
  
  const [rows] = await pool.execute(
    'select * from sub_material_code where material_code = ? and company_id = ?',
    [material_code, company_id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }

  const [result] = await pool.execute(
    'INSERT INTO sub_material_code (material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, user_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, userId, company_id]
  );

  res.json({ message: '添加成功', code: 200 });
});

// 更新材料编码接口
router.put('/material_code', authMiddleware, async (req, res) => {
  const { material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_material_code where material_code = ? and company_id = ? and id != ?',
    [material_code, company_id, id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 更新材料编码信息
  const [updateResult] = await pool.execute(
    'UPDATE sub_material_code SET material_code = ?, material_name = ?, model = ?, specification = ?, other_features = ?, usage_unit = ?, purchase_unit = ?, unit_price = ?, currency = ?, remarks = ?, user_id = ?, company_id = ? WHERE id = ?',
    [material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, userId, company_id, id]
  );
  
  if (updateResult.affectedRows === 0) {
    return res.json({ message: '未找到该材料编码', code: 401 });
  }
  
  res.json({ message: "修改成功", code: 200 });
});

// 删除材料编码
router.delete('/material_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  const [result] = await pool.execute(
    'UPDATE sub_material_code SET is_deleted = 0 where id = ? and is_deleted = 1 and company_id = ?',
    [id, company_id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '材料编码不存在或已被删除', code: 401 });
  }
  
  res.json({ message: '删除成功', code: 200 });
});





// 获取工艺编码列表（分页）
router.get('/process_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const [rows] = await pool.execute(
    'SELECT * FROM sub_process_code WHERE is_deleted = 1 and company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [company_id, parseInt(pageSize), offset]
  );
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_process_code WHERE is_deleted = 1 and company_id = ?', [company_id]);
  const total = countRows[0].total;
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(rows), 
    total, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200 
  });
});

// 添加工艺编码
router.post('/process_code', authMiddleware, async (req, res) => {
  const { process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_process_code where process_code = ? and company_id = ?',
    [process_code, company_id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }

  const [result] = await pool.execute(
    'INSERT INTO sub_process_code (process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, user_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, userId, company_id]
  );
  
  res.json({ message: "添加成功", code: 200 });
});

// 更新工艺编码接口
router.put('/process_code', authMiddleware, async (req, res) => {
  const { process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_process_code where process_code = ? and company_id = ? and id != ?',
    [process_code, company_id, id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 更新工艺编码信息
  const [updateResult] = await pool.execute(
    'UPDATE sub_process_code SET process_code = ?, process_name = ?, equipment_used = ?, piece_working_hours = ?, processing_unit_price = ?, section_points = ?, total_processing_price = ?, remarks = ?, user_id = ?, company_id = ? WHERE id = ?',
    [process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, userId, company_id, id]
  );
  
  if (updateResult.affectedRows === 0) {
    return res.json({ message: '未找到该工艺编码', code: 404 });
  }
  
  res.json({ message: '修改成功', code: 200 });
});

// 删除工艺编码
router.delete('/process_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  const [result] = await pool.execute(
    'UPDATE sub_process_code SET is_deleted = 0 WHERE id = ? and is_deleted = 1 and company_id = ?',
    [id, company_id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '工艺编码不存在或已被删除', code: 401 });
  }

  res.json({ message: '删除成功', code: 200 });
});





// 获取设备信息列表（分页）
router.get('/equipment_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const [rows] = await pool.execute(
    'SELECT * FROM sub_equipment_code WHERE is_deleted = 1 and company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [company_id, parseInt(pageSize), offset]
  );
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_equipment_code WHERE is_deleted = 1 and company_id = ?', [company_id]);
  const total = countRows[0].total;
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(rows), 
    total, 
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
  
  const [rows] = await pool.execute(
    'select * from sub_equipment_code where equipment_code = ? and company_id = ?',
    [equipment_code, company_id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }

  const [result] = await pool.execute(
    'INSERT INTO sub_equipment_code (equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, user_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, userId, company_id]
  );
  
  res.json({ message: "添加成功", code: 200 });
});

// 更新设备信息接口
router.put('/equipment_code', authMiddleware, async (req, res) => {
  const { equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, id } = req.body;
  
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_equipment_code where equipment_code = ? and company_id = ? and id != ?',
    [equipment_code, company_id, id]
  )
  if(rows.length != 0){
    return res.json({ message: '编码不能重复', code: 401 })
  }
  
  // 更新设备信息
  const [updateResult] = await pool.execute(
    'UPDATE sub_equipment_code SET equipment_code = ?, equipment_name = ?, equipment_quantity = ?, department = ?, working_hours = ?, equipment_efficiency = ?, equipment_status = ?, remarks = ?, user_id = ?, company_id = ? WHERE id = ?',
    [equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, userId, company_id, id]
  );
  
  if (updateResult.affectedRows === 0) {
    return res.json({ message: '未找到该设备信息', code: 401 });
  }
  
  res.json({ message: '修改成功', code: 200 });
});

// 删除设备信息
router.delete('/equipment_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user
  
  const [result] = await pool.execute(
    'UPDATE sub_equipment_code SET is_deleted = 0 WHERE id = ? and is_deleted = 1 and company_id = ?',
    [id, company_id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '设备信息不存在或已被删除', code: 401 });
  }
  
  res.json({ message: '删除成功', code: 200 });
});






// 获取员工信息列表（分页）
router.get('/employee_info', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  const { company_id } = req.user;
  
  const [rows] = await pool.execute(
    'SELECT * FROM sub_employee_info WHERE is_deleted = 1 and company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [company_id, parseInt(pageSize), offset]
  );
  // 查询总记录数
  const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_employee_info WHERE is_deleted = 1 and company_id = ?', [company_id]);
  const total = countRows[0].total;
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(rows), 
    total, 
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
  
  const [rows] = await pool.execute(
    'select * from sub_employee_info where employee_id = ? and company_id = ?',
    [employee_id, company_id]
  )
  if(rows.length != 0){
    return res.json({ message: '员工工号不能重复', code: 401 })
  }

  const [result] = await pool.execute(
    'INSERT INTO sub_employee_info (employee_id, name, department, production_position, salary_attribute, remarks, user_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [employee_id, name, department, production_position, salary_attribute, remarks, userId, company_id]
  );
  
  res.json({ message: "添加成功", code: 200 });
});

// 更新员工信息接口
router.put('/employee_info', authMiddleware, async (req, res) => {
  const { employee_id, name, department, production_position, salary_attribute, remarks, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  const [rows] = await pool.execute(
    'select * from sub_employee_info where employee_id = ? and company_id = ? and id != ?',
    [employee_id, company_id, id]
  )
  if(rows.length != 0){
    return res.json({ message: '员工工号不能重复', code: 401 })
  }
  
  // 更新员工信息
  const [updateResult] = await pool.execute(
    'UPDATE sub_employee_info SET employee_id = ?, name = ?, department = ?, production_position = ?, salary_attribute = ?, remarks = ?, user_id = ?, company_id = ? WHERE id = ?',
    [employee_id, name, department, production_position, salary_attribute, remarks, userId, company_id, id]
  );
  
  if (updateResult.affectedRows === 0) {
    return res.json({ message: '未找到该员工信息', code: 401 });
  }
  
  res.json({ message: "修改成功", code: 200 });
});

// 删除员工信息
router.delete('/employee_info/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  const { company_id } = req.user
  
  const [result] = await pool.execute(
    'UPDATE sub_employee_info SET is_deleted = 0 WHERE id = ? and is_deleted = 1 and company_id = ?',
    [id, company_id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '员工不存在或已被删除', code: 401 });
  }

  res.json({ message: '删除成功', code: 200 });
});

module.exports = router;