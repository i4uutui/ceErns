const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class SubProductQuotation extends Model {}
SubProductQuotation.init({
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    comment: '自增主键ID'
  },
  company_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '企业id'
  },
  user_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '发布的用户id'
  },
  customer_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '客户id'
  },
  product_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '产品编码id'
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '型号'
  },
  spec: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '规格'
  },
  order_char: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '其他特性'
  },
  customer_order: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '客户订单'
  },
  order_number: {
    type: DataTypes.INTEGER(20),
    allowNull: true,
    comment: '订单数量'
  },
  product_unit: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '产品单位'
  },
  product_price: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '产品单价'
  },
  transaction_currency: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '交易币别'
  },
  other_transaction_terms: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '交易条件'
  },
  is_deleted: {
    type: DataTypes.TINYINT(3),
    allowNull: true,
    defaultValue: 1,
    comment: '是否删除：1-未删除，0-已删除'
  },
}, {
  sequelize,
  modelName: 'sub_product_quotation',
  tableName: 'sub_product_quotation',
  timestamps: true,
  underscored: true,
  comment: '产品报价信息表'
})

module.exports = SubProductQuotation;