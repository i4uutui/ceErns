const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AdUser = sequelize.define("AdUser", {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 所属企业 id'
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: ' 用户名 '
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: ' 密码 '
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: ' 姓名 '
  },
  power: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: ' 权限字符串 '
  },
  type: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    comment: ' 账号类型：1 - 子管理员账号，2 - 普通子账号 '
  },
  parent_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 上级的 id'
  },
  status: {
    type: DataTypes.TINYINT(3).UNSIGNED,
    allowNull: true,
    defaultValue: 1,
    comment: ' 账户状态：1 - 正常，0 - 禁用 '
  },
  is_deleted: {
    type: DataTypes.TINYINT(3),
    allowNull: true,
    defaultValue: 1,
    comment: ' 是否删除：1 - 未删除，0 - 已删除 '
  }
}, {
  sequelize,
  modelName: 'ad_user',
  tableName: 'ad_user',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '子后台用户表'
})

module.exports = AdUser