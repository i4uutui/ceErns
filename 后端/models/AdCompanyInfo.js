const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AdCompanyInfo = sequelize.define("AdCompanyInfo", {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '自增主键ID'
  },
  logo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '企业logo'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '公司名称'
  },
  person: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '联系人'
  },
  contact: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '联系方式'
  },
  address: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: '公司地址'
  }
}, {
  sequelize,
  modelName: 'ad_company_info',
  tableName: 'ad_company_info',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '客户企业信息表'
})

module.exports = AdCompanyInfo