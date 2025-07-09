const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class SubCustomerInfo extends Model {}
SubCustomerInfo.init({
  
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      comment: '自增主键ID'
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
      comment: '所属企业id'
    },
    customer_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '客户编码'
    },
    customer_abbreviation: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '客户简称'
    },
    contact_person: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      comment: '联系人'
    },
    contact_information: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      comment: '联系方式'
    },
    company_full_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      comment: '公司全名'
    },
    company_address: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: null,
      comment: '公司地址'
    },
    delivery_address: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: null,
      comment: '交货地址'
    },
    tax_registration_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      comment: '税务登记号'
    },
    transaction_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      comment: '交易方式'
    },
    transaction_currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: null,
      comment: '交易币别'
    },
    other_transaction_terms: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '其它交易条件'
    },
    is_deleted: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
      defaultValue: 1,
      comment: '是否删除：1-未删除，0-已删除'
    },
}, {
  sequelize,
  modelName: 'sub_customer_info',
  tableName: 'sub_customer_info',
  timestamps: true,
  underscored: true,
  comment: '客户信息基础信息表'
})


module.exports = SubCustomerInfo