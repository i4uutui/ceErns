import Mhead from '@/components/main/mhead';
import LeftMenu from '@/components/main/leftMenu';
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router'
import { ElContainer, ElHeader, ElMain, ElScrollbar } from "element-plus"
import "@/assets/css/layout.css"
import "element-plus/theme-chalk/el-container.css"
import "element-plus/theme-chalk/el-scrollbar.css"
import "element-plus/theme-chalk/el-header.css"
import "element-plus/theme-chalk/el-main.css"

export default defineComponent({
  setup(){
    return() => (
      <ElContainer class="container">
        <div class='leftMenu'>
          <div class='logo'>LOGO</div>
          <ElScrollbar class='headerScroll'>
            <LeftMenu></LeftMenu>
          </ElScrollbar>
        </div>
        
        <ElContainer class='rightMain'>
          <ElHeader height='64px'>
            <Mhead />
          </ElHeader>
          <ElMain><RouterView /></ElMain>
        </ElContainer>
      </ElContainer>
    )
  }
})