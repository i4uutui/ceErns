import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElTable, ElTableColumn } from 'element-plus';
import { defineComponent, onMounted, ref, reactive } from 'vue'
import request from '@/utils/request';
import MySelect from '@/components/tables/mySelect.vue';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      part_id: [
        { required: true, message: '请选择部件编码', trigger: 'blur' },
      ],
      out_number: [
        { required: true, message: '请输入委外/库存数量', trigger: 'blur' },
      ],
      order_number: [
        { required: true, message: '请输入生产数量', trigger: 'blur' },
      ],
      remarks: [
        { required: true, message: '请输入生产特别要求', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      id: '',
      part_id: '',
      out_number: '',
      order_number: '',
      remarks: '',
    })
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);
    
    onMounted(() => {
      fetchProductList()
    })
    
    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/production_progress', {
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
          const res = await request.put('/api/production_progress', form.value);
          if(res && res.code == 200){
            ElMessage.success('修改成功');
            dialogVisible.value = false;
            fetchProductList();
          }
        }
      })
    }
    const handleUplate = (row) => {
      dialogVisible.value = true;
      form.value = {
        id: row.id,
        part_id: row.part_id,
        out_number: row.out_number,
        order_number: row.order_number,
        remarks: row.remarks,
      };
    }
    // 取消弹窗
    const handleClose = () => {
      dialogVisible.value = false;
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
            // header: () => (
            //   <div class="clearfix">
            //     <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
            //       添加产品报价
            //     </ElButton>
            //   </div>
            // ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="notice.notice" label="生产订单号" width="100" />
                  <ElTableColumn prop="customer.customer_abbreviation" label="客户名称" width="120" />
                  <ElTableColumn prop="sale.customer_order" label="客户订单号" width="120" />
                  <ElTableColumn prop="sale.rece_time" label="接单日期" width="170" />
                  <ElTableColumn prop="product.product_code" label="产品编码" width="100" />
                  <ElTableColumn prop="product.product_name" label="产品名称" width="100" />
                  <ElTableColumn prop="product.drawing" label="工程图号" width="100" />
                  <ElTableColumn prop="remarks" label="生产特别要求" width="170" />
                  <ElTableColumn prop="sale.order_number" label="订单数量" width="100" />
                  <ElTableColumn prop="out_number" label="委外/库存数量" width="100" />
                  <ElTableColumn prop="order_number" label="生产数量" width="100" />
                  <ElTableColumn prop="notice.delivery_time" label="客户交期" width="170" />
                  <ElTableColumn label="部件编码" width="120">
                    {({row}) => row.part ? row.part.part_code : ''}
                  </ElTableColumn>
                  <ElTableColumn label="部件名称" width="170">
                    {({row}) => row.part ? row.part.part_name : ''}
                  </ElTableColumn>
                  
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
        <ElDialog v-model={ dialogVisible.value } title='修改进度表' onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="部件编码" prop="part_id">
                  <MySelect v-model={ form.value.part_id } apiUrl="/api/getPartCode" query="part_code" itemValue="part_code" placeholder="请选择部件编码" />
                </ElFormItem>
                <ElFormItem label="委外/库存数量" prop="out_number">
                  <ElInput v-model={ form.value.out_number } placeholder="请输入委外/库存数量" />
                </ElFormItem>
                <ElFormItem label="生产数量" prop="order_number">
                  <ElInput v-model={ form.value.order_number } placeholder="请输入生产数量" />
                </ElFormItem>
                <ElFormItem label="生产特别要求" prop="remarks">
                  <ElInput v-model={ form.value.remarks } placeholder="请输入生产特别要求" />
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