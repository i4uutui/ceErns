import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage, ElSwitch, ElCascader, ElCascaderPanel } from 'element-plus'
import request from '@/utils/request';
import router from '@/router';
import { getItem } from '@/assets/js/storage';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const props = reactive({ multiple: true })
    const user = getItem('user')
    let dialogVisible = ref(false)
    let form = ref({
      uid: user.id,
      username: '',
      password: '',
      power: [] // 添加权限字段
    })
    let tableData = ref([])
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    let edit = ref(0)
    let options = ref([])
    let power = ref([])

    onMounted(() => {
      fetchAdminList()
      generateCascaderOptions()
    })

    // 获取子管理员列表
    const fetchAdminList = async () => {
      const res = await request.get('/api/user', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value
        },
      });
      tableData.value = res.data;
      total.value = res.totalPages;
    };
    const handleSubmit = async () => {
      try {
        // 添加
        if(!edit.value){
          form.value.attr = 2
          form.value.company = user.company
          await request.post('/api/user', form.value);
          ElMessage.success('添加成功');
        }else{
          // 修改
          const myForm = {
            id: edit.value,
            username: form.value.username,
            password: form.value.password,
            power: form.value.power,
            status: form.value.status,
            uid: user.id,
            company: user.company,
            attr: 2
          }
          await request.put('/api/user', myForm);
          ElMessage.success('修改成功');
        }
        
        dialogVisible.value = false;
        fetchAdminList();
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '添加失败');
      }
    }
    // 生成级联选择器的选项
    const generateCascaderOptions = () => {
      const { children } = router.options.routes.find(route => route.name === 'Layout');
      const groupedRoutes = {};
      children.forEach(route => {
        const { parent } = route.meta;
        if (!groupedRoutes[parent]) {
          groupedRoutes[parent] = [];
        }
        groupedRoutes[parent].push({
          value: route.name,
          label: route.meta.title,
          children: []
        });
      });
      options.value = Object.entries(groupedRoutes).map(([key, value]) => ({
        value: key,
        label: key,
        children: value
      }));
    }
    const cascaderHandler = (CascaderValue) => {
      form.value.power = JSON.stringify(CascaderValue)
    }
    // 添加管理员
    const handleAdd = () => {
      edit.value = 0;
      dialogVisible.value = true;
      form.value.username = '';
      form.value.password = '';
      form.value.power = []; // 清空权限选择
    };
    // 取消弹窗
    const handleClose = () => {
      edit.value = 0;
      dialogVisible.value = false;
      form.value.username = '';
      form.value.password = '';
      form.value.power = []; // 清空权限选择
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="clearfix">
                <ElButton style="margin-top: -5px" type="primary" onClick={ handleAdd } >
                  添加管理员
                </ElButton>
              </div>
            ),
            default: () => (
              <ElTable data={ tableData.value } border style={{ width: "100%" }}>
                <ElTableColumn prop="date" label="Date" width="180" />
                <ElTableColumn prop="name" label="Name" width="180" />
                <ElTableColumn prop="address" label="Address" />
                <ElTableColumn prop="address" label="Address">
                  <ElSwitch />
                </ElTableColumn>
              </ElTable>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title="添加管理员">
          {{
            default: () => (
              <ElForm model={ form.value } ref="formRef" label-width="80px">
                <ElFormItem label="用户名" prop="username">
                  <ElInput v-model={ form.value.username } />
                </ElFormItem>
                <ElFormItem label="密码" prop="password">
                  <ElInput v-model={ form.value.password } type="password" />
                </ElFormItem>
                <ElFormItem label="菜单权限" prop="power">
                  <ElCascader v-model={ power.value } options={ options.value } props={ props } show-all-levels={ false } collapse-tags={ true } max-collapse-tags={ 1 } onChange={ cascaderHandler }  />
                </ElFormItem>
                <ElFormItem label="状态" prop="status">
                  <ElSwitch v-model={ form.value.status } active-value={ 1 } inactive-value={ 0 } />
                </ElFormItem>
              </ElForm>
            ),
            footer: () => (
              <span class="dialog-footer">
                <ElButton onClick={ handleClose }>取消</ElButton>
                <ElButton type="primary" onClick={ handleSubmit }>确定</ElButton>
              </span>
            )
          }}
        </ElDialog>
      </>
    )
  }
})