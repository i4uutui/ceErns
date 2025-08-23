import { defineComponent, ref, onMounted } from 'vue';
import { getItem } from '@/assets/js/storage';
import { useRoute } from 'vue-router';
import router from '@/router';
import { Location, Edit } from '@element-plus/icons-vue'
import "./main.css"

export default defineComponent({
  setup(){
    const route = useRoute()
    const user = getItem('user')
    const menuRoutes = ref([]);
    const permissions = ref(user.power ? user.power : []); // 假设从后端获取的权限列表
    let menuDefaultActive = ref(route.path)

    onMounted(() => {
      const { children } = router.options.routes.find(route => route.name === 'Layout');
      const groupedRoutes = {};
      children.forEach(route => {
        const { parent } = route.meta;
        if (!groupedRoutes[parent]) {
          groupedRoutes[parent] = [];
        }
        if(permissions.value.length){
          if (permissions.value.includes(route.name)) {
            groupedRoutes[parent].push(route);
          }
        }else{
          groupedRoutes[parent].push(route);
        }
      });
      // 过滤掉没有子路由的父菜单组
      const filteredRoutes = Object.fromEntries(
        Object.entries(groupedRoutes).filter(([_, routes]) => routes.length > 0)
      );
      menuRoutes.value = Object.entries(filteredRoutes).map(([key, value]) => {
        const menu = value.filter(row => row.meta.menu == true)
        return {
          title: key,
          children: menu
        }
      });
    });

    return() => (
      <>
        <ElAside style={{ width: "140px", backgroundColor: '#eee' }}>
          <ElMenu default-active="2" class="el-menu-vertical-demo" defaultActive={ menuDefaultActive.value } router unique-opened>
            {menuRoutes.value.map(({ title, children }) => {
              if(children.length != 1){
                return (
                  <ElSubMenu key={title} index={title} title={title}>
                    {{
                      title: () => title,
                      default: () => children.map(route => (
                        <ElMenuItem key={route.name} index={route.path}>
                          {route.meta.title}
                        </ElMenuItem>
                      ))
                    }}
                  </ElSubMenu>
                )
              }else{
                return (
                  <ElMenuItem key={children[0].path} index={children[0].path}>
                    {children[0].meta.title}
                  </ElMenuItem>
                )
              }
            })}
          </ElMenu>
        </ElAside>
      </>
    )
  }
})
