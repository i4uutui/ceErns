import { defineComponent, ref, onMounted, computed } from 'vue';
import { ElButton, ElCard, ElInput, ElPagination, ElTable, ElTableColumn, } from 'element-plus'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    let tableData = ref([])
    let product_code = ref('')
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
            material_code: '',
            material_name: '',
            specification: '',
            number: ''
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
      const res = await request.get('/api/material_bom', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
          archive: 0,
          product_code: product_code.value
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
      if(rowIndex >= 1 || columnIndex >= 5 && column.label != '操作'){
        return { backgroundColor: '#fbe1e5' }
      }
    }
    const cellStyle = ({ columnIndex, rowIndex, column }) => {
      if(columnIndex >= 5 && column.label != '操作'){
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
            header: () => (
              <div class="flex">
                <div class="pr10 flex">
                  <span>产品编码:</span>
                  <ElInput v-model={ product_code.value } style="width: 160px" placeholder="请输入"/>
                </div>
                <div class="pr10">
                  <ElButton style="margin-top: -5px" type="primary" onClick={ fetchProductList } >
                    查询
                  </ElButton>
                </div>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ processedTableData.value } border stripe style={{ width: "100%" }} headerCellStyle={ headerCellStyle } cellStyle={ cellStyle }>
                  <ElTableColumn prop="product.product_code" label="产品编码" fixed="left" />
                  <ElTableColumn prop="product.product_name" label="产品名称" fixed="left" />
                  <ElTableColumn prop="product.drawing" label="工程图号" fixed="left" />
                  <ElTableColumn prop="part.part_code" label="部位编码" fixed="left" />
                  <ElTableColumn prop="part.part_name" label="部位名称" fixed="left" />
                  {
                    Array.from({ length: maxBomLength.value }).map((_, index) => (
                      <ElTableColumn label={`材料BOM-${index + 1}`} key={index}>
                        <ElTableColumn prop={`textJson[${index}].material_code`} label="材料编码" />
                        <ElTableColumn prop={`textJson[${index}].material_name`} label="材料名称" />
                        <ElTableColumn prop={`textJson[${index}].specification`} label="规格" />
                        <ElTableColumn prop={`textJson[${index}].number`} label="数量" />
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