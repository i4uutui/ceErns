import { defineComponent, computed, ref } from 'vue';
import { ElAside, ElMenu, ElMenuItem, ElSubMenu, ElIcon } from 'element-plus';
import * as Icons from '@element-plus/icons-vue'
import { useStore } from '@/stores';
import { useRoute } from 'vue-router';
import "./main.css"

export default defineComponent({
  setup(){
    const routerList = computed(() => {
      const store = useStore()
      return store.menuList
    })
    const route = ref(useRoute())
    
    return() => (
      <>
        <ElAside class='aside_body' style="width: 200px">
          <ElMenu defaultActive={ route.value.path } showTimeout={ 200 } router={ true } collapseTransition={ true } uniqueOpened={ true }>
            {
              routerList.value.map(item => {
                const { meta } = item;
                const IconComponent = Icons[meta.icon];
                return (
                  (item.children && item.children.length) ? 
                  <ElSubMenu index={ `/${item.path}` }>
                    {{
                      default: () => item.children.map(e => <ElMenuItem index={ `/${e.path}` }>{ e.meta.title }</ElMenuItem>),
                      title: () => (<><ElIcon><IconComponent /></ElIcon>{ item.meta.title }</>)
                    }}
                  </ElSubMenu> : 
                  <ElMenuItem index={ `/${item.path}` }>
                    <ElIcon><IconComponent /></ElIcon>
                    { item.meta.title }
                  </ElMenuItem>
                )
              })
            }
          </ElMenu>
        </ElAside>
      </>
    )
  }
})
