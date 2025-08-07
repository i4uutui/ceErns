const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubProductCode = sequelize.define('SubProductCode', {
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
  product_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '产品的唯一标识编码',
  },
  product_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '产品的名称',
  },
  drawing: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '产品的工程图号',
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '产品的型号',
  },
  specification: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '产品的规格参数',
  },
  other_features: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '产品的其他特性描述',
  },
  component_structure: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '产品的部件结构说明',
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '产品的计量单位',
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '产品的单价',
  },
  currency: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '产品价格的币别',
  },
  production_requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '产品的生产要求',
  },
  is_deleted: {
    type: DataTypes.INTEGER(1).UNSIGNED.ZEROFILL,
    allowNull: true,
    defaultValue: 1,
    comment: '1：未删除；0：已删除',
  }
}, {
  sequelize,
  modelName: 'sub_product_code',
  tableName: 'sub_product_code',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '产品编码信息表'
})

module.exports = SubProductCode;