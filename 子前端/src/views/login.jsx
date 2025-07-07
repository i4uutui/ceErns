import { defineComponent, ref, reactive } from 'vue';
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { Key, UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { setItem } from '@/assets/js/storage';
import request from '@/utils/request';
import "@/assets/css/login.css"

export default defineComponent({
  setup(){
    const router = useRouter();
    const loginFormRef = ref(null);
    const loginForm = reactive({
      username: 'admin1',
      password: 'admin123',
    });
    const loginRules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
    });

    const handleLogin = () => {
      loginFormRef.value.validate((valid) => {
        if (!valid) return false;
        request.post('api/login', loginForm).then(res => {
          console.log(res);
          setItem('token', res.token);
          setItem('user', res.user)
          setItem('company', res.company)
          ElMessage.success('登录成功');
          router.push('/');
        })
      });
    };

    return() => (
      <div class="login-container">
        <div class="login-wrapper">
          <div class="login-logo">管理系统</div>
          <ElForm ref={ loginFormRef } model={ loginForm } rules={ loginRules } label-width="0" class="login-form">
            <ElFormItem prop="username">
              <ElInput v-model={ loginForm.username } prefix-icon={ UserFilled } placeholder="用户名" />
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput v-model={ loginForm.password } prefixIcon={ Key } type="password" placeholder="密码" />
            </ElFormItem>
            <ElFormItem>
              <ElButton type="primary" onClick={ handleLogin } class="w-full" style={{ width: "100%" }}>
                登录
              </ElButton>
            </ElFormItem>
          </ElForm>
        </div>
      </div>
    )
  }
})