const express = require('express');
const router = express.Router();
const { SubProductsCode, SubCustomerInfo, SubPartCode, SubMaterialCode, Op } = require('../models');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

/**
 * 创建通用的获取数据列表的路由处理函数
 * @param {Model} Model - Sequelize 模型
 * @param {string} labelField - 用于显示标签的字段名
 * @returns {Function} - 路由处理函数
 */
const createGetListHandler = (Model, labelField) => async (req, res) => {
  const { company_id } = req.user;

  const { count, rows } = await Model.findAndCountAll({
    where: { is_deleted: 1, company_id },
    order: [['created_at', 'DESC']],
  });
  
  const formattedList = rows.map(item => {
    const itemData = item.get({ plain: true });
    return {
      label: itemData[labelField],
      ...itemData
    };
  });

  res.json({ data: formatArrayTime(formattedList), code: 200 });
};

// 使用封装的函数创建路由
router.get('/getMaterialCode', authMiddleware, createGetListHandler(SubMaterialCode, 'material_name'));
router.get('/getPartCode', authMiddleware, createGetListHandler(SubPartCode, 'part_name'));
router.get('/getProductsCode', authMiddleware, createGetListHandler(SubProductsCode, 'product_name'));
router.get('/getCustomerInfo', authMiddleware, createGetListHandler(SubCustomerInfo, 'customer_abbreviation'));

module.exports = router;  