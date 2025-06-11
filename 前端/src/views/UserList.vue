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
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>

    <!-- 添加管理员对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="添加子管理员">
      <template #content>
        <el-form :model="form" ref="formRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" />
          </el-form-item>
        </el-form>
      </template>
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
});
const adminList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取子管理员列表
const fetchAdminList = async () => {
  const { data } = await request.get('/admin/sub-admins', {
    params: {
      page: currentPage.value,
      pageSize: pageSize.value,
    },
  });
  adminList.value = data.list;
  total.value = data.total;
};

// 添加管理员
const handleAdd = () => {
  dialogVisible.value = true;
  form.username = '';
  form.password = '';
};

// 提交表单
const handleSubmit = async () => {
  try {
    await request.post('/api/super-admin/sub-admins', form);
    ElMessage.success('添加成功');
    dialogVisible.value = false;
    fetchAdminList();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '添加失败');
  }
};

// 删除管理员
const handleDelete = async (admin) => {
  if (confirm('确定要删除该管理员吗？')) {
    try {
      await request.delete(`/api/super-admin/sub-admins/${admin.id}`);
      ElMessage.success('删除成功');
      fetchAdminList();
    } catch (error) {
      ElMessage.error('删除失败');
    }
  }
};

// 分页相关
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  fetchAdminList();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchAdminList();
};

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
    