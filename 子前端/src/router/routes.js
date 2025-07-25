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
          parent: '首页'
        }
      },
      // 系统管理
      {
        path: '/system/user',
        name: 'UserManagement',
        component: () => import('@/views/System/UserManagement.jsx'),
        meta: {
          title: '用户管理',
          parent: '系统管理'
        }
      },
      // 基础资料
      {
        path: '/basic/product-code',
        name: 'ProductCode',
        component: () => import('@/views/Basic/ProductCode.jsx'),
        meta: {
          title: '产品编码',
          parent: '基础资料'
        }
      },
      {
        path: '/basic/part-code',
        name: 'PartCode',
        component: () => import('@/views/Basic/PartCode.jsx'),
        meta: {
          title: '部位编码',
          parent: '基础资料'
        }
      },
      {
        path: '/basic/material-code',
        name: 'MaterialCode',
        component: () => import('@/views/Basic/MaterialCode.jsx'),
        meta: {
          title: '原材料编码',
          parent: '基础资料'
        }
      },
      {
        path: '/basic/process-code',
        name: 'ProcessCode',
        component: () => import('@/views/Basic/ProcessCode.jsx'),
        meta: {
          title: '工艺编码',
          parent: '基础资料'
        }
      },
      {
        path: '/basic/equipment-code',
        name: 'EquipmentCode',
        component: () => import('@/views/Basic/EquipmentCode.jsx'),
        meta: {
          title: '设备编码',
          parent: '基础资料'
        }
      },
      {
        path: '/basic/employee-info',
        name: 'EmployeeInfo',
        component: () => import('@/views/Basic/EmployeeInfo.jsx'),
        meta: {
          title: '员工信息',
          parent: '基础资料'
        }
      },
      // 订单管理
      {
        path: '/order/customer-info',
        name: 'CustomerInfo',
        component: () => import('@/views/Order/CustomerInfo.jsx'),
        meta: {
          title: '客户资料',
          parent: '订单管理'
        }
      },
      {
        path: '/order/sales-order',
        name: 'SalesOrder',
        component: () => import('@/views/Order/SalesOrder.jsx'),
        meta: {
          title: '销售订单',
          parent: '订单管理'
        }
      },
      {
        path: '/order/product-quote',
        name: 'ProductQuote',
        component: () => import('@/views/Order/ProductQuote.jsx'),
        meta: {
          title: '产品报价',
          parent: '订单管理'
        }
      },
      {
        path: '/order/product-notice',
        name: 'ProductNotice',
        component: () => import('@/views/Order/ProductNotice.jsx'),
        meta: {
          title: '产品通知单',
          parent: '订单管理'
        }
      },
      {
        path: '/order/product-delivery',
        name: 'ProductDelivery',
        component: () => import('@/views/Order/ProductDelivery.jsx'),
        meta: {
          title: '产品出货单',
          parent: '订单管理'
        }
      },
      // 产品信息
      // {
      //   path: '/product/product-bom',
      //   name: 'ProductBOM',
      //   component: () => import('@/views/Product/ProductBOM.vue'),
      //   meta: {
      //     title: '产品BOM',
      //     parent: '产品信息'
      //   }
      // },
      {
        path: '/product/material-bom',
        name: 'MaterialBOM',
        component: () => import('@/views/Product/MaterialBOM.jsx'),
        meta: {
          title: '材料BOM',
          parent: '产品信息'
        }
      },
      {
        path: '/product/process-bom',
        name: 'ProcessBOM',
        component: () => import('@/views/Product/ProcessBOM.jsx'),
        meta: {
          title: '工艺BOM',
          parent: '产品信息'
        }
      },
      // // 采购管理
      {
        path: '/purchase/supplier-info',
        name: 'SupplierInfo',
        component: () => import('@/views/Purchase/SupplierInfo.jsx'),
        meta: {
          title: '供应商资料',
          parent: '采购管理'
        }
      },
      {
        path: '/purchase/material-quote',
        name: 'MaterialQuote',
        component: () => import('@/views/Purchase/MaterialQuote.jsx'),
        meta: {
          title: '原材料报价',
          parent: '采购管理'
        }
      },
      {
        path: '/purchase/purchase-order',
        name: 'PurchaseOrder',
        component: () => import('@/views/Purchase/PurchaseOrder.jsx'),
        meta: {
          title: '采购单',
          parent: '采购管理'
        }
      },
      // // 委外管理
      // {
      //   path: '/outsourcing/outsourcing-quote',
      //   name: 'OutsourcingQuote',
      //   component: () => import('@/views/Outsourcing/OutsourcingQuote.vue'),
      //   meta: {
      //     title: '委外报价',
      //     parent: '委外管理'
      //   }
      // },
      // {
      //   path: '/outsourcing/outsourcing-order',
      //   name: 'OutsourcingOrder',
      //   component: () => import('@/views/Outsourcing/OutsourcingOrder.vue'),
      //   meta: {
      //     title: '委外加工单',
      //     parent: '委外管理'
      //   }
      // },
      // {
      //   path: '/outsourcing/outsourcing-material',
      //   name: 'OutsourcingMaterial',
      //   component: () => import('@/views/Outsourcing/OutsourcingMaterial.vue'),
      //   meta: {
      //     title: '委外发料',
      //     parent: '委外管理'
      //   }
      // },
      // // 生产管理
      // {
      //   path: '/production/production-progress',
      //   name: 'ProductionProgress',
      //   component: () => import('@/views/Production/ProductionProgress.vue'),
      //   meta: {
      //     title: '生产进度表',
      //     parent: '生产管理'
      //   }
      // },
      // {
      //   path: '/production/work-order',
      //   name: 'WorkOrder',
      //   component: () => import('@/views/Production/WorkOrder.vue'),
      //   meta: {
      //     title: '派工单',
      //     parent: '生产管理'
      //   }
      // },
      // {
      //   path: '/production/report-order',
      //   name: 'ReportOrder',
      //   component: () => import('@/views/Production/ReportOrder.vue'),
      //   meta: {
      //     title: '报工单',
      //     parent: '生产管理'
      //   }
      // },
      // {
      //   path: '/production/production-material',
      //   name: 'ProductionMaterial',
      //   component: () => import('@/views/Production/ProductionMaterial.vue'),
      //   meta: {
      //     title: '生产领料',
      //     parent: '生产管理'
      //   }
      // },
      // {
      //   path: '/production/employee-piece-rate',
      //   name: 'EmployeePieceRate',
      //   component: () => import('@/views/Production/EmployeePieceRate.vue'),
      //   meta: {
      //     title: '员工计件工资',
      //     parent: '生产管理'
      //   }
      // }
    ]
  }
];

export default routes;