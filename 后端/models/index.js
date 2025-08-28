const { Op } = require('sequelize');
const sequelize = require('../config/sequelize.js')

const AdAdmin = require('./AdAdmin.js') // 产品报价信息表
const AdCompanyInfo = require('./AdCompanyInfo.js') // 客户企业信息表
const AdUser = require('./AdUser.js') // 子后台用户表
const AdOrganize = require('./AdOrganize.js') // 组织架构信息表
const SubProcessCycle = require('./SubProcessCycle.js') // 生产制程表
const SubWarehouseCycle = require('./SubWarehouseCycle.js') // 仓库类型表
const SubProductNotice = require('./SubProductNotice.js') // 生产通知单信息表
const SubProductQuotation = require('./SubProductQuotation.js') // 产品报价信息表
const SubCustomerInfo = require('./SubCustomerInfo.js') // 客户信息基础信息表
const SubProductCode = require('./SubProductCode.js') // 产品编码信息表
const SubProcessCode = require('./SubProcessCode.js') // 工艺编码信息表
const SubSupplierInfo = require('./subSupplierInfo.js') // 供应商信息表
const SubPartCode = require('./SubPartCode.js') // 部件编码基础信息表
const SubMaterialCode = require('./SubMaterialCode.js') // 材料编码基础信息表
const SubEquipmentCode = require('./SubEquipmentCode.js') // 设备编码基础信息表
const SubEmployeeInfo = require('./SubEmployeeInfo.js') // 员工信息基础信息表
const SubMaterialBom = require('./SubMaterialBom.js') // 材料BOM信息表
const SubMaterialBomChild = require('./SubMaterialBomChild.js') // 材料BOM信息表 子表
const SubProcessBom = require('./SubProcessBom.js') // 工艺BOM信息表
const SubProcessBomChild = require('./SubProcessBomChild.js') // 工艺BOM信息表 子表
const SubSaleOrder = require('./SubSaleOrder.js') // 销售订单表
const SubMaterialQuote = require('./SubMaterialQuote.js') // 材料报价表
const SubOutsourcingQuote = require('./SubOutsourcingQuote.js') // 委外报价信息表
const SubProductionProgress = require('./SubProductionProgress.js') // 生产进度表

// AdUser.hasOne(AdCompanyInfo, { foreignKey: 'id', sourceKey: 'company_id', as: 'company' })
// AdCompanyInfo.belongsTo(AdUser, { foreignKey: 'id', targetKey: 'company_id' })
AdUser.hasMany(AdOrganize, { foreignKey: 'menber_id', as: 'organize' });
AdOrganize.hasMany(AdOrganize, { foreignKey: 'pid', as: 'children' });
AdOrganize.belongsTo(AdUser, { foreignKey: 'menber_id', as: 'menber' });

SubEquipmentCode.belongsTo(SubProcessCycle, { foreignKey: 'cycle_id', as: 'cycle' })

SubSaleOrder.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' })
SubSaleOrder.belongsTo(SubProductCode, { foreignKey: 'product_id', as: 'product' })
SubProductCode.hasMany(SubSaleOrder, { foreignKey: 'product_id', as: 'order' })
SubCustomerInfo.hasMany(SubSaleOrder, { foreignKey: 'customer_id', as: 'order' })

SubProductQuotation.belongsTo(SubSaleOrder, { foreignKey: 'sale_id', as: 'sale' })
SubProductQuotation.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' })
SubProductQuotation.belongsTo(SubProductCode, { foreignKey: 'product_id', as: 'product' })

SubProductNotice.belongsTo(SubSaleOrder, { foreignKey: 'sale_id', as: 'sale' })
SubProductNotice.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' })
SubProductNotice.belongsTo(SubProductCode, { foreignKey: 'product_id', as: 'product' })

SubMaterialBom.belongsTo(SubProductCode, { foreignKey: 'product_id', as: 'product' });
SubMaterialBom.belongsTo(SubPartCode, { foreignKey: 'part_id', as: 'part' });
SubMaterialBom.hasMany(SubMaterialBomChild, { foreignKey: 'material_bom_id', as: 'children' })
SubMaterialBomChild.belongsTo(SubMaterialBom, { foreignKey: 'material_bom_id', as: 'parent' })
SubMaterialBomChild.belongsTo(SubMaterialCode, { foreignKey: 'material_id', as: 'material' })
SubMaterialCode.hasOne(SubMaterialBomChild, { foreignKey: 'material_id' })

SubProcessBom.belongsTo(SubProductCode, { foreignKey: 'product_id', as: 'product' });
SubProcessBom.belongsTo(SubPartCode, { foreignKey: 'part_id', as: 'part' });
SubProcessBom.hasMany(SubProcessBomChild, { foreignKey: 'process_bom_id', as: 'children' })
SubProcessBomChild.belongsTo(SubProcessBom, { foreignKey: 'process_bom_id', as: 'parent' })
SubProcessBomChild.belongsTo(SubProcessCode, { foreignKey: 'process_id', as: 'process' })
SubProcessBomChild.belongsTo(SubEquipmentCode, { foreignKey: 'equipment_id', as: 'equipment' })
SubProcessCode.hasOne(SubProcessBomChild, { foreignKey: 'process_id' })
SubEquipmentCode.hasOne(SubProcessBomChild, { foreignKey: 'equipment_id' })

SubMaterialQuote.belongsTo(SubMaterialCode, { foreignKey: 'material_id', as: 'material' })
SubMaterialQuote.belongsTo(SubSupplierInfo, { foreignKey: 'supplier_id', as: 'supplier' })
SubMaterialQuote.belongsTo(SubProductNotice, { foreignKey: 'notice_id', as: 'notice' })
SubMaterialQuote.belongsTo(SubProductCode, { foreignKey: 'product_id', as: 'product' })

SubOutsourcingQuote.belongsTo(SubSupplierInfo, { foreignKey: 'supplier_id', as: 'supplier' })
SubOutsourcingQuote.belongsTo(SubProcessBom, { foreignKey: 'process_bom_id', as: 'processBom' })
SubOutsourcingQuote.belongsTo(SubProcessBomChild, { foreignKey: 'process_bom_children_id', as: 'processChildren' })
SubOutsourcingQuote.belongsTo(SubProductNotice, { foreignKey: 'notice_id', as: 'notice' })

SubProductionProgress.belongsTo(SubProductNotice, { foreignKey: 'notice_id', as: 'notice' })
SubProductionProgress.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' })
SubProductionProgress.belongsTo(SubProductCode, { foreignKey: 'product_id', as: 'product' })
SubProductionProgress.belongsTo(SubPartCode, { foreignKey: 'part_id', as: 'part' })
SubProductionProgress.belongsTo(SubProcessBom, { foreignKey: 'bom_id', as: 'bom' })

module.exports = {
  Op,
  sequelize,
  AdAdmin,
  AdCompanyInfo,
  AdUser,
  AdOrganize,
  SubProcessCycle,
  SubWarehouseCycle,
  SubProductNotice,
  SubProductQuotation,
  SubCustomerInfo,
  SubProductCode,
  SubProcessCode,
  SubSupplierInfo,
  SubPartCode,
  SubMaterialCode,
  SubEquipmentCode,
  SubEmployeeInfo,
  SubMaterialBom,
  SubMaterialBomChild,
  SubProcessBom,
  SubProcessBomChild,
  SubSaleOrder,
  SubMaterialQuote,
  SubOutsourcingQuote,
  SubProductionProgress
}


