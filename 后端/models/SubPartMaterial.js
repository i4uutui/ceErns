const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubPartMaterial = sequelize.define('SubPartMaterial', {
  part_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    comment: '部件ID'
  },
  material_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    comment: '材料ID'
  },
}, {
  sequelize,
  modelName: 'sub_part_material',
  tableName: 'sub_part_material',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '部件和材料的关联中间表'
})

module.exports = SubPartMaterial;