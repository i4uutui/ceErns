import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage, ElMessageBox, ElPagination } from 'element-plus'
import MySelect from '@/components/tables/mySelect.vue';
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
      times: [
        { required: true, message: '请输入单件工时', trigger: 'blur' },
      ],
      price: [
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
      equipment_id: '',
      process_code: '',
      process_name: '',
      equipment_used: '',
      times: '',
      price: '',
      section_points: '',
      total_processing_price: '',
      remarks: '',
    })
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);
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
      total.value = res.total;
    };
    const handleSubmit = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (valid){
          if(!edit.value){
            const res = await request.post('/api/process_code', form.value);
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
            const res = await request.put('/api/process_code', myForm);
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
        const res = await request.delete('/api/process_code/' + row.id);
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
        equipment_id: '',
        process_code: '',
        process_name: '',
        equipment_used: '',
        times: '',
        price: '',
        section_points: '',
        total_processing_price: '',
        remarks: '',
      }
    }
    // 分页相关
    function pageSizeChange(val) {
      currentPage.value = 1;
      pageSize.value = val;
      fetchProductList()
    }
    function currentPageChange(val) {
      currentPage.value = val;
      fetchProductList();
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="clearfix">
                <ElButton style="margin-top: -5px" type="primary" v-permission={ 'ProcessCode:add' } onClick={ handleAdd } >
                  添加工艺编码
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="process_code" label="工艺编码" />
                  <ElTableColumn prop="process_name" label="工艺名称" />
                  <ElTableColumn prop="times" label="单件工时(时)" />
                  <ElTableColumn prop="price" label="加工单价" />
                  <ElTableColumn prop="section_points" label="段数点数" />
                  <ElTableColumn prop="total_processing_price" label="加工总价" />
                  <ElTableColumn prop="remarks" label="备注" />
                  <ElTableColumn label="操作" width="140" fixed="right">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" v-permission={ 'ProcessCode:edit' } onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                        <ElButton size="small" type="danger" v-permission={ 'ProcessCode:delete' } onClick={ () => handleDelete(scope.row) }>删除</ElButton>
                      </>
                    )}
                  </ElTableColumn>
                </ElTable>
                <ElPagination layout="prev, pager, next, jumper, total" currentPage={ currentPage.value } pageSize={ pageSize.value } total={ total.value } defaultPageSize={ pageSize.value } style={{ justifyContent: 'center', paddingTop: '10px' }} onUpdate:currentPage={ (page) => currentPageChange(page) } onUupdate:pageSize={ (size) => pageSizeChange(size) } />
              </>
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
                <ElFormItem label="使用设备" prop="equipment_id">
                  <MySelect v-model={ form.value.equipment_id } apiUrl="/api/getEquipmentCode" query="equipment_code" itemValue="equipment_code" placeholder="请选择设备" />
                </ElFormItem>
                <ElFormItem label="单件工时(时)" prop="times">
                  <ElInput v-model={ form.value.times } type="number" placeholder="请输入单件工时(时)" />
                </ElFormItem>
                <ElFormItem label="加工单价" prop="price">
                  <ElInput v-model={ form.value.price } type="number" placeholder="请输入加工单价" />
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