import { defineComponent, ref, onMounted, reactive } from 'vue'
import { ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage, ElSwitch, ElCascader, ElMessageBox } from 'element-plus'
import request from '@/utils/request';
import router from '@/router';
import { getItem } from '@/assets/js/storage';

export default defineComponent({
  setup(){
    const formRef = ref(null);
    const props = reactive({ multiple: true })
    const user = getItem('user')
    const rules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      name: [],
      power: [
        { required: true, message: '请选择用户权限', trigger: 'blur' },
      ]
    })
    let dialogVisible = ref(false)
    let form = ref({
      uid: user.id,
      username: '',
      password: '',
      name: '',
      power: [] // 添加权限字段
    })
    let tableData = ref([])
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    let edit = ref(0)
    let options = ref([])
    let placeholder = ref('')

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
    const handleSubmit = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (valid){
          if(!edit.value){
            form.value.attr = 2
            form.value.company = user.company
            const formValue = {
              ...form.value,
              power: JSON.stringify(form.value.power)
            }
            const res = await request.post('/api/user', formValue);
            if(res && res.code == 200){
              ElMessage.success('添加成功');
            }
            
          }else{
            // 修改
            const myForm = {
              id: edit.value,
              username: form.value.username,
              password: form.value.password,
              name: form.value.name,
              power: JSON.stringify(form.value.power),
              status: form.value.status,
              uid: user.id,
              company: user.company,
              attr: 2
            }
            const res = await request.put('/api/user', myForm);
            if(res && res.code == 200){
              ElMessage.success('修改成功');
            }
          }
          
          dialogVisible.value = false;
          fetchAdminList();
        }
      })
    }
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        "是否确认删除？",
        "提示",
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        const res = await request.delete('/api/user/' + row.id);
        if(res && res.code == 200){
          ElMessage.success('删除成功');
          fetchAdminList();
        }
      }).catch(() => {})
    }
    const closeUser = (row) => {
      form.value = row;
      const power = JSON.parse(row.power)
      form.value.power = power
      edit.value = row.id;
      handleSubmit()
    }
    const handleUplate = (row) => {
      edit.value = row.id;
      placeholder.value = '不输入则默认旧密码'
      dialogVisible.value = true;
      form.value.username = row.username;
      form.value.name = row.name;
      form.value.power = JSON.parse(row.power); // 清空权限选择
      form.value.status = row.status;
      form.value.uid = row.uid;
      form.value.company = row.company;
      
      if(rules.password){
        delete rules.password
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
      let filtered = Object.fromEntries(
        Object.entries(filterMenu(groupedRoutes)).filter(([_, routes]) => routes.length > 0)
      );
      options.value = Object.entries(filtered).map(([key, value]) => ({
        value: key,
        label: key,
        children: value
      }));
    }
    function filterMenu(data) {
      const newData = { ...data }; // 浅拷贝对象
    
      // 遍历所有菜单分类
      Object.keys(newData).forEach(category => {
          // 过滤当前分类下的菜单项
          newData[category] = newData[category].filter(item => 
              item.label !== '用户管理'
          );
      });
      
      return newData;
    }
    // 添加管理员
    const handleAdd = () => {
      edit.value = 0;
      dialogVisible.value = true;
      form.value.username = '';
      form.value.password = '';
      form.value.name = '';
      form.value.power = []; // 清空权限选择

      placeholder.value = '请输入密码'
      rules.password = [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不少于6位', trigger: 'blur' },
      ]
    };
    // 取消弹窗
    const handleClose = () => {
      edit.value = 0;
      dialogVisible.value = false;
      form.value.username = '';
      form.value.password = '';
      form.value.name = '';
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
              <ElTable data={ tableData.value } border stripe style={{ width: "100%" }}>
                <ElTableColumn prop="username" label="用户名" width="180" />
                <ElTableColumn prop="name" label="姓名" width="180" />
                <ElTableColumn prop="status" label="是否开启" width="180">
                  {(scope) => <ElSwitch v-model={ scope.row.status } active-value={ 1 } inactive-value={ 0 } onChange={ () => closeUser(scope.row) } />}
                </ElTableColumn>
                <ElTableColumn prop="created_at" label="创建时间" width="180" />
                <ElTableColumn label="操作">
                  {(scope) => (
                    <>
                      <ElButton size="small" type="default" onClick={ () => handleUplate(scope.row) }>修改</ElButton>
                      <ElButton size="small" type="danger" onClick={ () => handleDelete(scope.row) }>删除</ElButton>
                    </>
                  )}
                </ElTableColumn>
              </ElTable>
            )
          }}
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改管理员' : '添加管理员' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <ElForm model={ form.value } ref={ formRef } rules={ rules } label-width="80px">
                <ElFormItem label="用户名" prop="username">
                  <ElInput v-model={ form.value.username } placeholder="请输入用户名" />
                </ElFormItem>
                <ElFormItem label="密码" prop="password">
                  <ElInput v-model={ form.value.password } type="password" placeholder={ placeholder.value } />
                </ElFormItem>
                <ElFormItem label="姓名" prop="name">
                  <ElInput v-model={ form.value.name } placeholder="请输入姓名" />
                </ElFormItem>
                <ElFormItem label="菜单权限" prop="power">
                  <ElCascader v-model={ form.value.power } options={ options.value } props={ props } show-all-levels={ false } collapse-tags={ true } max-collapse-tags={ 1 } placeholder="请选择用户权限" />
                </ElFormItem>
                <ElFormItem label="是否开启" prop="status">
                  <ElSwitch v-model={ form.value.status } active-value={ 1 } inactive-value={ 0 } />
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