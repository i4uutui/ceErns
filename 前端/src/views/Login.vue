<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-logo">管理系统</div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" :prefix-icon="UserFilled" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" :prefixIcon="Key" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" class="w-full" style="width: 100%;">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { Key, UserFilled } from '@element-plus/icons-vue'
import request from '@/utils/request';

const router = useRouter();
const loginFormRef = ref(null);
const loading = ref(false);

const loginForm = reactive({
  username: '',
  password: '',
});

const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
});

const handleLogin = async () => {
  await loginFormRef.value.validate((valid) => {
    if (!valid) return false;
  });

  loading.value = true;
  try {
    const res = await request.post('/admin/login', loginForm);
    localStorage.setItem('token', res.token);
    ElMessage.success('登录成功');
    router.push('/');
  } catch (error) {
    console.error('登录失败', error);
    ElMessage.error(error.message || '登录失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f0f2f5;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-logo {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #165DFF;
}

.login-form {
  margin-top: 20px;
}
</style>