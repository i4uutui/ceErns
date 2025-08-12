import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage, ElMessageBox, ElPagination } from 'element-plus'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      material_code: [
        { required: true, message: '请输入材料编码', trigger: 'blur' },
      ],
      material_name: [
        { required: true, message: '请输入材料名称', trigger: 'blur' },
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
      usage_unit: [
        { required: true, message: '请输入使用单位', trigger: 'blur' },
      ],
      purchase_unit: [
        { required: true, message: '请输入采购单位', trigger: 'blur' },
      ],
      unit_price: [
        { required: true, message: '请输入单价', trigger: 'blur' },
      ],
      currency: [
        { required: true, message: '请输入币别', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      material_code: '',
      material_name: '',
      model: '',
      specification: '',
      other_features: '',
      usage_unit: '',
      purchase_unit: '',
      unit_price: '',
      currency: '',
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
      const res = await request.get('/api/material_code', {
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
            const res = await request.post('/api/material_code', form.value);
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
            const res = await request.put('/api/material_code', myForm);
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
        const res = await request.delete('/api/material_code/' + row.id);
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
        material_code: '',
        material_name: '',
        model: '',
        specification: '',
        other_features: '',
        usage_unit: '',
        purchase_unit: '',
        unit_price: '',
        currency: '',
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
                  添加材料编码
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="material_code" label="材料编码" />
                  <ElTableColumn prop="material_name" label="材料名称" />
                  <ElTableColumn prop="model" label="型号" />
                  <ElTableColumn prop="specification" label="规格" />
                  <ElTableColumn prop="other_features" label="其它特性" />
                  <ElTableColumn prop="usage_unit" label="使用单位" />
                  <ElTableColumn prop="purchase_unit" label="采购单位" />
                  <ElTableColumn prop="unit_price" label="单价" width="100" />
                  <ElTableColumn prop="currency" label="币别" width="100" />
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
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改材料编码' : '添加材料编码' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="80px">
                <ElFormItem label="材料编码" prop="material_code">
                  <ElInput v-model={ form.value.material_code } placeholder="请输入材料编码" />
                </ElFormItem>
                <ElFormItem label="材料名称" prop="material_name">
                  <ElInput v-model={ form.value.material_name } placeholder="请输入材料名称" />
                </ElFormItem>
                <ElFormItem label="型号" prop="model">
                  <ElInput v-model={ form.value.model } placeholder="请输入型号" />
                </ElFormItem>
                <ElFormItem label="规格" prop="specification">
                  <ElInput v-model={ form.value.specification } placeholder="请输入规格" />
                </ElFormItem>
                <ElFormItem label="其它特性" prop="other_features">
                  <ElInput v-model={ form.value.other_features } placeholder="请输入其它特性" />
                </ElFormItem>
                <ElFormItem label="使用单位" prop="usage_unit">
                  <ElInput v-model={ form.value.usage_unit } placeholder="请输入使用单位" />
                </ElFormItem>
                <ElFormItem label="采购单位" prop="purchase_unit">
                  <ElInput v-model={ form.value.purchase_unit } placeholder="请输入采购单位" />
                </ElFormItem>
                <ElFormItem label="单价" prop="unit_price">
                  <ElInput v-model={ form.value.unit_price } type="number" placeholder="请输入单价" />
                </ElFormItem>
                <ElFormItem label="币别" prop="currency">
                  <ElInput v-model={ form.value.currency } placeholder="请输入币别" />
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