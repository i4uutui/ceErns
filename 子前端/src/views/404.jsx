import { defineComponent } from "vue";
import "@/assets/css/404.css"
import image404 from '@/assets/images/404.png'

export default defineComponent({
  setup(){
    return() => (
      <div class="tcy_404 error_container">
        <img src={ image404 } />
        <h2>抱歉，您访问的页面出错了</h2>
        <p>您可能输错了网址，或该网页已删除或不存在</p>
        <a href="/" class="btn btn-primary btn_blue">返回主页</a>
      </div>
    )
  }
})