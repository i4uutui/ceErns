<template>
  <ElSelect v-model="valueData" :multiple="multiple" filterable remote remote-show-suffix valueKey="id" :placeholder="placeholder" @change="changeSelect">
    <ElOption v-for="(item, index) in option" :value="item.id" :label="item[itemValue]" :key="index">
      <div v-if="arrValue.length">
        <span v-for="(o, idx) in arrValue" :key="idx">
          <span v-if="arrValue.length == idx + 1">{{ getNestedProperty(item, o) }}</span>
          <span v-else>{{ getNestedProperty(item, o) }}:</span>
        </span>
      </div>
      <div v-else>{{ item[itemValue] }}</div>
    </ElOption>
  </ElSelect>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request';

const emit = defineEmits(['change'])
const props = defineProps({
  itemValue: {
    type: String,
    default: ''
  },
  arrValue: {
    type: Array,
    default: () => []
  },
  apiUrl: {
    type: String,
    default: ''
  },
  query: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const valueData = defineModel()

let list = ref([])
let option = ref([])
let timeout = ref(null)

onMounted(() => {
  getList()
})

const getList = async (query) => {
  const res = await request.get(props.apiUrl, {
    params: {
      [props.query]: query ? query : ''
    },
  });
  list.value = res.data
  option.value = res.data
}

const remoteMethod = (query) => {
  // option.value = []
  // if(timeout.value){
  //   clearTimeout(timeout.value)
  //   timeout.value = null
  // }
  // timeout.value = setTimeout(async () => {
  //   if(query){
  //     getList(query)
  //   }else{
  //     list.value = []
  //   }
  //   clearTimeout(timeout.value)
  //   timeout.value = null
  // }, 500)
}
const changeSelect = (value) => {
  // const val = option.value.filter(o => o.id == value)[0]
  // list.value = []
  // emit('change', val)
}
function getNestedProperty(obj, path) {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return undefined;
    }
    result = result[key];
  }
  return result;
}
</script>

