const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { formatArrayTime, formatObjectTime } = require('../middleware/formatTime');

// 获取产品编码
router.get('/getProductsCode', authMiddleware, async (req, res) => {
  const { company_id } = req.user;
  const [rows] = await pool.execute(
    'SELECT * FROM sub_products_code WHERE is_deleted = 1 and company_id = ? ORDER BY created_at DESC',
    [company_id]
  );
  const list = rows.map(item => {
    const { product_name, id, ...rest } = item;
    return {
      label: item.product_name,
      value: item.id,
      ...rest
    }
  })
  // 返回所需信息
  res.json({ data: formatArrayTime(list), code: 200 });
});

// 获取客户信息列表（分页）
router.get('/getCustomerInfo', authMiddleware, async (req, res) => {
  const { company_id } = req.user;
  const [rows] = await pool.execute(
    'SELECT * FROM sub_customer_info WHERE is_deleted = 1 and company_id = ? ORDER BY created_at DESC',
    [company_id]
  );
  const list = rows.map(item => {
    const { customer_abbreviation, id, ...rest } = item;
    return {
      label: item.customer_abbreviation,
      value: item.id,
      ...rest
    }
  })
  // 返回所需信息
  res.json({ data: formatArrayTime(list), code: 200 });
});


module.exports = router;