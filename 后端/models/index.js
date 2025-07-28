const { Op } = require('sequelize');

const AdAdmin = require('./AdAdmin.js') // 产品报价信息表
const AdCompanyInfo = require('./AdCompanyInfo.js') // 客户企业信息表
const AdUser = require('./AdUser.js') // 子后台用户表
const SubProductNotice = require('./SubProductNotice.js') // 生产通知单信息表
const SubProductQuotation = require('./SubProductQuotation.js') // 产品报价信息表
const SubCustomerInfo = require('./SubCustomerInfo.js') // 客户信息基础信息表
const SubProductsCode = require('./SubProductsCode.js') // 产品编码信息表
const SubProcessCode = require('./SubProcessCode.js') // 工艺编码信息表
const SubSupplierInfo = require('./subSupplierInfo.js') // 供应商信息表
const SubPartCode = require('./SubPartCode.js') // 部件编码基础信息表
const SubMaterialCode = require('./SubMaterialCode.js') // 材料编码基础信息表
const SubEquipmentCode = require('./SubEquipmentCode.js') // 设备编码基础信息表
const SubEmployeeInfo = require('./SubEmployeeInfo.js') // 员工信息基础信息表
const SubMaterialBom = require('./SubMaterialBom.js') // 材料BOM信息表
const SubProcessBom = require('./SubProcessBom.js') // 材料BOM信息表
const SubSaleOrder = require('./SubSaleOrder.js') // 销售订单表
const SubMaterialQuote = require('./SubMaterialQuote.js') // 材料报价表
const SubOutsourcingQuote = require('./SubOutsourcingQuote.js') // 委外报价信息表

AdUser.hasOne(AdCompanyInfo, { foreignKey: 'id', sourceKey: 'company_id', as: 'company' })
AdCompanyInfo.belongsTo(AdUser, { foreignKey: 'id', targetKey: 'company_id' })

SubSaleOrder.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' })
SubSaleOrder.belongsTo(SubProductsCode, { foreignKey: 'product_id', as: 'product' })

SubProductQuotation.belongsTo(SubSaleOrder, { foreignKey: 'sale_id', as: 'sale' })
SubProductQuotation.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' })
SubProductQuotation.belongsTo(SubProductsCode, { foreignKey: 'product_id', as: 'product' })

SubProductNotice.belongsTo(SubProductQuotation, { foreignKey: 'quote_id', as: 'quote' })
SubProductNotice.belongsTo(SubSaleOrder, { foreignKey: 'sale_id', as: 'sale' })
SubProductNotice.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' })
SubProductNotice.belongsTo(SubProductsCode, { foreignKey: 'product_id', as: 'product' })

SubMaterialBom.belongsTo(SubProductsCode, { foreignKey: 'product_id', as: 'product' })
SubMaterialBom.belongsTo(SubPartCode, { foreignKey: 'part_id', as: 'part' })

SubProcessBom.belongsTo(SubProductsCode, { foreignKey: 'product_id', as: 'product' })
SubProcessBom.belongsTo(SubPartCode, { foreignKey: 'part_id', as: 'part' })

SubMaterialQuote.belongsTo(SubMaterialCode, { foreignKey: 'material_id', as: 'material' })
SubMaterialQuote.belongsTo(SubSupplierInfo, { foreignKey: 'supplier_id', as: 'supplier' })
SubMaterialQuote.belongsTo(SubProductNotice, { foreignKey: 'notice_id', as: 'notice' })
SubMaterialQuote.belongsTo(SubProductsCode, { foreignKey: 'product_id', as: 'product' })

SubOutsourcingQuote.belongsTo(SubSupplierInfo, { foreignKey: 'supplier_id', as: 'supplier' })
SubOutsourcingQuote.belongsTo(SubProductsCode, { foreignKey: 'product_id', as: 'product' })
SubOutsourcingQuote.belongsTo(SubPartCode, { foreignKey: 'part_id', as: 'part' })
SubOutsourcingQuote.belongsTo(SubProcessCode, { foreignKey: 'process_id', as: 'process' })

module.exports = {
  Op,
  AdAdmin,
  AdCompanyInfo,
  AdUser,
  SubProductNotice,
  SubProductQuotation,
  SubCustomerInfo,
  SubProductsCode,
  SubProcessCode,
  SubSupplierInfo,
  SubPartCode,
  SubMaterialCode,
  SubEquipmentCode,
  SubEmployeeInfo,
  SubMaterialBom,
  SubProcessBom,
  SubSaleOrder,
  SubMaterialQuote,
  SubOutsourcingQuote
}


