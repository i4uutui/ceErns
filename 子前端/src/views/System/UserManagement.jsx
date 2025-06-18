import { defineComponent, ref, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage } from 'element-plus'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    let dialogVisible = ref(false)
    let form = ref({
      username: '',
      password: '',
    })
    let tableData = ref([])
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    let edit = ref(0)

    onMounted(() => {
      fetchAdminList()
    })

    // 获取子管理员列表
    const fetchAdminList = async () => {
      const res = await request.get('/api/user', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value
        },
      });
      tableData.value = res.data;
      total.value = res.totalPages;
    };
    const handleSubmit = async () => {
      try {
        // 添加
        if(!edit.value){
          await request.post('/api/user', form);
          ElMessage.success('添加成功');
        }else{
          // 修改
          const myForm = {
            id: edit.value,
            username: form.username,
            password: form.password,
          }
          await request.put('/api/user', myForm);
          ElMessage.success('修改成功');
        }
        
        dialogVisible.value = false;
        fetchAdminList();
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '添加失败');
      }
    }
    // 添加管理员
    const handleAdd = () => {
      edit.value = 0;
      dialogVisible.value = true;
      form.value.username = '';
      form.value.password = '';
    };
    // 取消弹窗
    const handleClose = () => {
      edit.value = 0;
      dialogVisible.value = false;
      form.value.username = '';
      form.value.password = '';
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="clearfix">
                <ElButton style="float: right; margin-top: -5px" type="primary" onClick={ handleAdd } >
                  添加管理员
                </ElButton>
              </div>
            ),
            default: () => (
              <ElTable data={ tableData.value } border style="width: 100%">
                <ElTableColumn prop="date" label="Date" width="180" />
                <ElTableColumn prop="name" label="Name" width="180" />
                <ElTableColumn prop="address" label="Address" />
              </ElTable>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title="添加管理员">
          <ElForm model={ form.value } ref="formRef" label-width="80px">
            <ElFormItem label="用户名" prop="username">
              <ElInput v-model={ form.value.username } />
            </ElFormItem>
            <ElFormItem label="密码" prop="password">
              <ElInput v-model={ form.value.password } type="password" />
            </ElFormItem>
          </ElForm>
          {{
            footer: () => (
              <span class="dialog-footer">
                <ElButton onClick={ handleClose }>取消</ElButton>
                <ElButton type="primary" onClick={ handleSubmit }>确定</ElButton>
              </span>
            )
          }}
        </ElDialog>
      </>
    )
  }
})