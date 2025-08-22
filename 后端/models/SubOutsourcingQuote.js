const {
  DataTypes
} = require('sequelize');
const sequelize = require('../config/sequelize');

const SubOutsourcingQuote = sequelize.define('SubOutsourcingQuote', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
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
  notice_id: {
    type: DataTypes.INTEGER(10),
    allowNull: false,
    comment: ' 生产通知单ID'
  },
  supplier_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 供应商 ID'
  },
  process_bom_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 工艺BOM ID '
  },
  process_bom_children_id: {
    type: DataTypes.INTEGER(5),
    allowNull: false,
    comment: ' 工艺BOM副表的id '
  },
  price: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    defaultValue: null,
    comment: ' 加工单价 '
  },
  transaction_currency: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: ' 交易币别 '
  },
  other_transaction_terms: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: ' 交易条件 '
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: ' 备注 '
  },
  is_deleted: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 1,
    comment: ' 是否删除：1 - 未删除，0 - 已删除 '
  },
}, {
  sequelize,
  modelName: 'sub_outsourcing_quote',
  tableName: 'sub_outsourcing_quote',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '委外报价信息表'
})

module.exports = SubOutsourcingQuote;