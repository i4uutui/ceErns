import { ElButton, ElCard, ElCascader, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, onMounted, ref, reactive } from 'vue'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      customer_id: [
        { required: true, message: '请输入客户名称', trigger: 'blur' },
      ],
      product_id: [
        { required: true, message: '请输入产品名称', trigger: 'blur' },
      ],
      model: [
        { required: true, message: '请输入型号', trigger: 'blur' },
      ],
      spec: [
        { required: true, message: '请输入规格', trigger: 'blur' },
      ],
      order_char: [
        { required: true, message: '请输入其他特性', trigger: 'blur' },
      ],
      customer_order: [
        { required: true, message: '请输入客户订单', trigger: 'blur' },
      ],
      order_number: [
        { required: true, message: '请输入订单数量', trigger: 'blur' },
      ],
      product_unit: [
        { required: true, message: '请输入产品单位', trigger: 'blur' },
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
      customer_id: '',
      product_id: '',
      model: '',
      spec: '',
      order_char: '',
      customer_order: '',
      order_number: '',
      product_unit: '',
      product_price: '',
      transaction_currency: '',
      other_transaction_terms: ''
    })
    let tableData = ref([])
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    let edit = ref(0)
    let customer = ref([])
    let product = ref([])
    let propsCascader = ref({
      emitPath: false,
      value: 'id'
    })

    onMounted(() => {
      getProducts()
      getCustomerInfo()
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
      total.value = res.totalPages;
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
    const getProducts = async () => {
      const res = await request.get('/api/getProductsCode');
      product.value = res.data
    }
    const getCustomerInfo = async () => {
      const res = await request.get('/api/getCustomerInfo');
      customer.value = res.data
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
        customer_id: '',
        product_id: '',
        model: '',
        spec: '',
        order_char: '',
        customer_order: '',
        order_number: '',
        product_unit: '',
        product_price: '',
        transaction_currency: '',
        other_transaction_terms: '',
      }
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
              <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                <ElTableColumn prop="customer.customer_abbreviation" label="客户名称" />
                <ElTableColumn prop="product.product_code" label="产品编码" />
                <ElTableColumn prop="product.product_name" label="产品名称" />
                <ElTableColumn prop="model" label="型号" />
                <ElTableColumn prop="spec" label="规格" />
                <ElTableColumn prop="order_char" label="其他特性" />
                <ElTableColumn prop="customer_order" label="客户订单" />
                <ElTableColumn prop="order_number" label="订单数量" />
                <ElTableColumn prop="product_unit" label="产品单位" />
                <ElTableColumn prop="product_price" label="产品单价" />
                <ElTableColumn prop="transaction_currency" label="交易币别" />
                <ElTableColumn prop="other_transaction_terms" label="交易条件" />
                <ElTableColumn prop="created_at" label="创建时间" />
                <ElTableColumn label="操作" width="140">
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
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改客户信息' : '添加客户信息' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="客户名称" prop="customer_id">
                  <ElCascader v-model={ form.value.customer_id } placeholder="请选择客户名称" options={ customer.value } filterable props={ propsCascader.value } />
                </ElFormItem>
                <ElFormItem label="产品名称" prop="product_id">
                  <ElCascader v-model={ form.value.product_id } placeholder="请选择产品名称" options={ product.value } filterable props={ propsCascader.value } />
                </ElFormItem>
                <ElFormItem label="型号" prop="model">
                  <ElInput v-model={ form.value.model } placeholder="请输入型号" />
                </ElFormItem>
                <ElFormItem label="规格" prop="spec">
                  <ElInput v-model={ form.value.spec } placeholder="请输入规格" />
                </ElFormItem>
                <ElFormItem label="其他特性" prop="order_char">
                  <ElInput v-model={ form.value.order_char } placeholder="请输入其他特性" />
                </ElFormItem>
                <ElFormItem label="客户订单" prop="customer_order">
                  <ElInput v-model={ form.value.customer_order } placeholder="请输入客户订单" />
                </ElFormItem>
                <ElFormItem label="订单数量" prop="order_number">
                  <ElInput v-model={ form.value.order_number } placeholder="请输入订单数量" />
                </ElFormItem>
                <ElFormItem label="产品单位" prop="product_unit">
                  <ElInput v-model={ form.value.product_unit } placeholder="请输入产品单位" />
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