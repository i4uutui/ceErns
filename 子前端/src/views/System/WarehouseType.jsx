import { defineComponent, ref, onMounted, reactive } from 'vue'
import request from '@/utils/request';
import { getItem } from '@/assets/js/storage';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      name: [
        { required: true, message: '请输入仓库名称', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      name: '',
    })
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);
    let edit = ref(0)

    onMounted(() => {
      fetchAdminList()
    })

    // 获取列表
    const fetchAdminList = async () => {
      const res = await request.get('/api/warehouse_cycle', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value
        },
      });
      tableData.value = res.data;
      total.value = res.total;
    };
    const handleSubmit = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (valid){
          if(!edit.value){
            const formValue = {
              ...form.value,
            }
            const res = await request.post('/api/warehouse_cycle', formValue);
            if(res && res.code == 200){
              ElMessage.success('添加成功');
            }
            
          }else{
            // 修改
            const myForm = {
              id: edit.value,
              name: form.value.name,
            }
            const res = await request.put('/api/warehouse_cycle', myForm);
            if(res && res.code == 200){
              ElMessage.success('修改成功');
            }
          }
          
          dialogVisible.value = false;
          fetchAdminList();
        }
      })
    }
    const handleUplate = (row) => {
      edit.value = row.id;
      form.value.name = row.name;
      dialogVisible.value = true;
    }
    // 添加管理员
    const handleAdd = () => {
      edit.value = 0;
      form.value.name = '';
      dialogVisible.value = true;
    };
    // 取消弹窗
    const handleClose = () => {
      edit.value = 0;
      form.value.name = '';
      dialogVisible.value = false;
    }
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

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="clearfix">
                <ElButton style="margin-top: -5px" type="primary" v-permission={ 'Warehouse:add' } onClick={ handleAdd } >
                  新增仓库
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="name" label="名称" />
                  <ElTableColumn prop="created_at" label="创建时间" />
                  <ElTableColumn label="操作">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" v-permission={ 'Warehouse:edit' } onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                      </>
                    )}
                  </ElTableColumn>
                </ElTable>
                <ElPagination layout="prev, pager, next, jumper, total" currentPage={ currentPage.value } pageSize={ pageSize.value } total={ total.value } defaultPageSize={ pageSize.value } style={{ justifyContent: 'center', paddingTop: '10px' }} onUpdate:currentPage={ (page) => currentPageChange(page) } onUupdate:pageSize={ (size) => pageSizeChange(size) } />
              </>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改仓库' : '添加仓库' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } rules={ rules } label-width="80px">
                <ElFormItem label="名称" prop="name">
                  <ElInput v-model={ form.value.name } placeholder="请输入名称" />
                </ElFormItem>
              </ElForm>
            ),
            footer: () => (
              <span class="dialog-footer">
                <ElButton onClick={ handleClose }>取消</ElButton>
                <ElButton type="primary" onClick={ () => handleSubmit(formRef.value) }>确定</ElButton>
              </span>
            )
          }}
        </ElDialog>
      </>
    )
  }
})