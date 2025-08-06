const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/layout.jsx'),
    redirect: '/home',
    children: [
      //首页
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/home.jsx'),
        meta: {
          title: '首页',
          parent: '首页',
          menu: true
        }
      },
      // 系统管理
      {
        path: '/system/user',
        name: 'UserManagement',
        component: () => import('@/views/System/UserManagement.jsx'),
        meta: {
          title: '用户管理',
          parent: '系统管理',
          menu: true
        }
      },
      {
        path: '/system/organize',
        name: 'OrganizeManagement',
        component: () => import('@/views/System/OrganizeManagement.jsx'),
        meta: {
          title: '组织架构',
          parent: '系统管理',
          menu: true
        }
      },
      // 基础资料
      {
        path: '/basic/product-code',
        name: 'ProductCode',
        component: () => import('@/views/Basic/ProductCode.jsx'),
        meta: {
          title: '产品编码',
          parent: '基础资料',
          menu: true
        }
      },
      {
        path: '/basic/part-code',
        name: 'PartCode',
        component: () => import('@/views/Basic/PartCode.jsx'),
        meta: {
          title: '部位编码',
          parent: '基础资料',
          menu: true
        }
      },
      {
        path: '/basic/material-code',
        name: 'MaterialCode',
        component: () => import('@/views/Basic/MaterialCode.jsx'),
        meta: {
          title: '原材料编码',
          parent: '基础资料',
          menu: true
        }
      },
      {
        path: '/basic/process-code',
        name: 'ProcessCode',
        component: () => import('@/views/Basic/ProcessCode.jsx'),
        meta: {
          title: '工艺编码',
          parent: '基础资料',
          menu: true
        }
      },
      {
        path: '/basic/equipment-code',
        name: 'EquipmentCode',
        component: () => import('@/views/Basic/EquipmentCode.jsx'),
        meta: {
          title: '设备编码',
          parent: '基础资料',
          menu: true
        }
      },
      {
        path: '/basic/employee-info',
        name: 'EmployeeInfo',
        component: () => import('@/views/Basic/EmployeeInfo.jsx'),
        meta: {
          title: '员工信息',
          parent: '基础资料',
          menu: true
        }
      },
      // 订单管理
      {
        path: '/order/customer-info',
        name: 'CustomerInfo',
        component: () => import('@/views/Order/CustomerInfo.jsx'),
        meta: {
          title: '客户资料',
          parent: '订单管理',
          menu: true
        }
      },
      {
        path: '/order/sales-order',
        name: 'SalesOrder',
        component: () => import('@/views/Order/SalesOrder.jsx'),
        meta: {
          title: '销售订单',
          parent: '订单管理',
          menu: true
        }
      },
      {
        path: '/order/product-quote',
        name: 'ProductQuote',
        component: () => import('@/views/Order/ProductQuote.jsx'),
        meta: {
          title: '产品报价',
          parent: '订单管理',
          menu: true
        }
      },
      {
        path: '/order/product-notice',
        name: 'ProductNotice',
        component: () => import('@/views/Order/ProductNotice.jsx'),
        meta: {
          title: '生产通知单',
          parent: '订单管理',
          menu: true
        }
      },
      {
        path: '/order/product-delivery',
        name: 'ProductDelivery',
        component: () => import('@/views/Order/ProductDelivery.jsx'),
        meta: {
          title: '产品出货单',
          parent: '订单管理',
          menu: true
        }
      },
      // 产品信息
      // {
      //   path: '/product/product-bom',
      //   name: 'ProductBOM',
      //   component: () => import('@/views/Product/ProductBOM.vue'),
      //   meta: {
      //     title: '产品BOM',
      //     parent: '产品信息',
      //     menu: true
      //   }
      // },
      {
        path: '/product/material-bom',
        name: 'MaterialBOM',
        component: () => import('@/views/Product/MaterialBOM.jsx'),
        meta: {
          title: '材料BOM',
          parent: '产品信息',
          menu: true
        }
      },
      {
        path: '/product/material-bom-archive',
        name: 'MaterialBOMArchive',
        component: () => import('@/views/Product/MaterialBOMArchive.jsx'),
        meta: {
          title: '材料BOM存档库',
          parent: '产品信息',
          menu: false
        }
      },
      {
        path: '/product/process-bom',
        name: 'ProcessBOM',
        component: () => import('@/views/Product/ProcessBOM.jsx'),
        meta: {
          title: '工艺BOM',
          parent: '产品信息',
          menu: true
        }
      },
      {
        path: '/product/process-bom-archive',
        name: 'ProcessBOMArchive',
        component: () => import('@/views/Product/ProcessBOMArchive.jsx'),
        meta: {
          title: '工艺BOM存档库',
          parent: '产品信息',
          menu: false
        }
      },
      // // 采购管理
      {
        path: '/purchase/supplier-info',
        name: 'SupplierInfo',
        component: () => import('@/views/Purchase/SupplierInfo.jsx'),
        meta: {
          title: '供应商资料',
          parent: '采购管理',
          menu: true
        }
      },
      {
        path: '/purchase/material-quote',
        name: 'MaterialQuote',
        component: () => import('@/views/Purchase/MaterialQuote.jsx'),
        meta: {
          title: '原材料报价',
          parent: '采购管理',
          menu: true
        }
      },
      {
        path: '/purchase/purchase-order',
        name: 'PurchaseOrder',
        component: () => import('@/views/Purchase/PurchaseOrder.jsx'),
        meta: {
          title: '采购单',
          parent: '采购管理',
          menu: true
        }
      },
      // // 委外管理
      {
        path: '/outsourcing/outsourcing-quote',
        name: 'OutsourcingQuote',
        component: () => import('@/views/Outsourcing/OutsourcingQuote.jsx'),
        meta: {
          title: '委外报价',
          parent: '委外管理',
          menu: true
        }
      },
      {
        path: '/outsourcing/outsourcing-order',
        name: 'OutsourcingOrder',
        component: () => import('@/views/Outsourcing/OutsourcingOrder.jsx'),
        meta: {
          title: '委外加工单',
          parent: '委外管理',
          menu: true
        }
      },
      {
        path: '/outsourcing/outsourcing-material',
        name: 'OutsourcingMaterial',
        component: () => import('@/views/Outsourcing/OutsourcingMaterial.jsx'),
        meta: {
          title: '委外发料',
          parent: '委外管理',
          menu: true
        }
      },
      // 生产管理
      {
        path: '/production/production-progress',
        name: 'ProductionProgress',
        component: () => import('@/views/Production/ProductionProgress.jsx'),
        meta: {
          title: '生产进度表',
          parent: '生产管理',
          menu: true
        }
      },
      {
        path: '/production/work-order',
        name: 'WorkOrder',
        component: () => import('@/views/Production/WorkOrder.jsx'),
        meta: {
          title: '派工单',
          parent: '生产管理',
          menu: true
        }
      },
      // {
      //   path: '/production/report-order',
      //   name: 'ReportOrder',
      //   component: () => import('@/views/Production/ReportOrder.vue'),
      //   meta: {
      //     title: '报工单',
      //     parent: '生产管理',
      //     menu: true
      //   }
      // },
      // {
      //   path: '/production/production-material',
      //   name: 'ProductionMaterial',
      //   component: () => import('@/views/Production/ProductionMaterial.vue'),
      //   meta: {
      //     title: '生产领料',
      //     parent: '生产管理',
      //     menu: true
      //   }
      // },
      // {
      //   path: '/production/employee-piece-rate',
      //   name: 'EmployeePieceRate',
      //   component: () => import('@/views/Production/EmployeePieceRate.vue'),
      //   meta: {
      //     title: '员工计件工资',
      //     parent: '生产管理',
      //     menu: true
      //   }
      // }
    ]
  }
];

export default routes;