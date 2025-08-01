const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AdOrganize = sequelize.define('AdOrganize', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER(5),
    allowNull: true,
    defaultValue: null,
    comment: '发布用户id'
  },
  company_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 所属企业 id'
  },
  pid: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 上级ID'
  },
  menber_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 关联的用户ID，关联员工信息表'
  },
  label: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: ' 节点名称，如部门名称 '
  },
  is_deleted: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 1,
    comment: ' 是否删除：1 - 未删除，0 - 已删除 '
  }
}, {
  sequelize,
  modelName: 'ad_organize',
  tableName: 'ad_organize',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '材料报价信息表'
})

module.exports = AdOrganize;