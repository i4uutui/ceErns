import Mhead from '@/components/main/mhead';
import LeftMenu from '@/components/main/leftMenu';
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router'
import { ElContainer, ElHeader, ElMain, ElScrollbar, ElFooter } from "element-plus"
import "element-plus/theme-chalk/el-container.css"
import "element-plus/theme-chalk/el-scrollbar.css"
import "element-plus/theme-chalk/el-header.css"
import "element-plus/theme-chalk/el-main.css"

export default defineComponent({
  setup(){
    return() => (
      <ElContainer style={{ height: "100vh" }}>
        <ElHeader height='64px' style={{ borderBottom: "1px solid #eee" }}>
          <Mhead />
        </ElHeader>
        <ElContainer>
          <ElScrollbar class='headerScroll'>
            <LeftMenu></LeftMenu>
          </ElScrollbar>
          <ElMain><RouterView /></ElMain>
        </ElContainer>
        <ElFooter height='40px'>Footer</ElFooter>
      </ElContainer>
    )
  }
})