import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 总后台路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/admin/userList',
    name: 'AdminUserList',
    component: () => import('../views/UserListPage.vue')
  },
  // 默认重定向
  {
    path: '/',
    redirect: '/admin/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;  