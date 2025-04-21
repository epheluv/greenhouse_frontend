<template>
  <div class="app-container">
    <BubbleBackground />

    <div class="main-content">
      <SensorMenu />

      <div class="dashboard-layout">
        <div class="heatmap-section">
          <SensorHeatmap />
        </div>

        <div class="data-section">
          <ZoneSelector />
          <ZoneLineChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BubbleBackground from '@/components/BubbleBackground.vue'
import SensorMenu from '@/components/controls/SensorMenu.vue'
import SensorHeatmap from '@/components/SensorCharts/SensorHeatmap.vue'
import ZoneLineChart from '@/components/SensorCharts/ZoneLineChart.vue'
import ZoneSelector from '@/components/controls/ZoneSelector.vue'
</script>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
}

.main-content {
  position: relative;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  margin-top: 20px;
}

.heatmap-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 20px;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>