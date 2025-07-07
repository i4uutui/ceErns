<template>
  <div class="sub-admin-list">
    <el-card>
      <template #header>
        <div class="clearfix">
          <span>子管理员列表</span>
          <el-button
            style="float: right; margin-top: -5px"
            type="primary"
            @click="handleAdd"
          >
            添加管理员
          </el-button>
        </div>
      </template>
      <el-table :data="adminList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="company.name" label="公司名" />
        <el-table-column label="是否开启">
          <template #default="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="(value) => changeSwitch(value, scope.row)" />
          </template>
        </el-table-column>
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
    <el-dialog v-model="dialogVisible" title="添加子管理员">
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="公司名称" prop="company_id">
          <!-- <el-input v-model="form.company_id" /> -->
           <el-cascader v-model="form.company_id" :options="options" :props="propsCascader" filterable :show-all-levels="false" placeholder="请选择企业" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password"  v-if="!edit">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="是否开启" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
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
import { ElMessage, ElDialog, ElButton, ElCard, ElPagination, ElTable, ElTableColumn, ElInput, ElFormItem, ElForm, ElSwitch, ElCascader } from 'element-plus';
import request from '@/utils/request';
import config from '@/utils/config'

const dialogVisible = ref(false);
const formRef = ref(null);
const form = reactive({
  username: '',
  password: '',
  company_id: '',
  status: 0
});
const adminList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
let options = ref([])
let propsCascader = ref({
  label: 'name',
  value: 'id',
  emitPath: false
})
let edit = ref(0)


// 获取子管理员列表
const fetchAdminList = async () => {
  const res = await request.get('/admin/user', {
    params: {
      page: currentPage.value,
      pageSize: pageSize.value
    },
  });
  adminList.value = res.data;
  total.value = res.totalPages;
};
const getCompanyList= async () => {
  const res = await request.get('/admin/company', {
    params: {
      page: 1,
      pageSize: 10,
    },
  })
  options.value = res.data
}
const handleUplate = async (admin) => {
  edit.value = admin.id;
  dialogVisible.value = true;
  form.username = admin.username;
  form.password = '';
  form.company_id = admin.company_id;
  form.status = admin.status;
}
// 添加管理员
const handleAdd = () => {
  edit.value = 0;
  dialogVisible.value = true;
  form.username = '';
  form.password = '';
  form.company_id = '';
  form.status = 0;
};
const changeSwitch = async (value, row) => {
  const { company, created_at, updated_at, ...formData } = row
  formData.password = ''
  await request.put('/admin/user', formData);
  ElMessage.success('修改成功');
}
// 提交表单
const handleSubmit = async () => {
  try {
    // 添加
    if(!edit.value){
      form.attr = 1;
      await request.post('/admin/user', form);
      ElMessage.success('添加成功');
    }else{
      // 修改
      const myForm = {
        id: edit.value,
        username: form.username,
        password: form.password,
        company_id: form.company_id,
        status: form.status
      }
      await request.put('/admin/user', myForm);
      ElMessage.success('修改成功');
    }
    
    dialogVisible.value = false;
    fetchAdminList();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '添加失败');
  }
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
  getCompanyList()
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
    