<template>
  <div class="dashboard">
    <!-- 标题 -->
    <h1 style="color: #2c3e50; text-align: center">智能大棚监控系统</h1>

    <!-- 温度图表 -->
    <div class="chart-container">
      <v-chart :option="temperatureChart" autoresize style="width: 100%; height: 400px" />
    </div>

    <!-- 状态提示 -->
    <div v-if="errorMessage" class="error-alert">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
// 1. ECharts基础配置
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import axios from 'axios'

// 注册必需组件
use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
])

export default {
  components: { VChart },
  data() {
    return {
      // 2. 温度图表配置
      temperatureChart: {
        title: {
          text: '温度变化趋势',
          left: 'center',
          textStyle: {
            color: '#666'
          }
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
            formatter: value => {
              return new Date(value).toLocaleTimeString()
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} ℃'
          }
        },
        series: [{
          name: '温度',
          type: 'line',
          smooth: true,
          itemStyle: { color: '#e74c3c' },
          areaStyle: { color: '#f9ebea' },
          data: []
        }]
      },
      // 3. 错误信息
      errorMessage: '',
      // 4. 轮询定时器
      refreshInterval: null
    }
  },
  async mounted() {
    await this.loadData()
    // 5. 开启自动刷新（每10秒）
    this.refreshInterval = setInterval(this.loadData, 10000)
  },
  beforeUnmount() {
    // 清除定时器
    clearInterval(this.refreshInterval)
  },
  methods: {
    async loadData() {
      try {
        const response = await axios.get('http://localhost:8080/api/temperature')

        // 6. 转换数据格式
        this.temperatureChart.series[0].data = response.data.map(item => ({
          value: [
            // 转换时间戳（假设后端返回ISO格式）
            new Date(item.timestamp).getTime(),
            item.value
          ]
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
/* 7. 基础样式 */
.dashboard {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}

.chart-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
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