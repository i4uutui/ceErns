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
      // product_id: [
      //   { required: true, message: '请选择产品编码', trigger: 'blur' },
      // ],
      // part_id: [
      //   { required: true, message: '请选择部件编码', trigger: 'blur' },
      // ],
      make_time: [
        { required: true, message: '请选择制程工时', trigger: 'blur' },
      ]
    })
    let dialogVisible = ref(false)
    let form = ref({
      product_id: '',
      part_id: '',
      make_time: '',
    })
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);
    let edit = ref(0)

    onMounted(() => {
      fetchProductList()
    })

    const maxBomLength = computed(() => {
      return tableData.value.reduce((max, item) => {
        const currentLength = item.part.process.length;
        return currentLength > max ? currentLength : max;
      }, 0);
    });

    // 处理数据：确保每条记录的 textJson 长度一致（不足的补空对象）
    const processedTableData = computed(() => {
      return tableData.value.map(item => {
        const { part } = item;
        const { process } = part;
        // 计算需要补充的空对象数量
        const needFillCount = maxProcessLength - process.length;
        // 补充空对象（可根据实际需求定义空对象结构）
        const filledProcess = [...process, ...Array(needFillCount).fill({})];
        return {
          ...item,
          part: {
            ...part,
            process: filledProcess
          }
        };
      })
    });
    
    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/process_bom', {
        params: {
          page: 1,
          pageSize: 100,
          archive: 1
        },
      });
      tableData.value = res.data;
      total.value = res.total;
    };
    const handleSubmit = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (valid){
          const low = { ...form.value, archive: 1 }
          low.textJson = JSON.stringify(low.textJson)
          if(!edit.value){
            const res = await request.post('/api/process_bom', low);
            if(res && res.code == 200){
              ElMessage.success('添加成功');
              dialogVisible.value = false;
              fetchProductList();
            }
            
          }else{
            // 修改
            const myForm = {
              id: edit.value,
              ...low
            }
            const res = await request.put('/api/process_bom', myForm);
            if(res && res.code == 200){
              ElMessage.success('修改成功');
              dialogVisible.value = false;
              fetchProductList();
            }
          }
        }
      })
    }
    const handleArchive = () => {
      if(tableData.value.length){
        ElMessageBox.confirm('是否确认存档', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const ids = tableData.value.map(row => row.id)
          const res = await request.put('/api/process_bom_archive', { ids, archive: 0 });
          if(res && res.code == 200){
            ElMessage.success('修改成功');
            dialogVisible.value = false;
            fetchProductList();
          }
        }).catch(() => {})
      }else{
        ElMessage.error('暂无数据可存档！');
      }
    }
    const handleDelete = ({ id }) => {
      ElMessageBox.confirm('是否确认存档', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const res = await request.delete('/api/process_bom', { params: { id } });
          if(res && res.code == 200){
            ElMessage.success('修改成功');
            dialogVisible.value = false;
            fetchProductList();
          }
        }).catch(() => {})
    }
    const handleUplate = ({ id, product_id, part_id, make_time }) => {
      edit.value = id;
      dialogVisible.value = true;
      form.value = { id, product_id, make_time, part_id };
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
        product_id: '',
        part_id: '',
        make_time: '',
      }
    }
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
                  {/* <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                    添加工艺BOM
                  </ElButton> */}
                  <ElButton style="margin-top: -5px" type="primary" onClick={ handleArchive } >
                    存档
                  </ElButton>
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
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }} headerCellStyle={ headerCellStyle } cellStyle={ cellStyle }>
                  <ElTableColumn prop="product.product_code" label="产品编码" fixed="left" />
                  <ElTableColumn prop="product.product_name" label="产品名称" fixed="left" />
                  <ElTableColumn prop="product.drawing" label="工程图号" fixed="left" />
                  <ElTableColumn prop="part.part_code" label="部位编码" fixed="left" />
                  <ElTableColumn prop="part.part_name" label="部位名称" fixed="left" />
                  <ElTableColumn prop="make_time" label="制程工时" fixed="left" />
                  {
                    Array.from({ length: maxBomLength.value }).map((_, index) => (
                      <ElTableColumn label={`工序-${index + 1}`} key={index}>
                        <ElTableColumn prop={`part.process[${index}].process_code`} label="工艺编码" />
                        <ElTableColumn prop={`part.process[${index}].process_name`} label="工艺名称" />
                        <ElTableColumn prop={`part.process[${index}].equipment.equipment_code`} label="设备编码" />
                        <ElTableColumn prop={`part.process[${index}].equipment.equipment_name`} label="设备名称" />
                        <ElTableColumn prop={`part.process[${index}].times`} label="单件工时(分)" />
                        <ElTableColumn prop={`part.process[${index}].price`} label="加工单价" />
                        <ElTableColumn prop={`part.process[${index}].section_points`} label="段数点数" />
                        <ElTableColumn prop={`part.process[${index}].long`} label="生产制程" />
                      </ElTableColumn>
                    ))
                  }
                  <ElTableColumn label="操作" width="140" fixed="right">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                        <ElButton size="small" type="danger" onClick={ () => handleDelete(scope.row) }>删除</ElButton>
                      </>
                    )}
                  </ElTableColumn>
                </ElTable>
                <ElPagination layout="prev, pager, next, jumper, total" currentPage={ currentPage.value } pageSize={ pageSize.value } total={ total.value } defaultPageSize={ pageSize.value } style={{ justifyContent: 'center', paddingTop: '10px' }} onUpdate:currentPage={ (page) => currentPageChange(page) } onUupdate:pageSize={ (size) => pageSizeChange(size) } />
              </>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改工艺BOM信息' : '添加工艺BOM信息' } bodyClass="dialogBodyStyle" onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="产品编码" prop="product_id">
                  <MySelect v-model={ form.value.product_id } apiUrl="/api/getProductsCode" query="product_code" itemValue="product_code" placeholder="请选择产品编码" />
                </ElFormItem>
                <ElFormItem label="部件编码" prop="part_id">
                  <MySelect v-model={ form.value.part_id } apiUrl="/api/getPartCode" query="part_code" itemValue="part_code" placeholder="请选择部件编码" />
                </ElFormItem>
                <ElFormItem label="制程工时" prop="make_time">
                  <ElInput v-model={ form.value.make_time } placeholder="请输入制程工时" />
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