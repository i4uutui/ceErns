import { ElButton, ElCard, ElInput, ElMessage, ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
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
    let customer_abbreviation = ref('')
    let customer_order = ref('')
    let goods_address = ref('')
    let isPrint = ref(false)
    
    const printObj = ref({
      id: "printTable", // 这里是要打印元素的ID
      popTitle: "出货通知单", // 打印的标题
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
    
    watch(() => tableData.value, () => {
      const tds = document.querySelectorAll('#printTable .el-table__footer-wrapper tr>td');
      tds[1].colSpan = 6;
      tds[1].style.textAlign = 'left';
    })
    onMounted(() => {
      user.value = getItem('user')
      nowDate.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
    
    // 获取列表
    const fetchProductList = async () => {
      const res = await request.get('/api/product_notice', {
        params: {
          page: 1,
          pageSize: 10,
          customer_abbreviation: customer_abbreviation.value,
          customer_order: customer_order.value,
          goods_address: goods_address.value
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
                  <span>客户名称:</span>
                  <ElInput v-model={ customer_abbreviation.value } style="width: 240px" placeholder="请输入"/>
                </div>
                <div class="pr10 flex">
                  <span>客户订单号:</span>
                  <ElInput v-model={ customer_order.value } style="width: 240px" placeholder="请输入"/>
                </div>
                <div class="pr10 flex">
                  <span>交货地点:</span>
                  <ElInput v-model={ goods_address.value } style="width: 240px" placeholder="请输入"/>
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
              <div id="printTable">
                <ElTable data={ tableData.value } border stripe style={{ width: "940px" }} summaryMethod={ getSummaries } show-summary>
                  <ElTableColumn prop="product.product_code" label="产品编码" width="120" />
                  <ElTableColumn prop="product.product_name" label="产品名称" width="120" />
                  <ElTableColumn label="型号&规格" width="160">
                    {{
                      default: ({ row }) => {
                        console.log(row)
                        const model = row.product.model
                        const spec = row.product.specification
                        return `${model}&${spec}`;
                      }
                    }}
                  </ElTableColumn>
                  <ElTableColumn prop="product.other_features" label="其它特性" width="120" />
                  <ElTableColumn prop="sale.unit" label="单位" width="100" />
                  <ElTableColumn prop="sale.order_number" label="订单数量" width="100" />
                  <ElTableColumn prop="quote.product_price" label="单价" width="100" />
                  <ElTableColumn label="金额" width="120">
                    {{
                      default: ({ row }) => {
                        const order_number = Number(row.sale.order_number)
                        const product_price = Number(row.quote.product_price)
                        return order_number * product_price
                      }
                    }}
                  </ElTableColumn>
                </ElTable>
                <div id="extraPrintContent" class="flex" style="justify-content: space-between; padding-top: 6px;width: 940px">
                  <div>客户签收：</div>
                  <div>审查：</div>
                  <div>制表：{ user.value?.name }</div>
                  <div>日期：{ nowDate.value }</div>
                </div>
              </div>
            )
          }}
        </ElCard>
      </>
    )
  }
})