import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage } from 'element-plus'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      process_code: [
        { required: true, message: '请输入工艺编码', trigger: 'blur' },
      ],
      process_name: [
        { required: true, message: '请输入工艺名称', trigger: 'blur' },
      ],
      equipment_used: [
        { required: true, message: '请输入使用设备', trigger: 'blur' },
      ],
      piece_working_hours: [
        { required: true, message: '请输入单件工时', trigger: 'blur' },
      ],
      processing_unit_price: [
        { required: true, message: '请输入加工单价', trigger: 'blur' },
      ],
      section_points: [
        { required: true, message: '请输入段数点数', trigger: 'blur' },
      ],
      total_processing_price: [
        { required: true, message: '请输入加工总价', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      process_code: '',
      process_name: '',
      equipment_used: '',
      piece_working_hours: '',
      processing_unit_price: '',
      section_points: '',
      total_processing_price: '',
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
      const res = await request.get('/api/process_code', {
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
            const res = await request.post('/api/process_code', form.value);
            if(res && res.code == 200){
              ElMessage.success('添加成功');
            }
            
          }else{
            // 修改
            const myForm = {
              id: edit.value,
              ...form.value
            }
            const res = await request.put('/api/process_code', myForm);
            if(res && res.code == 200){
              ElMessage.success('修改成功');
            }
          }
          
          dialogVisible.value = false;
          fetchProductList();
        }
      })
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
        process_code: '',
        process_name: '',
        equipment_used: '',
        piece_working_hours: '',
        processing_unit_price: '',
        section_points: '',
        total_processing_price: '',
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
                  添加工艺编码
                </ElButton>
              </div>
            ),
            default: () => (
              <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                <ElTableColumn prop="process_code" label="工艺编码" />
                <ElTableColumn prop="process_name" label="工艺名称" />
                <ElTableColumn prop="equipment_used" label="使用设备" />
                <ElTableColumn prop="piece_working_hours" label="单件工时(时)" />
                <ElTableColumn prop="processing_unit_price" label="加工单价" />
                <ElTableColumn prop="section_points" label="段数点数" />
                <ElTableColumn prop="total_processing_price" label="加工总价" />
                <ElTableColumn prop="remarks" label="备注" />
                <ElTableColumn label="操作">
                  {(scope) => (
                    <>
                      <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                    </>
                  )}
                </ElTableColumn>
              </ElTable>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改工艺编码' : '添加工艺编码' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="工艺编码" prop="process_code">
                  <ElInput v-model={ form.value.process_code } placeholder="请输入工艺编码" />
                </ElFormItem>
                <ElFormItem label="工艺名称" prop="process_name">
                  <ElInput v-model={ form.value.process_name } placeholder="请输入工艺名称" />
                </ElFormItem>
                <ElFormItem label="使用设备" prop="equipment_used">
                  <ElInput v-model={ form.value.equipment_used } placeholder="请输入使用设备" />
                </ElFormItem>
                <ElFormItem label="单件工时(时)" prop="piece_working_hours">
                  <ElInput v-model={ form.value.piece_working_hours } type="number" placeholder="请输入单件工时(时)" />
                </ElFormItem>
                <ElFormItem label="加工单价" prop="processing_unit_price">
                  <ElInput v-model={ form.value.processing_unit_price } type="number" placeholder="请输入加工单价" />
                </ElFormItem>
                <ElFormItem label="段数点数" prop="section_points">
                  <ElInput v-model={ form.value.section_points } type="number" placeholder="请输入段数点数" />
                </ElFormItem>
                <ElFormItem label="加工总价" prop="total_processing_price">
                  <ElInput v-model={ form.value.total_processing_price } type="number" placeholder="请输入加工总价" />
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