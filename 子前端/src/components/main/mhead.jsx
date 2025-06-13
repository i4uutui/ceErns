import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElRow, ElCol } from 'element-plus';
import { SwitchButton } from '@element-plus/icons-vue'
import { getItem } from '@/assets/js/storage';
import imageError from '@/assets/images/0fc7d20532fdaf769a25683617711.png'
import "./main.css"

export default defineComponent({
  setup(){
    const router = useRouter();
    const user = reactive(getItem('user'))

    const errorHandler = () => {
      // 头像没显示出来
    }
    const loginOut = () => {
      showModal('是否确认退出登录？',{
        onConfirm: () => {
          localStorage.clear()
          router.push('/login');
        },
      })
    }

    return() => (
      <>
        <ElRow align='middle' style={{ height: "64px" }}>
          <ElCol span={ 8 }>
            <img src="https://cn.element-plus.org/images/element-plus-logo.svg" style={{ width: "180px" }} />
          </ElCol>
          <ElCol span={ 8 }>
            <div class="f28" style={{ fontWeight: 'bold', textAlign: 'center' }}>
              企业数字化管理平台
            </div>
          </ElCol>
          <ElCol span={ 8 }>
            <div class="flex row-right">
              <ElAvatar shape="circle" size={ 40 } fit="cover" src={ user.avatar_url }>
                <img src={ imageError } style={{ width: "40px", borderRadius: '50%' }} />
              </ElAvatar>
              <div class="pl10">欢迎你，{ user.username }</div>
            </div>
          </ElCol>
        </ElRow>
      </>
    )
  }
})