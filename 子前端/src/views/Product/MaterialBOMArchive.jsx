import { defineComponent, ref, onMounted } from 'vue';
import request from '@/utils/request';

export default defineComponent({
  setup(){
    let tableData = ref([])
    let currentPage = ref(1);
    let pageSize = ref(10);
    let total = ref(0);

    onMounted(() => {
      fetchProductList()
    })
  }
})