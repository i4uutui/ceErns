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
        <ElHeader height='64px' style={{ borderBottom: "1px solid #eee", backgroundColor: '#FFF' }}>
          <Mhead />
        </ElHeader>
        <ElContainer>
          <ElScrollbar class='headerScroll'>
            <LeftMenu></LeftMenu>
          </ElScrollbar>
          <ElMain><RouterView /></ElMain>
        </ElContainer>
        <ElFooter height='40px' style="backgroundColor: #FFF">
          <div class="flex row-center" style={{ height: "40px" }}>
            <div class="flex-1 text-left">
            开发者 ┃ 东莞元方企业管理咨询有限公司 ┃ 徐庆华 18666885858
            </div>
            <div class="flex-1 text-center">
            使用企业 ┃ 东莞市骏宏达铝业科技有限公司
            </div>
            <div class="flex-1 text-right">
              使用者 ┃ ADMI001
            </div>
          </div>
        </ElFooter>
      </ElContainer>
    )
  }
})