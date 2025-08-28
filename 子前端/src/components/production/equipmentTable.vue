<template>
  <div class="equipment-table-container">
    <!-- 表格容器 -->
    <div class="table-wrapper">
      <table class="equipment-table">
        <thead>
          <tr>
            <th class="process-column">制程</th>
            <!-- 动态生成设备列，每台设备占用5列 -->
            <template v-for="(col, index) in maxDevices * 5" :key="index">
              <th v-if="index % 5 === 0">设备编码</th>
              <th v-if="index % 5 === 1">设备名称</th>
              <th v-if="index % 5 === 2">设备数量</th>
              <th v-if="index % 5 === 3">工作时长</th>
              <th v-if="index % 5 === 4">设备效能</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <!-- 遍历每个制程组 -->
          <tr v-for="(group, groupIndex) in groupedData" :key="groupIndex">
            <td class="process-column">{{ group.processName }}</td>
            
            <!-- 遍历组内的每个设备 -->
            <template v-for="(equipment, eqIndex) in group.equipments" :key="eqIndex">
              <td>{{ equipment.equipment_code }}</td>
              <td>{{ equipment.equipment_name }}</td>
              <td>{{ equipment.equipment_quantity }}</td>
              <td>{{ equipment.working_hours }}</td>
              <td>{{ equipment.equipment_efficiency }}</td>
            </template>
            
            <!-- 填充空白单元格 -->
            <template v-for="(empty, emptyIndex) in (maxDevices - group.equipments.length) * 5" :key="`empty-${groupIndex}-${emptyIndex}`">
              <td></td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  dataValue: Array
})

// 按制程分组数据
const groupedData = computed(() => {
  const groups = {};
  
  // 遍历所有设备，按制程名称分组
  props.dataValue.forEach(equipment => {
    const processName = equipment.cycle.name;
    
    if (!groups[processName]) {
      groups[processName] = {
        processName,
        equipments: []
      };
    }
    
    groups[processName].equipments.push(equipment);
  });
  
  // 转换为数组并排序
  return Object.values(groups).sort((a, b) => a.processName.localeCompare(b.processName));
});

// 计算最大设备数量，用于确定表格列数
const maxDevices = computed(() => {
  return Math.max(...groupedData.value.map(group => group.equipments.length), 1);
});
</script>

<style scoped>
.equipment-table-container {
  padding: 20px;
  overflow-x: auto;
}

.table-wrapper {
  min-width: 800px;
}

.equipment-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
  background-color: #fff;
}

.equipment-table th,
.equipment-table td {
  padding: 12px 15px;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.equipment-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

.equipment-table tr:nth-child(even) {
  background-color: #f8fafc;
}

.equipment-table tr:hover {
  background-color: #f1f5f9;
}

.process-column {
  background-color: #f0fdfa;
  font-weight: 600;
  min-width: 100px;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .equipment-table-container {
    padding: 10px;
  }
  
  .equipment-table th,
  .equipment-table td {
    padding: 8px 10px;
    font-size: 14px;
  }
}
</style>
