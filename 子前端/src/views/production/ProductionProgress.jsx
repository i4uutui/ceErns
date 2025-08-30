import { defineComponent, onMounted, ref, reactive, computed } from 'vue'
import request from '@/utils/request';
import MySelect from '@/components/tables/mySelect.vue';
import EquipmentTable from '@/components/production/equipmentTable.vue';

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
    let cycle = ref([])
    let uniqueEquipments = ref([])
    
    const maxBomLength = computed(() => {
      if (tableData.value.length === 0) return 0;
      return Math.max(...tableData.value.map(item => item.bom?.children?.length || 0));
    });
    
    const processedTableData = computed(() => {
      return tableData.value.map(item => {
        const bom = { ...item.bom, children: [...(item.bom?.children || [])] };
        const newItem = { ...item, bom };
        
        while (newItem.bom.children.length < maxBomLength.value) {
          newItem.bom.children.push({
            process: {
              process_code: '',
              process_name: '',
              section_points: '',
            },
            equipment: {
              equipment_code: '',
              equipment_name: '',
              cycle: {
                name: ''
              }
            },
            all_time: '',
            all_time: '',
            price: '',
            time: '',
            add_finish: '',
            order_number: ''
          });
        }
        return newItem;
      });
    });
    
    onMounted(() => {
      fetchProductList()
      getProcessCycle()
    })
    
    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/production_progress');
      tableData.value = res.data;
      // 集合equipment并且去重
      uniqueEquipments.value = [...res.data
        .flatMap(item => item?.bom?.children ?? [])
        .map(child => child.equipment)
        .filter(Boolean)
        .reduce((map, equip) => map.set(equip.id, equip), new Map())
        .values()
      ];
    };
    const getProcessCycle = async () => {
      const res = await request.get('/api/getProcessCycle')
      cycle.value = res.data
    }
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
    // 选择生产起始时间
    const dateChange = (value) => {
      console.log(value)
    }
    // 取消弹窗
    const handleClose = () => {
      dialogVisible.value = false;
    }
    const columnLength = 15 // 表示前面不需要颜色的列数
    const headerCellStyle = ({ rowIndex, columnIndex, column, row }) => {
      let cycleLength = cycle.value.length * 3
      if(rowIndex == 1 && columnIndex >= 0 && columnIndex < cycleLength || rowIndex == 0 && columnIndex >= columnLength && columnIndex < columnLength + cycleLength){
        if(rowIndex == 0){
          return { backgroundColor: getColumnStyle(columnIndex, columnLength, 3) }
        }else{
          return { backgroundColor: getColumnStyle(columnIndex, 0, 3) }
        }
      }
      if(rowIndex == 0 && columnIndex == columnLength - 1){
        return { backgroundColor: '#A8EAE4' }
      }
      if(rowIndex == 0 && columnIndex >= columnLength + cycleLength && columnIndex <= row.length - 1 && columnIndex % 2 == 1 || rowIndex == 1 && Math.floor((columnIndex - 1) / 8) % 2 == 0){
        return { backgroundColor: '#fbe1e5' }
      }
    }
    const cellStyle = ({ columnIndex, rowIndex, column }) => {
      if(columnIndex >= columnLength && columnIndex < columnLength + cycle.value.length * 3){
        return { backgroundColor: getColumnStyle(columnIndex, columnLength, 3) }
      }
      if(columnIndex == columnLength - 1){
        return { backgroundColor: '#A8EAE4' }
      }
      if(columnIndex >= columnLength + cycle.value.length * 3 && Math.floor((columnIndex) / 8) % 2 == 0){
        return { backgroundColor: '#fbe1e5' }
      }
    }
    const getColumnStyle = (columnNumber, startNumber, number) => {
      const offset = columnNumber - startNumber;
      const group = Math.floor(offset / number);
      return group % 2 === 0 ? '#C9E4B4' : '#A8EAE4';
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <EquipmentTable dataValue={ uniqueEquipments.value }></EquipmentTable>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%", height: '400px' }} headerCellStyle={ headerCellStyle } cellStyle={ cellStyle }>
                  <ElTableColumn prop="notice.notice" label="生产订单号" width="100" />
                  <ElTableColumn prop="customer.customer_abbreviation" label="客户名称" width="120" />
                  <ElTableColumn prop="customer_order" label="客户订单号" width="120" />
                  <ElTableColumn prop="rece_time" label="接单日期" width="110" />
                  <ElTableColumn prop="product.product_code" label="产品编码" width="100" />
                  <ElTableColumn prop="product.product_name" label="产品名称" width="100" />
                  <ElTableColumn prop="product.drawing" label="工程图号" width="100" />
                  <ElTableColumn prop="remarks" label="生产特别要求" width="170" />
                  <ElTableColumn prop="out_number" label="订单数量" width="100" />
                  <ElTableColumn label="委外/库存数量" width="100" />
                  <ElTableColumn prop="out_number" label="生产数量" width="100" />
                  <ElTableColumn prop="notice.delivery_time" label="客户交期" width="110" />
                  <ElTableColumn prop="part.part_code" label="部件编码" width="110" />
                  <ElTableColumn prop="part.part_name" label="部件名称" width="110" />
                  <ElTableColumn label="预计生产起始时间" width="170">
                    {({row}) => <el-date-picker v-model={ row.start_date } clearable={ false } value-format="YYYY-MM-DD" type="date" placeholder="选择日期" style="width: 140px" onChange={ (value) => dateChange(value) }></el-date-picker>}
                  </ElTableColumn>
                  {cycle.value && Array.isArray(cycle.value) && cycle.value.map((e, index) => (
                    <>
                      <ElTableColumn label={ e.name } width="90" align="center">
                        <ElTableColumn label="预排交期" width="90" align="center" />
                      </ElTableColumn>
                      <ElTableColumn label="最短周期" width="90" align="center">
                        <ElTableColumn label="制程日总负荷" width="90" align="center" />
                      </ElTableColumn>
                      <ElTableColumn label="1" width="90" align="center">
                        <ElTableColumn label="完成数量" width="90" align="center" />
                      </ElTableColumn>
                    </>
                  ))}
                  {
                    Array.from({ length: maxBomLength.value }).map((_, index) => (
                      <ElTableColumn label={`工序-${index + 1}`} key={index} align="center">
                        <ElTableColumn prop={`bom.children[${index}].process.process_code`} label="工艺编码" />
                        <ElTableColumn prop={`bom.children[${index}].process.process_name`} label="工艺名称" />
                        <ElTableColumn prop={`bom.children[${index}].equipment.equipment_name`} label="设备名称" />
                        <ElTableColumn prop={`bom.children[${index}].equipment.cycle.name`} label="生产制程" />
                        <ElTableColumn prop={`bom.children[${index}].all_time`} label="全部工时(H)" />
                        <ElTableColumn prop={`bom.children[${index}].all_load`} label="每日负荷(H)" />
                        <ElTableColumn prop={`bom.children[${index}].add_finish`} label="累计完成" />
                        <ElTableColumn prop={`bom.children[${index}].order_number`} label="订单尾数" />
                      </ElTableColumn>
                    ))
                  }
                  {/*
                    <ElTableColumn label="操作" width="140" fixed="right">
                      {(scope) => (
                        <>
                          <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                        </>
                      )}
                    </ElTableColumn>
                  */}
                </ElTable>
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