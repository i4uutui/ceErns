const { Op } = require('sequelize');

const SubProductQuotation = require('./SubProductQuotation')
const SubCustomerInfo = require('./SubCustomerInfo')
const SubProductsCode = require('./SubProductsCode')


SubProductQuotation.belongsTo(SubCustomerInfo, { foreignKey: 'customer_id' });
SubProductQuotation.belongsTo(SubProductsCode, { foreignKey: 'product_id' });

module.exports = {
  Op,
  SubProductQuotation,
  SubCustomerInfo,
  SubProductsCode
}