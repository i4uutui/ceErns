const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SubEmployeeInfo = sequelize.define('SubEmployeeInfo', {
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
  employee_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: ' 员工工号 '
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: ' 姓名 '
  },
  department: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: ' 所属部门 '
  },
  production_position: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: ' 生产岗位 '
  },
  salary_attribute: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: ' 工资属性 '
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: ' 备注 '
  },
  is_deleted: {
    type: DataTypes.TINYINT(3),
    allowNull: true,
    defaultValue: 1,
    comment: ' 是否删除：1 - 未删除，0 - 已删除 '
  },
}, {
  sequelize,
  modelName: 'sub_employee_info',
  tableName: 'sub_employee_info',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '员工信息基础信息表'
})

module.exports = SubEmployeeInfo;