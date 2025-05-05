<template>
  <div class="sideBar">
    <div class="logo">🌱 智能温室</div>

    <div class="menu">
      <!-- 传感器菜单 -->
      <div class="menu-group">
        <div class="menu-title" @click="toggleSensorMenu">
          <span>传感器监测</span>
          <span class="arrow">{{ isSensorMenuOpen ? '▼' : '▶' }}</span>
        </div>
        <Transition name="slide">
          <div v-show="isSensorMenuOpen" class="submenu">
            <div v-for="type in sensorTypes" :key="type"
              :class="{ active: store.selectedType === type && store.selectedView === 'sensor' }"
              @click="selectSensor(type)">
              {{ getTypeName(type) }}
            </div>
          </div>
        </Transition>
      </div>

      <!-- 其他菜单项 -->
      <div class="menu-item" :class="{ active: store.selectedView === 'disease' }" @click="store.setView('disease')">
        病斑巡检
      </div>
      <div class="menu-item" :class="{ active: store.selectedView === 'alerts' }" @click="store.setView('alerts')">
        告警统计
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSensorStore } from '@/stores/sensorStore'

const store = useSensorStore()
const isSensorMenuOpen = ref(true)
const sensorTypes = ['temperature', 'humidity', 'pressure', 'co2', 'lightIntensity']

const toggleSensorMenu = () => {
  isSensorMenuOpen.value = !isSensorMenuOpen.value
}

const selectSensor = (type) => {
  store.setView('sensor')
  store.setSelection(type, store.selectedZone)
}

const getTypeName = (type) => {
  const names = {
    temperature: '温度监测',
    humidity: '湿度分布',
    pressure: '气压变化',
    co2: 'CO₂浓度',
    lightIntensity: '光照强度'
  }
  return names[type] || type
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.logo {
  font-size: 1rem;
  font-weight: bold;
  padding: 15px;
  margin-bottom: 30px;
  color: #2c3e50;
}

.menu-group {
  margin-bottom: 15px;
}

.menu-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    background: rgba(52, 152, 219, 0.1);
  }
}

.submenu {
  margin-left: 20px;
  overflow: hidden;
}

.menu-item,
.submenu div {
  padding: 12px;
  margin: 5px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(52, 152, 219, 0.1);
  }

  &.active {
    background: #3498db;
    color: white;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>