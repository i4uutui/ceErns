import { ElButton, ElCard, ElInput, ElMessage, ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, ref, watch, onMounted } from 'vue'
import { numberToChinese } from '@/utils/tool.js'
import { getItem } from "@/assets/js/storage";
import dayjs from "dayjs"
import request from '@/utils/request';
import "@/assets/css/print.scss"

export default defineComponent({
  setup(){
    const user = ref()
    const nowDate = ref()
    let tableData = ref([])
    let supplier_abbreviation = ref('')
    let product_code = ref('')
    let product_name = ref('')
    let notice = ref('')
    let isPrint = ref(false)
    
    const printObj = ref({
      id: "printTable", // 这里是要打印元素的ID
      popTitle: "采购单", // 打印的标题
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
    
    // watch(() => tableData.value, () => {
    //   const tds1 = document.querySelectorAll('#totalTable1 .el-table__footer-wrapper tr>td');
    //   tds1[1].colSpan = 6;
    //   tds1[1].style.textAlign = 'left';
    //   const tds2 = document.querySelectorAll('#totalTable2 .el-table__footer-wrapper tr>td');
    //   tds2[1].colSpan = 6;
    //   tds2[1].style.textAlign = 'left';
    // })
    onMounted(() => {
      user.value = getItem('user')
      nowDate.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    
    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/material_quote', {
        params: {
          page: 1,
          pageSize: 10,
          supplier_abbreviation: supplier_abbreviation.value,
          product_code: product_code.value,
          product_name: product_name.value,
          notice: notice.value,
        },
      });
      tableData.value = res.data;
      if(res.total == 0) return ElMessage.error('数据为空！')
    };
    // 统计合计
    const getSummaries = ({ columns, data }) => {
      const sums = [];
      // 计算product_price的总和
      const totalPrice = data.reduce((sum, item) => {
        return sum + Number(item.quote.product_price);
      }, 0);
      
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 2) {
          sums[index] = totalPrice;
          return;
        }
        if (index === 1) {
          sums[index] = `人民币大写：${numberToChinese(totalPrice)}`;
          return;
        }
      });
      return sums;
    }

    return() => (
      <>
        <ElCard>
          {{
            header: () => (
              <div class="flex">
                <div class="pr10 flex">
                  <span>供应商:</span>
                  <ElInput v-model={ supplier_abbreviation.value } style="width: 160px" placeholder="请输入"/>
                </div>
                <div class="pr10 flex">
                  <span>产品编码:</span>
                  <ElInput v-model={ product_code.value } style="width: 160px" placeholder="请输入"/>
                </div>
                <div class="pr10 flex">
                  <span>产品名称:</span>
                  <ElInput v-model={ product_name.value } style="width: 160px" placeholder="请输入"/>
                </div>
                <div class="pr10 flex">
                  <span>生产订单:</span>
                  <ElInput v-model={ notice.value } style="width: 160px" placeholder="请输入"/>
                </div>
                <div class="pr10">
                  <ElButton style="margin-top: -5px" type="primary" onClick={ fetchProductList }>
                    查询
                  </ElButton>
                  <ElButton style="margin-top: -5px" type="primary">
                    提交
                  </ElButton>
                  <ElButton style="margin-top: -5px" type="primary" v-print={ printObj.value }>
                    打印
                  </ElButton>
                </div>
              </div>
            ),
            default: () => (
              <>
                <div id="totalTable1">
                  <ElTable data={ tableData.value } border stripe style={{ width: "940px" }}>
                    <ElTableColumn prop="material.material_code" label="材料编码" width="120" />
                    <ElTableColumn prop="material.material_name" label="材料名称" width="120" />
                    <ElTableColumn label="型号&规格" width="160">
                      {{
                        default: ({ row }) => {
                          const model = row.material.model
                          const spec = row.material.specification
                          return `${model}&${spec}`;
                        }
                      }}
                    </ElTableColumn>
                    <ElTableColumn prop="material.other_features" label="其它特性" width="120" />
                    <ElTableColumn prop="material.purchase_unit" label="单位" width="100" />
                    <ElTableColumn prop="material.unit_price" label="单价" width="100" />
                    <ElTableColumn prop="number" label="交易数量" width="100" />
                    <ElTableColumn prop="notice.delivery_time" label="交货时间" width="120" />
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
                    <ElTable data={ tableData.value } border stripe style={{ width: "700px" }}>
                      <ElTableColumn prop="material.material_code" label="材料编码" width="80" />
                      <ElTableColumn prop="material.material_name" label="材料名称" width="80" />
                      <ElTableColumn label="型号&规格" width="120">
                        {{
                          default: ({ row }) => {
                            const model = row.material.model
                            const spec = row.material.specification
                            return `${model}&${spec}`;
                          }
                        }}
                      </ElTableColumn>
                      <ElTableColumn prop="material.other_features" label="其它特性" width="100" />
                      <ElTableColumn prop="material.purchase_unit" label="单位" width="60" />
                      <ElTableColumn prop="material.unit_price" label="单价" width="80" />
                      <ElTableColumn prop="number" label="交易数量" width="80" />
                      <ElTableColumn prop="notice.delivery_time" label="交货时间" width="100" />
                    </ElTable>
                    <div id="extraPrintContent" class="flex" style="justify-content: space-between; padding-top: 6px;width: 700px">
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
})