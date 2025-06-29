const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取产品编码列表（分页）
router.get('/products_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_products_code LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );
    
    // 查询总记录数
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_products_code');
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 添加产品编码
router.post('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO sub_products_code (product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_products_code WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: rows[0], code: 200 });
  } catch(error){
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 更新产品编码接口
router.put('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, id } = req.body;
  
  try {
    // 更新产品编码信息
    const [updateResult] = await pool.execute(
      'UPDATE sub_products_code SET product_code = ?, product_name = ?, model = ?, specification = ?, other_features = ?, component_structure = ?, unit = ?, unit_price = ?, currency = ?, production_requirements = ? WHERE id = ?',
      [product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '未找到该产品编码', code: 404 });
    }
    
    // 查询更新后的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_products_code WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到该产品编码', code: 404 });
    }
    
    res.json({ data: formatObjectTime(rows[0]), code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});



// 获取部件编码列表（分页）
router.get('/part_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_part_code LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );
    
    // 查询总记录数
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_part_code');
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 添加部件编码
router.post('/part_code', authMiddleware, async (req, res) => {
  const { part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO sub_part_code (part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_part_code WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: rows[0], code: 200 });
  } catch(error){
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 更新部件编码接口
router.put('/part_code', authMiddleware, async (req, res) => {
  const { part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, id } = req.body;
  
  try {
    // 更新部件编码信息
    const [updateResult] = await pool.execute(
      'UPDATE sub_part_code SET part_code = ?, part_name = ?, model = ?, specification = ?, other_features = ?, unit = ?, unit_price = ?, currency = ?, production_requirements = ?, remarks = ? WHERE id = ?',
      [part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '未找到该部件编码', code: 404 });
    }
    
    // 查询更新后的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_part_code WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到该部件编码', code: 404 });
    }
    
    res.json({ data: formatObjectTime(rows[0]), code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});





// 获取材料编码列表（分页）
router.get('/material_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_material_code LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );
    
    // 查询总记录数
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_material_code');
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 添加材料编码
router.post('/material_code', authMiddleware, async (req, res) => {
  const { material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO sub_material_code (material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_material_code WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: rows[0], code: 200 });
  } catch(error){
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 更新材料编码接口
router.put('/material_code', authMiddleware, async (req, res) => {
  const { material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, id } = req.body;
  
  try {
    // 更新材料编码信息
    const [updateResult] = await pool.execute(
      'UPDATE sub_material_code SET material_code = ?, material_name = ?, model = ?, specification = ?, other_features = ?, usage_unit = ?, purchase_unit = ?, unit_price = ?, currency = ?, remarks = ? WHERE id = ?',
      [material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '未找到该材料编码', code: 404 });
    }
    
    // 查询更新后的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_material_code WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到该材料编码', code: 404 });
    }
    
    res.json({ data: formatObjectTime(rows[0]), code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});





// 获取工艺编码列表（分页）
router.get('/process_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_process_code LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );
    
    // 查询总记录数
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_process_code');
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 添加工艺编码
router.post('/process_code', authMiddleware, async (req, res) => {
  const { process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO sub_process_code (process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_process_code WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: rows[0], code: 200 });
  } catch(error){
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 更新工艺编码接口
router.put('/process_code', authMiddleware, async (req, res) => {
  const { process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, id } = req.body;
  
  try {
    // 更新工艺编码信息
    const [updateResult] = await pool.execute(
      'UPDATE sub_process_code SET process_code = ?, process_name = ?, equipment_used = ?, piece_working_hours = ?, processing_unit_price = ?, section_points = ?, total_processing_price = ?, remarks = ? WHERE id = ?',
      [process_code, process_name, equipment_used, piece_working_hours, processing_unit_price, section_points, total_processing_price, remarks, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '未找到该工艺编码', code: 404 });
    }
    
    // 查询更新后的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_process_code WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到该工艺编码', code: 404 });
    }
    
    res.json({ data: formatObjectTime(rows[0]), code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});





// 获取设备信息列表（分页）
router.get('/equipment_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_equipment_code LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );
    
    // 查询总记录数
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_equipment_code');
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 添加设备信息
router.post('/equipment_code', authMiddleware, async (req, res) => {
  const { equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO sub_equipment_code (equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_equipment_code WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: rows[0], code: 200 });
  } catch(error){
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 更新设备信息接口
router.put('/equipment_code', authMiddleware, async (req, res) => {
  const { equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, id } = req.body;
  
  try {
    // 更新设备信息
    const [updateResult] = await pool.execute(
      'UPDATE sub_equipment_code SET equipment_code = ?, equipment_name = ?, equipment_quantity = ?, department = ?, working_hours = ?, equipment_efficiency = ?, equipment_status = ?, remarks = ? WHERE id = ?',
      [equipment_code, equipment_name, equipment_quantity, department, working_hours, equipment_efficiency, equipment_status, remarks, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '未找到该设备信息', code: 404 });
    }
    
    // 查询更新后的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_equipment_code WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到该设备信息', code: 404 });
    }
    
    res.json({ data: formatObjectTime(rows[0]), code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});






// 获取员工信息列表（分页）
router.get('/employee_info', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_employee_info LIMIT ? OFFSET ?',
      [parseInt(pageSize), offset]
    );
    
    // 查询总记录数
    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM sub_employee_info');
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 添加员工信息
router.post('/employee_info', authMiddleware, async (req, res) => {
  const { employee_id, name, department, production_position, salary_attribute, remarks } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO sub_employee_info (employee_id, name, department, production_position, salary_attribute, remarks) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, name, department, production_position, salary_attribute, remarks]
    );
    
    // 查询包含时间字段的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_employee_info WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: rows[0], code: 200 });
  } catch(error){
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

// 更新员工信息接口
router.put('/employee_info', authMiddleware, async (req, res) => {
  const { employee_id, name, department, production_position, salary_attribute, remarks, id } = req.body;
  
  try {
    // 更新员工信息
    const [updateResult] = await pool.execute(
      'UPDATE sub_employee_info SET employee_id = ?, name = ?, department = ?, production_position = ?, salary_attribute = ?, remarks = ? WHERE id = ?',
      [employee_id, name, department, production_position, salary_attribute, remarks, id]
    );
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '未找到该员工信息', code: 404 });
    }
    
    // 查询更新后的完整信息
    const [rows] = await pool.execute(
      'SELECT * FROM sub_employee_info WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: '未找到该员工信息', code: 404 });
    }
    
    res.json({ data: formatObjectTime(rows[0]), code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误', code: 500 });
  }
});

module.exports = router;