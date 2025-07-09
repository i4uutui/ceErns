const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubSupplierInfo = sequelize.define('SubSupplierInfo', {
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
  supplier_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '供应商编码'
  },
  supplier_abbreviation: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '供应商简称'
  },
  contact_person: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '联系人'
  },
  contact_information: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '联系方式'
  },
  supplier_full_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '供应商全名'
  },
  supplier_address: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: '供应商地址'
  },
  supplier_category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '供应商类别'
  },
  supply_method: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '供货方式'
  },
  transaction_method: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '交易方式'
  },
  transaction_currency: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '交易币别'
  },
  other_transaction_terms: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '其它交易条件'
  },
  is_deleted: {
    type: DataTypes.TINYINT(3),
    allowNull: true,
    defaultValue: 1,
    comment: '是否删除：1-未删除，0-已删除'
  }
}, {
  sequelize,
  modelName: 'sub_supplier_info',
  tableName: 'sub_supplier_info',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '供应商信息表'
})

module.exports = SubSupplierInfo;