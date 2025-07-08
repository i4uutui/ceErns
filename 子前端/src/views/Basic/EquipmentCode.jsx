import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      equipment_code: [
        { required: true, message: '请输入设备编码', trigger: 'blur' },
      ],
      equipment_name: [
        { required: true, message: '请输入设备名称', trigger: 'blur' },
      ],
      equipment_quantity: [
        { required: true, message: '请输入设备数量', trigger: 'blur' },
      ],
      department: [
        { required: true, message: '请输入所属部门', trigger: 'blur' },
      ],
      working_hours: [
        { required: true, message: '请输入工作时长(时)', trigger: 'blur' },
      ],
      equipment_efficiency: [
        { required: true, message: '请输入设备效能', trigger: 'blur' },
      ],
      equipment_status: [
        { required: true, message: '请输入设备状态', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      equipment_code: '',
      equipment_name: '',
      equipment_quantity: '',
      department: '',
      working_hours: '',
      equipment_efficiency: '',
      equipment_status: '',
      remarks: '',
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
      const res = await request.get('/api/equipment_code', {
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
            const res = await request.post('/api/equipment_code', form.value);
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
            const res = await request.put('/api/equipment_code', myForm);
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
        const res = await request.delete('/api/equipment_code/' + row.id);
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
        equipment_code: '',
        equipment_name: '',
        equipment_quantity: '',
        department: '',
        working_hours: '',
        equipment_efficiency: '',
        equipment_status: '',
        remarks: '',
      }
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="clearfix">
                <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                  添加设备
                </ElButton>
              </div>
            ),
            default: () => (
              <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                <ElTableColumn prop="equipment_code" label="设备编码" />
                <ElTableColumn prop="equipment_name" label="设备名称" />
                <ElTableColumn prop="equipment_quantity" label="设备数量" />
                <ElTableColumn prop="department" label="所属部门" />
                <ElTableColumn prop="working_hours" label="工作时长(时)" />
                <ElTableColumn prop="equipment_efficiency" label="设备效能" />
                <ElTableColumn prop="equipment_status" label="设备状态" />
                <ElTableColumn prop="remarks" label="备注" />
                <ElTableColumn label="操作" width='140'>
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
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改设备信息' : '添加设备信息' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="设备编码" prop="equipment_code">
                  <ElInput v-model={ form.value.equipment_code } placeholder="请输入设备编码" />
                </ElFormItem>
                <ElFormItem label="设备名称" prop="equipment_name">
                  <ElInput v-model={ form.value.equipment_name } placeholder="请输入设备名称" />
                </ElFormItem>
                <ElFormItem label="设备数量" prop="equipment_quantity">
                  <ElInput v-model={ form.value.equipment_quantity } type="number" placeholder="请输入设备数量" />
                </ElFormItem>
                <ElFormItem label="所属部门" prop="department">
                  <ElInput v-model={ form.value.department } placeholder="请输入所属部门" />
                </ElFormItem>
                <ElFormItem label="工作时长(时)" prop="working_hours">
                  <ElInput v-model={ form.value.working_hours } type="number" placeholder="请输入工作时长(时)" />
                </ElFormItem>
                <ElFormItem label="设备效能" prop="equipment_efficiency">
                  <ElInput v-model={ form.value.equipment_efficiency } placeholder="请输入设备效能" />
                </ElFormItem>
                <ElFormItem label="设备状态" prop="equipment_status">
                  <ElInput v-model={ form.value.equipment_status } placeholder="请输入设备状态" />
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