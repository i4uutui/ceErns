import { ElButton, ElCard, ElDatePicker, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, onMounted, ref, reactive } from 'vue'
import request from '@/utils/request';
import MySelect from '@/components/tables/mySelect.vue';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      supplier_id: [
        { required: true, message: '请选择供应商编码', trigger: 'blur' }
      ],
      product_id: [
        { required: true, message: '请选择产品编码', trigger: 'blur' }
      ],
      part_id: [
        { required: true, message: '请选择部件编码', trigger: 'blur' }
      ],
      process_id: [
        { required: true, message: '请选择工艺编码', trigger: 'blur' }
      ],
      processing_unit_price: [
        { required: true, message: '请输入加工单价', trigger: 'blur' }
      ],
      transaction_currency: [
        { required: true, message: '请输入交易币别', trigger: 'blur' }
      ],
      other_transaction_terms: [
        { required: true, message: '请输入交易条件', trigger: 'blur' }
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      supplier_id: '',
      product_id: '',
      part_id: '',
      process_id: '',
      processing_unit_price: '',
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
      const res = await request.get('/api/outsourcing_quote', {
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
            const res = await request.post('/api/outsourcing_quote', form.value);
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
            const res = await request.put('/api/outsourcing_quote', myForm);
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
        supplier_id: '',
        product_id: '',
        part_id: '',
        process_id: '',
        processing_unit_price: '',
        transaction_currency: '',
        other_transaction_terms: '',
        remarks: ''
      }
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="clearfix">
                <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                  添加委外报价
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="supplier.supplier_code" label="供应商编码" width="100" />
                  <ElTableColumn prop="supplier.supplier_abbreviation" label="供应商名称" width="170" />
                  <ElTableColumn prop="product.product_code" label="产品编码" width="100" />
                  <ElTableColumn prop="product.product_name" label="产品名称" width="100" />
                  <ElTableColumn prop="product.drawing" label="工程图号" width="100" />
                  <ElTableColumn label="型号/规格">
                    {({ row }) => (
                      <span>{row.product.model}/{row.product.specification}</span>
                    )}
                  </ElTableColumn>
                  <ElTableColumn prop="part.part_code" label="部件编码" width="100" />
                  <ElTableColumn prop="part.part_name" label="部件名称" width="100" />
                  <ElTableColumn prop="process.process_code" label="工艺编码" width="100" />
                  <ElTableColumn prop="process.process_name" label="工艺名称" width="120" />
                  <ElTableColumn prop="processing_unit_price" label="加工单价" width="100" />
                  <ElTableColumn prop="transaction_currency" label="交易币别" width="120" />
                  <ElTableColumn prop="other_transaction_terms" label="交易条件" width="170" />
                  <ElTableColumn prop="remarks" label="备注" width="170" />
                  <ElTableColumn prop="created_at" label="创建时间" width="170" />
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
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改委外报价' : '添加委外报价' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="供应商编码" prop="supplier_id">
                  <MySelect v-model={ form.value.supplier_id } apiUrl="/api/getSupplierInfo" query="supplier_code" itemValue="supplier_code" placeholder="请选择供应商编码" />
                </ElFormItem>
                <ElFormItem label="产品编码" prop="product_id">
                  <MySelect v-model={ form.value.product_id } apiUrl="/api/getProductsCode" query="product_code" itemValue="product_code" placeholder="请选择产品编码" />
                </ElFormItem>
                <ElFormItem label="部件编码" prop="part_id">
                  <MySelect v-model={ form.value.part_id } apiUrl="/api/getPartCode" query="part_code" itemValue="part_code" placeholder="请选择部件编码" />
                </ElFormItem>
                <ElFormItem label="工艺编码" prop="process_id">
                  <MySelect v-model={ form.value.process_id } apiUrl="/api/getProcessCode" query="process_code" itemValue="process_code" placeholder="请选择工艺编码" />
                </ElFormItem>
                <ElFormItem label="加工单价" prop="processing_unit_price">
                  <ElInput v-model={ form.value.processing_unit_price } placeholder="请输入加工单价" />
                </ElFormItem>
                <ElFormItem label="交易币别" prop="transaction_currency">
                  <ElInput v-model={ form.value.transaction_currency } placeholder="请输入交易币别" />
                </ElFormItem>
                <ElFormItem label="交易条件" prop="other_transaction_terms">
                  <ElInput v-model={ form.value.other_transaction_terms } placeholder="请输入交易条件" />
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