<template>
  <div class="dashboard">
    <!-- 标题 -->
    <h1 style="color: #2c3e50; text-align: center">智能大棚监控系统</h1>

    <!-- 图表容器 -->
    <div class="charts-container">
      <!-- 温度图表 -->
      <div class="chart-item">
        <v-chart :option="temperatureChart" autoresize style="width: 100%; height: 300px" />
      </div>

      <!-- 湿度图表（折线图） -->
      <div class="chart-item">
        <v-chart :option="humidityChart" autoresize style="width: 100%; height: 300px" />
      </div>

      <!-- 气压图表（柱状图） -->
      <div class="chart-item">
        <v-chart :option="pressureChart" autoresize style="width: 100%; height: 300px" />
      </div>

      <!-- 二氧化碳浓度图表（折线图） -->
      <div class="chart-item">
        <v-chart :option="co2Chart" autoresize style="width: 100%; height: 300px" />
      </div>
    </div>

    <!-- 状态提示 -->
    <div v-if="errorMessage" class="error-alert">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import axios from 'axios'

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  BarChart,
  CanvasRenderer
])

export default {
  components: { VChart },
  data() {
    return {
      // 温度图表配置
      temperatureChart: {
        title: {
          text: '温度变化趋势',
          left: 'center',
          textStyle: { color: '#666' }
        },
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const date = new Date(params[0].value[0])
            return `${date.toLocaleString()}<br/>温度: ${params[0].value[1]}℃`
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            rotate: 45, // 横坐标倾斜45度
            formatter: value => new Date(value).toLocaleTimeString()
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: { 
            formatter: '{value} ℃',
            margin: 10 // 增加纵坐标标签的边距
          }
        },
        grid: {
          left: '10%', // 调整图表的左边界
          right: '10%', // 调整图表的右边界
          bottom: '20%' // 调整图表的底部边界
        },
        series: [
          {
            name: '温度',
            type: 'line',
            smooth: true,
            itemStyle: { color: '#e74c3c' },
            areaStyle: { color: '#f9ebea' },
            data: []
          }
        ]
      },
      // 湿度图表配置（折线图）
      humidityChart: {
        title: {
          text: '湿度变化趋势',
          left: 'center',
          textStyle: { color: '#666' }
        },
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const date = new Date(params[0].value[0])
            return `${date.toLocaleString()}<br/>湿度: ${params[0].value[1]}%`
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            rotate: 45, // 横坐标倾斜45度
            formatter: value => new Date(value).toLocaleTimeString()
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: { 
            formatter: '{value} %',
            margin: 10 // 增加纵坐标标签的边距
          }
        },
        grid: {
          left: '10%', // 调整图表的左边界
          right: '10%', // 调整图表的右边界
          bottom: '20%' // 调整图表的底部边界
        },
        series: [
          {
            name: '湿度',
            type: 'line',
            smooth: true,
            itemStyle: { color: '#3498db' },
            areaStyle: { color: '#d6eaf8' },
            data: []
          }
        ]
      },
      // 气压图表配置（柱状图）
      pressureChart: {
        title: {
          text: '气压变化',
          left: 'center',
          textStyle: { color: '#666' }
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'time',
          axisLabel: {
            rotate: 45, // 横坐标倾斜45度
            formatter: value => new Date(value).toLocaleTimeString()
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: { 
            formatter: '{value} hPa',
            margin: 10 // 增加纵坐标标签的边距
          }
        },
        grid: {
          left: '12%', // 调整图表的左边界
          right: '10%', // 调整图表的右边界
          bottom: '20%' // 调整图表的底部边界
        },
        series: [
          {
            name: '气压',
            type: 'line',
            itemStyle: { color: '#2ecc71' },
            areaStyle: { color: '#ccffcc' },
            data: []
          }
        ]
      },
      // 二氧化碳浓度图表配置（折线图）
      co2Chart: {
        title: {
          text: '二氧化碳浓度变化趋势',
          left: 'center',
          textStyle: { color: '#666' }
        },
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const date = new Date(params[0].value[0])
            return `${date.toLocaleString()}<br/>二氧化碳浓度: ${params[0].value[1]} ppm`
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            rotate: 45, // 横坐标倾斜45度
            formatter: value => new Date(value).toLocaleTimeString()
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: { 
            formatter: '{value} ppm',
            margin: 10 // 增加纵坐标标签的边距
          }
        },
        grid: {
          left: '15%', // 调整图表的左边界
          right: '10%', // 调整图表的右边界
          bottom: '20%' // 调整图表的底部边界
        },
        series: [
          {
            name: '二氧化碳浓度',
            type: 'line',
            smooth: true,
            itemStyle: { color: '#9b59b6' },
            areaStyle: { color: '#f0e4f8' },
            data: []
          }
        ]
      },
      errorMessage: '',
      refreshInterval: null
    }
  },
  async mounted() {
    await this.loadData()
    this.refreshInterval = setInterval(this.loadData, 10000)
  },
  beforeUnmount() {
    clearInterval(this.refreshInterval)
  },
  methods: {
    async loadData() {
      try {
        // 加载温度数据
        const tempResponse = await axios.get('http://localhost:8080/api/temperature')
        this.temperatureChart.series[0].data = tempResponse.data.map(item => ({
          value: [new Date(item.timestamp).getTime(), item.value]
        }))

        // 加载湿度数据
        const humidityResponse = await axios.get('http://localhost:8080/api/humidity')
        this.humidityChart.series[0].data = humidityResponse.data.map(item => ({
          value: [new Date(item.timestamp).getTime(), item.value]
        }))

        // 加载气压数据
        const pressureResponse = await axios.get('http://localhost:8080/api/pressure')
        this.pressureChart.series[0].data = pressureResponse.data.map(item => ({
          value: [new Date(item.timestamp).getTime(), item.value]
        }))

        // 加载二氧化碳浓度数据
        const co2Response = await axios.get('http://localhost:8080/api/co2')
        this.co2Chart.series[0].data = co2Response.data.map(item => ({
          value: [new Date(item.timestamp).getTime(), item.value]
        }))

        this.errorMessage = ''
      } catch (error) {
        console.error('数据加载失败:', error)
        this.errorMessage = `数据更新失败: ${error.message}`
      }
    }
  }
}
</script>

<style>
.dashboard {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.chart-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.error-alert {
  color: #c0392b;
  background: #fadbd8;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}
</style>