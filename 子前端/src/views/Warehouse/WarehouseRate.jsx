import { defineComponent, onMounted, ref } from 'vue'
import { ElCard, ElTabPane, ElTabs } from 'element-plus'
import request from '@/utils/request';

export default defineComponent({
  setup() {
    let tabList = ref([])
    
    onMounted(() => {
      fetchTabList()
    })
    
    // 获取Tab列表
    const fetchTabList = async () => {
      const res = await request.get('/api/warehouse_cycle', {
        params: {
          page: 1,
          pageSize: 100
        },
      });
      tabList.value = res.data;
    };
    const onTabClick = (pane) => {
      const row = tabList.value[pane.index]
      console.log(row)
    }
    
    return() => (
      <>
        <ElCard bodyStyle={{ height: "calc(100vh - 144px )" }}>
          <ElTabs type="card" onTabClick={ (pane, e) => onTabClick(pane, e) }>
            {tabList.value.map((item, index) => (
              <ElTabPane label={ item.name }></ElTabPane>
            ))}
          </ElTabs>
          
        </ElCard>
      </>
    )
  }
})