const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubSaleOrder = sequelize.define('SubSaleOrder', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: ' 自增主键 ID'
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: ' 企业 id'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: ' 发布的用户 id'
  },
  rece_time: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: ' 接单日期 '
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: ' 客户 id'
  },
  customer_order: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: ' 客户订单号 '
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: ' 产品编码 id'
  },
  product_req: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: ' 产品要求 '
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: ' 产品数量 '
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: ' 单位 '
  },
  delivery_time: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: ' 交货日期 '
  },
  goods_time: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: ' 送货日期 '
  },
  goods_address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: ' 送货地点 '
  },
  is_deleted: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 1,
    comment: ' 是否删除：1 - 未删除，0 - 已删除 '
  },
}, {
  sequelize,
  modelName: 'sub_sales_order',
  tableName: 'sub_sales_order',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '销售订单表'
})

module.exports = SubSaleOrder;