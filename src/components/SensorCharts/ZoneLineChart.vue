<!-- src/components/SensorCharts/ZoneLineChart.vue -->
<template>
  <div class="chart-container">
    <v-chart :option="chartOption" autoresize />
    <div v-if="loading" class="loading-overlay">加载中...</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import axios from 'axios'
import { useSensorStore } from '@/stores/sensorStore'

use([LineChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])

const store = useSensorStore()
let refreshTimer = null // 新增定时器

// 线图配色方案（调整后）
const colorMap = {
  temperature: '#FF9F7C', // 温度 - 鲑鱼粉
  humidity: '#6C8EB2',    // 湿度 - 灰蓝色
  pressure: '#8AAA79',    // 气压 - 苔藓绿
  co2: '#808080',        // 二氧化碳 - 中灰色
  lightIntensity: '#FFFF00',  // 光照强度 - 纯黄色
};
const yAxisRangeMap = {
  temperature: { min: 0, max: 40 },    // 温度范围
  humidity: { min: 0, max: 100 },      // 湿度范围
  pressure: { min: 900, max: 1100 },   // 气压范围
  co2: { min: 0, max: 1500 },       // 二氧化碳范围
  lightIntensity: { min: 0, max: 100000 }, // 光照强度范围
};

const getUnit = (type) => {
  const units = {
    temperature: '℃',
    humidity: '%',
    pressure: 'hPa',
    co2: 'ppm',
    lightIntensity: 'lux'
  }
  return units[type] || ''
}

const getBaseOption = function () {
  const type = store.selectedType;
  const color = colorMap[type] || '#5470C6'; //默认颜色
  const range = yAxisRangeMap[type] || { min: 0, max: 100 }; // 默认范围

  return {
    title: {
      text: '区域监测趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const date = new Date(params[0].value[0]);
        return `${date.toLocaleString()}<br/>${params[0].marker} ${params[0].seriesName}: ${params[0].value[1]}${getUnit(type)}`;
      },
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        rotate: 45,
        formatter: function (value) {
          return new Date(value).toLocaleTimeString();
        },
      },
    },
    yAxis: {
      type: 'value',
      name: getUnit(type),
      min: range.min,
      max: range.max,
      axisLabel: {
        formatter: (value) => {
          // 大数值格式化
          if (value >= 10000) {
            return `${(value / 1000).toFixed(0)}k`;
          }
          if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}k`;
          }
          return value.toFixed(1);
        },
        margin: 0, // 增加标签边距
      }
    },
    series: [
      {
        name: '监测值',
        type: 'line',
        smooth: true,
        itemStyle: {
          color: color, // 使用对应的颜色
        },
        areaStyle: {
          color: `${color}30`, // 使用半透明颜色
        },
        data: [],
      },
    ],
  };
};

const chartOption = ref(getBaseOption())
const loading = ref(false)

watch(() => [store.selectedType, store.selectedZone], fetchData, { immediate: true })

async function fetchData() {
  if (!store.selectedType || !store.selectedZone) return

  try {
    loading.value = true

    const newOption = getBaseOption()

    const res = await axios.get(`http://localhost:8080/api/sensors/${store.selectedType}`, {
      params: {
        zone: store.selectedZone,
        limit: 20
      }
    })

    // 更新数据和配置
    newOption.series[0].data = res.data.map(item => ({
      value: [item.timestamp, item.value]
    }))

    chartOption.value = newOption // 整体替换配置对象
  } catch (error) {
    console.error('数据加载失败:', error)
  } finally {
    loading.value = false
  }
}

// 新增定时刷新方法
const startAutoRefresh = () => {
  refreshTimer = setInterval(fetchData, 30000) // 每30秒刷新
}

// 生命周期钩子
onMounted(startAutoRefresh)
onUnmounted(() => clearInterval(refreshTimer))

</script>

<style scoped>
.chart-container {
  position: relative;
  background: white;
  border-radius: 8px;
  height: 500px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>