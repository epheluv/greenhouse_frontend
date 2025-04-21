<template>
  <div class="data-grid">
    <div class="grid-header">
      <span>区域</span>
      <span>当前值</span>
      <span>更新时间</span>
    </div>
    <div class="grid-body">
      <div v-for="item in gridData" :key="item.zoneId" class="grid-row">
        <span class="zone-id">{{ item.zoneId }}</span>
        <span :class="valueClass(item.value)">{{ formattedValue(item.value) }}</span>
        <span>{{ formatTime(item.timestamp) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSensorStore } from '@/stores/sensorStore'
import axios from 'axios'
// 在DataGrid.vue的script部分添加
import { onMounted, onUnmounted } from 'vue'

const refreshInterval = ref(null)

onMounted(() => {
  refreshInterval.value = setInterval(async () => {
    const res = await axios.get(`http://localhost:8080/api/sensors/${store.selectedType}`)
    gridData.value = res.data
  }, 10000)
})

onUnmounted(() => {
  clearInterval(refreshInterval.value)
})

const store = useSensorStore()
const gridData = ref([])

watch(() => store.selectedType, async (newType) => {
  const res = await axios.get(`http://localhost:8080/api/sensors/${newType}`)
  gridData.value = res.data
}, { immediate: true })

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

const formattedValue = (value) => {
  const units = {
    temperature: '℃',
    humidity: '%',
    pressure: 'hPa',
    co2: 'ppm'
  }
  return `${value.toFixed(1)}${units[store.selectedType]}`
}

const valueClass = (value) => {
  if (store.selectedType === 'co2' && value > 1000) return 'danger'
  if (store.selectedType === 'humidity' && value < 40) return 'warning'
  return ''
}
</script>

<style scoped>
.data-grid {
  background: white;
  border-radius: 8px;
  padding: 15px;
  height: 500px;
  overflow-y: auto;
}

.grid-header,
.grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  padding: 10px;
}

.grid-header {
  font-weight: bold;
  border-bottom: 2px solid #eee;
}

.grid-row {
  border-bottom: 1px solid #f5f5f5;

  &:hover {
    background-color: #f9f9f9;
  }
}

.zone-id {
  font-weight: 500;
  color: #2c3e50;
}

.danger {
  color: #e74c3c;
  font-weight: bold;
}

.warning {
  color: #f1c40f;
}
</style>