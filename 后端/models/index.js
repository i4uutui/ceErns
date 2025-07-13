const { Op } = require('sequelize');

const AdAdmin = require('./AdAdmin.js') // 产品报价信息表
const AdCompanyInfo = require('./AdCompanyInfo.js') // 客户企业信息表
const AdUser = require('./AdUser.js') // 子后台用户表
const SubProductQuotation = require('./SubProductQuotation.js') // 产品报价信息表
const SubCustomerInfo = require('./SubCustomerInfo.js') // 客户信息基础信息表
const SubProductsCode = require('./SubProductsCode.js') // 产品编码信息表
const SubSupplierInfo = require('./subSupplierInfo.js') // 供应商信息表
const SubPartCode = require('./SubPartCode.js') // 部件编码基础信息表
const SubMaterialCode = require('./SubMaterialCode.js') // 材料编码基础信息表
const SubMaterialBom = require('./SubMaterialBom.js') // 材料BOM信息表

AdUser.belongsTo(AdCompanyInfo, { foreignKey: 'company_id', as: 'company' });

SubProductQuotation.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' });
SubProductQuotation.belongsTo(SubProductsCode, { foreignKey: 'product_id', as: 'product' });

SubMaterialBom.belongsTo(SubPartCode, { foreignKey: 'part_id', as: 'part' })
SubMaterialBom.belongsTo(SubMaterialCode, { foreignKey: 'material_id', as: 'material' })

module.exports = {
  Op,
  AdAdmin,
  AdCompanyInfo,
  AdUser,
  SubProductQuotation,
  SubCustomerInfo,
  SubProductsCode,
  SubSupplierInfo,
  SubPartCode,
  SubMaterialCode,
  SubMaterialBom
}


