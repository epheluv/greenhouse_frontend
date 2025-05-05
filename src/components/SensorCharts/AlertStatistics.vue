<template>
  <div class="alert-stats">
    <div class="stats-header">
      <h3>最近7天告警统计</h3>
      <div class="time-range">{{ timeRange }}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card unresolved">
        <div class="stat-value">{{ stats.unresolved }}</div>
        <div class="stat-label">未解决告警</div>
      </div>
      <div class="stat-card resolved">
        <div class="stat-value">{{ stats.resolved }}</div>
        <div class="stat-label">已解决告警</div>
      </div>
    </div>

    <div class="filters">
      <div class="filter-item modern-select">
        <label>传感器类型：</label>
        <select v-model="selectedSensorType">
          <option value="all">全部</option>
          <option v-for="type in sensorTypes" :key="type" :value="type">
            {{ getTypeName(type) }}
          </option>
        </select>
      </div>
    </div>

    <div class="alert-list" v-if="filteredAlerts.length > 0">
      <div class="alert-item" v-for="alert in filteredAlerts" :key="alert.id">
        
        <div class="alert-meta">
          <span class="zone">{{ alert.zoneId }}</span>
          <span class="type">{{ alert.sensorType }}</span>
          <span class="value">{{ alert.triggerValue }}</span>
        </div>

        <div class="alert-status" :class="alert.status.toLowerCase()">
          {{ alert.status === 'ACTIVE' ? '未解决' : '已解决' }}
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      暂无告警记录
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

const stats = ref({ resolved: 0, unresolved: 0 })
const alerts = ref([])
const timeRange = ref('')

// 新增状态管理
const selectedSensorType = ref('all')
const sensorTypes = ref(['temperature', 'humidity', 'pressure', 'co2', 'lightIntensity'])

// 计算属性处理筛选逻辑
const filteredAlerts = computed(() => {
  if (!alerts.value) return []
  
  return alerts.value.filter(alert => {
    if (selectedSensorType.value === 'all') return true
    return alert.sensorType === selectedSensorType.value
  })
})

// 类型名称映射
const getTypeName = (type) => {
  const names = {
    temperature: '温度',
    humidity: '湿度', 
    pressure: '气压',
    co2: '二氧化碳',
    lightIntensity: '光照'
  }
  return names[type] || type
}

onMounted(async () => {
  try {
    // 获取统计概览
    const statsRes = await axios.get('http://localhost:8080/api/alerts/recent')
    stats.value = statsRes.data

    // 获取告警列表
    const alertsRes = await axios.get('http://localhost:8080/api/alerts/recent/list')
    alerts.value = alertsRes.data

    // 设置时间范围显示
    timeRange.value = `${dayjs().subtract(7, 'day').format('MM/DD')} - ${dayjs().format('MM/DD')}`
  } catch (error) {
    console.error('加载告警数据失败:', error)
  }
})


</script>

<style scoped>
.alert-stats {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
  }

  &.unresolved {
    background: linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(255,107,107,0.05) 100%);
    border: 1px solid rgba(255,107,107,0.15);
    
    &::after { background: #ff6b6b; }
  }

  &.resolved {
    background: linear-gradient(135deg, rgba(114,177,118,0.1) 0%, rgba(114,177,118,0.05) 100%);
    border: 1px solid rgba(114,177,118,0.15);
    
    &::after { background: #72b176; }
  }
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.filter-item select, .sensor-type {
  width: 15%;
  padding: 6px 50px 6px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  font-size: 16px;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.alert-list {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.alert-list::-webkit-scrollbar {
  width: 8px;
}

.alert-list::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
}

.alert-list::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15);
  border-radius: 4px;
}

.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f8f9fa;
  }
}

.alert-meta {
  flex: 1;

  >span {
    display: inline-block;
    margin-right: 20px;
    font-size: 14px;

    &.zone {
      width: 60px;
    }

    &.type {
      width: 100px;
    }

    &.value {
      width: 80px;
    }
  }
}

.alert-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;

  &.active {
    background: #fff3f3;
    color: #ff6b6b;
  }

  &.resolved {
    background: #f0f9eb;
    color: #72b176;
  }
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>