import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 总后台路由
  {
    path: '/',
    name: 'AdminLogin',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin/user',
    name: 'AdminUserList',
    component: () => import('../views/UserList.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;  