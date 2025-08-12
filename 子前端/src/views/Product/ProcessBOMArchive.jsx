import { defineComponent, ref, onMounted, reactive, computed } from 'vue'
import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElTable, ElTableColumn, ElIcon, ElMessageBox } from 'element-plus'
import { CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import { isEmptyValue } from '@/utils/tool'
import request from '@/utils/request';
import MySelect from '@/components/tables/mySelect.vue';

export default defineComponent({
  setup(){
    // const formRef = ref(null);
    // const rules = reactive({
    //   product_id: [
    //     { required: true, message: '请选择产品编码', trigger: 'blur' },
    //   ],
    //   part_id: [
    //     { required: true, message: '请选择部件编码', trigger: 'blur' },
    //   ],
    //   make_time: [
    //     { required: true, message: '请选择制程工时', trigger: 'blur' },
    //   ],
    //   process_id: [
    //     { required: true, message: '请选择工艺编码', trigger: 'blur' }
    //   ],
    //   equipment_id: [
    //     { required: true, message: '请选择设备编码', trigger: 'blur' },
    //   ],
    //   time: [
    //     { required: true, message: '请输入单件工时', trigger: 'blur' },
    //   ],
    //   price: [
    //     { required: true, message: '请输入加工单价', trigger: 'blur' },
    //   ],
    //   long: [
    //     { required: true, message: '请输入生产制程', trigger: 'blur' },
    //   ]
    // })
    // let dialogVisible = ref(false)
    // let form = ref({
    //   product_id: '',
    //   part_id: '',
    //   make_time: '',
    //   children: [
    //     { process_id: '', equipment_id: '', time: '', price: '', long: '' }
    //   ]
    // })
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);
    let edit = ref(0)

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
            process: {
              process_code: '',
              process_name: '',
              section_points: '',
            },
            equipment: {
              equipment_code: '',
              equipment_name: '',
            },
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
      tableData.value = res.data;
      total.value = res.total;
    };
    // const handleSubmit = async (formEl) => {
    //   if (!formEl) return
    //   await formEl.validate(async (valid, fields) => {
    //     if (valid){
    //       const low = { ...form.value, archive: 1 }
    //       if(!edit.value){
    //         const res = await request.post('/api/process_bom', low);
    //         if(res && res.code == 200){
    //           ElMessage.success('添加成功');
    //           dialogVisible.value = false;
    //           fetchProductList();
    //         }
            
    //       }else{
    //         // 修改
    //         const myForm = {
    //           id: edit.value,
    //           ...low
    //         }
    //         const res = await request.put('/api/process_bom', myForm);
    //         if(res && res.code == 200){
    //           ElMessage.success('修改成功');
    //           dialogVisible.value = false;
    //           fetchProductList();
    //         }
    //       }
    //     }
    //   })
    // }
    // const handleArchive = () => {
    //   if(tableData.value.length){
    //     ElMessageBox.confirm('是否确认存档', '提示', {
    //       confirmButtonText: '确认',
    //       cancelButtonText: '取消',
    //       type: 'warning',
    //     }).then(async () => {
    //       const ids = tableData.value.map(row => row.id)
    //       const res = await request.put('/api/process_bom_archive', { ids, archive: 0 });
    //       if(res && res.code == 200){
    //         ElMessage.success('修改成功');
    //         dialogVisible.value = false;
    //         fetchProductList();
    //       }
    //     }).catch(() => {})
    //   }else{
    //     ElMessage.error('暂无数据可存档！');
    //   }
    // }
    // const handleDelete = ({ id }) => {
    //   ElMessageBox.confirm('是否确认删除', '提示', {
    //       confirmButtonText: '确认',
    //       cancelButtonText: '取消',
    //       type: 'warning',
    //     }).then(async () => {
    //       const res = await request.delete('/api/process_bom', { params: { id } });
    //       if(res && res.code == 200){
    //         ElMessage.success('删除成功');
    //         dialogVisible.value = false;
    //         fetchProductList();
    //       }
    //     }).catch(() => {})
    // }
    // const handleUplate = ({ id, product_id, part_id, make_time, children }) => {
    //   edit.value = id;
    //   dialogVisible.value = true;
    //   const filtered = children.filter(item => {
    //     return !Object.values(item).every(isEmptyValue);
    //   });
    //   form.value = { children: filtered, id, product_id, make_time, part_id };
    // }
    // 添加
    // const handleAdd = () => {
    //   edit.value = 0;
    //   dialogVisible.value = true;
    //   resetForm()
    // };
    // 取消弹窗
    // const handleClose = () => {
    //   edit.value = 0;
    //   dialogVisible.value = false;
    //   resetForm()
    // }
    // const resetForm = () => {
    //   form.value = {
    //     product_id: '',
    //     part_id: '',
    //     make_time: '',
    //     children: [
    //       { process_id: '', equipment_id: '', time: '', price: '', long: '' }
    //     ]
    //   }
    // }
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
    const goArchive = () => {
      window.open('/product/process-bom-archive', '_blank')
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
              <div class="flex row-between">
                <div>
                  {/*
                    <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                      添加工艺BOM
                    </ElButton>
                    <ElButton style="margin-top: -5px" type="primary" onClick={ handleArchive } >
                      存档
                    </ElButton>*/
                  }
                </div>
                <div>
                  <ElButton style="margin-top: -5px" type="warning" onClick={ goArchive } >
                    工艺BOM库
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
                  <ElTableColumn prop="make_time" label="制程工时" fixed="left" />
                  {
                    Array.from({ length: maxBomLength.value }).map((_, index) => (
                      <ElTableColumn label={`工序-${index + 1}`} key={index}>
                        <ElTableColumn prop={`children[${index}].process.process_code`} label="工艺编码" />
                        <ElTableColumn prop={`children[${index}].process.process_name`} label="工艺名称" />
                        <ElTableColumn prop={`children[${index}].equipment.equipment_code`} label="设备编码" />
                        <ElTableColumn prop={`children[${index}].equipment.equipment_name`} label="设备名称" />
                        <ElTableColumn prop={`children[${index}].time`} label="单件工时" />
                        <ElTableColumn prop={`children[${index}].price`} label="加工单价" />
                        <ElTableColumn prop={`children[${index}].process.section_points`} label="段数点数" />
                        <ElTableColumn prop={`children[${index}].long`} label="生产制程" />
                      </ElTableColumn>
                    ))
                  }
                  {/* <ElTableColumn label="操作" width="140" fixed="right">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                        <ElButton size="small" type="danger" onClick={ () => handleDelete(scope.row) }>删除</ElButton>
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