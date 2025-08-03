import { defineComponent, ref, onMounted, reactive, computed } from 'vue'
import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElTable, ElTableColumn, ElIcon } from 'element-plus'
import { CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import { getRandomString } from '@/utils/tool';
import request from '@/utils/request';
import MySelect from '@/components/tables/mySelect.vue';

export default defineComponent({
  setup(){
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);

    const maxBomLength = computed(() => {
      if (tableData.value.length === 0) return 0;
      return Math.max(...tableData.value.map(item => item.textJson.length));
    });

    // 处理数据：确保每条记录的 textJson 长度一致（不足的补空对象）
    const processedTableData = computed(() => {
      return tableData.value.map(item => {
        const newItem = { ...item, textJson: [...item.textJson] };
        while (newItem.textJson.length < maxBomLength.value) {
          newItem.textJson.push({
            process_code: '',
            process_name: '',
            section_points: '',
            equipment_code: '',
            equipment_name: '',
            time: '',
            price: '',
            long: '',
          });
        }
        return newItem;
      });
    });
    
    onMounted(() => {
      fetchProductList()
    })
    
    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/process_bom', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
          archive: 0
        },
      });
      const data = res.data.map(o => {
        const test = JSON.parse(o.textJson)
        o.textJson = test
        return o
      })
      tableData.value = data;
      total.value = res.total;
    };
    const headerCellStyle = ({ columnIndex, rowIndex, column }) => {
      if(rowIndex >= 1 || columnIndex >= 6 && column.label != '操作'){
        return { backgroundColor: '#fbe1e5' }
      }
    }
    const cellStyle = ({ columnIndex, rowIndex, column }) => {
      if(columnIndex >= 6 && column.label != '操作'){
        return { backgroundColor: '#fbe1e5' }
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
            // header: () => (
            //   <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
            //     添加工艺BOM
            //   </ElButton>
            // ),
            default: () => (
              <>
                <ElTable data={ processedTableData.value } border stripe style={{ width: "100%" }} headerCellStyle={ headerCellStyle } cellStyle={ cellStyle }>
                  <ElTableColumn prop="product.product_code" label="产品编码" fixed="left" />
                  <ElTableColumn prop="product.product_name" label="产品名称" fixed="left" />
                  <ElTableColumn prop="product.drawing" label="工程图号" fixed="left" />
                  <ElTableColumn prop="part.part_code" label="部位编码" fixed="left" />
                  <ElTableColumn prop="part.part_name" label="部位名称" fixed="left" />
                  <ElTableColumn prop="make_time" label="制程工时" fixed="left" />
                  {
                    Array.from({ length: maxBomLength.value }).map((_, index) => (
                      <ElTableColumn label={`工序-${index + 1}`} key={index}>
                        <ElTableColumn prop={`textJson[${index}].process_code`} label="工艺编码" />
                        <ElTableColumn prop={`textJson[${index}].process_name`} label="工艺名称" />
                        <ElTableColumn prop={`textJson[${index}].equipment_code`} label="设备编码" />
                        <ElTableColumn prop={`textJson[${index}].equipment_name`} label="设备名称" />
                        <ElTableColumn prop={`textJson[${index}].time`} label="单件工时" />
                        <ElTableColumn prop={`textJson[${index}].price`} label="加工单价" />
                        <ElTableColumn prop={`textJson[${index}].section_points`} label="段数点数" />
                        <ElTableColumn prop={`textJson[${index}].long`} label="生产制程" />
                      </ElTableColumn>
                    ))
                  }
                  {/* <ElTableColumn label="操作" width="140" fixed="right">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                      </>
                    )}
                  </ElTableColumn> */}
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