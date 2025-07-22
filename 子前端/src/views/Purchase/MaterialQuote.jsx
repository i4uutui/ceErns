import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage, ElMessageBox, ElPagination } from 'element-plus'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      material_code_id: [
        { required: true, message: '请选择材料编码', trigger: 'blur' },
      ],
      delivery: [
        { required: true, message: '请输入送货方式', trigger: 'blur' },
      ],
      packaging: [
        { required: true, message: '请输入包装要求', trigger: 'blur' },
      ],
      transaction_currency: [
        { required: true, message: '请输入交易币别', trigger: 'blur' },
      ],
      other_transaction_terms: [
        { required: true, message: '请输入交易条件', trigger: 'blur' },
      ]
    })
    let dialogVisible = ref(false)
    let form = ref({
      material_code_id: '', 
      delivery: '', 
      packaging: '', 
      transaction_currency: '', 
      other_transaction_terms: '', 
      remarks: ''
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
      const res = await request.get('/api/material_quote', {
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
            const res = await request.post('/api/material_quote', form.value);
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
            const res = await request.put('/api/material_quote', myForm);
            if(res && res.code == 200){
              ElMessage.success('修改成功');
              dialogVisible.value = false;
              fetchProductList();
            }
          }
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
        material_code_id: '',
        delivery: '', 
        packaging: '', 
        transaction_currency: '', 
        other_transaction_terms: '', 
        remarks: ''
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
                  添加供应商
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="materialCode.material_code" label="材料编码" />
                  <ElTableColumn prop="materialCode.material_name" label="材料名称" />
                  <ElTableColumn prop="materialCode.model" label="型号" />
                  <ElTableColumn prop="materialCode.specification" label="规格" />
                  <ElTableColumn prop="materialCode.other_features" label="其他特性" />
                  <ElTableColumn prop="materialCode.purchase_unit" label="采购单位" />
                  <ElTableColumn prop="materialCode.unit_price" label="采购单价" />
                  <ElTableColumn prop="delivery" label="送货方式" />
                  <ElTableColumn prop="packaging" label="包装要求" />
                  <ElTableColumn prop="transaction_currency" label="交易币别" />
                  <ElTableColumn prop="other_transaction_terms" label="其它交易条件" />
                  <ElTableColumn prop="remarks" label="备注" />
                  <ElTableColumn prop="created_at" label="创建时间" />
                  <ElTableColumn label="操作" width="140" fixed="right">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                      </>
                    )}
                  </ElTableColumn>
                </ElTable>
                <ElPagination layout="prev, pager, next, jumper, total" currentPage={ currentPage.value } pageSize={ pageSize.value } total={ total.value } defaultPageSize={ pageSize.value } style={{ justifyContent: 'center', paddingTop: '10px' }} onUpdate:currentPage={ (page) => currentPageChange(page) } onUupdate:pageSize={ (size) => pageSizeChange(size) } />
              </>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改材料报价' : '添加材料报价' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="供应商编码" prop="supplier_code">
                  <ElInput v-model={ form.value.supplier_code } placeholder="请输入供应商编码" />
                </ElFormItem>
                <ElFormItem label="送货方式" prop="delivery">
                  <ElInput v-model={ form.value.delivery } placeholder="请输入送货方式" />
                </ElFormItem>
                <ElFormItem label="包装要求" prop="packaging">
                  <ElInput v-model={ form.value.packaging } placeholder="请输入包装要求" />
                </ElFormItem>
                <ElFormItem label="交易币别" prop="transaction_currency">
                  <ElInput v-model={ form.value.transaction_currency } placeholder="请输入交易币别" />
                </ElFormItem>
                <ElFormItem label="其它交易条件" prop="other_transaction_terms">
                  <ElInput v-model={ form.value.other_transaction_terms } placeholder="请输入其它交易条件" />
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