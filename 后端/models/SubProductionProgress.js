const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubProductionProgress = sequelize.define('SubProductionProgress', {
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
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '生产通知单id'
  },
  product_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '产品编码id'
  },
  customer_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '客户id'
  },
  sale_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: '销售id'
  },
  out_number: {
    type: DataTypes.INTEGER(20),
    allowNull: true,
    comment: '委外/库存数量'
  },
  order_number: {
    type: DataTypes.INTEGER(20),
    allowNull: true,
    comment: '生产数量'
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: ' 生产特别要求 '
  },
}, {
  sequelize,
  modelName: 'sub_production_progress',
  tableName: 'sub_production_progress',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '生产进度表'
})

module.exports = SubProductionProgress