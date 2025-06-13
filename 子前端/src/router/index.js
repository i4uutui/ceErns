import { createRouter, createWebHistory } from 'vue-router';
import route from './routes'

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

export default router;  