<!-- AlertStatistics.vue -->
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

    <div class="alert-list" v-if="alerts.length > 0">
      <div class="alert-item" v-for="alert in alerts" :key="alert.id">
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

const stats = ref({ resolved: 0, unresolved: 0 })
const alerts = ref([])
const timeRange = ref('')

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
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;

  &.unresolved {
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
  }

  &.resolved {
    background: rgba(114, 177, 118, 0.1);
    border: 1px solid rgba(114, 177, 118, 0.3);
  }
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.alert-list {
  border-top: 1px solid #eee;
  padding-top: 20px;
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