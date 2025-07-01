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

 Date: 01/07/2025 19:35:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sub_admins
-- ----------------------------
DROP TABLE IF EXISTS `sub_admins`;
CREATE TABLE `sub_admins`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `company` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公司名称',
  `avatar_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'logo',
  `attr` int(1) NULL DEFAULT NULL COMMENT '用户类型：1子后台管理员，2子后台子用户',
  `power` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '权限信息',
  `uid` int(10) NULL DEFAULT NULL COMMENT '有数据时是子用户，null时父用户',
  `status` int(1) NULL DEFAULT NULL COMMENT '用户状态：1开启，0关闭',
  `is_delete` int(1) UNSIGNED ZEROFILL NULL DEFAULT 0 COMMENT '0：未删除；1：已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_admins
-- ----------------------------
INSERT INTO `sub_admins` VALUES (34, 'admin1', '$2b$10$BGGtcKLhRyzjdI5RLG16Ze/eLzMylKAH1YY/mSSc6ofAM086R.IU2', 'admin333', '21212121', NULL, 1, NULL, NULL, 1, 0, '2025-07-01 11:22:36', '2025-07-01 11:22:36');
INSERT INTO `sub_admins` VALUES (37, 'admin22', '$2b$10$C6yDOk6bs0KzYb5EXUB9PuhVhg8wsaY33un4/rbfBaUdJGiSKSYH6', '2121', '21212121', NULL, 2, '[[\"基础资料\",\"ProductCode\"],[\"基础资料\",\"PartCode\"],[\"基础资料\",\"MaterialCode\"],[\"基础资料\",\"ProcessCode\"],[\"基础资料\",\"EquipmentCode\"],[\"基础资料\",\"EmployeeInfo\"],[\"订单管理\",\"CustomerInfo\"],[\"订单管理\",\"ProductQuote\"],[\"订单管理\",\"SalesOrder\"],[\"订单管理\",\"ProductDelivery\"],[\"首页\",\"Home\"]]', 34, 1, 0, '2025-07-01 13:10:10', '2025-07-01 13:10:10');
INSERT INTO `sub_admins` VALUES (38, 'admin23', '$2b$10$7JwdkpHsFPvXAEEofoui6urxdw/p7eFBCZCjHDMkammwrgaX8gxoC', '2121', '21212121', NULL, 2, '[[\"订单管理\",\"CustomerInfo\"],[\"订单管理\",\"ProductQuote\"],[\"订单管理\",\"SalesOrder\"],[\"订单管理\",\"ProductDelivery\"],[\"基础资料\",\"ProductCode\"],[\"基础资料\",\"PartCode\"],[\"基础资料\",\"MaterialCode\"],[\"基础资料\",\"ProcessCode\"],[\"基础资料\",\"EquipmentCode\"],[\"基础资料\",\"EmployeeInfo\"],[\"首页\",\"Home\"]]', 34, 1, 0, '2025-07-01 13:10:40', '2025-07-01 13:10:40');

-- ----------------------------
-- Table structure for sub_customer_info
-- ----------------------------
DROP TABLE IF EXISTS `sub_customer_info`;
CREATE TABLE `sub_customer_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '客户信息基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_customer_info
-- ----------------------------
INSERT INTO `sub_customer_info` VALUES (1, '客户编码111', '客户简称111', '联系人111', '13800138000', '东莞公司有限公司', '东莞市寮步镇', '东莞市茶山镇', '112233445566778899', '线上交易', '￥', '1221');

-- ----------------------------
-- Table structure for sub_employee_info
-- ----------------------------
DROP TABLE IF EXISTS `sub_employee_info`;
CREATE TABLE `sub_employee_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `employee_id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '员工工号',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `department` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '所属部门',
  `production_position` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '生产岗位',
  `salary_attribute` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '工资属性',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '员工信息基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_employee_info
-- ----------------------------
INSERT INTO `sub_employee_info` VALUES (1, 'K10', '当坐飞机', '客服', '朱伙', '工具', '火雨1');

-- ----------------------------
-- Table structure for sub_equipment_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_equipment_code`;
CREATE TABLE `sub_equipment_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `equipment_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '设备编码',
  `equipment_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '设备名称',
  `equipment_quantity` int(11) NULL DEFAULT 2 COMMENT '设备数量',
  `department` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '所属部门',
  `working_hours` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '工作时长(小时)',
  `equipment_efficiency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备效能',
  `equipment_status` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '设备状态',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '设备信息基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_equipment_code
-- ----------------------------
INSERT INTO `sub_equipment_code` VALUES (1, '设备1', '设备名1', 22, '开发', '2', '09fe8', 'idsie', '');
INSERT INTO `sub_equipment_code` VALUES (2, '设备2', '设备名1', 32, '211', '213', '212', '231', '21');

-- ----------------------------
-- Table structure for sub_material_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_material_code`;
CREATE TABLE `sub_material_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `material_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '材料编码',
  `material_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '材料名称',
  `model` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '型号',
  `specification` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '规格',
  `other_features` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '其它特性',
  `usage_unit` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '使用单位',
  `purchase_unit` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '采购单位',
  `unit_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '单价',
  `currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '币别',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '材料编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_material_code
-- ----------------------------
INSERT INTO `sub_material_code` VALUES (1, '材料1', '材料名1', '型号1', '规格1', '特性1', '公司单位', '采购单位', 12.00, '￥', '3321');

-- ----------------------------
-- Table structure for sub_part_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_part_code`;
CREATE TABLE `sub_part_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '部件编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_part_code
-- ----------------------------
INSERT INTO `sub_part_code` VALUES (1, '部件1', '部件1', '型号1', '规格1', '特性1', 'KG', 122.00, '￥', '电光石火', '');
INSERT INTO `sub_part_code` VALUES (2, '部件1', '部件1', '型号2', '规格2', '特性2', 'KG', 12.00, '￥', '咴', '吕21');

-- ----------------------------
-- Table structure for sub_process_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_process_code`;
CREATE TABLE `sub_process_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `process_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '工艺编码',
  `process_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '工艺名称',
  `equipment_used` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '使用设备',
  `piece_working_hours` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '单件工时(小时)',
  `processing_unit_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '加工单价',
  `section_points` int(11) NULL DEFAULT NULL COMMENT '段数点数',
  `total_processing_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '加工总价',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '工艺编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_process_code
-- ----------------------------
INSERT INTO `sub_process_code` VALUES (1, '工艺', '名称1', '设备1', '33', 12.00, 32, 121.00, '2');
INSERT INTO `sub_process_code` VALUES (2, '工艺', '工艺1', '设备1', '33', 12.00, 212, 2112.00, '');

-- ----------------------------
-- Table structure for sub_products_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_products_code`;
CREATE TABLE `sub_products_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `product_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '产品的唯一标识编码',
  `product_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '产品的名称',
  `model` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品的型号',
  `specification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品的规格参数',
  `other_features` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '产品的其他特性描述',
  `component_structure` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '产品的部件结构说明',
  `unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品的计量单位',
  `unit_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '产品的单价',
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '产品价格的币别',
  `production_requirements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '产品的生产要求',
  `user_id` int(5) NULL DEFAULT NULL COMMENT '用户id',
  `is_delete` int(1) UNSIGNED ZEROFILL NULL DEFAULT 0 COMMENT '0：未删除；1：已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '产品编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_products_code
-- ----------------------------
INSERT INTO `sub_products_code` VALUES (7, '1121', '212', '3131', '3131', '31', '2121', '3131', 12121.00, '2121', '3131', 34, 0, '2025-07-01 12:56:36', '2025-07-01 12:56:36');
INSERT INTO `sub_products_code` VALUES (8, '222', '23323', '332', '323', '232', '323', '323232', 3232.00, '323', '2323', 38, 0, '2025-07-01 13:57:44', '2025-07-01 13:57:44');

-- ----------------------------
-- Table structure for super_admin
-- ----------------------------
DROP TABLE IF EXISTS `super_admin`;
CREATE TABLE `super_admin`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'NULL：未删除，时间戳：已删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of super_admin
-- ----------------------------
INSERT INTO `super_admin` VALUES (2, 'admin', '$2b$10$yGvjogOw/BzNZQlD/prLr.R27q.NGvnVAYV8/3aw8w.GzmkNYKbOW', NULL);

SET FOREIGN_KEY_CHECKS = 1;
