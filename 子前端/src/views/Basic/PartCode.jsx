import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage, ElMessageBox, ElPagination } from 'element-plus'
import MySelect from '@/components/tables/mySelect.vue';
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      part_code: [
        { required: true, message: '请输入部件编码', trigger: 'blur' },
      ],
      part_name: [
        { required: true, message: '请输入部件名称', trigger: 'blur' },
      ],
      model: [
        { required: true, message: '请输入型号', trigger: 'blur' },
      ],
      specification: [
        { required: true, message: '请输入规格', trigger: 'blur' },
      ],
      other_features: [
        { required: true, message: '请输入其它特性', trigger: 'blur' },
      ],
      unit: [
        { required: true, message: '请输入单位', trigger: 'blur' },
      ],
      unit_price: [
        { required: true, message: '请输入单价', trigger: 'blur' },
      ],
      currency: [
        { required: true, message: '请输入币别', trigger: 'blur' },
      ],
      production_requirements: [
        { required: true, message: '请输入生产要求', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      part_code: '',
      part_name: '',
      model: '',
      specification: '',
      materialIds: [],
      other_features: '',
      unit: '',
      unit_price: '',
      currency: '',
      production_requirements: '',
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
      const res = await request.get('/api/part_code', {
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
            const res = await request.post('/api/part_code', form.value);
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
            const res = await request.put('/api/part_code', myForm);
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
        const res = await request.delete('/api/part_code/' + row.id);
        if(res && res.code == 200){
          ElMessage.success('删除成功');
          fetchProductList();
        }
      }).catch(() => {})
    }
    const handleUplate = (row) => {
      edit.value = row.id;
      dialogVisible.value = true;
      const rows = { ...row }
      rows.materialIds = rows.material.map(e => e.id)
      form.value = rows;
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
        part_code: '',
        part_name: '',
        model: '',
        specification: '',
        materialIds: [],
        other_features: '',
        unit: '',
        unit_price: '',
        currency: '',
        production_requirements: '',
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
                <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                  添加部件编码
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="part_code" label="部件编码" />
                  <ElTableColumn prop="part_name" label="部件名称" />
                  <ElTableColumn prop="model" label="型号" />
                  <ElTableColumn prop="specification" label="规格" />
                  <ElTableColumn label="材料">
                  {({row}) => (
                    <span>{ row.material && row.material.length ? row.material.map(material => material.material_name).join('，') : 'null' }
                    </span>
                  )}
                  </ElTableColumn>
                  <ElTableColumn prop="other_features" label="其它特性" />
                  <ElTableColumn prop="unit" label="单位" width="100" />
                  <ElTableColumn prop="unit_price" label="单价" width="100" />
                  <ElTableColumn prop="currency" label="币别" width="100" />
                  <ElTableColumn prop="production_requirements" label="生产要求" />
                  <ElTableColumn prop="remarks" label="备注" />
                  <ElTableColumn label="操作" width="140" fixed="right">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                        <ElButton size="small" type="danger" onClick={ () => handleDelete(scope.row) }>删除</ElButton>
                      </>
                    )}
                  </ElTableColumn>
                </ElTable>
                <ElPagination layout="prev, pager, next, jumper, total" currentPage={ currentPage.value } pageSize={ pageSize.value } total={ total.value } defaultPageSize={ pageSize.value } style={{ justifyContent: 'center', paddingTop: '10px' }} onUpdate:currentPage={ (page) => currentPageChange(page) } onUupdate:pageSize={ (size) => pageSizeChange(size) } />
              </>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改部件编码' : '添加部件编码' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="80px">
                <ElFormItem label="部件编码" prop="part_code">
                  <ElInput v-model={ form.value.part_code } placeholder="请输入部件编码" />
                </ElFormItem>
                <ElFormItem label="部件名称" prop="part_name">
                  <ElInput v-model={ form.value.part_name } placeholder="请输入部件名称" />
                </ElFormItem>
                <ElFormItem label="型号" prop="model">
                  <ElInput v-model={ form.value.model } placeholder="请输入型号" />
                </ElFormItem>
                <ElFormItem label="规格" prop="specification">
                  <ElInput v-model={ form.value.specification } placeholder="请输入规格" />
                </ElFormItem>
                <ElFormItem label="材料" prop="materialIds">
                  <MySelect v-model={ form.value.materialIds } multiple apiUrl="/api/getMaterialCode" query="material_code" itemValue="material_code" placeholder="请选择材料" />
                </ElFormItem>
                <ElFormItem label="其它特性" prop="other_features">
                  <ElInput v-model={ form.value.other_features } placeholder="请输入其它特性" />
                </ElFormItem>
                <ElFormItem label="单位" prop="unit">
                  <ElInput v-model={ form.value.unit } placeholder="请输入单位" />
                </ElFormItem>
                <ElFormItem label="单价" prop="unit_price">
                  <ElInput v-model={ form.value.unit_price } type="number" placeholder="请输入单价" />
                </ElFormItem>
                <ElFormItem label="币别" prop="currency">
                  <ElInput v-model={ form.value.currency } placeholder="请输入币别" />
                </ElFormItem>
                <ElFormItem label="生产要求" prop="production_requirements">
                  <ElInput v-model={ form.value.production_requirements } placeholder="请输入生产要求" />
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