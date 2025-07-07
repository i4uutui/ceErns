<template>
  <div class="sub-admin-list">
    <el-card>
      <template #header>
        <div class="clearfix">
          <span>企业列表</span>
          <el-button
            style="float: right; margin-top: -5px"
            type="primary"
            @click="handleAdd"
          >
            添加企业
          </el-button>
        </div>
      </template>
      <el-table :data="adminList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="logo" label="ID" width="180">
          <template #default="scope">
            <img :src="scope.row.logo" style="width: 100px; height: 100px;" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="企业名称" />
        <el-table-column prop="person" label="联系人" />
        <el-table-column prop="contact" label="联系方式" />
        <el-table-column prop="address" label="联系地址" />
        <el-table-column prop="created_at" label="添加时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="default" @click="handleUplate(scope.row)">
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination 
        layout="prev, pager, next, jumper, slot, total, sizes" :current-page="currentPage" 
        :page-size="pageSize" 
        :page-count="total" 
        :page-sizes='[10, 20, 40, 60]'
        @update:current-page="currentPageChange"
        @update:page-size="pageSizeChange"
        />
      </div>
    </el-card>

    <!-- 添加管理员对话框 -->
    <el-dialog v-model="dialogVisible" title="添加企业">
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            name="image"
            :action="config.api + 'upload/image'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logo" :src="`${config.api}${form.logo}`" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="企业名称" prop="username">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="联系人" prop="person">
          <el-input v-model="form.person" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElDialog, ElButton, ElCard, ElPagination, ElTable, ElTableColumn, ElInput, ElFormItem, ElForm, ElUpload, ElIcon } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'
import request from '@/utils/request';
import config from '@/utils/config'

const dialogVisible = ref(false);
const formRef = ref(null);
const form = reactive({
  logo: '',
  name: '',
  person: '',
  contact: '',
  address: '',
});
const adminList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
let edit = ref(0)


// 获取子管理员列表
const fetchAdminList = async () => {
  const res = await request.get('/admin/company', {
    params: {
      page: currentPage.value,
      pageSize: pageSize.value
    },
  });
  adminList.value = res.data;
  total.value = res.totalPages;
};
const handleUplate = async (admin) => {
  edit.value = admin.id;
  dialogVisible.value = true;
  form.logo = admin.logo
  form.name = admin.name;
  form.person = admin.person;
  form.contact = admin.contact;
  form.address = admin.address;
}
// 添加管理员
const handleAdd = () => {
  edit.value = 0;
  dialogVisible.value = true;
  form.logo = ''
  form.name = '';
  form.person = '';
  form.contact = '';
  form.address = '';
};
// 提交表单
const handleSubmit = async () => {
  // 添加
  if(!edit.value){
    form.attr = 1;
    await request.post('/admin/company', form);
    ElMessage.success('添加成功');
  }else{
    // 修改
    const myForm = {
      id: edit.value,
      logo: form.logo,
      name: form.name,
      person: form.person,
      contact: form.contact,
      address: form.address,
    }
    await request.put('/admin/company', myForm);
    ElMessage.success('修改成功');
  }
  
  dialogVisible.value = false;
  fetchAdminList();
};
// 图片上传成功回调
const handleAvatarSuccess = (res, file) => {
  form.logo = res.imagePath; // 假设返回的图片链接在 res.url 中
};
// 图片上传前校验
const beforeAvatarUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片！');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！');
  }
  return isJpgOrPng && isLt2M;
};
// 分页相关
function pageSizeChange(val) {
  currentPage.value = 1;
  pageSize.value = val;
  fetchAdminList()
}
function currentPageChange(val) {
  currentPage.value = val;
  fetchAdminList();
}

onMounted(() => {
  fetchAdminList();
});
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.avatar-uploader .avatar {
  width: 108px;
  height: 108px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 108px;
  height: 108px;
  text-align: center;
}
</style>