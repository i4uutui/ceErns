import { defineComponent, ref, onMounted, reactive, computed } from 'vue'
import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElTable, ElTableColumn, ElIcon, ElMessageBox } from 'element-plus'
import { CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import { getRandomString, isEmptyValue } from '@/utils/tool';
import request from '@/utils/request';

export default defineComponent({
  setup(){
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);
    let product_code = ref('')
    let product_name = ref('')

    const maxBomLength = computed(() => {
      if (tableData.value.length === 0) return 0;
      return Math.max(...tableData.value.map(item => item.children.length));
    });

    // 处理数据：确保每条记录的 children 长度一致（不足的补空对象）
    const processedTableData = computed(() => {
      return tableData.value.map(item => {
        const newItem = { ...item, children: [...item.children] };
        while (newItem.children.length < maxBomLength.value) {
          newItem.children.push({
            material: {
              material_code: '',
              material_name: '',
              specification: '',
            },
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
          product_code: product_code.value,
          product_name: product_name.value,
        },
      });
      tableData.value = res.data;
      total.value = res.total;
    };
    const handleCope = ({ id }) => {
      ElMessageBox.confirm('是否确认复制新增', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const params = { id, type: 'material' }
        const res = await request.post('/api/cope_bom', params)
        if(res && res.code == 200){
          ElMessage.success('操作成功');
        }
      }).catch(() => {})
    }
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
    const goArchive = () => {
      window.open('/product/material-bom-archive', '_blank')
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
              <div class="clearfix flex">
                <div class="flex pl10">
                  <span>产品编码：</span>
                  <ElInput v-model={ product_code.value } style="width: 240px" placeholder="请输入产品编码" />
                </div>
                <div class="flex pl10">
                  <span>产品名称：</span>
                  <ElInput v-model={ product_name.value } style="width: 240px" placeholder="请输入产品名称" />
                </div>
                <div class="pl10">
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
                        <ElTableColumn prop={`children[${index}].material.material_code`} label="材料编码" />
                        <ElTableColumn prop={`children[${index}].material.material_name`} label="材料名称" />
                        <ElTableColumn prop={`children[${index}].material.specification`} label="规格" />
                        <ElTableColumn prop={`children[${index}].number`} label="数量" />
                      </ElTableColumn>
                    ))
                  }
                  <ElTableColumn label="操作" width="140" fixed="right">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" onClick={ () => handleCope(scope.row) }>复制新增</ElButton>
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