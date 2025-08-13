const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubMaterialBomChild = sequelize.define('SubMaterialBomChild', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: ' 自增主键 ID'
  },
  material_bom_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 材料 BOM 的父表 id'
  },
  material_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 材料编码 ID，关联材料编码表 '
  },
  number: {
    type: DataTypes.INTEGER(20),
    allowNull: true,
    defaultValue: null,
    comment: ' 数量'
  },
}, {
  sequelize,
  modelName: 'sub_material_bom_child',
  tableName: 'sub_material_bom_child',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '材料BOM表子表'
})

module.exports = SubMaterialBomChild;