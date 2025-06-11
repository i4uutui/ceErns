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
        <el-table-column prop="company" label="公司名" />
        <el-table-column prop="created_at" label="添加时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="default" @click="handleUplate(scope.row)">
              修改
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">
              删除
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="form.company" />
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
import { ElMessage, ElDialog, ElButton, ElCard, ElPagination, ElTable, ElTableColumn, ElInput, ElFormItem, ElForm } from 'element-plus';
import request from '@/utils/request';

const dialogVisible = ref(false);
const formRef = ref(null);
const form = reactive({
  username: '',
  password: '',
  company: ''
});
const adminList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
let edit = ref(0)


// 获取子管理员列表
const fetchAdminList = async () => {
  const res = await request.get('/admin/sub-admins', {
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
  form.username = admin.username;
  form.password = admin.password;
  form.company = admin.company;
}
// 添加管理员
const handleAdd = () => {
  edit.value = 0;
  dialogVisible.value = true;
  form.username = '';
  form.password = '';
  form.company = ''
};

// 提交表单
const handleSubmit = async () => {
  try {
    if(!edit.value){
      await request.post('/admin/sub-admins', form);
      ElMessage.success('添加成功');
    }else{
      const myForm = {
        id: edit.value,
        username: form.username,
        password: form.password,
        company: form.company,
      }
      await request.put('/admin/sub-admins', myForm);
      ElMessage.success('修改成功');
    }
    
    dialogVisible.value = false;
    fetchAdminList();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '添加失败');
  }
};

// 删除管理员
const handleDelete = (admin) => {
  if (confirm('确定要删除该管理员吗？')) {
    request.delete(`/admin/sub-admins/${admin.id}`).then(res => {
      ElMessage.success('删除成功');
      fetchAdminList();
    })
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
});
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
    