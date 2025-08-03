import { ElButton, ElCard, ElDatePicker, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, onMounted, ref, reactive } from 'vue'
import request from '@/utils/request';
import MySelect from '@/components/tables/mySelect.vue';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      sale_id: [
        { required: true, message: '请选择报价单号', trigger: 'blur' },
      ],
      notice: [
        { required: true, message: '请输入生产单号', trigger: 'blur' },
      ],
      delivery_time: [
        { required: true, message: '请输入交货日期', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      sale_id: '',
      notice: '',
      delivery_time: '',
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
      const res = await request.get('/api/product_notice', {
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
            const res = await request.post('/api/product_notice', form.value);
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
            const res = await request.put('/api/product_notice', myForm);
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
        sale_id: '',
        notice: '',
        delivery_time: '',
      }
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="clearfix">
                <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                  添加生产通知单
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="notice" label="生产订单号" width="100" />
                  <ElTableColumn prop="sale.rece_time" label="接单日期" width="170" />
                  <ElTableColumn prop="customer.customer_abbreviation" label="客户名称" width="100" />
                  <ElTableColumn prop="sale.customer_order" label="客户订单号" width="100" />
                  <ElTableColumn prop="product.product_code" label="产品编码" width="100" />
                  <ElTableColumn prop="product.product_name" label="产品名称" width="100" />
                  <ElTableColumn prop="product.drawing" label="工程图号" width="120" />
                  <ElTableColumn prop="product.component_structure" label="产品结构" width="100" />
                  <ElTableColumn prop="product.model" label="型号" width="100" />
                  <ElTableColumn prop="product.specification" label="规格" width="100" />
                  <ElTableColumn prop="product.other_features" label="其它特性" width="100" />
                  <ElTableColumn prop="sale.product_req" label="产品要求" width="120" />
                  <ElTableColumn prop="sale.order_number" label="订单数量" width="100" />
                  <ElTableColumn prop="sale.unit" label="单位" width="120" />
                  <ElTableColumn prop="delivery_time" label="交货日期" width="170" />
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
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改生产通知单' : '添加生产通知单' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="客户订单号" prop="sale_id">
                  <MySelect v-model={ form.value.sale_id } apiUrl="/api/getSaleOrder" query="customer_order" itemValue="customer_order" placeholder="请选择客户订单号" />
                </ElFormItem>
                <ElFormItem label="生产订单号" prop="notice">
                  <ElInput v-model={ form.value.notice } placeholder="请输入生产订单号" />
                </ElFormItem>
                <ElFormItem label="交货日期" prop="delivery_time">
                  <ElDatePicker v-model={ form.value.delivery_time } type="datetime" placeholder="请选择交货日期" />
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