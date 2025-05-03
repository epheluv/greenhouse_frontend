<template>
  <div class="app-container">
    <SideBar />

    <div class="main-content">
      <BubbleBackground />

      <!-- 根据视图类型显示不同内容 -->
      <Transition name="fade" mode="out-in">
        <template v-if="store.selectedView === 'sensor'">
          <div class="dashboard-layout">
            <div class="heatmap-section">
              <SensorHeatmap />
            </div>
            <div class="data-section">
              <ZoneSelector />
              <ZoneLineChart />
            </div>
          </div>
        </template>

        <template v-else-if="store.selectedView === 'disease'">
          <DiseaseInspection />
        </template>

        <template v-else-if="store.selectedView === 'alerts'">
          <AlertStatistics />
        </template>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/layout/SideBar.vue'
import DiseaseInspection from '@/components/SensorCharts/DiseaseInspection.vue' // 导入新组件
import SensorHeatmap from '@/components/SensorCharts/SensorHeatmap.vue'
import ZoneLineChart from '@/components/SensorCharts/ZoneLineChart.vue'
import ZoneSelector from '@/components/controls/ZoneSelector.vue'
import { useSensorStore } from '@/stores/sensorStore'
import AlertStatistics from '@/components/SensorCharts/AlertStatistics.vue'
import BubbleBackground from '@/components/BubbleBackground.vue'

const store = useSensorStore() // 必须显式获取 store 实例
</script>

<style>
/* 全局样式 */
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  /* 禁止全局滚动 */
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  /* 侧边栏宽度 */
  padding: 30px 20px;
  position: relative;
}


.bubble-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  /* 位于主内容之下 */
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  margin-top: 30px;
}

/* 浅色玻璃拟态 */
.heatmap-section {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.data-section {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 改良的卡片样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  border-radius: 14px;
  padding: 20px;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.05),
    0 2px 8px rgba(0, 0, 0, 0.03);
}

/* 字体与色彩调整 */
.app-container {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: hsl(240deg 10% 30%);
}

/* 浅色滚动条 */
::-webkit-scrollbar {
  width: 8px;
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

/* 响应式优化 */
@media (max-width: 1024px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .glass-card {
    padding: 16px;
  }
}

/* 新增装饰元素 */
.main-content::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle at 50% 50%,
      rgba(200, 220, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
}
</style>