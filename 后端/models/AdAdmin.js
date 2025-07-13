const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AdAdmin = sequelize.define("AdAdmin", {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '密码哈希'
  }
}, {
  sequelize,
  modelName: 'ad_admin',
  tableName: 'ad_admin',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '总后台用户表'
})

module.exports = AdAdmin