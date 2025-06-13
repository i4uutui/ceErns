import { defineComponent, ref, onMounted } from 'vue';
import { ElAside, ElMenu, ElMenuItem, ElSubMenu, ElIcon } from 'element-plus';
import router from '@/router';
import { Location, Edit } from '@element-plus/icons-vue'
import "./main.css"

export default defineComponent({
  setup(){
    const menuRoutes = ref([]);
    const permissions = ref(['UserManagement', 'ProductCode']); // 假设从后端获取的权限列表

    onMounted(() => {
      const { children } = router.options.routes.find(route => route.name === 'Layout');
      const groupedRoutes = {};
      children.forEach(route => {
        const { parent } = route.meta;
        if (!groupedRoutes[parent]) {
          groupedRoutes[parent] = [];
        }
        if (permissions.value.includes(route.name)) {
          groupedRoutes[parent].push(route);
        }
      });
      menuRoutes.value = Object.entries(groupedRoutes).map(([key, value]) => ({
        title: key,
        children: value
      }));
      console.log(menuRoutes.value);
    });
    
    return() => (
      <>
        <ElAside style={{ width: "200px", backgroundColor: '#eee' }}>
          <ElMenu default-active="2" class="el-menu-vertical-demo" >
            {menuRoutes.value.map(({ title, children }) => (
              <ElSubMenu key={title} index={title} title={title}>
                {{
                  title: () => title,
                  default: () => children.map(route => (
                    <ElMenuItem key={route.name} index={route.name}>
                      {route.meta.title}
                    </ElMenuItem>
                  ))
                }}
              </ElSubMenu>
            ))}
          </ElMenu>
        </ElAside>
      </>
    )
  }
})
