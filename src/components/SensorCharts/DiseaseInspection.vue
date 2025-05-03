<template>
  <div class="disease-inspection">
    <svg :width="svgWidth" :height="svgHeight" @mousemove="handleMouseMove">
      <!-- 箭头标记定义 -->
      <defs>
        <marker
          id="arrow"
          markerWidth="10" 
          markerHeight="10"
          refX="19" 
          refY="-135" 
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10" fill="#4a90e2" />
        </marker>
      </defs>

      <!-- 种植道 -->
      <g v-for="(lane, index) in plantingLanes" :key="'lane-' + index">
        <rect 
          :x="lane.x" 
          :y="lane.y" 
          :width="lane.width" 
          :height="lane.height" 
          fill="rgba(114, 177, 118, 0.1)"
          stroke="#72b176" 
          stroke-width="2"
          rx="4"
        />
      </g>

      <!-- 巡检路径 -->
      <path 
        v-for="(path, index) in inspectionPaths" 
        :key="'path-' + index" 
        :d="generatePathD(path)" 
        fill="none"
        stroke="#4a90e2" 
        stroke-width="2"
        stroke-dasharray="5 3"
        marker-end="url(#arrow)"
      />

      <!-- 检测点 -->
      <circle 
        v-for="(point, index) in detectionPoints" 
        :key="'point-' + index" 
        :cx="point.cx" 
        :cy="point.cy"
        r="4" 
        fill="#ff6b6b" 
        class="detection-point"
        @mouseover="handlePointHover(point, $event)" 
        @mouseout="hideTooltip"
      />

      <!-- 信息提示框 -->
      <foreignObject
        v-if="activePoint"
        :x="Math.min(tooltipX, svgWidth - 210)" 
        :y="Math.min(tooltipY, svgHeight - 110)"
        width="200"
        height="200"
        class="tooltip"
      >
        <div class="tooltip-content">
          <h3>检测点详情</h3>
          <p>位置: {{ activePoint.position }}</p>
          <p>病症类型: {{ activePoint.disease }}</p>
          <p>置信度: {{ activePoint.confidence }}%</p>
        </div>
      </foreignObject>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const $api = axios.create({ baseURL: 'http://localhost:8080' })
const svgWidth = 800
const svgHeight = 600

const plantingLanes = ref([])
const inspectionPaths = ref([])
const detectionPoints = ref([])

// 工具提示相关变量
const activePoint = ref(null)  // 当前激活的检测点
const tooltipX = ref(0)        // 提示框X坐标
const tooltipY = ref(0)        // 提示框Y坐标

// 处理鼠标悬停
const handlePointHover = (point, event) => {
  activePoint.value = point
  tooltipX.value = event.offsetX + 10  // 横向偏移10px避免遮挡
  tooltipY.value = event.offsetY + 10  // 纵向偏移10px
}

// 隐藏提示框
const hideTooltip = () => {
  activePoint.value = null
}

// 生成 SVG 路径的 d 属性
const generatePathD = (path) => {
  if (!path?.points?.length) return '';
  
  // 将路径点转换为 SVG 路径命令
  return path.points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L'; // 第一个点用 M（MoveTo），后续用 L（LineTo）
      return `${command}${point.x} ${point.y}`;
    })
    .join(' ');
};

// 加载种植道数据
const loadPlantingLanes = async () => {
    try {
        const res = await $api.get('/api/planting-lanes')
        plantingLanes.value = res.data.map(lane => ({
            x: lane.x,
            y: lane.y,
            width: lane.width || 60,
            height: lane.height || 500
        }))
    } catch (error) {
        console.error('种植道加载失败:', error)
    }
}

// 加载巡检路径数据
const loadInspectionPaths = async () => {
  try {
    const res = await $api.get('/api/inspection-paths');
    inspectionPaths.value = res.data.map(path => ({
      points: path.points.map(p => ({ x: p.x, y: p.y }))
    }));
  } catch (error) {
    console.error('路径加载失败:', error);
  }
};

// 加载检测点数据
const loadDetectionPoints = async () => {
    try {
        const res = await $api.get('/api/detection-points')
        detectionPoints.value = res.data.map(point => ({
            cx: point.cx,
            cy: point.cy,
            position: point.position,
            disease: point.disease,
            confidence: point.confidence
        }))
    } catch (error) {
        console.error('检测点加载失败:', error)
    }
}

onMounted(() => {
    loadPlantingLanes()
    loadInspectionPaths()
    loadDetectionPoints()
})
</script>

<style scoped>
.disease-inspection {
  margin: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 检测点动画 */
.detection-point {
  transition: all 0.3s ease;
  cursor: pointer;
}

.detection-point:hover {
  r: 6;
  fill: #ff4757;
  filter: drop-shadow(0 0 4px rgba(255, 107, 107, 0.5));
}

/* 工具提示优化 */
.tooltip-content {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Helvetica Neue', sans-serif;
}

.tooltip-content h3 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tooltip-content p {
  margin: 6px 0;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 路径动画 */
path {
  transition: opacity 0.3s ease;
}

path:hover {
  opacity: 0.8;
}
</style>