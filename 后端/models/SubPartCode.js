const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubPartCode = sequelize.define('SubPartCode', {
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
  part_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '部件编码'
  },
  part_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '部件名称'
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
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '单位'
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '单价'
  },
  currency: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '币别'
  },
  production_requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '生产要求'
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
  modelName: 'sub_part_code',
  tableName: 'sub_part_code',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '部件编码基础信息表'
})

module.exports = SubPartCode;