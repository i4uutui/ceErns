const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubProcessBomChild = sequelize.define('SubProcessBomChild', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: ' 自增主键 ID'
  },
  process_bom_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 工艺 BOM 的父表 id'
  },
  process_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 工艺编码 ID，关联工艺编码表 '
  },
  equipment_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    comment: ' 设备编码 ID，关联设备信息表 '
  },
  process_index: {
    type: DataTypes.INTEGER(5),
    allowNull: false,
    comment: ' 工序下标 '
  },
  time: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    defaultValue: null,
    comment: ' 单件工时 (小时)'
  },
  price: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    defaultValue: null,
    comment: ' 加工单价 '
  },
  cycle_id: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    comment: ' 生产制程ID '
  },
}, {
  sequelize,
  modelName: 'sub_process_bom_child',
  tableName: 'sub_process_bom_child',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '工艺BOM表子表'
})

module.exports = SubProcessBomChild;