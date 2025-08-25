import { defineComponent, ref } from 'vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

export default defineComponent({
  name: 'App',
  setup() {
    const locale = ref(zhCn);
    
    return () => (
      <ElConfigProvider locale={ locale.value }>
        <router-view></router-view>
      </ElConfigProvider>
    );
  }
});  