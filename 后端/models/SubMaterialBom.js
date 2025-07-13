const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubMaterialBom = sequelize.define('SubMaterialBom', {
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
  number: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '序号'
  },
  model_spec: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '型号&规格'
  },
  other_features: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '其它特性'
  },
  send_receiving_units: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '收发单位'
  },
  purchasing_unit: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '采购单位'
  },
  quantity_used: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '使用数量'
  },
  loss_rate: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '损耗率'
  },
  purchase_quantity: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '采购数量'
  },
  is_deleted: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 1,
    comment: '是否删除：1-未删除，0-已删除'
  }
}, {
  sequelize,
  modelName: 'sub_material_bom',
  tableName: 'sub_material_bom',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '材料BOM信息表'
})

module.exports = SubMaterialBom;