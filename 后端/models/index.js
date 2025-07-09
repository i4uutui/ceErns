const { Op } = require('sequelize');

const SubProductQuotation = require('./SubProductQuotation.js')
const SubCustomerInfo = require('./SubCustomerInfo.js')
const SubProductsCode = require('./SubProductsCode.js')
const SubSupplierInfo = require('./subSupplierInfo.js')

SubProductQuotation.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id', as: 'customer' });
SubProductQuotation.belongsTo(SubProductsCode, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  Op,
  SubProductQuotation,
  SubCustomerInfo,
  SubProductsCode,
  SubSupplierInfo
}


