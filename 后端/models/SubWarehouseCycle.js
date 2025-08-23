const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubWarehouseCycle = sequelize.define('SubWarehouseCycle', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '名称'
  },
  is_deleted: {
    type: DataTypes.TINYINT(3),
    allowNull: true,
    defaultValue: 1,
    comment: '是否删除：1-未删除，0-已删除'
  }
}, {
  sequelize,
  modelName: 'sub_warehouse_cycle',
  tableName: 'sub_warehouse_cycle',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '仓库类型表'
})

module.exports = SubWarehouseCycle;