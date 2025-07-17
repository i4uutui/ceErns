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
const SubSaleOrder = require('./SubSaleOrder.js') // 销售订单表

AdUser.belongsTo(AdCompanyInfo, { foreignKey: 'company_id', as: 'company' });

SubProductNotice.belongsTo(SubProductQuotation, { foreignKey: 'quote_id', as: 'quote' })
SubProductQuotation.belongsTo(SubSaleOrder, { foreignKey: 'sale_id', as: 'sale' });
SubMaterialBom.belongsTo(SubPartCode, { foreignKey: 'part_id', as: 'part' })
SubMaterialBom.belongsTo(SubMaterialCode, { foreignKey: 'material_id', as: 'material' })
SubSaleOrder.belongsTo (SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' });
SubSaleOrder.belongsTo (SubProductsCode, { foreignKey: 'product_id', as: 'product' });

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
  SubSaleOrder,
}


