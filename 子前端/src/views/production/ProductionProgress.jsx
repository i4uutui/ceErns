import { ElButton, ElCard, ElPagination, ElTable, ElTableColumn } from 'element-plus';
import { defineComponent, onMounted, ref } from 'vue'
import request from '@/utils/request';

export default defineComponent({
  setup(){
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
                  <ElTableColumn prop="remark" label="生产特别要求" width="170" />
                  <ElTableColumn prop="sale.order_number" label="订单数量" width="100" />
                  <ElTableColumn prop="out_number" label="委外/库存数量" width="100" />
                  <ElTableColumn prop="order_number" label="生产数量" width="100" />
                  <ElTableColumn prop="notice.delivery_time" label="客户交期" width="170" />
                  <ElTableColumn prop="other_transaction_terms" label="部件编码" width="120" />
                  <ElTableColumn prop="created_at" label="部件名称" width="170" />
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
      </>
    )
  }
})