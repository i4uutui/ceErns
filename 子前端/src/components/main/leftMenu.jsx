import { defineComponent, ref } from 'vue';
import { ElAside, ElMenu, ElMenuItem, ElSubMenu, ElIcon } from 'element-plus';
import { Location, Edit } from '@element-plus/icons-vue'
import "./main.css"

export default defineComponent({
  setup(){

    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }
    
    return() => (
      <>
        <ElAside style={{ width: "200px", backgroundColor: '#eee' }}>
          <ElMenu default-active="2" class="el-menu-vertical-demo" onOpen={ handleOpen } onClose={ handleClose }>
            <ElSubMenu index="1">
              {{
                title: () => (
                  <>
                    <ElIcon><Location /></ElIcon>
                    <span>系统管理</span>
                  </>
                ),
                default: () => (
                  <>
                    <ElMenuItem index="1-1">用户管理</ElMenuItem>
                  </>
                )
              }}
            </ElSubMenu>
            <ElMenuItem index="1-2">
              {/* <ElIcon><IconComponent /></ElIcon> */}
              22222
            </ElMenuItem>
          </ElMenu>
        </ElAside>
      </>
    )
  }
})
