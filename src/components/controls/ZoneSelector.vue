<template>
  <div class="zone-grid">
    <div v-for="(row, rowIndex) in zoneMatrix" :key="rowIndex" class="zone-row">
      <div v-for="zone in row" :key="zone" class="zone-cell" :class="{ active: store.selectedZone === zone }"
        @click="store.setSelection(store.selectedType, zone)">
        {{ zone }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSensorStore } from '@/stores/sensorStore'

const store = useSensorStore()

// 生成2x4网格区域
const zoneMatrix = [
  ['A1', 'A2'],
  ['B1', 'B2'],
  ['C1', 'C2'],
  ['D1', 'D2']
]
</script>

<style scoped>
.zone-grid {
  background: white;
  border-radius: 8px;
  padding: 10px;
}

.zone-row {
  display: flex;
  gap: 10px;
  margin: 5px 0;
}

.zone-cell {
  flex: 1;
  text-align: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3498db;
    background: #f0f8ff;
  }

  &.active {
    background: #3498db;
    color: white;
    border-color: #2980b9;
  }
}
</style>