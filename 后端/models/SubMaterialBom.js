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
  product_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '产品编码id'
  },
  part_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '部件编码id'
  },
  archive: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '是否已存档，1未存，0已存'
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