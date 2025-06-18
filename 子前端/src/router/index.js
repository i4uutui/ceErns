import { createRouter, createWebHistory } from 'vue-router';
import route from './routes'
import { getItem } from '@/assets/js/storage';

const routes = [
  ...route,
  {
    path: '/login',
    name: 'AdminLogin',
    component: () => import('../views/Login.jsx')
  },
  {
    path: "/404",
    name: '404',
    component: () => import("@/views/404")
  },
  {
    path: '/:pathMatch(.*)*', // vue2可以使用 * ，vue3使用/:pathMatch(.*)*或/:pathMatch(.*)或/:catchAll(.*)
    redirect: {
      name: "404"
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = getItem('token');
  console.log(to);
  if (!token && to.name !== 'AdminLogin') {
    // 如果没有 token 且访问的不是登录页面，跳转到登录页面
    next({ name: 'AdminLogin' });
  } else {
    // 否则继续访问
    next();
  }
});

export default router;  