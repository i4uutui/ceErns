const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubMaterialQuote = sequelize.define('SubMaterialQuote', {
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
  material_code_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: ' 材料编码 ID'
  },
  delivery: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: ' 送货方式 '
  },
  packaging: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: ' 包装要求 '
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
  }
}, {
  sequelize,
  modelName: 'SubMaterialQuote',
  tableName: 'SubMaterialQuote',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '材料报价信息表'
})

module.exports = SubMaterialQuote;