const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取产品编码列表（分页）
router.get('/products_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const userId = req.user.id;

  // 首先查询当前用户信息
  const [userRows] = await pool.execute(
    'SELECT id, uid, power FROM sub_admins WHERE id = ?',
    [userId]
  );
  const currentUser = userRows[0];
  if (!currentUser) {
    return res.json({ message: '用户不存在', code: 404 });
  }
  
  let userIds = [];
  // 如果当前用户的uid有数据，则查询所有uid相同的用户
  if (currentUser.uid !== null) {
    const [sameUidRows] = await pool.execute(
      'SELECT id FROM sub_admins WHERE uid = ?',
      [currentUser.uid]
    );
    userIds = [currentUser.uid, ...sameUidRows.map(row => row.id)];
  } else {
    // 否则查询当前用户及其所有子用户
    const [subUserRows] = await pool.execute(
      'SELECT id FROM sub_admins WHERE uid = ?',
      [userId]
    );
    userIds = [userId, ...subUserRows.map(row => row.id)];
  }
  
  const placeholders = userIds.map(() => '?').join(',');
  const queryParams = [...userIds, parseInt(pageSize), offset];
  
  // 查询当前页的数据，只显示共享用户创建的产品编码
  const [rows] = await pool.execute(
    `SELECT spc.*, sa.username, sa.name, sa.company, sa.avatar_url 
     FROM sub_products_code spc
     JOIN sub_admins sa ON spc.user_id = sa.id
     WHERE spc.user_id IN (${placeholders}) AND spc.is_delete = 0 
     ORDER BY spc.created_at DESC LIMIT ? OFFSET ?`,
    queryParams
  );
  
  // 格式化数据，将用户信息提取到单独的对象中
  const formattedData = rows.map(row => {
    const { username, name, company, avatar_url, ...productData } = row;
    return {
      ...productData,
      user: {
        id: productData.user_id,
        username,
        name,
        company,
        avatar_url
      }
    };
  });

  // 为总记录数查询创建参数
  const countParams = [...userIds];
  
  // 查询总记录数
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) as total FROM sub_products_code WHERE user_id IN (${placeholders}) AND is_delete = 0`,
    countParams
  );
  const total = countRows[0].total;

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);
  
  // 返回所需信息
  res.json({ 
    data: formatArrayTime(formattedData), 
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
  
  const userId = req.user.id;
  
  const [result] = await pool.execute(
    'INSERT INTO sub_products_code (product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, userId]
  );
  
  res.json({ msg: '添加成功', code: 200 });
});

// 更新产品编码接口
router.put('/products_code', authMiddleware, async (req, res) => {
  const { product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, id } = req.body;
  
  const userId = req.user.id;
  
  // 更新产品编码信息
  const [updateResult] = await pool.execute(
    'UPDATE sub_products_code SET product_code = ?, product_name = ?, model = ?, specification = ?, other_features = ?, component_structure = ?, unit = ?, unit_price = ?, currency = ?, production_requirements = ?, user_id = ? WHERE id = ?',
    [product_code, product_name, model, specification, other_features, component_structure, unit, unit_price, currency, production_requirements, userId, id]
  );
  
  if (updateResult.affectedRows === 0) {
    return res.status(404).json({ message: '未找到该产品编码', code: 404 });
  }
  
  res.json({ msg: "修改成功", code: 200 });
});

// 删除产品编码
router.delete('/products_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  // 更新 deleted_at 为当前时间
  const [result] = await pool.execute(
    'UPDATE sub_products_code SET is_delete = 1 WHERE id = ? AND is_delete = 0',
    [id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '用户不存在或已被删除', code: 401 });
  }

  res.json({ message: '删除成功', code: 200 });
});



// 获取部件编码列表（分页）
router.get('/part_code', authMiddleware, async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    const userId = req.user.id;
    
    // 首先查询当前用户信息
    const [userRows] = await pool.execute(
      'SELECT id, uid, power FROM sub_admins WHERE id = ?',
      [userId]
    );
    const currentUser = userRows[0];
    if (!currentUser) {
      return res.json({ message: '用户不存在', code: 404 });
    }
    
    let userIds = [];
    // 如果当前用户的uid有数据，则查询所有uid相同的用户
    if (currentUser.uid !== null) {
      const [sameUidRows] = await pool.execute(
        'SELECT id FROM sub_admins WHERE uid = ?',
        [currentUser.uid]
      );
      userIds = [currentUser.uid, ...sameUidRows.map(row => row.id)];
    } else {
      // 否则查询当前用户及其所有子用户
      const [subUserRows] = await pool.execute(
        'SELECT id FROM sub_admins WHERE uid = ?',
        [userId]
      );
      userIds = [userId, ...subUserRows.map(row => row.id)];
    }
    
    const placeholders = userIds.map(() => '?').join(',');
    const queryParams = [...userIds, parseInt(pageSize), offset];
    
    // 查询当前页的数据，只显示共享用户创建的产品编码
    const [rows] = await pool.execute(
      `SELECT spc.*, sa.username, sa.name, sa.company, sa.avatar_url 
       FROM sub_part_code spc
       JOIN sub_admins sa ON spc.user_id = sa.id
       WHERE spc.user_id IN (${placeholders}) AND spc.is_delete = 0 
       ORDER BY spc.created_at DESC LIMIT ? OFFSET ?`,
      queryParams
    );
    
    // 格式化数据，将用户信息提取到单独的对象中
    const formattedData = rows.map(row => {
      const { username, name, company, avatar_url, ...productData } = row;
      return {
        ...productData,
        user: {
          id: productData.user_id,
          username,
          name,
          company,
          avatar_url
        }
      };
    });
    
    // 为总记录数查询创建参数
    const countParams = [...userIds];
    
    // 查询总记录数
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM sub_part_code WHERE user_id IN (${placeholders}) AND is_delete = 0`,
      countParams
    );
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
  
  const userId = req.user.id;

  const [result] = await pool.execute(
    'INSERT INTO sub_part_code (part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, userId]
  );
  
  // 查询包含时间字段的完整信息
  const [rows] = await pool.execute(
    'SELECT * FROM sub_part_code WHERE id = ?',
    [result.insertId]
  );

  res.json({ data: rows[0], code: 200 });
});

// 更新部件编码接口
router.put('/part_code', authMiddleware, async (req, res) => {
  const { part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, id } = req.body;
  
  const userId = req.user.id;
  
  // 更新部件编码信息
  const [updateResult] = await pool.execute(
    'UPDATE sub_part_code SET part_code = ?, part_name = ?, model = ?, specification = ?, other_features = ?, unit = ?, unit_price = ?, currency = ?, production_requirements = ?, remarks = ?, user_id = ? WHERE id = ?',
    [part_code, part_name, model, specification, other_features, unit, unit_price, currency, production_requirements, remarks, userId, id]
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
});

// 删除部件编码
router.delete('/part_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  // 更新 deleted_at 为当前时间
  const [result] = await pool.execute(
    'UPDATE sub_part_code SET is_delete = 1 WHERE id = ? AND is_delete = 0',
    [id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '用户不存在或已被删除', code: 401 });
  }

  res.json({ message: '删除成功', code: 200 });
});





// 获取材料编码列表（分页）
router.get('/material_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    const userId = req.user.id;
    
    // 首先查询当前用户信息
    const [userRows] = await pool.execute(
      'SELECT id, uid, power FROM sub_admins WHERE id = ?',
      [userId]
    );
    const currentUser = userRows[0];
    if (!currentUser) {
      return res.json({ message: '用户不存在', code: 404 });
    }
    
    let userIds = [];
    // 如果当前用户的uid有数据，则查询所有uid相同的用户
    if (currentUser.uid !== null) {
      const [sameUidRows] = await pool.execute(
        'SELECT id FROM sub_admins WHERE uid = ?',
        [currentUser.uid]
      );
      userIds = [currentUser.uid, ...sameUidRows.map(row => row.id)];
    } else {
      // 否则查询当前用户及其所有子用户
      const [subUserRows] = await pool.execute(
        'SELECT id FROM sub_admins WHERE uid = ?',
        [userId]
      );
      userIds = [userId, ...subUserRows.map(row => row.id)];
    }
    
    const placeholders = userIds.map(() => '?').join(',');
    const queryParams = [...userIds, parseInt(pageSize), offset];
    
    // 查询当前页的数据，只显示共享用户创建的产品编码
    const [rows] = await pool.execute(
      `SELECT spc.*, sa.username, sa.name, sa.company, sa.avatar_url 
       FROM sub_material_code spc
       JOIN sub_admins sa ON spc.user_id = sa.id
       WHERE spc.user_id IN (${placeholders}) AND spc.is_delete = 0 
       ORDER BY spc.created_at DESC LIMIT ? OFFSET ?`,
      queryParams
    );
    
    // 格式化数据，将用户信息提取到单独的对象中
    const formattedData = rows.map(row => {
      const { username, name, company, avatar_url, ...productData } = row;
      return {
        ...productData,
        user: {
          id: productData.user_id,
          username,
          name,
          company,
          avatar_url
        }
      };
    });
    
    // 为总记录数查询创建参数
    const countParams = [...userIds];
    
    // 查询总记录数
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM sub_material_code WHERE user_id IN (${placeholders}) AND is_delete = 0`,
      countParams
    );
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
  
  const userId = req.user.id;

  const [result] = await pool.execute(
    'INSERT INTO sub_material_code (material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, userId]
  );
  
  // 查询包含时间字段的完整信息
  const [rows] = await pool.execute(
    'SELECT * FROM sub_material_code WHERE id = ?',
    [result.insertId]
  );

  res.json({ data: rows[0], code: 200 });
});

// 更新材料编码接口
router.put('/material_code', authMiddleware, async (req, res) => {
  const { material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, id } = req.body;
  
  const userId = req.user.id;
  
  // 更新材料编码信息
  const [updateResult] = await pool.execute(
    'UPDATE sub_material_code SET material_code = ?, material_name = ?, model = ?, specification = ?, other_features = ?, usage_unit = ?, purchase_unit = ?, unit_price = ?, currency = ?, remarks = ?, user_id = ? WHERE id = ?',
    [material_code, material_name, model, specification, other_features, usage_unit, purchase_unit, unit_price, currency, remarks, userId, id]
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
});

// 删除材料编码
router.delete('/material_code/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  // 更新 deleted_at 为当前时间
  const [result] = await pool.execute(
    'UPDATE sub_material_code SET is_delete = 1 WHERE id = ? AND is_delete = 0',
    [id]
  );
  
  if (result.affectedRows === 0) {
    return res.json({ message: '用户不存在或已被删除', code: 401 });
  }

  res.json({ message: '删除成功', code: 200 });
});





// 获取工艺编码列表（分页）
router.get('/process_code', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  
  try {
    // 查询当前页的数据
    const [rows] = await pool.execute(
      'SELECT * FROM sub_process_code ORDER BY created_at DESC LIMIT ? OFFSET ?',
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
      'SELECT * FROM sub_equipment_code ORDER BY created_at DESC LIMIT ? OFFSET ?',
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
      'SELECT * FROM sub_employee_info ORDER BY created_at DESC LIMIT ? OFFSET ?',
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