<template>
    <div class="sensor-menu">
      <div class="menu-item" 
           v-for="type in ['temperature', 'humidity', 'pressure', 'co2']"
           :key="type"
           :class="{ active: store.selectedType === type }"
           @click="store.setSelection(type, store.selectedZone)">
        {{ getTypeName(type) }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { useSensorStore } from '@/stores/sensorStore'
  
  const store = useSensorStore()
  
  const getTypeName = (type) => {
    const names = {
      temperature: '温度监测',
      humidity: '湿度分布',
      pressure: '气压变化',
      co2: 'CO₂浓度'
    }
    return names[type] || type
  }
  </script>
  
  <style scoped>
  .sensor-menu {
    display: flex;
    gap: 15px;
    padding: 20px;
    background: rgba(255,255,255,0.9);
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .menu-item {
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
    
    &:hover {
      background: #f0f0f0;
    }
    
    &.active {
      background: #3498db;
      color: white;
    }
  }
  </style>