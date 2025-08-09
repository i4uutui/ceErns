const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubPartProcess = sequelize.define('SubPartProcess', {
  part_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    comment: '部件ID'
  },
  process_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    comment: '工艺ID'
  },
}, {
  sequelize,
  modelName: 'sub_part_process',
  tableName: 'sub_part_process',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '部件和工艺的关联中间表'
})

module.exports = SubPartProcess;