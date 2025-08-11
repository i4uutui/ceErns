const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubMaterialCode = sequelize.define('SubMaterialCode', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '自增主键ID'
  },
  user_id: {
    type: DataTypes.INTEGER(5),
    allowNull: true,
    comment: '发布用户id'
  },
  company_id: {
    type: DataTypes.INTEGER(5),
    allowNull: true,
    comment: '企业id'
  },
  material_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '材料编码'
  },
  material_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '材料名称'
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '型号'
  },
  specification: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '规格'
  },
  other_features: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '其它特性'
  },
  usage_unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '使用单位'
  },
  purchase_unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '采购单位'
  },
  unit_price: {
    type: DataTypes.DECIMAL(10),
    allowNull: true,
    comment: '单价'
  },
  currency: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '币别'
  },
  number: {
    type: DataTypes.DECIMAL(20),
    allowNull: true,
    comment: '数量'
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注'
  },
  is_deleted: {
    type: DataTypes.INTEGER(1).UNSIGNED.ZEROFILL,
    allowNull: true,
    defaultValue: 1,
    comment: '1：未删除；0：已删除'
  },
}, {
  sequelize,
  modelName: 'sub_material_code',
  tableName: 'sub_material_code',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '材料编码基础信息表'
})

module.exports = SubMaterialCode;