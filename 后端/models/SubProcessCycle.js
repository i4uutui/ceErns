const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubProcessCycle = sequelize.define('SubProcessCycle', {
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
    comment: '制程名称'
  },
  is_deleted: {
    type: DataTypes.TINYINT(3),
    allowNull: true,
    defaultValue: 1,
    comment: '是否删除：1-未删除，0-已删除'
  }
}, {
  sequelize,
  modelName: 'sub_process_cycle',
  tableName: 'sub_process_cycle',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '生产制程表'
})

module.exports = SubProcessCycle;