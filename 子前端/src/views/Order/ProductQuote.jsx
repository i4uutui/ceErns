import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElOption, ElPagination, ElSelect, ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, onMounted, ref, reactive } from 'vue'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      sale_id: [
        { required: true, message: '请选择销售订单', trigger: 'blur' },
      ],
      notice: [
        { required: true, message: '请输入报价单号', trigger: 'blur' },
      ],
      product_price: [
        { required: true, message: '请输入产品单价', trigger: 'blur' },
      ],
      transaction_currency: [
        { required: true, message: '请输入交易币别', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      sale_id: '',
      notice: '',
      product_price: '',
      transaction_currency: '',
      other_transaction_terms: ''
    })
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);
    let edit = ref(0)
    let saleOrder = ref([])
    let loading = ref(false)

    onMounted(() => {
      fetchProductList()
    })

    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/product_quotation', {
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
            const res = await request.post('/api/product_quotation', form.value);
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
            const res = await request.put('/api/product_quotation', myForm);
            if(res && res.code == 200){
              ElMessage.success('修改成功');
              dialogVisible.value = false;
              fetchProductList();
            }
          }
        }
      })
    }
    let timeout = null
    const remoteMethod = (query) => {
      if(timeout){
        clearTimeout(timeout)
        timeout = null
      }
      timeout = setTimeout(async () => {
        if(query){
          loading.value = true
          const res = await request.get('/api/getSaleOrder', {
            params: {
              customer_order: query
            },
          });
          saleOrder.value = res.data
          loading.value = false
        }else{
          saleOrder.value = []
        }
        clearTimeout(timeout)
        timeout = null
      }, 500)
    }
    const changeSelect = (value) => {
      saleOrder.value = []
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
        sale_id: '',
        notice: '',
        product_price: '',
        transaction_currency: '',
        other_transaction_terms: '',
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
                  添加产品报价
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="notice" label="报价单号" width="100" />
                  <ElTableColumn prop="sale.product.product_code" label="产品编码" width="100" />
                  <ElTableColumn prop="sale.customer.customer_abbreviation" label="客户名称" width="120" />
                  <ElTableColumn prop="sale.product.product_name" label="产品名称" width="100" />
                  <ElTableColumn prop="sale.product.model" label="型号" width="100" />
                  <ElTableColumn prop="sale.product.specification" label="规格" width="100" />
                  <ElTableColumn prop="sale.product.other_features" label="其他特性" width="100" />
                  <ElTableColumn prop="sale.customer_order" label="客户订单号" width="120" />
                  <ElTableColumn prop="sale.order_number" label="订单数量" width="100" />
                  <ElTableColumn prop="sale.unit" label="单位" width="100" />
                  <ElTableColumn prop="product_price" label="产品单价" width="100" />
                  <ElTableColumn prop="transaction_currency" label="交易币别" width="100" />
                  <ElTableColumn prop="other_transaction_terms" label="交易条件" width="120" />
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
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改产品报价' : '添加产品报价' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="销售订单" prop="sale_id">
                  <ElSelect v-model={ form.value.sale_id } filterable remote loading={ loading.value } remote-method={ remoteMethod } value-key="id" placeholder="请选择销售订单" onChange={ changeSelect }>
                    {
                      saleOrder.value.map((o, index) => (
                        <ElOption value={ o.id } label={ `${o.customer_order}:${o.product.drawing}` } />
                      ))
                    }
                  </ElSelect>
                </ElFormItem>
                <ElFormItem label="报价单号" prop="notice">
                  <ElInput v-model={ form.value.notice } placeholder="请输入报价单号" />
                </ElFormItem>
                <ElFormItem label="产品单价" prop="product_price">
                  <ElInput v-model={ form.value.product_price } placeholder="请输入产品单价" />
                </ElFormItem>
                <ElFormItem label="交易币别" prop="transaction_currency">
                  <ElInput v-model={ form.value.transaction_currency } placeholder="请输入交易币别" />
                </ElFormItem>
                <ElFormItem label="交易条件" prop="other_transaction_terms">
                  <ElInput v-model={ form.value.other_transaction_terms } placeholder="请输入交易条件" />
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