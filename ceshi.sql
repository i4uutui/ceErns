/*
 Navicat Premium Data Transfer

 Source Server         : ceshi
 Source Server Type    : MySQL
 Source Server Version : 50740
 Source Host           : localhost:3306
 Source Schema         : ceshi

 Target Server Type    : MySQL
 Target Server Version : 50740
 File Encoding         : 65001

 Date: 27/08/2025 16:29:40
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ad_admin
-- ----------------------------
DROP TABLE IF EXISTS `ad_admin`;
CREATE TABLE `ad_admin`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码哈希',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ad_admin
-- ----------------------------
INSERT INTO `ad_admin` VALUES (1, 'admin', '$2b$10$K7.4Gl6jHarcam6M5hGmSefgqtPOQsxzhux/8o6hK3H38f1PrFjs2', '2025-07-07 11:14:53', '2025-07-07 11:14:53');

-- ----------------------------
-- Table structure for ad_company_info
-- ----------------------------
DROP TABLE IF EXISTS `ad_company_info`;
CREATE TABLE `ad_company_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `logo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '企业logo',
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公司名称',
  `person` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系人',
  `contact` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `address` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '公司地址',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '客户企业信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ad_company_info
-- ----------------------------
INSERT INTO `ad_company_info` VALUES (1, NULL, '东莞企业', '梁工', '13800138000', '东莞市寮步镇', '2025-07-07 11:54:18', '2025-07-07 11:55:10');
INSERT INTO `ad_company_info` VALUES (2, NULL, '东坑企业', '刘工1', '13800138000', '东坑镇', '2025-07-07 13:59:43', '2025-07-12 15:29:04');

-- ----------------------------
-- Table structure for ad_organize
-- ----------------------------
DROP TABLE IF EXISTS `ad_organize`;
CREATE TABLE `ad_organize`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `pid` int(11) NULL DEFAULT NULL COMMENT '上级ID，用于构建组织层级关系',
  `label` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点名称，如部门名称',
  `menber_id` int(11) NULL DEFAULT NULL COMMENT '关联的用户ID，关联员工信息表',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '组织架构信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ad_organize
-- ----------------------------
INSERT INTO `ad_organize` VALUES (1, 1, 1, 0, '企业名称11', 4, 1, '2025-08-01 14:55:42', '2025-08-01 17:12:20');
INSERT INTO `ad_organize` VALUES (2, 1, 1, 1, '业务部', 1, 0, '2025-08-01 14:56:50', '2025-08-01 17:11:17');
INSERT INTO `ad_organize` VALUES (3, 1, 1, 0, '前端工程师', 4, 1, '2025-08-01 15:56:01', '2025-08-01 15:56:01');
INSERT INTO `ad_organize` VALUES (4, 1, 1, 1, '221', 5, 0, '2025-08-01 17:11:46', '2025-08-01 17:11:50');

-- ----------------------------
-- Table structure for ad_user
-- ----------------------------
DROP TABLE IF EXISTS `ad_user`;
CREATE TABLE `ad_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL COMMENT '所属企业id',
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `power` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '权限字符串',
  `type` tinyint(1) NULL DEFAULT NULL COMMENT '账号类型：1-子管理员账号，2-普通子账号',
  `parent_id` int(11) NOT NULL COMMENT '上级的id',
  `status` tinyint(3) UNSIGNED NULL DEFAULT 1 COMMENT '账户状态：1-正常，0-禁用',
  `is_deleted` tinyint(3) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ad_user
-- ----------------------------
INSERT INTO `ad_user` VALUES (1, 1, 'admin1', '$2b$10$qJOWecY5nOd6ICarLgePce3XPyVtXXrp1dkbB9ZQvtydVrKLz8uGG', '我是名字', NULL, 1, 0, 1, 1, '2025-07-07 13:56:55', '2025-07-21 17:26:05');
INSERT INTO `ad_user` VALUES (2, 2, 'admin99', '$2b$10$Ukc2Byd6TFsl0u2p68J0leC7tVgwp4LDWr7s6YV0EWpc6xR3dZyMm', NULL, NULL, 1, 0, 1, 1, '2025-07-07 14:00:05', '2025-07-08 14:21:48');
INSERT INTO `ad_user` VALUES (3, 1, '2121', '$2b$10$EpPaXdgc4ugWWT1Qi.DFSeRoz9XyBa3N7mKkNGuXEBvmy.pe8HEWq', NULL, NULL, 1, 0, 1, 1, '2025-07-08 10:35:09', '2025-07-08 14:21:49');
INSERT INTO `ad_user` VALUES (4, 1, '121', '$2b$10$4ZYMcp6ZeDQauRLCZCb1mOBIUy9ML4gbRTZDizJU3VaOt83D8ZJnu', '2132', '[[\"基础资料\",\"ProductCode\"],[\"基础资料\",\"PartCode\"],[\"基础资料\",\"MaterialCode\"],[\"基础资料\",\"ProcessCode\"],[\"基础资料\",\"EquipmentCode\"],[\"基础资料\",\"EmployeeInfo\"],[\"订单管理\",\"CustomerInfo\"],[\"订单管理\",\"ProductQuote\"],[\"订单管理\",\"SalesOrder\"],[\"订单管理\",\"ProductDelivery\"]]', 2, 1, 1, 1, '2025-07-08 14:10:45', '2025-07-08 14:40:30');
INSERT INTO `ad_user` VALUES (5, 1, 'admin2', '$2b$10$qJOWecY5nOd6ICarLgePce3XPyVtXXrp1dkbB9ZQvtydVrKLz8uGG', '哈哈', '[[\"系统管理\"],[\"系统管理\",\"OrganizeManagement\"],[\"系统管理\",\"ProcessCycle\"],[\"系统管理\",\"ProcessCycle\",\"ProcessCycle:edit\"],[\"系统管理\",\"WarehouseType\"],[\"基础资料\"],[\"基础资料\",\"MaterialCode\"],[\"基础资料\",\"PartCode\"],[\"基础资料\",\"ProductCode\"],[\"基础资料\",\"ProductCode\",\"ProductCode:add\"],[\"基础资料\",\"ProductCode\",\"ProductCode:edit\"],[\"基础资料\",\"PartCode\",\"PartCode:edit\"],[\"基础资料\",\"PartCode\",\"PartCode:delete\"],[\"基础资料\",\"MaterialCode\",\"MaterialCode:edit\"],[\"基础资料\",\"ProcessCode\"],[\"基础资料\",\"EquipmentCode\"],[\"基础资料\",\"EquipmentCode\",\"EquipmentCode:edit\"],[\"基础资料\",\"EquipmentCode\",\"EquipmentCode:add\"],[\"基础资料\",\"EquipmentCode\",\"EquipmentCode:delete\"],[\"基础资料\",\"EmployeeInfo\",\"EmployeeInfo:delete\"],[\"基础资料\",\"EmployeeInfo\",\"EmployeeInfo:edit\"],[\"基础资料\",\"EmployeeInfo\"],[\"订单管理\"],[\"订单管理\",\"CustomerInfo\"],[\"订单管理\",\"CustomerInfo\",\"CustomerInfo:add\"],[\"订单管理\",\"CustomerInfo\",\"CustomerInfo:edit\"],[\"订单管理\",\"SalesOrder\"],[\"订单管理\",\"SalesOrder\",\"SalesOrder:edit\"],[\"订单管理\",\"ProductQuote\"],[\"订单管理\",\"ProductQuote\",\"ProductQuote:add\"],[\"订单管理\",\"ProductNotice\"],[\"订单管理\",\"ProductNotice\",\"ProductNotice:edit\"],[\"订单管理\",\"ProductNotice\",\"ProductNotice:add\"],[\"订单管理\",\"ProductNotice\",\"ProductNotice:date\"],[\"订单管理\",\"ProductDelivery\"],[\"产品信息\"],[\"产品信息\",\"MaterialBOM\"],[\"产品信息\",\"MaterialBOM\",\"MaterialBOM:add\"],[\"产品信息\",\"MaterialBOM\",\"MaterialBOM:edit\"],[\"产品信息\",\"MaterialBOM\",\"MaterialBOM:archive\"],[\"产品信息\",\"MaterialBOM\",\"MaterialBOM:newPage\"],[\"产品信息\",\"MaterialBOMArchive\"],[\"产品信息\",\"ProcessBOM\"],[\"产品信息\",\"ProcessBOM\",\"ProcessBOM:archive\"],[\"产品信息\",\"ProcessBOM\",\"ProcessBOM:newPage\"],[\"产品信息\",\"ProcessBOMArchive\"]]', 2, 1, 1, 1, '2025-07-08 14:20:13', '2025-08-23 11:25:17');

-- ----------------------------
-- Table structure for sub_customer_info
-- ----------------------------
DROP TABLE IF EXISTS `sub_customer_info`;
CREATE TABLE `sub_customer_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `user_id` int(5) NULL DEFAULT NULL COMMENT '发布用户id',
  `company_id` int(11) NOT NULL COMMENT '所属企业id',
  `customer_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '客户编码',
  `customer_abbreviation` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '客户简称',
  `contact_person` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系人',
  `contact_information` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `company_full_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '公司全名',
  `company_address` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '公司地址',
  `delivery_address` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交货地址',
  `tax_registration_number` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '税务登记号',
  `transaction_method` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交易方式',
  `transaction_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交易币别',
  `other_transaction_terms` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '其它交易条件',
  `is_deleted` int(3) NOT NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '客户信息基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_customer_info
-- ----------------------------
INSERT INTO `sub_customer_info` VALUES (1, 1, 1, '123223', '我是客户哦', '1', '1', '1', '1', '1', '1', '1', '1', '1', 1, '2025-07-08 19:29:21', '2025-07-09 15:38:10');
INSERT INTO `sub_customer_info` VALUES (2, 1, 1, '1234', '2121', '212', '121', '21', '121', '2121', '21', '21', '2121', '2121', 1, '2025-07-09 00:58:19', '2025-07-09 00:58:19');
INSERT INTO `sub_customer_info` VALUES (3, 1, 1, '12311', '211', '12', '1', '15', '155', '15', '15', '1', '55', '11', 1, '2025-07-09 15:04:51', '2025-07-09 15:04:51');

-- ----------------------------
-- Table structure for sub_employee_info
-- ----------------------------
DROP TABLE IF EXISTS `sub_employee_info`;
CREATE TABLE `sub_employee_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `user_id` int(5) NOT NULL COMMENT '发布的用户id',
  `company_id` int(5) NOT NULL COMMENT '企业id',
  `employee_id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '员工工号',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `department` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '所属部门',
  `production_position` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '生产岗位',
  `salary_attribute` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '工资属性',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `is_deleted` tinyint(3) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '员工信息基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_employee_info
-- ----------------------------
INSERT INTO `sub_employee_info` VALUES (1, 1, 1, '1', '1', '1', '1', '1', '1', 1, '2025-07-08 16:39:58', '2025-08-12 10:17:59');
INSERT INTO `sub_employee_info` VALUES (2, 1, 1, '2', '2', '3', '23', '32', '3', 1, '2025-07-08 16:40:09', '2025-07-08 16:42:06');

-- ----------------------------
-- Table structure for sub_equipment_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_equipment_code`;
CREATE TABLE `sub_equipment_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `user_id` int(5) NULL DEFAULT NULL COMMENT '用户id',
  `company_id` int(5) NULL DEFAULT NULL COMMENT '企业id',
  `equipment_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '设备编码',
  `equipment_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '设备名称',
  `equipment_quantity` int(11) NULL DEFAULT 2 COMMENT '设备数量',
  `department` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '所属部门',
  `working_hours` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '工作时长(小时)',
  `equipment_efficiency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备效能',
  `equipment_status` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备状态',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `is_deleted` int(1) UNSIGNED ZEROFILL NULL DEFAULT 1 COMMENT '1：未删除；0：已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '设备信息基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_equipment_code
-- ----------------------------
INSERT INTO `sub_equipment_code` VALUES (3, 1, 1, '123', '设备2121', 12, '121', '121', '211', '21', '212', 1, '2025-07-08 16:06:29', '2025-08-12 10:17:56');
INSERT INTO `sub_equipment_code` VALUES (4, 1, 1, '111', '设备4444', 22, '2121', '2121', '212', '121', '2121', 1, '2025-08-09 16:06:56', '2025-08-09 16:06:56');

-- ----------------------------
-- Table structure for sub_material_bom
-- ----------------------------
DROP TABLE IF EXISTS `sub_material_bom`;
CREATE TABLE `sub_material_bom`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `product_id` int(11) NOT NULL COMMENT '产品编码id',
  `part_id` int(11) NOT NULL COMMENT '部件编码id',
  `archive` int(11) NULL DEFAULT NULL COMMENT '是否已存档，1未存，0已存',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '材料BOM表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_material_bom
-- ----------------------------
INSERT INTO `sub_material_bom` VALUES (5, 1, 1, 11, 6, 0, 1, '2025-07-27 11:10:29', '2025-08-03 11:04:19');
INSERT INTO `sub_material_bom` VALUES (6, 1, 1, 10, 5, 0, 1, '2025-07-27 11:22:56', '2025-08-03 11:04:19');
INSERT INTO `sub_material_bom` VALUES (7, 1, 1, 9, 6, 0, 1, '2025-07-27 11:50:06', '2025-08-03 11:04:19');
INSERT INTO `sub_material_bom` VALUES (8, 1, 1, 10, 6, 0, 1, '2025-08-02 11:04:51', '2025-08-03 11:04:19');
INSERT INTO `sub_material_bom` VALUES (9, 1, 1, 19, 5, 0, 1, '2025-08-11 10:19:02', '2025-08-13 14:40:29');
INSERT INTO `sub_material_bom` VALUES (10, 1, 1, 19, 6, 0, 1, '2025-08-11 10:19:02', '2025-08-13 14:40:29');
INSERT INTO `sub_material_bom` VALUES (11, 1, 1, 19, 10, 0, 1, '2025-08-11 10:19:02', '2025-08-13 14:40:29');
INSERT INTO `sub_material_bom` VALUES (12, 1, 1, 17, 7, 0, 1, '2025-08-13 10:38:41', '2025-08-13 14:40:29');
INSERT INTO `sub_material_bom` VALUES (13, 1, 1, 19, 6, 0, 1, '2025-08-13 14:41:35', '2025-08-17 09:48:46');
INSERT INTO `sub_material_bom` VALUES (14, 1, 1, 17, 7, 0, 1, '2025-08-13 14:41:55', '2025-08-17 09:48:46');
INSERT INTO `sub_material_bom` VALUES (15, 1, 1, 19, 10, 0, 1, '2025-08-13 14:42:03', '2025-08-17 09:48:46');
INSERT INTO `sub_material_bom` VALUES (16, 1, 1, 17, 7, 1, 1, '2025-08-21 09:35:05', '2025-08-21 09:35:08');

-- ----------------------------
-- Table structure for sub_material_bom_child
-- ----------------------------
DROP TABLE IF EXISTS `sub_material_bom_child`;
CREATE TABLE `sub_material_bom_child`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `material_bom_id` int(11) NOT NULL COMMENT '材料BOM的父表id',
  `material_id` int(11) NOT NULL COMMENT '材料编码ID，关联材料编码表',
  `number` int(20) NULL DEFAULT NULL COMMENT '数量',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '材料BOM表子表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_material_bom_child
-- ----------------------------
INSERT INTO `sub_material_bom_child` VALUES (6, 12, 2, 12, '2025-08-13 10:38:41', '2025-08-13 10:38:41');
INSERT INTO `sub_material_bom_child` VALUES (7, 12, 2, 22, '2025-08-13 10:38:41', '2025-08-13 10:38:41');
INSERT INTO `sub_material_bom_child` VALUES (8, 12, 2, 24, '2025-08-13 10:38:41', '2025-08-13 10:38:41');
INSERT INTO `sub_material_bom_child` VALUES (9, 11, 2, 23, '2025-08-13 10:59:47', '2025-08-13 10:59:47');
INSERT INTO `sub_material_bom_child` VALUES (10, 11, 2, 34, '2025-08-13 10:59:47', '2025-08-13 10:59:47');
INSERT INTO `sub_material_bom_child` VALUES (11, 10, 2, 12, '2025-08-13 10:59:52', '2025-08-13 10:59:52');
INSERT INTO `sub_material_bom_child` VALUES (12, 13, 3, 12, '2025-08-13 14:41:35', '2025-08-17 09:48:42');
INSERT INTO `sub_material_bom_child` VALUES (13, 14, 2, 12, '2025-08-13 14:41:55', '2025-08-13 14:41:55');
INSERT INTO `sub_material_bom_child` VALUES (14, 14, 2, 22, '2025-08-13 14:41:55', '2025-08-13 14:41:55');
INSERT INTO `sub_material_bom_child` VALUES (15, 14, 3, 24, '2025-08-13 14:41:55', '2025-08-17 09:38:34');
INSERT INTO `sub_material_bom_child` VALUES (16, 15, 2, 23, '2025-08-13 14:42:03', '2025-08-13 14:42:03');
INSERT INTO `sub_material_bom_child` VALUES (17, 15, 2, 34, '2025-08-13 14:42:03', '2025-08-13 14:42:03');
INSERT INTO `sub_material_bom_child` VALUES (18, 16, 3, 12, '2025-08-21 09:35:05', '2025-08-21 09:35:05');

-- ----------------------------
-- Table structure for sub_material_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_material_code`;
CREATE TABLE `sub_material_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `user_id` int(5) NULL DEFAULT NULL COMMENT '发布用户id',
  `company_id` int(5) NULL DEFAULT NULL COMMENT '企业id',
  `material_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '材料编码',
  `material_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '材料名称',
  `model` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '型号',
  `specification` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '规格',
  `other_features` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '其它特性',
  `usage_unit` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '使用单位',
  `purchase_unit` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '采购单位',
  `currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '币别',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `is_deleted` int(1) UNSIGNED ZEROFILL NULL DEFAULT 1 COMMENT '1：未删除；0：已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '材料编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_material_code
-- ----------------------------
INSERT INTO `sub_material_code` VALUES (2, 1, 1, '123', '121', '2121', '21', '2121', '21', '21', '12', '21', 1, '2025-07-08 15:36:33', '2025-08-12 10:18:06');
INSERT INTO `sub_material_code` VALUES (3, 1, 1, '789', '555', '535', '35353', '353', '353', '5353', '535', '353', 1, '2025-08-17 09:38:16', '2025-08-17 09:38:16');

-- ----------------------------
-- Table structure for sub_material_quote
-- ----------------------------
DROP TABLE IF EXISTS `sub_material_quote`;
CREATE TABLE `sub_material_quote`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `supplier_id` int(11) NULL DEFAULT NULL COMMENT '供应商id',
  `notice_id` int(11) NULL DEFAULT NULL COMMENT '生产通知单id',
  `product_id` int(11) NULL DEFAULT NULL COMMENT '产品编码id',
  `material_id` int(11) NOT NULL COMMENT '材料编码ID',
  `price` int(11) NULL DEFAULT NULL COMMENT '单价',
  `delivery` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '送货方式',
  `packaging` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '包装要求',
  `transaction_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交易币别',
  `other_transaction_terms` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '交易条件',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '材料报价信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_material_quote
-- ----------------------------
INSERT INTO `sub_material_quote` VALUES (1, 1, 1, 2, 6, 10, 2, NULL, '1111', '1111', '1111', '1111', '1111', 1, '2025-07-27 21:43:20', '2025-07-27 22:39:03');
INSERT INTO `sub_material_quote` VALUES (2, 1, 1, 1, 5, 9, 2, 21, '2222', '222', '22', '222', '22', 1, '2025-07-27 22:40:03', '2025-08-21 09:52:23');

-- ----------------------------
-- Table structure for sub_outsourcing_quote
-- ----------------------------
DROP TABLE IF EXISTS `sub_outsourcing_quote`;
CREATE TABLE `sub_outsourcing_quote`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `notice_id` int(10) NULL DEFAULT NULL COMMENT '生产通知单ID',
  `supplier_id` int(11) NOT NULL COMMENT '供应商ID',
  `process_bom_id` int(11) NOT NULL COMMENT '工艺BOM id',
  `process_bom_children_id` int(5) NULL DEFAULT NULL COMMENT '工艺BOM副表的id',
  `price` int(11) NULL DEFAULT NULL COMMENT '加工单价',
  `now_price` int(11) NULL DEFAULT NULL COMMENT '实际单价',
  `number` int(11) NULL DEFAULT NULL COMMENT '委外实际数量',
  `transaction_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交易币别',
  `other_transaction_terms` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '交易条件',
  `ment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '加工要求',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `status` int(2) NULL DEFAULT NULL COMMENT '报价单的状态：1已报价，2：已委外，3：已入库',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '委外报价信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_outsourcing_quote
-- ----------------------------
INSERT INTO `sub_outsourcing_quote` VALUES (4, 1, 1, 6, 1, 36, 5, 58, 58, 311, '￥', '自己拉货', NULL, '请准备一辆货车', 2, 1, '2025-08-25 15:05:25', '2025-08-25 15:07:03');

-- ----------------------------
-- Table structure for sub_part_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_part_code`;
CREATE TABLE `sub_part_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `user_id` int(5) NULL DEFAULT NULL COMMENT '发布的用户id',
  `company_id` int(5) NULL DEFAULT NULL COMMENT '企业id',
  `part_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '部件编码',
  `part_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '部件名称',
  `model` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '型号',
  `specification` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '规格',
  `other_features` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '其它特性',
  `unit` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '单位',
  `unit_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '单价',
  `currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '币别',
  `production_requirements` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '生产要求',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `is_deleted` int(1) UNSIGNED ZEROFILL NULL DEFAULT 1 COMMENT '1：未删除；0：已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '部件编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_part_code
-- ----------------------------
INSERT INTO `sub_part_code` VALUES (5, 1, 1, 'C002', '笔芯', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-08-21 15:46:13');
INSERT INTO `sub_part_code` VALUES (6, 1, 1, 'C001', '笔筒', '12', '1212', '1', '3131', 12.00, '21', '2121', '2121', 1, '2025-07-08 15:36:15', '2025-08-21 15:45:21');
INSERT INTO `sub_part_code` VALUES (7, 1, 1, '1234', '2124', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-08-08 11:14:41');
INSERT INTO `sub_part_code` VALUES (8, 1, 1, '1238', '2128', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-08-08 11:14:38');
INSERT INTO `sub_part_code` VALUES (9, 1, 1, '12310', '21210', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-08-08 11:14:44');
INSERT INTO `sub_part_code` VALUES (10, 1, 1, '12311', '21211', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-08-08 11:14:48');
INSERT INTO `sub_part_code` VALUES (12, 1, 1, '12312', '21212', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-08-08 11:14:51');
INSERT INTO `sub_part_code` VALUES (13, 1, 1, '12313', '21213', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-07-08 15:35:24');
INSERT INTO `sub_part_code` VALUES (14, 1, 1, '12314', '21214', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-07-08 15:35:24');
INSERT INTO `sub_part_code` VALUES (15, 1, 1, '12315', '21215', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-07-08 15:35:24');
INSERT INTO `sub_part_code` VALUES (16, 1, 1, '12316', '21216', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-07-08 15:35:24');
INSERT INTO `sub_part_code` VALUES (17, 1, 1, '12317', '21217', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-08-08 11:16:00');
INSERT INTO `sub_part_code` VALUES (18, 1, 1, '12318', '21218', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-07-08 15:35:24');
INSERT INTO `sub_part_code` VALUES (19, 1, 1, '12319', '21219', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-07-08 15:35:24');
INSERT INTO `sub_part_code` VALUES (20, 1, 1, '12320', '21220', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-07-08 15:35:24');

-- ----------------------------
-- Table structure for sub_process_bom
-- ----------------------------
DROP TABLE IF EXISTS `sub_process_bom`;
CREATE TABLE `sub_process_bom`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `product_id` int(11) NOT NULL COMMENT '产品编码id',
  `part_id` int(11) NOT NULL COMMENT '部件编码id',
  `archive` int(11) NULL DEFAULT NULL COMMENT '是否已存档，1未存，0已存',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '工艺BOM表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_process_bom
-- ----------------------------
INSERT INTO `sub_process_bom` VALUES (35, 1, 1, 19, 6, 0, 1, '2025-08-12 15:08:15', '2025-08-21 16:11:39');
INSERT INTO `sub_process_bom` VALUES (36, 1, 1, 19, 6, 0, 1, '2025-08-12 15:09:18', '2025-08-21 16:11:40');
INSERT INTO `sub_process_bom` VALUES (37, 1, 1, 19, 5, 0, 1, '2025-08-21 09:35:20', '2025-08-21 16:11:41');
INSERT INTO `sub_process_bom` VALUES (38, 1, 1, 16, 9, 1, 1, '2025-08-21 16:00:29', '2025-08-26 15:51:31');

-- ----------------------------
-- Table structure for sub_process_bom_child
-- ----------------------------
DROP TABLE IF EXISTS `sub_process_bom_child`;
CREATE TABLE `sub_process_bom_child`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `process_bom_id` int(11) NOT NULL COMMENT '工艺BOM的父表id',
  `process_id` int(11) NOT NULL COMMENT '工艺编码ID，关联工艺编码表',
  `equipment_id` int(11) NOT NULL COMMENT '设备编码ID，关联设备信息表',
  `process_index` int(5) NULL DEFAULT NULL COMMENT '工序下标',
  `time` int(11) NULL DEFAULT NULL COMMENT '单件工时(小时)',
  `price` int(11) NULL DEFAULT NULL COMMENT '加工单价',
  `cycle_id` int(11) NULL DEFAULT NULL COMMENT '生产制程ID',
  `all_time` int(11) NULL DEFAULT NULL COMMENT '全部工时-H',
  `all_load` int(11) NULL DEFAULT NULL COMMENT '每日负荷-H',
  `add_finish` int(11) NULL DEFAULT NULL COMMENT '累计完成',
  `order_number` int(11) NULL DEFAULT NULL COMMENT '订单尾数',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '工艺BOM表子表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_process_bom_child
-- ----------------------------
INSERT INTO `sub_process_bom_child` VALUES (3, 35, 4, 4, 1, 22, 22, 1, NULL, NULL, NULL, 2121, '2025-08-12 15:08:15', '2025-08-27 11:01:38');
INSERT INTO `sub_process_bom_child` VALUES (4, 35, 3, 3, 2, 44, 55, 1, NULL, NULL, NULL, 2121, '2025-08-12 15:08:15', '2025-08-27 11:01:38');
INSERT INTO `sub_process_bom_child` VALUES (5, 36, 3, 4, 2, 12, 331, 1, NULL, NULL, NULL, 2121, '2025-08-12 15:09:18', '2025-08-27 11:01:38');
INSERT INTO `sub_process_bom_child` VALUES (6, 36, 4, 3, 1, 211, 1212, 1, NULL, NULL, NULL, 2121, '2025-08-13 10:33:55', '2025-08-27 11:01:38');
INSERT INTO `sub_process_bom_child` VALUES (7, 37, 3, 3, 1, 21, 33, 2, NULL, NULL, NULL, 2121, '2025-08-21 09:35:20', '2025-08-27 11:01:38');
INSERT INTO `sub_process_bom_child` VALUES (8, 38, 3, 3, 1, 21, 121, 1, NULL, NULL, NULL, NULL, '2025-08-21 16:00:29', '2025-08-26 15:51:31');
INSERT INTO `sub_process_bom_child` VALUES (9, 38, 4, 3, 2, 212, 31, 2, NULL, NULL, NULL, NULL, '2025-08-21 16:00:29', '2025-08-26 15:27:40');
INSERT INTO `sub_process_bom_child` VALUES (10, 38, 4, 3, 3, 31, 21, 3, NULL, NULL, NULL, NULL, '2025-08-21 16:00:29', '2025-08-26 15:50:14');

-- ----------------------------
-- Table structure for sub_process_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_process_code`;
CREATE TABLE `sub_process_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `user_id` int(5) NULL DEFAULT NULL COMMENT '用户id',
  `company_id` int(5) NULL DEFAULT NULL COMMENT '企业id',
  `equipment_id` int(11) NULL DEFAULT NULL COMMENT '设备编码ID',
  `process_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '工艺编码',
  `process_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '工艺名称',
  `times` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '单件工时(小时)',
  `price` int(10) NULL DEFAULT NULL COMMENT '加工单价',
  `section_points` int(11) NULL DEFAULT NULL COMMENT '段数点数',
  `total_processing_price` int(10) NULL DEFAULT NULL COMMENT '加工总价',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `is_deleted` int(1) UNSIGNED ZEROFILL NULL DEFAULT 1 COMMENT '1：未删除；0：已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '工艺编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_process_code
-- ----------------------------
INSERT INTO `sub_process_code` VALUES (3, 1, 1, 3, '123', '212', '21', 2121, 21, 21, '212', 1, '2025-07-08 15:56:54', '2025-08-10 11:29:00');
INSERT INTO `sub_process_code` VALUES (4, 1, 1, 4, '2222', '111', '3131', 21, 213, 3131, '3131', 1, '2025-08-09 16:07:09', '2025-08-22 09:32:16');

-- ----------------------------
-- Table structure for sub_process_cycle
-- ----------------------------
DROP TABLE IF EXISTS `sub_process_cycle`;
CREATE TABLE `sub_process_cycle`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id，关联企业信息表',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id，关联用户表',
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '仓库名称',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '仓库类型表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sub_process_cycle
-- ----------------------------
INSERT INTO `sub_process_cycle` VALUES (1, 1, 1, '备料组', 1, '2025-08-21 09:30:12', '2025-08-21 09:30:12');
INSERT INTO `sub_process_cycle` VALUES (2, 1, 1, '设备组', 1, '2025-08-21 09:30:39', '2025-08-21 09:30:51');
INSERT INTO `sub_process_cycle` VALUES (3, 1, 1, '生产组', 1, '2025-08-21 09:30:45', '2025-08-21 09:30:45');

-- ----------------------------
-- Table structure for sub_product_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_product_code`;
CREATE TABLE `sub_product_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(5) NULL DEFAULT NULL COMMENT '发布的用户id',
  `product_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '产品的唯一标识编码',
  `product_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '产品的名称',
  `drawing` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '工程图号',
  `model` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品的型号',
  `specification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品的规格参数',
  `other_features` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '产品的其他特性描述',
  `component_structure` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '产品的部件结构说明',
  `unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品的计量单位',
  `unit_price` int(10) NULL DEFAULT NULL COMMENT '产品的单价',
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品价格的币别',
  `production_requirements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '产品的生产要求',
  `is_deleted` int(1) UNSIGNED ZEROFILL NULL DEFAULT 1 COMMENT '1：未删除；0：已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '产品编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_product_code
-- ----------------------------
INSERT INTO `sub_product_code` VALUES (9, 1, 1, '123', '113', '图只可以', '21', '2131', '3131', '1313', '212', 1212, '121', '21', 1, '2025-07-08 15:02:27', '2025-07-14 10:04:36');
INSERT INTO `sub_product_code` VALUES (10, 1, 1, '1233', '212', '月1', '121', '2121', '2121', '21', '212', 121, '21', '2121', 1, '2025-07-08 15:12:29', '2025-07-14 10:04:29');
INSERT INTO `sub_product_code` VALUES (11, 1, 1, '1234', '12', '121', '212', '21', '212', '211', '1212', 2212, '1212', '121', 1, '2025-07-15 11:04:40', '2025-07-15 11:12:37');
INSERT INTO `sub_product_code` VALUES (12, 1, 1, '12321', '21221', '2121', 'wdd', 'dwwdq', 'dwqwdw', 'qdwq', 'qw', 212, '211', '2121', 1, '2025-08-08 11:19:00', '2025-08-08 11:19:00');
INSERT INTO `sub_product_code` VALUES (13, 1, 1, '12322', '21222', '2121', 'wdd', 'dwwdq', 'dwqwdw', 'qdwq', 'qw', 212, '211', '2121', 1, '2025-08-08 11:23:21', '2025-08-08 14:44:31');
INSERT INTO `sub_product_code` VALUES (14, 1, 1, '12323', '21223', '2121', 'wdd', 'dwwdq', 'dwqwdw', 'qdwq', 'qw', 212, '211', '2121', 1, '2025-08-08 11:28:28', '2025-08-08 11:28:28');
INSERT INTO `sub_product_code` VALUES (15, 1, 1, '12324', '21224', '2121', 'wdd', 'dwwdq', 'dwqwdw', 'qdwq', 'qw', 212, '211', '2121', 1, '2025-08-08 11:34:57', '2025-08-08 11:34:57');
INSERT INTO `sub_product_code` VALUES (16, 1, 1, '12325', '21225', '2121', 'wdd', 'dwwdq', 'dwqwdw', 'qdwq', 'qw', 212, '211', '2121', 1, '2025-08-08 11:35:22', '2025-08-08 14:09:03');
INSERT INTO `sub_product_code` VALUES (17, 1, 1, '12671', '4841', 'eewqw', 'ewe', 'rwrw', 'rww', 'qeqeq', 'eqwew', 323, '21', '31', 1, '2025-08-08 11:36:50', '2025-08-08 11:36:50');
INSERT INTO `sub_product_code` VALUES (18, 1, 1, '43456', '2345', '23', '423', '42', 'ewf', '5', '3553', 21, '313', '12', 0, '2025-08-08 14:10:41', '2025-08-08 14:58:55');
INSERT INTO `sub_product_code` VALUES (19, 1, 1, 'A001', '圆珠笔', 'qqqwe', 'eeqqwq', 'sewww', 'ersdsd', 'ewww', 'ff', 22, '3rr', 'rww', 1, '2025-08-10 10:09:09', '2025-08-21 15:44:55');

-- ----------------------------
-- Table structure for sub_product_notice
-- ----------------------------
DROP TABLE IF EXISTS `sub_product_notice`;
CREATE TABLE `sub_product_notice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `notice` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '生产订单号',
  `customer_id` int(11) NULL DEFAULT NULL COMMENT '客户id',
  `product_id` int(11) NULL DEFAULT NULL COMMENT '产品id',
  `sale_id` int(11) NULL DEFAULT NULL COMMENT '销售id',
  `delivery_time` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交货日期',
  `is_notice` int(1) NULL DEFAULT 1 COMMENT '是否已排产：1 - 未排产，0 - 已排产',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '生产通知单信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_product_notice
-- ----------------------------
INSERT INTO `sub_product_notice` VALUES (5, 1, 1, '1111', 2, 9, 2, '2025-07-30T16:00:00.000Z', NULL, 1, '2025-07-25 22:56:01', '2025-07-25 22:56:01');
INSERT INTO `sub_product_notice` VALUES (6, 1, 1, '2222', 3, 10, 1, '2025-07-28 00:00:00', 1, 1, '2025-07-25 22:56:09', '2025-08-27 11:48:55');
INSERT INTO `sub_product_notice` VALUES (7, 1, 1, '11111', 2, 19, 2, '2025-08-11 00:00:00', 0, 1, '2025-08-03 19:54:20', '2025-08-27 11:40:33');

-- ----------------------------
-- Table structure for sub_product_quotation
-- ----------------------------
DROP TABLE IF EXISTS `sub_product_quotation`;
CREATE TABLE `sub_product_quotation`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `sale_id` int(11) NOT NULL COMMENT '销售订单id',
  `customer_id` int(11) NULL DEFAULT NULL COMMENT '客户id',
  `product_id` int(11) NULL DEFAULT NULL COMMENT '产品id',
  `notice` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '报价单号',
  `product_price` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '产品单价',
  `transaction_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交易币别',
  `other_transaction_terms` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '交易条件',
  `is_deleted` tinyint(3) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '产品报价表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_product_quotation
-- ----------------------------
INSERT INTO `sub_product_quotation` VALUES (11, 1, 1, 2, 2, 9, '111', '111', '111', '111', 1, '2025-07-25 22:44:22', '2025-07-25 22:44:22');
INSERT INTO `sub_product_quotation` VALUES (12, 1, 1, 1, 3, 10, '222', '222', '222', '222', 1, '2025-07-25 22:44:29', '2025-07-25 22:44:29');

-- ----------------------------
-- Table structure for sub_production_progress
-- ----------------------------
DROP TABLE IF EXISTS `sub_production_progress`;
CREATE TABLE `sub_production_progress`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `notice_id` int(11) NOT NULL COMMENT '生产通知单id',
  `customer_id` int(11) NOT NULL COMMENT '客户id',
  `product_id` int(11) NOT NULL COMMENT '产品id',
  `part_id` int(11) NULL DEFAULT NULL COMMENT '部件id',
  `bom_id` int(11) NULL DEFAULT NULL COMMENT 'bom表的id',
  `order_number` int(20) NULL DEFAULT NULL COMMENT '委外/库存数量',
  `out_number` int(20) NULL DEFAULT NULL COMMENT '生产数量',
  `start_date` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '预计起始生产时间',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '生产特别要求',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '生产进度表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_production_progress
-- ----------------------------
INSERT INTO `sub_production_progress` VALUES (4, 1, 1, 7, 2, 19, 5, 37, 2121, NULL, NULL, NULL, 1, '2025-08-27 11:40:33', '2025-08-27 11:40:33');
INSERT INTO `sub_production_progress` VALUES (5, 1, 1, 7, 2, 19, 6, 36, 2121, NULL, NULL, NULL, 1, '2025-08-27 11:40:33', '2025-08-27 11:40:33');
INSERT INTO `sub_production_progress` VALUES (6, 1, 1, 7, 2, 19, 6, 35, 2121, NULL, NULL, NULL, 1, '2025-08-27 11:40:33', '2025-08-27 11:40:33');

-- ----------------------------
-- Table structure for sub_sales_order
-- ----------------------------
DROP TABLE IF EXISTS `sub_sales_order`;
CREATE TABLE `sub_sales_order`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `rece_time` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '接单日期',
  `customer_id` int(11) NOT NULL COMMENT '客户id',
  `customer_order` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '客户订单号',
  `product_id` int(11) NOT NULL COMMENT '产品编码id',
  `product_req` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '产品要求',
  `order_number` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '订单数量',
  `actual_number` int(11) NULL DEFAULT NULL COMMENT '实际数量，给采购单使用的',
  `unit` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '单位',
  `delivery_time` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交货日期',
  `goods_time` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '送货日期',
  `goods_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '送货地点',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '销售订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_sales_order
-- ----------------------------
INSERT INTO `sub_sales_order` VALUES (1, 1, 1, '2025-07-07 00:00:00', 3, '31232131', 10, '我的要求', '311', 313, '车1', '2025-07-07 00:00:00', '2025-07-27 00:00:00', '2123121', 1, '2025-07-14 13:55:51', '2025-08-21 10:22:35');
INSERT INTO `sub_sales_order` VALUES (2, 1, 1, '2025-07-10 00:00:00', 2, '3333312', 19, '21', '2121', 2121, '2121', '2025-07-14 00:00:00', '2025-07-14 18:47:29', '3131', 1, '2025-07-14 18:47:31', '2025-08-27 10:05:48');

-- ----------------------------
-- Table structure for sub_supplier_info
-- ----------------------------
DROP TABLE IF EXISTS `sub_supplier_info`;
CREATE TABLE `sub_supplier_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `company_id` int(11) NOT NULL COMMENT '所属企业id',
  `supplier_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '供应商编码',
  `supplier_abbreviation` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '供应商简称',
  `contact_person` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系人',
  `contact_information` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `supplier_full_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '供应商全名',
  `supplier_address` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '供应商地址',
  `supplier_category` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '供应商类别',
  `supply_method` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '供货方式',
  `transaction_method` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交易方式',
  `transaction_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交易币别',
  `other_transaction_terms` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '其它交易条件',
  `is_deleted` tinyint(3) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '供应商信息信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_supplier_info
-- ----------------------------
INSERT INTO `sub_supplier_info` VALUES (1, 1, 1, '123', '2121', '13', '15', '1515', '212', '5151', '15', '15151', '1515', '15', 1, '2025-07-10 00:03:15', '2025-07-10 00:03:15');
INSERT INTO `sub_supplier_info` VALUES (2, 1, 1, '1234', '151', '153333333', '1', '515', '155', '511', '515', '15', '1', '515', 1, '2025-07-10 00:03:27', '2025-07-10 00:03:37');

-- ----------------------------
-- Table structure for sub_warehouse_cycle
-- ----------------------------
DROP TABLE IF EXISTS `sub_warehouse_cycle`;
CREATE TABLE `sub_warehouse_cycle`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id，关联企业信息表',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id，关联用户表',
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '生产制程名称',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '生产制程表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sub_warehouse_cycle
-- ----------------------------
INSERT INTO `sub_warehouse_cycle` VALUES (4, 1, 1, '成品仓', 1, '2025-08-23 09:35:08', '2025-08-23 09:35:08');
INSERT INTO `sub_warehouse_cycle` VALUES (5, 1, 1, '半成品仓', 1, '2025-08-23 09:35:27', '2025-08-23 09:35:27');
INSERT INTO `sub_warehouse_cycle` VALUES (6, 1, 1, '材料仓', 1, '2025-08-23 09:35:34', '2025-08-23 09:35:34');

SET FOREIGN_KEY_CHECKS = 1;
