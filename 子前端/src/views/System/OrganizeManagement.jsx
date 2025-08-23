import { defineComponent, onMounted, ref, reactive } from 'vue'
import { ElCard, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElOption, ElMessage } from 'element-plus'
import request from '@/utils/request';
import { Vue3TreeOrg } from 'vue3-tree-org';
import "vue3-tree-org/lib/vue3-tree-org.css";
import { getItem } from '@/assets/js/storage';

export default defineComponent({
  setup(){
    const user = getItem('user')
    const formRef = ref(null);
    const rules = reactive({
      label: [
        { required: true, message: '请输入岗位名称', trigger: 'blur' },
      ],
      menber_id: [
        { required: true, message: '请选择用户信息', trigger: 'blur' },
      ]
    })
    let data = ref({})
    let userList = ref([])
    let dialogVisible = ref(false)
    let edit = ref(0)
    let form = ref({
      label: '',
      menber_id: '',
      pid: 0
    })

    onMounted(() => {
      data.value = { id: 0, label: { label: '总经理', menberName: '222' }, children: [] }

      fetchAdminList()
      fetchUserList()
    })

    const fetchAdminList = async () => {
      const res = await request.get('/api/organize');
      data.value.children = res.data.length ? res.data : [];
    };
    const fetchUserList = async () => {
      const res = await request.get('/api/user', {
        params: {
          page: 1,
          pageSize: 200
        }
      });
      userList.value = res.data
    }
    const handleSubmit = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (valid){
          if(!edit.value){
            const res = await request.post('/api/organize', form.value);
            if(res && res.code == 200){
              ElMessage.success('添加成功');
            }
          }else{
            const formData = {
              ...form.value,
              id: edit.value
            }
            const res = await request.put('/api/organize', formData);
            if(res && res.code == 200){
              ElMessage.success('修改成功');
            }
          }
          dialogVisible.value = false;
          fetchAdminList();
        }
      })
    }
    const handleDelete = async (id) => {
      const res = await request.delete('/api/organize', { params: { id } });
      if(res && res.code == 200){
        ElMessage.success('删除成功');
        fetchAdminList();
      }
    }
    // 取消弹窗
    const handleClose = () => {
      edit.value = 0;
      form.value = {
        label: '',
        menber_id: '',
        pid: 0
      };
      dialogVisible.value = false
    }
    const onNodeAdd = (node) => {
      if(user.type != 1) return
      edit.value = 0;
      form.value.pid = node.id
      dialogVisible.value = true
    }
    const onNodeEdit = (node) => {
      if(user.type != 1) return
      edit.value = node.id;
      form.value = {
        pid: node.pid,
        label: node.label?.label,
        menber_id: node.menber_id
      }
      dialogVisible.value = true
    }
    const nodeDelete = (node) => {
      if(user.type != 1) return
      handleDelete(node.id)
    }

    return() => (
      <>
        <ElCard bodyStyle={{ height: "calc(100vh - 144px )" }}>
          <Vue3TreeOrg data={ data.value } collapsable cloneNodeDrag center horizontal={ false } nodeDraggable={ false } defaultExpandLevel={ 1 } defineMenus={[{ name: '新增节点', command: 'add' },{ name: '编辑节点', command: 'edit' },{ name: '删除节点', command: 'delete' }]} labelStyle={{ background: "#fff", color: "#5e6d82", }} nodeAdd={ onNodeAdd } nodeEdit={ onNodeEdit } nodeDelete={ nodeDelete }>
            {{
              default: ({ node }) => (
                <div class="tree-org-node__text node-label">
                  <div class="custom-content">{ node.label?.label }</div>
                  <div style={{ paddingTop: '8px' }}>{ node.label?.menberName }</div>
                </div>
              )
            }}
          </Vue3TreeOrg>
        </ElCard>
        <ElDialog v-model={ dialogVisible.value } title={ edit.value ? '修改节点' : '添加节点' } onClose={ () => handleClose() }>
          {{
            default: () => (
              <>
                <ElForm model={ form.value } ref={ formRef } rules={ rules } label-width="80px">
                  <ElFormItem label="岗位名称" prop="label">
                    <ElInput v-model={ form.value.label } placeholder="请输入岗位名称" />
                  </ElFormItem>
                  <ElFormItem label="用户" prop="menber_id">
                    <ElSelect v-model={ form.value.menber_id } valueKey="id" placeholder="请选择用户">
                      {
                        userList.value.map((row, index) => <ElOption value={ row.id } label={ row.name } key={ index } />)
                      }
                    </ElSelect>
                  </ElFormItem>
                </ElForm>
              </>
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