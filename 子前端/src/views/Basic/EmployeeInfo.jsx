import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      employee_id: [
        { required: true, message: '请输入员工工号', trigger: 'blur' },
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
      ],
      department: [
        { required: true, message: '请输入所属部门', trigger: 'blur' },
      ],
      production_position: [
        { required: true, message: '请输入生产岗位', trigger: 'blur' },
      ],
      salary_attribute: [
        { required: true, message: '请输入工资属性', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      employee_id: '',
      name: '',
      department: '',
      production_position: '',
      salary_attribute: '',
    })
    let tableData = ref([])
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    let edit = ref(0)

    onMounted(() => {
      fetchProductList()
    })

    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/employee_info', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value
        },
      });
      tableData.value = res.data;
      total.value = res.totalPages;
    };
    const handleSubmit = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (valid){
          if(!edit.value){
            const res = await request.post('/api/employee_info', form.value);
            if(res && res.code == 200){
              ElMessage.success('添加成功');
              dialogVisible.value = false;
              fetchProductList();
            }
            
          }else{
            // 修改
            const myForm = {
              id: edit.value,
              ...form.value
            }
            const res = await request.put('/api/employee_info', myForm);
            if(res && res.code == 200){
              ElMessage.success('修改成功');
              dialogVisible.value = false;
              fetchProductList();
            }
          }
        }
      })
    }
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        "是否确认删除？",
        "提示",
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        const res = await request.delete('/api/employee_info/' + row.id);
        if(res && res.code == 200){
          ElMessage.success('删除成功');
          fetchProductList();
        }
      }).catch(() => {})
    }
    const handleUplate = (row) => {
      edit.value = row.id;
      dialogVisible.value = true;
      form.value = { ...row };
    }
    // 添加
    const handleAdd = () => {
      edit.value = 0;
      dialogVisible.value = true;
      resetForm()
    };
    // 取消弹窗
    const handleClose = () => {
      edit.value = 0;
      dialogVisible.value = false;
      resetForm()
    }
    const resetForm = () => {
      form.value = {
        employee_id: '',
        name: '',
        department: '',
        production_position: '',
        salary_attribute: '',
      }
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="clearfix">
                <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                  添加员工
                </ElButton>
              </div>
            ),
            default: () => (
              <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                <ElTableColumn prop="employee_id" label="员工工号" />
                <ElTableColumn prop="name" label="姓名" />
                <ElTableColumn prop="department" label="所属部门" />
                <ElTableColumn prop="production_position" label="生产岗位" />
                <ElTableColumn prop="salary_attribute" label="工资属性" />
                <ElTableColumn prop="remarks" label="备注" />
                <ElTableColumn label="操作" width="140">
                  {(scope) => (
                    <>
                      <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                      <ElButton size="small" type="danger" onClick={ () => handleDelete(scope.row) }>删除</ElButton>
                    </>
                  )}
                </ElTableColumn>
              </ElTable>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改员工信息' : '添加员工信息' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="员工工号" prop="employee_id">
                  <ElInput v-model={ form.value.employee_id } placeholder="请输入员工工号" />
                </ElFormItem>
                <ElFormItem label="姓名" prop="name">
                  <ElInput v-model={ form.value.name } placeholder="请输入姓名" />
                </ElFormItem>
                <ElFormItem label="所属部门" prop="department">
                  <ElInput v-model={ form.value.department } placeholder="请输入所属部门" />
                </ElFormItem>
                <ElFormItem label="生产岗位" prop="production_position">
                  <ElInput v-model={ form.value.production_position } placeholder="请输入生产岗位" />
                </ElFormItem>
                <ElFormItem label="工资属性" prop="salary_attribute">
                  <ElInput v-model={ form.value.salary_attribute } placeholder="请输入工资属性" />
                </ElFormItem>
                <ElFormItem label="备注" prop="remarks">
                  <ElInput v-model={ form.value.remarks } placeholder="请输入备注" />
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