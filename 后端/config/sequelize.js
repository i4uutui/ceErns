const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ceshi', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // 启用SQL日志
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;