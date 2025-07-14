const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubProductQuotation = sequelize.define('SubProductQuotation', {
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
  sale_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '销售订单id'
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
  }
}, {
  sequelize,
  modelName: 'sub_product_quotation',
  tableName: 'sub_product_quotation',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '产品报价信息表'
})


module.exports = SubProductQuotation;
