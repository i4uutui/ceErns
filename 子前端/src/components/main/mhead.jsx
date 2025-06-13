import { computed, defineComponent, inject } from 'vue';
import { useRouter } from 'vue-router';
import { ElAvatar, ElBreadcrumb, ElBreadcrumbItem, ElIcon, ElText, ElSpace, ElMessage } from 'element-plus';
import { SwitchButton } from '@element-plus/icons-vue'
import Tags from './tags';
import "./main.css"

export default defineComponent({
  setup(){
    const router = useRouter();
    const showModal = inject('showModal')
    const user = localStorage.getItem('user')

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
    const handleBreadcrumbClick = (path) => {
      router.push(path);
    };

    const breadcrumbItems = computed(() => {
      const matched = route.matched;
      return matched.map((match) => ({
        path: match.path,
        title: match.meta.title,
      }));
    })

    return() => (
      <>
        <div class="header">
          <ElBreadcrumb separator="/">
            {breadcrumbItems.value.map((item) => (
              <ElBreadcrumbItem key={ item.path } onClick={() => handleBreadcrumbClick(item.path)}>
                { item.title }
              </ElBreadcrumbItem>
            ))}
          </ElBreadcrumb>
          <ElSpace wrap>
            <ElAvatar size={ 40 } src={ user.avatar } onError={ errorHandler }>
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </ElAvatar>
            <ElText style='padding-right:40px'>{ user.nickName }</ElText>

            <ElText style='cursor: pointer;' onClick={ loginOut }>
              <ElIcon style='margin-right: 6px'><SwitchButton /></ElIcon>
              退出登录
            </ElText>
          </ElSpace>
        </div>
        {/* <Tags></Tags> */}
      </>
    )
  }
})