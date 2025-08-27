const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { AdUser, AdOrganize, SubProcessCycle, SubWarehouseCycle, Op } = require('../models')
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取后台用户列表（分页）
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: 获取后台用户列表（分页）
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 */
router.get('/user', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const { company_id, id: userId } = req.user;
  // 查询当前页的数据，排除当前登录用户，只显示其创建的用户
  const { count, rows } = await AdUser.findAndCountAll({
    where: {
      is_deleted: 1,
      parent_id: userId,
      company_id,
    },
    include: [{
      model: AdOrganize,
      as: 'organize',
      where: { is_deleted: 1 },
      required: false
    }],
    order: [['created_at', 'DESC']],
    limit: parseInt(pageSize),
    offset
  })
  const totalPages = Math.ceil(count / pageSize)
  const fromData = rows.map(item => {
    const data = item.toJSON()
    const { password, ...userData } = data
    return userData
  })

  const result = fromData.map(user => {
    const organizeNames = user.organize?.map(pos => pos.label);
    return {
      ...user,
      organizeNames,
    };
  })

  // 返回所需信息
  res.json({ 
    data: formatArrayTime(result), 
    total: count, 
    totalPages, 
    currentPage: parseInt(page), 
    pageSize: parseInt(pageSize),
    code: 200
  });
});

// 添加用户
/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: 新增用户
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: username
 *         schema:
 *           type: string
 *       - name: password
 *         schema:
 *           type: string
 *       - name: name
 *         schema:
 *           type: string
 *       - name: power
 *         schema:
 *           type: string
 *       - name: status
 *         schema:
 *           type: int
 */
router.post('/user', authMiddleware, async (req, res) => {
  const { username, password, name, power, status } = req.body;
  
  const { id: parent_id, company_id } = req.user

  if(password.length < 6){
    return res.json({ message: '密码长度需大于等于6位，请重新输入', code: 401 })
  }
  const rows = await AdUser.findAll({
    where: {
      username,
      company_id
    }
  })
  if(rows.length != 0){
    return res.json({ message: '用户名已被使用，请输入其他用户名', code: 401 })
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const type = 2
  
  AdUser.create({
    username, name, power, status, parent_id, company_id, type,
    password: hashedPassword
  })
  
  res.json({ message: '添加成功', code: 200 });
});

// 更新子管理员接口
/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: 更新用户
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: id
 *         schema:
 *           type: int
 *       - name: username
 *         schema:
 *           type: string
 *       - name: password
 *         schema:
 *           type: string
 *       - name: name
 *         schema:
 *           type: string
 *       - name: power
 *         schema:
 *           type: string
 *       - name: status
 *         schema:
 *           type: int
 */
router.put('/user', authMiddleware, async (req, res) => {
  const { username, password, name, power, status, id } = req.body;
  
  const { id: parent_id, company_id } = req.user
  
  // 检查新用户名是否已被其他用户使用
  const rows = await AdUser.findAll({
    where: {
      username, 
      company_id,
      id: {
        [Op.ne]: id
      }
    }
  })
  if(rows.length != 0){
    return res.json({ message: '用户名已被使用，请输入其他用户名', code: 401 })
  }

  // 先查询原始密码
  const adminRows = await AdUser.findOne({
    id, company_id
  })
  
  // 如果密码字段存在且不为空，则加密新密码
  // 否则使用原始密码
  const passwordToUpdate = password ? await bcrypt.hash(password, 10) : adminRows.password;
  const type = 2

  // 更新管理员信息
  await AdUser.update({
    username, name, power, type, company_id, parent_id, status,
    password: passwordToUpdate
  }, { where: { id } })
  
  res.json({ message: "修改成功", code: 200 });
});

// 删除子后台用户
/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: 删除用户
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: id
 *         schema:
 *           type: int
 */
router.delete('/user/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  const result = await AdUser.update({
    is_deleted: 0
  }, { where: { id, is_deleted: 1 } })
  
  if (result.affectedRows === 0) {
    return res.json({ message: '用户不存在或已被删除', code: 401 });
  }
  
  await AdUser.update({
    is_deleted: 0
  }, { where: { parent_id: id, is_deleted: 1 } })
  
  res.json({ message: '删除成功', code: 200 });
});





/**
 * 将扁平的组织节点数组转换为树形结构
 * @param {Array} nodes - 扁平的组织节点数组
 * @returns {Array} 树形结构数组
 */
function buildOrgTree(nodes) {
  const nodeMap = {};
  
  // 构建节点映射并初始化children
  nodes.forEach(node => {
    nodeMap[node.id] = {
      ...node,
      children: []
    };
  });

  // 构建树形结构
  const tree = [];
  nodes.forEach(node => {
    const currentNode = nodeMap[node.id];
    if (node.pid === 0) {
      tree.push(currentNode);
    } else if (nodeMap[node.pid]) {
      nodeMap[node.pid].children.push(currentNode);
    }
  });

  // 按sort排序并递归处理子节点
  // function sortChildren(node) {
  //   if (node.children && node.children.length > 0) {
  //     node.children.sort((a, b) => a.sort - b.sort);
  //     node.children.forEach(child => sortChildren(child));
  //   }
  // }
  
  // tree.forEach(rootNode => sortChildren(rootNode));
  return tree;
}
/**
 * @swagger
 * /api/organize:
 *   get:
 *     summary: 组织结构
 *     description: 本接口不需要传参数，直接调用即可
 *     tags:
 *       - 系统管理
 */
router.get('/organize', authMiddleware, async (req, res) => {
  const { company_id } = req.user;
  
  const nodes = await AdOrganize.findAll({
    where: {
      is_deleted: 1,
      company_id,
    },
    include: [
      { model: AdUser, as: 'menber' }
    ],
  });
  const nodeList = nodes.map(node => {
    const data = node.toJSON()
    return {
      id: data.id,
      pid: data.pid,
      label: { label: data.label, menberName: data.menber?.name },
      menber_id: data.menber?.id
    }
  });
  // 构建树形结构
  const tree = buildOrgTree(nodeList);

  res.json({ 
    data: formatArrayTime(tree), 
    code: 200
  });
})
/**
 * @swagger
 * /api/organize:
 *   post:
 *     summary: 新增组织节点
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: pid
 *         schema:
 *           type: int
 *         description: 父节点ID，如果没有则填0
 *       - name: label
 *         schema:
 *           type: string
 *         description: 节点名称
 *       - name: menber_id
 *         schema:
 *           type: string
 *         description: 关联的用户ID
 */
router.post('/organize', authMiddleware, async (req, res) => {
  const { label, pid = 0, menber_id } = req.body;
  // menber_id所选择的用户id，pid父节点id
  const { company_id, id: user_id } = req.user;

  // 验证父节点是否存在
  if (pid != 0) {
    const parentNode = await AdOrganize.findByPk(pid);
    if (!parentNode) {
      return res.json({ message: '父节点不存在', code: 401})
    }
  }
  // 验证用户是否存在
  if (menber_id) {
    const userExists = await AdUser.findByPk(menber_id);
    if (!userExists) {
      return res.json({ message: '用户不存在', code: 401 });
    }
  }
  AdOrganize.create({ label, pid, menber_id, user_id, company_id })

  res.json({ message: '添加成功', code: 200 });
})
/**
 * @swagger
 * /api/organize:
 *   put:
 *     summary: 修改组织节点
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: id
 *         schema:
 *           type: int
 *         description: 当前节点ID
 *       - name: pid
 *         schema:
 *           type: int
 *         description: 父节点ID，如果没有则填0
 *       - name: label
 *         schema:
 *           type: string
 *         description: 节点名称
 *       - name: menber_id
 *         schema:
 *           type: string
 *         description: 关联的用户ID
 */
router.put('/organize', authMiddleware, async (req, res) => {
  const { label, pid = 0, menber_id, id } = req.body;
  // menber_id所选择的用户id，pid父节点id
  const { company_id, id: user_id } = req.user;

  const node = await AdOrganize.findByPk(id);
  if (!node) {
    return res.json({ message: '组织节点不存在', code: 401 });
  }
  if (menber_id !== undefined && menber_id !== null) {
    const userExists = await AdUser.findByPk(menber_id);
    if (!userExists) {
      return res.json({ message: '关联的用户不存在', code: 401 });
    }
  }
  await AdOrganize.update({
    label, pid, menber_id, company_id, user_id
  }, {
    where: { id }
  })

  res.json({ message: '修改成功', code: 200 });
})
/**
 * @swagger
 * /api/organize:
 *   delete:
 *     summary: 删除组织节点
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: id
 *         schema:
 *           type: int
 *         description: 当前节点ID
 */
router.delete('/organize', authMiddleware, async (req, res) => {
  const { id } = req.query;

  const node = await AdOrganize.findByPk(id);
  if (!node) {
    return res.json({ message: '组织节点不存在', code: 401 });
  }
  
  await AdOrganize.update({
    is_deleted: 0
  }, {
    where: { id }
  })

  res.json({ message: '删除成功', code: 200 });
})



// 生产制程
/**
 * @swagger
 * /api/process_cycle:
 *   get:
 *     summary: 获取生产制程列表（分页）
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 */
router.get('/process_cycle', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const { company_id } = req.user;
  
  const { count, rows } = await SubProcessCycle.findAndCountAll({
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
})
/**
 * @swagger
 * /api/process_cycle:
 *   post:
 *     summary: 新增生产制程
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: name
 *         schema:
 *           type: string
 */
router.post('/process_cycle', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const { id: userId, company_id } = req.user;
  
  const processCycle = await SubProcessCycle.create({
    name, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
})
/**
 * @swagger
 * /api/process_cycle:
 *   put:
 *     summary: 修改生产制程
 *     tags:
 *       - 系统管理
 *     parameters:
 *       - name: id
 *         schema:
 *           type: int
 *       - name: name
 *         schema:
 *           type: string
 */
router.put('/process_cycle', authMiddleware, async (req, res) => {
  const { name, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  // 验证是否存在
  const processCycle = await SubProcessCycle.findByPk(id);
  if (!processCycle) {
    return res.json({ message: '生产制程不存在', code: 401 });
  }
  
  await processCycle.update({
    name, company_id,
    user_id: userId
  }, { where: { id } })
  
  res.json({ msg: "修改成功", code: 200 });
})




// 仓库类型
router.get('/warehouse_cycle', authMiddleware, async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const { company_id } = req.user;
  
  const { count, rows } = await SubWarehouseCycle.findAndCountAll({
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
})
router.post('/warehouse_cycle', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const { id: userId, company_id } = req.user;
  
  const warehouse = await SubWarehouseCycle.create({
    name, company_id,
    user_id: userId
  })
  
  res.json({ msg: '添加成功', code: 200 });
})
router.put('/warehouse_cycle', authMiddleware, async (req, res) => {
  const { name, id } = req.body;
  const { id: userId, company_id } = req.user;
  
  // 验证是否存在
  const warehouse = await SubWarehouseCycle.findByPk(id);
  if (!warehouse) {
    return res.json({ message: '仓库类型不存在', code: 401 });
  }
  
  await warehouse.update({
    name, company_id,
    user_id: userId
  }, { where: { id } })
  
  res.json({ msg: "修改成功", code: 200 });
})


module.exports = router;   