const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubEquipmentCode = sequelize.define('SubEquipmentCode', {
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
  equipment_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: ' 设备编码 '
  },
  equipment_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: ' 设备名称 '
  },
  equipment_quantity: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    defaultValue: 2,
    comment: ' 设备数量 '
  },
  cycle_id: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    comment: ' 所属制程组 '
  },
  working_hours: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: ' 工作时长 (小时)'
  },
  equipment_efficiency: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: ' 设备效能 '
  },
  equipment_status: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: ' 设备状态 '
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: ' 备注 '
  },
  is_deleted: {
    type: DataTypes.INTEGER(1).UNSIGNED.ZEROFILL,
    allowNull: true,
    defaultValue: 1,
    comment: '1：未删除；0：已删除 '
  },
}, {
  sequelize,
  modelName: 'sub_equipment_code',
  tableName: 'sub_equipment_code',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '设备信息基础信息表'
})

module.exports = SubEquipmentCode;