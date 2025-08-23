import { defineComponent, ref, onMounted, reactive, computed } from 'vue'
import { ElButton, ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElTable, ElTableColumn, ElIcon, ElMessageBox } from 'element-plus'
import { CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import { getRandomString, isEmptyValue } from '@/utils/tool';
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
      material_id: [
        { required: true, message: '请选择材料编码', trigger: 'blur' }
      ],
      number: [
        { required: true, message: '请输入数量', trigger: 'blur' },
      ]
    })
    let dialogVisible = ref(false)
    let form = ref({
      product_id: '',
      part_id: '',
      children: [
        { material_id: '', number: '' }
      ]
    })
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
          if(!edit.value){
            const res = await request.post('/api/material_bom', low);
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
            const res = await request.put('/api/material_bom', myForm);
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
          const res = await request.put('/api/material_bom_archive', { ids, archive: 0 });
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
        const res = await request.delete('/api/material_bom', { params: { id } });
        if(res && res.code == 200){
          ElMessage.success('修改成功');
          dialogVisible.value = false;
          fetchProductList();
        }
      }).catch(() => {})
    }
    const handleUplate = ({ id, product_id, part_id, children }) => {
      edit.value = id;
      dialogVisible.value = true;
      let filtered = children.filter(item => {
        return !Object.values(item).every(isEmptyValue);
      });
      if(!filtered.length) filtered = [{ material_id: '', number: '' }]
      form.value = { product_id, part_id, children: filtered };
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
        children: [
          { material_id: '', number: '' }
        ]
      }
    }
    const handleAddJson = () => {
      const obj = { material_id: '', number: '' }
      form.value.children.push(obj)
    }
    const handledeletedJson = (index) => {
      form.value.children.splice(index, 1)
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
              <div class="flex row-between">
                <div>
                  <ElButton style="margin-top: -5px" type="primary" v-permission={ 'MaterialBOM:add' } onClick={ handleAdd } >
                    添加材料BOM
                  </ElButton>
                  <ElButton style="margin-top: -5px" type="primary" v-permission={ 'MaterialBOM:archive' } onClick={ handleArchive } >
                    存档
                  </ElButton>
                </div>
                <div>
                  <ElButton style="margin-top: -5px" type="warning" v-permission={ 'MaterialBOM:newPage' } onClick={ goArchive } >
                    材料BOM库
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
                        <ElButton size="small" type="default" v-permission={ 'MaterialBOM:edit' } onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                        <ElButton size="small" type="danger" v-permission={ 'MaterialBOM:delete' } onClick={ () => handleDelete(scope.row) }>删除</ElButton>
                      </>
                    )}
                  </ElTableColumn>
                </ElTable>
                <ElPagination layout="prev, pager, next, jumper, total" currentPage={ currentPage.value } pageSize={ pageSize.value } total={ total.value } defaultPageSize={ pageSize.value } style={{ justifyContent: 'center', paddingTop: '10px' }} onUpdate:currentPage={ (page) => currentPageChange(page) } onUupdate:pageSize={ (size) => pageSizeChange(size) } />
              </>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改材料BOM信息' : '添加材料BOM信息' } bodyClass="dialogBodyStyle" onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="产品编码" prop="product_id">
                  <MySelect v-model={ form.value.product_id } apiUrl="/api/getProductsCode" query="product_code" itemValue="product_code" placeholder="请选择产品编码" />
                </ElFormItem>
                <ElFormItem label="部件编码" prop="part_id">
                  <MySelect v-model={ form.value.part_id } apiUrl="/api/getPartCode" query="part_code" itemValue="part_code" placeholder="请选择部件编码" />
                </ElFormItem>
                {
                  form.value.children.map((e, index) => (
                    <Fragment key={ index }>
                      <ElFormItem label="材料编码" prop={ `children[${index}].material_id` } rules={ rules.material_id }>
                        <MySelect v-model={ e.material_id } apiUrl="/api/getMaterialCode" query="material_code" itemValue="material_code" placeholder="请选择材料编码" />
                      </ElFormItem>
                      <ElFormItem label="数量" prop={ `children[${index}].number` } rules={ rules.number }>
                        <div class="flex">
                          <ElInput v-model={ e.number } placeholder="请输入数量" />
                          <div class="flex">
                            {
                              index == form.value.children.length - 1 && index < 20 ? <ElIcon style={{ fontSize: '26px', color: '#409eff', cursor: "pointer" }} onClick={ handleAddJson }><CirclePlusFilled /></ElIcon> : <></>
                            }
                            {
                              index > 0 ? <ElIcon style={{ fontSize: '26px', color: 'red', cursor: "pointer" }} onClick={ () => handledeletedJson(index) }><RemoveFilled /></ElIcon> : <></>
                            }
                          </div>
                        </div>
                      </ElFormItem>
                    </Fragment>
                  ))
                }
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