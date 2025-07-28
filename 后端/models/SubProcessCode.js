const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubProcessCode = sequelize.define('SubProcessCode', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
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
  process_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '工艺'
  },
  process_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '工艺名称'
  },
  equipment_used: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: ' 使用设备 '
  },
  piece_working_hours: {
    type: DataTypes.STRING(5),
    allowNull: true,
    comment: ' 单件工时 (小时)'
  },
  processing_unit_price: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    comment: ' 加工单价 '
  },
  section_points: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    comment: ' 段数点数 '
  },
  total_processing_price: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    comment: ' 加工总价 '
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注'
  },
  is_deleted: {
    type: DataTypes.INTEGER(1).UNSIGNED.ZEROFILL,
    allowNull: true,
    defaultValue: 1,
    comment: '1：未删除；0：已删除'
  },
}, {
  sequelize,
  modelName: 'sub_process_code',
  tableName: 'sub_process_code',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '工艺编码基础信息表'
})

module.exports = SubProcessCode;