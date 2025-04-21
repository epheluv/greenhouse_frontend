<template>
  <v-chart :option="heatmapOption" autoresize />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { HeatmapChart } from 'echarts/charts'
import { GridComponent, VisualMapComponent } from 'echarts/components'
import { useSensorStore } from '@/stores/sensorStore'
import axios from 'axios'

use([CanvasRenderer, HeatmapChart, GridComponent, VisualMapComponent])

// 热力图配色方案（调整后）
const HEATMAP_CONFIG = {
  temperature: {
    colors: ['#FFF3DB', '#FFD8A8', '#FFB38A', '#E69575'], // 米白→浅橙→珊瑚粉→砖红
    min: 20,
    max: 40
  },
  humidity: {
    colors: ['#E8F4F8', '#B8D4E3', '#85B2C9', '#4E7C9B'], // 雾白→浅灰蓝→灰蓝→深灰蓝
    min: 30,
    max: 90
  },
  pressure: {
    colors: ['#EDF5E1', '#C7E2C3', '#8EB18A', '#5D8066'], // 浅薄荷→橄榄绿→苔藓绿→深橄榄
    min: 980,
    max: 1040
  },
  co2: {
    colors: ['#F0F0F0', '#C0C4CC', '#909399', '#606266'], // 浅灰→银灰→中灰→炭灰
    min: 400,
    max: 2000
  }
}

const store = useSensorStore()
const heatmapOption = ref({
  title: { text: '区域热力图', left: 'center' },
  tooltip: { position: 'top' },
  grid: { height: '80%', top: '10%' },
  xAxis: { type: 'category', data: ['1', '2'] },
  yAxis: { type: 'category', data: ['D', 'C', 'B', 'A'] },
  visualMap: {
    min: 0,
    max: 100,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '5%'
  },
  series: [{
    type: 'heatmap',
    data: [],
    label: { show: true },
    emphasis: { itemStyle: { shadowBlur: 10 } }
  }]
})

watch(() => store.selectedType, (newType) => {
  const config = HEATMAP_CONFIG[newType]
  heatmapOption.value.visualMap = {
    min: config.min,
    max: config.max,
    inRange: { color: config.colors },
    textStyle: { color: '#666' }
  }
  loadHeatmapData()
})

// 自动更新逻辑
const autoRefresh = ref(true)
let refreshTimer = null

onMounted(() => {
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})

const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    if (autoRefresh.value) loadHeatmapData()
  }, 10000) // 每10秒更新
}

const stopAutoRefresh = () => {
  clearInterval(refreshTimer)
}

const loadHeatmapData = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/sensors/${store.selectedType}`)
    heatmapOption.value.series[0].data = processLatestData(res.data)
  } catch (error) {
    console.error('热力图数据加载失败:', error)
  }
}

// 新数据处理方法
const processLatestData = (latestData) => {
  return latestData.map(item => [
    item.zoneId.charAt(1), // 行号：A/B/C/D
    item.zoneId.charAt(0), // 列号：1/2
    item.value // 最新数值
  ])
}

</script>