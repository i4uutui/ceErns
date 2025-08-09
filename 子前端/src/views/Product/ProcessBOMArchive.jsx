import { defineComponent, ref, onMounted, reactive, computed } from 'vue'
import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElTable, ElTableColumn, ElIcon, ElMessageBox } from 'element-plus'
import { CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import { getRandomString } from '@/utils/tool';
import request from '@/utils/request';
import MySelect from '@/components/tables/mySelect.vue';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      product_id: [
        { required: true, message: '请选择产品编码', trigger: 'blur' },
      ],
      part_id: [
        { required: true, message: '请选择部件编码', trigger: 'blur' },
      ],
      make_time: [
        { required: true, message: '请选择制程工时', trigger: 'blur' },
      ]
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
      const res = await request.get('/api/process_bom', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
          archive: 0
        },
      });
      tableData.value = res.data;
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
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }} headerCellStyle={ headerCellStyle } cellStyle={ cellStyle }>
                  <ElTableColumn prop="product.product_code" label="产品编码" fixed="left" />
                  <ElTableColumn prop="product.product_name" label="产品名称" fixed="left" />
                  <ElTableColumn prop="product.drawing" label="工程图号" fixed="left" />
                  <ElTableColumn prop="part.part_code" label="部位编码" fixed="left" />
                  <ElTableColumn prop="part.part_name" label="部位名称" fixed="left" />
                  <ElTableColumn prop="make_time" label="制程工时" fixed="left" />
                  {({row}) => (
                    row.part.process.map((e, index) => (
                    <>
                      <ElTableColumn label={`工序-${index + 1}`} key={index}>
                        <ElTableColumn prop={`row.part.process[${index}].process_code`} label="工艺编码" />
                        <ElTableColumn prop={`row.part.process[${index}].process_name`} label="工艺名称" />
                        <ElTableColumn prop={`row.part.process[${index}].equipment.equipment_code`} label="设备编码" />
                        <ElTableColumn prop={`row.part.process[${index}].equipment.equipment_name`} label="设备名称" />
                        <ElTableColumn prop={`row.part.process[${index}].times`} label="单件工时(分)" />
                        <ElTableColumn prop={`row.part.process[${index}].price`} label="加工单价" />
                        <ElTableColumn prop={`row.part.process[${index}].section_points`} label="段数点数" />
                        <ElTableColumn prop={`row.part.process[${index}].long`} label="生产制程" />
                      </ElTableColumn>
                    </>
                    ))
                  )}
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