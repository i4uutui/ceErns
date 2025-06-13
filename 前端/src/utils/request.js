import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';
import config from './config'

const service = axios.create({
  baseURL: config.api,
  timeout: 5000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 3 * 1000,
      });
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    const { status } = error.response || {};
    if (status === 401) {
      ElMessage.error('登录状态已过期，请重新登录');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    } else {
      ElMessage({
        message: error.message,
        type: 'error',
        duration: 3 * 1000,
      });
    }
    return Promise.reject(error);
  }
);

export default service;
    