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

 Date: 12/07/2025 16:30:05
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
INSERT INTO `ad_user` VALUES (1, 1, 'admin1', '$2b$10$qJOWecY5nOd6ICarLgePce3XPyVtXXrp1dkbB9ZQvtydVrKLz8uGG', NULL, NULL, 1, 0, 1, 1, '2025-07-07 13:56:55', '2025-07-08 14:33:26');
INSERT INTO `ad_user` VALUES (2, 2, 'admin99', '$2b$10$Ukc2Byd6TFsl0u2p68J0leC7tVgwp4LDWr7s6YV0EWpc6xR3dZyMm', NULL, NULL, 1, 0, 1, 1, '2025-07-07 14:00:05', '2025-07-08 14:21:48');
INSERT INTO `ad_user` VALUES (3, 1, '2121', '$2b$10$EpPaXdgc4ugWWT1Qi.DFSeRoz9XyBa3N7mKkNGuXEBvmy.pe8HEWq', NULL, NULL, 1, 0, 1, 1, '2025-07-08 10:35:09', '2025-07-08 14:21:49');
INSERT INTO `ad_user` VALUES (4, 1, '121', '$2b$10$4ZYMcp6ZeDQauRLCZCb1mOBIUy9ML4gbRTZDizJU3VaOt83D8ZJnu', '2132', '[[\"基础资料\",\"ProductCode\"],[\"基础资料\",\"PartCode\"],[\"基础资料\",\"MaterialCode\"],[\"基础资料\",\"ProcessCode\"],[\"基础资料\",\"EquipmentCode\"],[\"基础资料\",\"EmployeeInfo\"],[\"订单管理\",\"CustomerInfo\"],[\"订单管理\",\"ProductQuote\"],[\"订单管理\",\"SalesOrder\"],[\"订单管理\",\"ProductDelivery\"]]', 2, 1, 1, 1, '2025-07-08 14:10:45', '2025-07-08 14:40:30');
INSERT INTO `ad_user` VALUES (5, 1, 'admin2', '$2b$10$0HdrlA/lzF2sEhesH/MXEOorOAC9uHMr0ggKxgHdFQa6vQiL9bNWG', '哈哈', '[[\"基础资料\",\"ProductCode\"],[\"基础资料\",\"PartCode\"],[\"基础资料\",\"MaterialCode\"],[\"基础资料\",\"ProcessCode\"],[\"基础资料\",\"EquipmentCode\"],[\"基础资料\",\"EmployeeInfo\"]]', 2, 1, 1, 1, '2025-07-08 14:20:13', '2025-07-08 14:40:30');

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
INSERT INTO `sub_employee_info` VALUES (1, 1, 1, '1', '1', '1', '1', '1', '1', 1, '2025-07-08 16:39:58', '2025-07-08 16:39:58');
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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '设备信息基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_equipment_code
-- ----------------------------
INSERT INTO `sub_equipment_code` VALUES (3, 1, 1, '123', '2121', 12, '121', '121', '211', '21', '212', 1, '2025-07-08 16:06:29', '2025-07-08 16:08:21');

-- ----------------------------
-- Table structure for sub_material_bom
-- ----------------------------
DROP TABLE IF EXISTS `sub_material_bom`;
CREATE TABLE `sub_material_bom`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `part_id` int(11) NOT NULL COMMENT '部件编码id',
  `material_id` int(11) NOT NULL COMMENT '材料编码id',
  `number` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '序号',
  `model_spec` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '型号&规格',
  `other_features` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '其它特性',
  `send_receiving_units` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '收发单位',
  `purchasing_unit` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '采购单位',
  `quantity_used` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '使用数量',
  `loss_rate` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '损耗率',
  `purchase_quantity` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '采购数量',
  `is_deleted` tinyint(1) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '材料BOM表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sub_material_bom
-- ----------------------------
INSERT INTO `sub_material_bom` VALUES (1, 1, 1, 6, 2, '1221', '21', '112112211', '3131', '2121', '21', '121', '212', 1, '2025-07-12 13:56:42', '2025-07-12 14:04:49');

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
  `unit_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '单价',
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
INSERT INTO `sub_material_code` VALUES (2, 1, 1, '123', '121', '2121', '21', '2121', '21', '21', 122.00, '12', '21', 1, '2025-07-08 15:36:33', '2025-07-08 15:37:12');

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
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '部件编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_part_code
-- ----------------------------
INSERT INTO `sub_part_code` VALUES (5, 1, 1, '123', '2121', '212', '1212', '121', '3131', 31.00, '311', '3131', '3131', 1, '2025-07-08 15:35:24', '2025-07-08 15:35:24');
INSERT INTO `sub_part_code` VALUES (6, 1, 1, '21', '31', '12', '1212', '1', '3131', 12.00, '21', '2121', '2121', 1, '2025-07-08 15:36:15', '2025-07-08 15:36:15');

-- ----------------------------
-- Table structure for sub_process_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_process_code`;
CREATE TABLE `sub_process_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `user_id` int(5) NULL DEFAULT NULL COMMENT '用户id',
  `company_id` int(5) NULL DEFAULT NULL COMMENT '企业id',
  `process_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '工艺编码',
  `process_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '工艺名称',
  `equipment_used` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '使用设备',
  `piece_working_hours` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '单件工时(小时)',
  `processing_unit_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '加工单价',
  `section_points` int(11) NULL DEFAULT NULL COMMENT '段数点数',
  `total_processing_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '加工总价',
  `remarks` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `is_deleted` int(1) UNSIGNED ZEROFILL NULL DEFAULT 1 COMMENT '1：未删除；0：已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '工艺编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_process_code
-- ----------------------------
INSERT INTO `sub_process_code` VALUES (3, 1, 1, '123', '212', '121', '21', 2121.00, 21, 21.00, '212', 1, '2025-07-08 15:56:54', '2025-07-08 16:00:17');

-- ----------------------------
-- Table structure for sub_product_quotation
-- ----------------------------
DROP TABLE IF EXISTS `sub_product_quotation`;
CREATE TABLE `sub_product_quotation`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(11) NOT NULL COMMENT '发布的用户id',
  `customer_id` int(11) NOT NULL COMMENT '客户id',
  `product_id` int(11) NOT NULL COMMENT '产品编码id',
  `model` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '型号',
  `spec` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '规格',
  `order_char` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '其他特性',
  `customer_order` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '客户订单',
  `order_number` int(20) NULL DEFAULT NULL COMMENT '订单数量',
  `product_unit` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '产品单位',
  `product_price` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '产品单价',
  `transaction_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '交易币别',
  `other_transaction_terms` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '交易条件',
  `is_deleted` tinyint(3) NULL DEFAULT 1 COMMENT '是否删除：1-未删除，0-已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_quotation_product`(`product_id`) USING BTREE,
  INDEX `fc_quotation_product`(`customer_id`) USING BTREE,
  CONSTRAINT `fc_quotation_product` FOREIGN KEY (`customer_id`) REFERENCES `sub_customer_info` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_quotation_product` FOREIGN KEY (`product_id`) REFERENCES `sub_products_code` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '产品报价表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_product_quotation
-- ----------------------------
INSERT INTO `sub_product_quotation` VALUES (1, 1, 1, 1, 10, '1112', '121', '21', '2121', 121, '2121', '121', '1', '21', 1, '2025-07-09 01:04:37', '2025-07-12 14:02:00');
INSERT INTO `sub_product_quotation` VALUES (2, 1, 1, 2, 9, '12', '1222211', '12', '12', 1, '2', '12', '12', '12', 1, '2025-07-09 11:45:02', '2025-07-09 18:46:59');

-- ----------------------------
-- Table structure for sub_products_code
-- ----------------------------
DROP TABLE IF EXISTS `sub_products_code`;
CREATE TABLE `sub_products_code`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `company_id` int(11) NOT NULL COMMENT '企业id',
  `user_id` int(5) NULL DEFAULT NULL COMMENT '发布的用户id',
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
  `is_deleted` int(1) UNSIGNED ZEROFILL NULL DEFAULT 1 COMMENT '1：未删除；0：已删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '产品编码基础信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_products_code
-- ----------------------------
INSERT INTO `sub_products_code` VALUES (9, 1, 1, '123', '113', '21', '2131', '3131', '1313', '212', 1212.00, '121', '21', 1, '2025-07-08 15:02:27', '2025-07-08 15:09:53');
INSERT INTO `sub_products_code` VALUES (10, 1, 1, '1233', '212', '121', '2121', '2121', '21', '212', 121.00, '21', '2121', 1, '2025-07-08 15:12:29', '2025-07-08 15:12:29');

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

SET FOREIGN_KEY_CHECKS = 1;
