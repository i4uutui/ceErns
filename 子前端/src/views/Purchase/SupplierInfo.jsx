import { defineComponent, ref, onMounted, reactive } from 'vue'
import request from '@/utils/request';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const rules = reactive({
      supplier_code: [
        { required: true, message: '请输入供应商编码', trigger: 'blur' },
      ],
      supplier_abbreviation: [
        { required: true, message: '请输入供应商简称', trigger: 'blur' },
      ],
      contact_person: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
      ],
      contact_information: [
        { required: true, message: '请输入联系方式', trigger: 'blur' },
      ],
      supplier_full_name: [
        { required: true, message: '请输入供应商全名', trigger: 'blur' },
      ],
      supplier_address: [
        { required: true, message: '请输入供应商地址', trigger: 'blur' },
      ],
      supplier_category: [
        { required: true, message: '请输入供应商类别', trigger: 'blur' },
      ],
      supply_method: [
        { required: true, message: '请输入供货方式', trigger: 'blur' },
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
      supplier_code: '',
      supplier_abbreviation: '',
      contact_person: '',
      contact_information: '',
      supplier_full_name: '',
      supplier_address: '',
      supplier_category: '',
      supply_method: '',
      transaction_method: '',
      transaction_currency: '',
      other_transaction_terms: '',
    })
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);
    let edit = ref(0)

    onMounted(() => {
      fetchProductList()
    })

    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/supplier_info', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value
        },
      });
      tableData.value = res.data;
      total.value = res.total;
    };
    const handleSubmit = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (valid){
          if(!edit.value){
            const res = await request.post('/api/supplier_info', form.value);
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
            const res = await request.put('/api/supplier_info', myForm);
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
        supplier_code: '',
        supplier_abbreviation: '',
        contact_person: '',
        contact_information: '',
        supplier_full_name: '',
        supplier_address: '',
        supplier_category: '',
        supply_method: '',
        transaction_method: '',
        transaction_currency: '',
        other_transaction_terms: '',
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
              <div class="clearfix">
                <ElButton style="margin-top: -5px" type="primary" v-permission={ 'SupplierInfo:add' } onClick={ handleAdd } >
                  添加供应商
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                  <ElTableColumn prop="supplier_code" label="供应商编码" />
                  <ElTableColumn prop="supplier_abbreviation" label="供应商简称" />
                  <ElTableColumn prop="contact_person" label="联系人" />
                  <ElTableColumn prop="contact_information" label="联系方式" />
                  <ElTableColumn prop="supplier_full_name" label="供应商全名" />
                  <ElTableColumn prop="supplier_address" label="供应商地址" />
                  <ElTableColumn prop="supplier_category" label="供应商类别" />
                  <ElTableColumn prop="supply_method" label="供货方式" />
                  <ElTableColumn prop="transaction_method" label="交易方式" />
                  <ElTableColumn prop="transaction_currency" label="交易币别" />
                  <ElTableColumn prop="other_transaction_terms" label="其它交易条件" />
                  <ElTableColumn prop="created_at" label="创建时间" />
                  <ElTableColumn label="操作" width="140" fixed="right">
                    {(scope) => (
                      <>
                        <ElButton size="small" type="default" v-permission={ 'SupplierInfo:edit' } onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                      </>
                    )}
                  </ElTableColumn>
                </ElTable>
                <ElPagination layout="prev, pager, next, jumper, total" currentPage={ currentPage.value } pageSize={ pageSize.value } total={ total.value } defaultPageSize={ pageSize.value } style={{ justifyContent: 'center', paddingTop: '10px' }} onUpdate:currentPage={ (page) => currentPageChange(page) } onUupdate:pageSize={ (size) => pageSizeChange(size) } />
              </>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改供应商信息' : '添加供应商信息' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="供应商编码" prop="supplier_code">
                  <ElInput v-model={ form.value.supplier_code } placeholder="请输入供应商编码" />
                </ElFormItem>
                <ElFormItem label="供应商简称" prop="supplier_abbreviation">
                  <ElInput v-model={ form.value.supplier_abbreviation } placeholder="请输入供应商简称" />
                </ElFormItem>
                <ElFormItem label="联系人" prop="contact_person">
                  <ElInput v-model={ form.value.contact_person } placeholder="请输入联系人" />
                </ElFormItem>
                <ElFormItem label="联系方式" prop="contact_information">
                  <ElInput v-model={ form.value.contact_information } placeholder="请输入联系方式" />
                </ElFormItem>
                <ElFormItem label="供应商全名" prop="supplier_full_name">
                  <ElInput v-model={ form.value.supplier_full_name } placeholder="请输入供应商全名" />
                </ElFormItem>
                <ElFormItem label="供应商地址" prop="supplier_address">
                  <ElInput v-model={ form.value.supplier_address } placeholder="请输入供应商地址" />
                </ElFormItem>
                <ElFormItem label="供应商类别" prop="supplier_category">
                  <ElInput v-model={ form.value.supplier_category } placeholder="请输入供应商类别" />
                </ElFormItem>
                <ElFormItem label="供货方式" prop="supply_method">
                  <ElInput v-model={ form.value.supply_method } placeholder="请输入供货方式" />
                </ElFormItem>
                <ElFormItem label="交易方式" prop="transaction_method">
                  <ElInput v-model={ form.value.transaction_method } placeholder="请输入交易方式" />
                </ElFormItem>
                <ElFormItem label="交易币别" prop="transaction_currency">
                  <ElInput v-model={ form.value.transaction_currency } placeholder="请输入交易币别" />
                </ElFormItem>
                <ElFormItem label="其它交易条件" prop="other_transaction_terms">
                  <ElInput v-model={ form.value.other_transaction_terms } placeholder="请输入其它交易条件" />
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