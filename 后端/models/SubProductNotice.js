const {
  DataTypes
} = require('sequelize');
const sequelize = require('../config/sequelize');

const SubProductNotice = sequelize.define('SubProductNotice', {
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
  notice: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: ' 生产订单号 '
  },
  quote_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: ' 报价单 id'
  },
  sale_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: ' 销售 id'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: ' 产品 id'
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: ' 客户 id'
  },
  delivery_time: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: ' 交货日期 '
  },
  is_deleted: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 1,
    comment: ' 是否删除：1 - 未删除，0 - 已删除 '
  },
}, {
  sequelize,
  modelName: 'sub_product_notice',
  tableName: 'sub_product_notice',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '生产通知单信息表'
})

module.exports = SubProductNotice;