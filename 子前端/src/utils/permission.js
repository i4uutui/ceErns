import { hasPermission } from './tool.js';

export default {
  install(app) {
    // 注册v-permission指令
    app.directive('permission', {
      mounted(el, binding) {
        const { value } = binding;
        // 若权限不匹配，移除元素
        if (value && !hasPermission(value)) {
          el.parentNode?.removeChild(el);
        }
      }
    });
  }
};