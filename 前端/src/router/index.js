import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 总后台路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'AdminUserList',
    component: () => import('../views/UserListPage.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;  