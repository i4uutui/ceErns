import { defineComponent, ref, onMounted } from 'vue';
import { getItem } from "@/assets/js/storage";
import request from '@/utils/request';
import dayjs from "dayjs"
import "@/assets/css/print.scss"
import MySelect from '@/components/tables/mySelect.vue';

export default defineComponent({
  setup() {
    const statusType = {
      2: '已委外',
      3: '已入库'
    }
    const user = ref()
    const nowDate = ref()
    let supplier_abbreviation = ref('')
    let product_name = ref('')
    let product_code = ref('')
    let notice = ref('')
    let status = ref('')
    let tableData = ref([])
    let isPrint = ref(false)
    let allSelect = ref([])
    let chirmStatus = ref([2, 3])
    
    const printObj = ref({
      id: "printTable", // 这里是要打印元素的ID
      popTitle: "委外加工单", // 打印的标题
      // preview: true, // 是否启动预览模式，默认是false
      zIndex: 20003, // 预览窗口的z-index，默认是20002，最好比默认值更高
      previewBeforeOpenCallback() { console.log('正在加载预览窗口！'); }, // 预览窗口打开之前的callback
      previewOpenCallback() { console.log('已经加载完预览窗口，预览打开了！') }, // 预览窗口打开时的callback
      beforeOpenCallback(vue) {
        console.log('开始打印之前！')
        isPrint.value = true
      }, // 开始打印之前的callback
      openCallback(vue) {
        console.log('监听到了打印窗户弹起了！')
      }, // 调用打印时的callback
      closeCallback() {
        console.log('关闭了打印工具！')
        isPrint.value = false
      }, // 关闭打印的callback(点击弹窗的取消和打印按钮都会触发)
      clickMounted() { console.log('点击v-print绑定的按钮了！') },
    })
    
    onMounted(() => {
      user.value = getItem('user')
      nowDate.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
      fetchProductList()
    })
    
    // 获取列表
    const fetchProductList = async () => {
      const res = await request.post('/api/outsourcing_quote', {
        page: 1,
        pageSize: 100,
        supplier_abbreviation: supplier_abbreviation.value,
        product_name: product_name.value,
        product_code: product_code.value,
        notice: notice.value,
        status: chirmStatus.value
      });
      tableData.value = res.data;
    };
    const setWarehousing = (value) => {
      ElMessage.error('等待实现......')
    }
    // 点击入库按钮
    const handleWarehousing = (row) => {
      const all = [row.id]
      setWarehousing(all)
    }
    // 点击批量入库按钮
    const handleAllWarehousing = () => {
      if(allSelect.value.length == 0) return ElMessage.error('请先选择加工单')
      setWarehousing(allSelect.value)
    }
    // 用户主动多选，然后保存到allSelect
    const handleSelectionChange = (select) => {
      allSelect.value = select.map(e => e.id)
    }
    // 筛选
    const search = () => {
      if(status.value){
        chirmStatus.value = [status.value]
      }else{
        chirmStatus.value = [2, 4]
      }
      fetchProductList()
    }
    const handleDelete = (row) => {
      const index = tableData.value.findIndex(e => e.id == row.id)
      tableData.value.splice(index, 1)
    }
    
    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="flex flex-wrap">
                <div class="pr10 pb20 flex">
                  <span style="width: 90px">供应商名称:</span>
                  <ElInput v-model={ supplier_abbreviation.value } style="width: 160px" placeholder="请输入"/>
                </div>
                <div class="pr10 pb20 flex">
                  <span style="width: 74px">产品编码:</span>
                  <ElInput v-model={ product_code.value } style="width: 160px" placeholder="请输入"/>
                </div>
                <div class="pr10 pb20 flex">
                  <span style="width: 74px">产品名称:</span>
                  <ElInput v-model={ product_name.value } style="width: 160px" placeholder="请输入"/>
                </div>
                <div class="pr10 pb20 flex">
                  <span style="width: 74px">生产订单:</span>
                  <ElInput v-model={ notice.value } style="width: 160px" placeholder="请输入"/>
                </div>
                <div class="pr10 pb20 flex">
                  <span style="width: 54px">状态:</span>
                  <ElSelect v-model={ status.value } multiple={ false } clearable filterable remote remote-show-suffix valueKey="id" placeholder="请选择状态" style="width: 160px">
                    {
                      Object.entries(statusType).map(([value, label]) => ({
                        value: Number(value),
                        label: label
                      })).map((item, index) => <ElOption value={ item.value } label={ item.label } key={ index } />)
                    }
                  </ElSelect>
                </div>
                <div class="pr10 pb20">
                  <ElButton style="margin-top: -5px" type="primary" onClick={ search }>
                    查询
                  </ElButton>
                  <ElButton style="margin-top: -5px" type="primary" v-permission={ 'OutsourcingOrder:print' } v-print={ printObj.value }>
                    委外加工单打印
                  </ElButton>
                  <ElButton style="margin-top: -5px" type="primary" onClick={ handleAllWarehousing } v-permission={ 'OutsourcingOrder:allWareh' }>
                    批量入库
                  </ElButton>
                </div>
              </div>
            ),
            default: () => (
              <>
                <div id="totalTable1">
                  <ElTable data={ tableData.value } border stripe onSelectionChange={ (select) => handleSelectionChange(select) }>
                    <ElTableColumn type="selection" width="55" />
                    <ElTableColumn label="状态" width="120">
                      {({ row }) => <span style="color: red">{ statusType[row.status] }</span>}
                    </ElTableColumn>
                    <ElTableColumn prop="processBom.part.part_code" label="部位编码" width="120" />
                    <ElTableColumn prop="processBom.part.part_name" label="部位名称" width="120" />
                    <ElTableColumn prop="processChildren.process.process_code" label="工艺编码" width="120" />
                    <ElTableColumn prop="processChildren.process.process_name" label="工艺名称" width="120" />
                    <ElTableColumn label="加工要求" width="160">
                      {({ row }) => <ElInput v-model={ row.ment } placeholder="请输入加工要求" />}
                    </ElTableColumn>
                    <ElTableColumn prop="notice.sale.unit" label="单位" width="100" />
                    <ElTableColumn label="委外数量" width="100">
                      {({ row }) => <el-input v-model={ row.number } type='number' placeholder="请输入委外数量" />}
                    </ElTableColumn>
                    <ElTableColumn label="加工单价" width="100">
                      {({ row }) => <el-input v-model={ row.now_price } type="number" placeholder="请输入加工单价" />}
                    </ElTableColumn>
                    <ElTableColumn prop="notice.sale.delivery_time" label="要求交期" width="180" />
                    <ElTableColumn label="操作" width="150" fixed="right">
                      {(scope) => (
                        <>
                          {/*
                          <ElButton size="small" type="default" onClick={ () => handleDelete(scope.row) }>删除</ElButton>
                          */}
                          <ElButton size="small" type="primary" onClick={ () => handleWarehousing(scope.row) } v-permission={ 'OutsourcingOrder:wareh' }>入库</ElButton>
                        </>
                      )}
                    </ElTableColumn>
                  </ElTable>
                  <div id="extraPrintContent" class="flex" style="justify-content: space-between; padding-top: 6px;width: 940px">
                    <div>核准：</div>
                    <div>审查：</div>
                    <div>制表：{ user.value?.name }</div>
                    <div>日期：{ nowDate.value }</div>
                  </div>
                </div>
                <div class="printTable" id='totalTable2'>
                  <div id="printTable">
                    <div class="flex row-between" style="padding: 20px;width: 640px;">
                      <div>
                        供应商:{ supplier_abbreviation.value }
                      </div>
                      <div>
                        产品编码:{ product_code.value }
                      </div>
                      <div>
                        产品名称:{ product_name.value }
                      </div>
                      <div>
                        生产订单:{ notice.value }
                      </div>
                    </div>
                    <ElTable data={ tableData.value } border stripe style={{ width: "780px" }}>
                      <ElTableColumn prop="processBom.part.part_code" label="部位编码" width="80" />
                      <ElTableColumn prop="processBom.part.part_name" label="部位名称" width="80" />
                      <ElTableColumn prop="processChildren.process.process_code" label="工艺编码" width="80" />
                      <ElTableColumn prop="processChildren.process.process_name" label="工艺名称" width="80" />
                      <ElTableColumn prop="ment" label="加工要求" width="100" />
                      <ElTableColumn prop="notice.sale.unit" label="单位" width="80" />
                      <ElTableColumn prop="number" label="委外数量" width="100" />
                      <ElTableColumn prop="price" label="加工单价" width="80" />
                      <ElTableColumn prop="notice.sale.delivery_time" label="要求交期" width="100" />
                    </ElTable>
                    <div id="extraPrintContent" class="flex" style="justify-content: space-between; padding-top: 6px;width: 780px">
                      <div>核准：</div>
                      <div>审查：</div>
                      <div>制表：{ user.value?.name }</div>
                      <div>日期：{ nowDate.value }</div>
                    </div>
                  </div>
                </div>
              </>
            )
          }}
        </ElCard>
      </>
    )
  }
});