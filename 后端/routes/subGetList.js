const express = require('express');
const router = express.Router();
const { SubProductsCode, SubCustomerInfo, SubPartCode, SubMaterialCode, SubSaleOrder, SubProductQuotation, SubProcessCode, SubEquipmentCode, SubSupplierInfo, SubProductNotice, Op } = require('../models');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取销售订单列表
router.get('/getSaleOrder', authMiddleware, async (req, res) => {
  const { customer_order } = req.query;
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, customer_order: {
      [Op.like]: `%${customer_order}%`
    } },
    include: [
      { model: SubProductsCode, as: 'product' },
      { model: SubCustomerInfo, as: 'customer'}
    ],
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubSaleOrder.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});
// 获取报价单列表
router.get('/getProductQuotation', authMiddleware, async (req, res) => {
  const { notice } = req.query;
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, notice: {
      [Op.like]: `%${notice}%`
    } },
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubProductQuotation.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});
// 获取客户列表
router.get('/getCustomerInfo', authMiddleware, async (req, res) => {
  const { customer_abbreviation } = req.query;
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, customer_abbreviation: {
      [Op.like]: `%${customer_abbreviation}%`
    } },
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubCustomerInfo.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});
// 获取产品编码列表
router.get('/getProductsCode', authMiddleware, async (req, res) => {
  const { product_code } = req.query;
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, product_code: {
      [Op.like]: `%${product_code}%`
    } },
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubProductsCode.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});
// 获取部件编码列表
router.get('/getPartCode', authMiddleware, async (req, res) => {
  const { part_code } = req.query;
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, part_code: {
      [Op.like]: `%${part_code}%`
    } },
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubPartCode.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});
// 获取材料编码列表
router.get('/getMaterialCode', authMiddleware, async (req, res) => {
  const { material_code } = req.query;
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, material_code: {
      [Op.like]: `%${material_code}%`
    } },
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubMaterialCode.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});
// 获取工艺编码列表
router.get('/getProcessCode', authMiddleware, async (req, res) => {
  const { process_code } = req.query;
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, process_code: {
      [Op.like]: `%${process_code}%`
    } },
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubProcessCode.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});
// 获取设备编码列表
router.get('/getEquipmentCode', authMiddleware, async (req, res) => {
  const { equipment_code } = req.query;
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, equipment_code: {
      [Op.like]: `%${equipment_code}%`
    } },
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubEquipmentCode.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});


// 获取供应商列表（分页）
router.get('/getSupplierInfo', authMiddleware, async (req, res) => {
  const { supplier_code } = req.query;
  
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, supplier_code: {
      [Op.like]: `%${supplier_code}%`
    } },
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubSupplierInfo.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});

// 获取生产通知单列表
router.get('/getProductNotice', authMiddleware, async (req, res) => {
  const { notice } = req.query;
  
  const { company_id } = req.user;
  
  const config = {
    where: { is_deleted: 1, company_id, notice: {
      [Op.like]: `%${notice}%`
    } },
    order: [['created_at', 'DESC']],
  }
  const { count, rows } = await SubProductNotice.findAndCountAll(config);
  const row = rows.map(e => e.toJSON())
  
  res.json({ data: formatArrayTime(row), code: 200 });
});

module.exports = router;  