import { defineComponent, onMounted, ref, reactive } from 'vue'
import request from '@/utils/request';
import MySelect from '@/components/tables/mySelect.vue';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      rece_time: [
        { required: true, message: '请选择接单日期', trigger: 'blur' },
      ],
      customer_id: [
        { required: true, message: '请选择客户', trigger: 'blur' },
      ],
      customer_order: [
        { required: true, message: '请输入客户订单号', trigger: 'blur' },
      ],
      product_id: [
        { required: true, message: '请选择产品编码', trigger: 'blur' },
      ],
      product_req: [
        { required: true, message: '请输入产品要求', trigger: 'blur' },
      ],
      order_number: [
        { required: true, message: '请输入订单数量', trigger: 'blur' },
      ],
      unit: [
        { required: true, message: '请输入单位', trigger: 'blur' },
      ],
      delivery_time: [
        { required: true, message: '请输入交货日期', trigger: 'blur' },
      ],
      goods_time: [
        { required: true, message: '请输入送货日期', trigger: 'blur' },
      ],
      goods_address: [
        { required: true, message: '请输入送货地址', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      rece_time: '',
      customer_id: '',
      customer_order: '',
      product_id: '',
      product_req: '',
      order_number: '',
      unit: '',
      delivery_time: '',
      goods_time: '',
      goods_address: '',
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
      const res = await request.get('/api/sale_order', {
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
            const res = await request.post('/api/sale_order', form.value);
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
            const res = await request.put('/api/sale_order', myForm);
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
        rece_time: '',
        customer_id: '',
        customer_order: '',
        product_id: '',
        product_req: '',
        order_number: '',
        unit: '',
        delivery_time: '',
        goods_time: '',
        goods_address: '',
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
                <ElButton style="margin-top: -5px" type="primary" v-permission={ 'SalesOrder:add' } onClick={ handleAdd } >
                  添加销售订单
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="rece_time" label="接单日期" width="170" fixed="left" />
                  <ElTableColumn prop="customer.customer_code" label="客户编码" width="100" fixed="left" />
                  <ElTableColumn prop="customer.customer_abbreviation" label="客户名称" width="120" fixed="left" />
                  <ElTableColumn prop="customer_order" label="客户订单号" width="120" fixed="left" />
                  <ElTableColumn prop="product.product_code" label="产品编码" width="100" />
                  <ElTableColumn prop="product.product_name" label="产品名称" width="100" />
                  <ElTableColumn prop="product.drawing" label="工程图号" width="100" />
                  <ElTableColumn prop="product.component_structure" label="产品结构" width="100" />
                  <ElTableColumn prop="product.model" label="型号" width="100" />
                  <ElTableColumn prop="product.specification" label="规格" width="100" />
                  <ElTableColumn prop="product.other_features" label="其他特性" width="100" />
                  <ElTableColumn prop="product_req" label="产品要求" width="100" />
                  <ElTableColumn prop="order_number" label="订单数量" width="100" />
                  <ElTableColumn prop="unit" label="单位" width="80" />
                  <ElTableColumn prop="delivery_time" label="交货日期" width="170" />
                  <ElTableColumn prop="goods_time" label="送货日期" width="170" />
                  <ElTableColumn prop="goods_address" label="送货地点" width="120" />
                  <ElTableColumn prop="created_at" label="创建时间" width="170" />
                  <ElTableColumn label="操作" width="140" fixed="right">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" v-permission={ 'SalesOrder:edit' } onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                      </>
                    )}
                  </ElTableColumn>
                </ElTable>
                <ElPagination layout="prev, pager, next, jumper, total" currentPage={ currentPage.value } pageSize={ pageSize.value } total={ total.value } defaultPageSize={ pageSize.value } style={{ justifyContent: 'center', paddingTop: '10px' }} onUpdate:currentPage={ (page) => currentPageChange(page) } onUupdate:pageSize={ (size) => pageSizeChange(size) } />
              </>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改销售订单' : '添加销售订单' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="接单日期" prop="rece_time">
                  <ElDatePicker v-model={ form.value.rece_time } type="datetime" placeholder="请选择接单日期" />
                </ElFormItem>
                <ElFormItem label="客户名称" prop="customer_id">
                  <MySelect v-model={ form.value.customer_id } apiUrl="/api/getCustomerInfo" query="customer_abbreviation" itemValue="customer_abbreviation" placeholder="请选择客户名称" />
                </ElFormItem>
                <ElFormItem label="客户订单号" prop="customer_order">
                  <ElInput v-model={ form.value.customer_order } placeholder="请输入客户订单号" />
                </ElFormItem>
                <ElFormItem label="产品编码" prop="product_id">
                  <MySelect v-model={ form.value.product_id } apiUrl="/api/getProductsCode" query="product_name" itemValue="product_name" placeholder="请选择产品编码" />
                </ElFormItem>
                <ElFormItem label="产品要求" prop="product_req">
                  <ElInput v-model={ form.value.product_req } placeholder="请输入产品要求" />
                </ElFormItem>
                <ElFormItem label="订单数量" prop="order_number">
                  <ElInput v-model={ form.value.order_number } placeholder="请输入订单数量" />
                </ElFormItem>
                <ElFormItem label="单位" prop="unit">
                  <ElInput v-model={ form.value.unit } placeholder="请输入单位" />
                </ElFormItem>
                <ElFormItem label="交货日期" prop="delivery_time">
                  <ElDatePicker v-model={ form.value.delivery_time } type="datetime" placeholder="请选择交货日期" />
                </ElFormItem>
                <ElFormItem label="送货日期" prop="goods_time">
                  <ElDatePicker v-model={ form.value.goods_time } type="datetime" placeholder="请选择送货日期" />
                </ElFormItem>
                <ElFormItem label="送货地点" prop="goods_address">
                  <ElInput v-model={ form.value.goods_address } placeholder="请输入送货地点" />
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