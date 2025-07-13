import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElButton, ElCard, ElCascader, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElTable, ElTableColumn } from 'element-plus'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      customer_code: [
        { required: true, message: '请输入客户编码', trigger: 'blur' },
      ],
      customer_abbreviation: [
        { required: true, message: '请输入客户简称', trigger: 'blur' },
      ],
      contact_person: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
      ],
      contact_information: [
        { required: true, message: '请输入联系方式', trigger: 'blur' },
      ],
      company_full_name: [
        { required: true, message: '请输入公司全名', trigger: 'blur' },
      ],
      company_address: [
        { required: true, message: '请输入公司地址', trigger: 'blur' },
      ],
      delivery_address: [
        { required: true, message: '请输入交货地址', trigger: 'blur' },
      ],
      tax_registration_number: [
        { required: true, message: '请输入税务登记号', trigger: 'blur' },
      ],
      transaction_method: [
        { required: true, message: '请输入交易方式', trigger: 'blur' },
      ],
      transaction_currency: [
        { required: true, message: '请输入交易币别', trigger: 'blur' },
      ],
    })
    let dialogVisible = ref(false)
    let form = ref({
      customer_code: '',
      customer_abbreviation: '',
      contact_person: '',
      contact_information: '',
      company_full_name: '',
      company_address: '',
      delivery_address: '',
      tax_registration_number: '',
      transaction_method: '',
      transaction_currency: '',
      other_transaction_terms: '',
    })
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);
    let edit = ref(0)
    let partCode = ref([])
    let materialCode = ref([])
    let propsCascader = ref({
      emitPath: false,
      value: 'id'
    })
    
    onMounted(() => {
      getPartCode()
      getMaterialCode()
      fetchProductList()
    })
    
    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/material_bom', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value
        },
      });
      tableData.value = res.data;
      total.value = res.total;
    };
    const getPartCode = async () => {
      const res = await request.get('/api/getPartCode');
      partCode.value = res.data
    }
    const getMaterialCode = async () => {
      const res = await request.get('/api/getMaterialCode');
      materialCode.value = res.data
    }
    const handleSubmit = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (valid){
          if(!edit.value){
            const res = await request.post('/api/material_bom', form.value);
            if(res && res.code == 200){
              ElMessage.success('添加成功');
              dialogVisible.value = false;
              fetchProductList();
            }
            
          }else{
            // 修改
            const myForm = {
              id: edit.value,
              ...form.value
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
    const handleUplate = (row) => {
      edit.value = row.id;
      dialogVisible.value = true;
      form.value = { ...row };
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
        number: '',
        part_id: '',
        material_id: '',
        model_spec: '',
        other_features: '',
        send_receiving_units: '',
        purchasing_unit: '',
        quantity_used: '',
        loss_rate: '',
        purchase_quantity: '',
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
              <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                添加材料BOM
              </ElButton>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="number" label="序号" />
                  <ElTableColumn prop="part.part_code" label="部位编码" />
                  <ElTableColumn prop="part.part_name" label="部位名称" />
                  <ElTableColumn prop="material.material_code" label="材料编码" />
                  <ElTableColumn prop="material.material_name" label="材料名称" />
                  <ElTableColumn prop="model_spec" label="型号&规格" />
                  <ElTableColumn prop="other_features" label="其它特性" />
                  <ElTableColumn prop="send_receiving_units" label="收发单位" />
                  <ElTableColumn prop="purchasing_unit" label="采购单位" />
                  <ElTableColumn prop="quantity_used" label="使用数量" />
                  <ElTableColumn prop="loss_rate" label="损耗率" />
                  <ElTableColumn prop="purchase_quantity" label="采购数量" />
                  <ElTableColumn prop="created_at" label="创建时间" />
                  <ElTableColumn label="操作" width="140">
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
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改材料BOM信息' : '添加材料BOM信息' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="序号" prop="number">
                  <ElInput v-model={ form.value.number } placeholder="请输入序号" />
                </ElFormItem>
                <ElFormItem label="部件名称" prop="part_id">
                  <ElCascader v-model={ form.value.part_id } placeholder="请选择部件名称" options={ partCode.value } filterable props={ propsCascader.value } />
                </ElFormItem>
                <ElFormItem label="材料名称" prop="material_id">
                  <ElCascader v-model={ form.value.material_id } placeholder="请选择材料名称" options={ materialCode.value } filterable props={ propsCascader.value } />
                </ElFormItem>
                <ElFormItem label="型号&规格" prop="model_spec">
                  <ElInput v-model={ form.value.model_spec } placeholder="请输入型号&规格" />
                </ElFormItem>
                <ElFormItem label="其它特性" prop="other_features">
                  <ElInput v-model={ form.value.other_features } placeholder="请输入其它特性" />
                </ElFormItem>
                <ElFormItem label="收发单位" prop="send_receiving_units">
                  <ElInput v-model={ form.value.send_receiving_units } placeholder="请输入收发单位" />
                </ElFormItem>
                <ElFormItem label="采购单位" prop="purchasing_unit">
                  <ElInput v-model={ form.value.purchasing_unit } placeholder="请输入采购单位" />
                </ElFormItem>
                <ElFormItem label="使用数量" prop="quantity_used">
                  <ElInput v-model={ form.value.quantity_used } placeholder="请输入使用数量" />
                </ElFormItem>
                <ElFormItem label="损耗率" prop="loss_rate">
                  <ElInput v-model={ form.value.loss_rate } placeholder="请输入损耗率" />
                </ElFormItem>
                <ElFormItem label="采购数量" prop="purchase_quantity">
                  <ElInput v-model={ form.value.purchase_quantity } placeholder="请输入采购数量" />
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