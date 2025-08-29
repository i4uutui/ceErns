<template>
  <div class="equipment-table-container">
      <div class="table-wrapper">
        <table class="equipment-table">
          <thead>
            <tr>
              <th class="process-column">制程</th>
              <template v-for="device in maxDevices" :key="device">
                <template v-for="col in 5" :key="`${device}-${col}`">
                  <th :class="['device-column', `device-group-${device % 2 + 1}`]" v-if="col === 1">设备编码</th>
                  <th :class="['device-column', `device-group-${device % 2 + 1}`]" v-if="col === 2">设备名称</th>
                  <th :class="['device-column', `device-group-${device % 2 + 1}`]" v-if="col === 3">设备数量 </th>
                  <th :class="['device-column', `device-group-${device % 2 + 1}`]" v-if="col === 4">工作时长(H) </th>
                  <th :class="['device-column', `device-group-${device % 2 + 1}`]" v-if="col === 5">设备效能 </th>
                </template>
              </template>
              <th class="total-column">负荷极限</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(group, groupIndex) in groupedData" :key="groupIndex">
              <td class="process-column">{{ group.processName }}</td>
              
              <template v-for="(equipment, eqIndex) in group.equipments" :key="eqIndex">
                <td :class="`device-group-${(eqIndex + 1) % 2 + 1}`">{{ equipment.equipment_code }}</td>
                <td :class="`device-group-${(eqIndex + 1) % 2 + 1}`">{{ equipment.equipment_name }}</td>
                <td :class="`device-group-${(eqIndex + 1) % 2 + 1}`">{{ equipment.equipment_quantity }}</td>
                <td :class="`device-group-${(eqIndex + 1) % 2 + 1}`">{{ equipment.working_hours }}</td>
                <td :class="`device-group-${(eqIndex + 1) % 2 + 1}`">{{ equipment.equipment_efficiency }}</td>
              </template>
              
              <template v-for="emptyDevice in (maxDevices - group.equipments.length)" :key="`empty-device-${groupIndex}-${emptyDevice}`">
                <template v-for="col in 5" :key="`empty-${groupIndex}-${emptyDevice}-${col}`">
                  <td :class="`device-group-${(group.equipments.length + emptyDevice) % 2 + 1}`"></td>
                </template>
              </template>
              
              <td class="total-column">
                {{ calculateTotalEfficiency(group.equipments) }}
              </td>
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

const groupedData = computed(() => {
  const groups = {};
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
  
  return Object.values(groups).sort((a, b) => a.processName.localeCompare(b.processName));
});

// 计算最大设备数量，用于确定列数
const maxDevices = computed(() => {
  return Math.max(...groupedData.value.map(group => group.equipments.length), 1);
});

// 计算一组设备的总效能
const calculateTotalEfficiency = (equipments) => {
  return equipments.reduce((total, equipment) => {
    // 确保值是数字，如果是字符串则转换
    const efficiency = Number(equipment.equipment_efficiency) || 0;
    return total + efficiency;
  }, 0);
};
</script>

<style scoped lang="scss">
.equipment-table-container {
  overflow-x: auto;
  .table-wrapper {
    min-width: 800px;
    overflow-x: auto;
    .equipment-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e5e7eb;
      background-color: #fff;
      tr:hover td {
        background-color: #f1f5f9;
      }
      th, td{
        padding: 6px 6px;
        border: 1px solid #e5e7eb;
        text-align: left;
        font-size: 14px;
        width: 350px;
      }
      th {
        font-weight: 600;
        color: #334155;
        white-space: nowrap;
      }
      .device-group-1 {
        background-color: #F3F3F3;
      }
      .device-group-2 {
        background-color: #ffffff;
      }
      .process-column {
        background-color: #f0fdfa;
        font-weight: 600;
        min-width: 100px;
      }
      .total-column {
        background-color: #fff3cd;
        font-weight: bold;
        color: #856404;
        min-width: 120px;
      }
    }
  }
}
@media (max-width: 768px) {
  .equipment-table-container {
    padding: 10px;
    .table-wrapper {
      min-width: 700px;
      .equipment-table{
        th, td{
          padding: 8px 10px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
