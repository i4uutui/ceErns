import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage } from 'element-plus'
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
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    let edit = ref(0)

    onMounted(() => {
      fetchProductList()
    })

    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/customer_info', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value
        },
      });
      tableData.value = res.data;
      total.value = res.totalPages;
    };
    const handleSubmit = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (valid){
          if(!edit.value){
            const res = await request.post('/api/customer_info', form.value);
            if(res && res.code == 200){
              ElMessage.success('添加成功');
            }
            
          }else{
            // 修改
            const myForm = {
              id: edit.value,
              ...form.value
            }
            const res = await request.put('/api/customer_info', myForm);
            if(res && res.code == 200){
              ElMessage.success('修改成功');
            }
          }
          
          dialogVisible.value = false;
          fetchProductList();
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
      }
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="clearfix">
                <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                  添加客户
                </ElButton>
              </div>
            ),
            default: () => (
              <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                <ElTableColumn prop="customer_code" label="客户编码" />
                <ElTableColumn prop="customer_abbreviation" label="客户简称" />
                <ElTableColumn prop="contact_person" label="联系人" />
                <ElTableColumn prop="contact_information" label="联系方式" />
                <ElTableColumn prop="company_full_name" label="公司全名" />
                <ElTableColumn prop="company_address" label="公司地址" />
                <ElTableColumn prop="delivery_address" label="交货地址" />
                <ElTableColumn prop="tax_registration_number" label="税务登记号" />
                <ElTableColumn prop="transaction_method" label="交易方式" />
                <ElTableColumn prop="transaction_currency" label="交易币别" />
                <ElTableColumn prop="other_transaction_terms" label="其它交易条件" />
                <ElTableColumn label="操作">
                  {(scope) => (
                    <>
                      <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                    </>
                  )}
                </ElTableColumn>
              </ElTable>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改客户信息' : '添加客户信息' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } inline={ true } rules={ rules } label-width="110px">
                <ElFormItem label="客户编码" prop="customer_code">
                  <ElInput v-model={ form.value.customer_code } placeholder="请输入客户编码" />
                </ElFormItem>
                <ElFormItem label="客户简称" prop="customer_abbreviation">
                  <ElInput v-model={ form.value.customer_abbreviation } placeholder="请输入客户简称" />
                </ElFormItem>
                <ElFormItem label="联系人" prop="contact_person">
                  <ElInput v-model={ form.value.contact_person } placeholder="请输入联系人" />
                </ElFormItem>
                <ElFormItem label="联系方式" prop="contact_information">
                  <ElInput v-model={ form.value.contact_information } placeholder="请输入联系方式" />
                </ElFormItem>
                <ElFormItem label="公司全名" prop="company_full_name">
                  <ElInput v-model={ form.value.company_full_name } placeholder="请输入公司全名" />
                </ElFormItem>
                <ElFormItem label="公司地址" prop="company_address">
                  <ElInput v-model={ form.value.company_address } placeholder="请输入公司地址" />
                </ElFormItem>
                <ElFormItem label="交货地址" prop="delivery_address">
                  <ElInput v-model={ form.value.delivery_address } placeholder="请输入交货地址" />
                </ElFormItem>
                <ElFormItem label="税务登记号" prop="tax_registration_number">
                  <ElInput v-model={ form.value.tax_registration_number } placeholder="请输入税务登记号" />
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