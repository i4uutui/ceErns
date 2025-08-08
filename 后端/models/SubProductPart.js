const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubProductPart = sequelize.define('SubProductPart', {
  product_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    comment: '产品ID'
  },
  part_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    comment: '部件ID'
  },
}, {
  sequelize,
  modelName: 'sub_product_part',
  tableName: 'sub_product_part',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '产品和部件的关联中间表'
})

module.exports = SubProductPart;