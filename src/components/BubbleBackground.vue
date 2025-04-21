<!-- 在components目录下创建BubbleBackground.vue -->
<template>
  <canvas ref="canvas" class="bubble-canvas"></canvas>
</template>

<script>
export default {
  name: 'BubbleBackground',
  data() {
    return {
      canvas: null,
      ctx: null,
      bubbles: [],
      animationFrameId: null
    }
  },
  mounted() {
    this.initCanvas()
    this.startAnimation()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    cancelAnimationFrame(this.animationFrameId)
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas
      this.ctx = this.canvas.getContext('2d')
      this.resizeCanvas()
    },

    resizeCanvas() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    },

    handleResize() {
      this.resizeCanvas()
    },

    createBubble() {
      return {
        x: Math.random() * this.canvas.width,
        y: this.canvas.height + 50,
        radius: Math.random() * 60 + 2,// 气泡大小范围
        speed: Math.random() * 1.5 + 1,// 上升速度范围
        opacity: Math.random() * 0.5 + 0.5,// 透明度范围
        phase: Math.random() * Math.PI * 2
      }
    },

    updateBubbles() {
      // 随机生成新气泡
      if (Math.random() < 0.1) {
        this.bubbles.push(this.createBubble())
      }

      // 更新气泡位置和状态
      this.bubbles = this.bubbles.filter(bubble => {
        bubble.y -= bubble.speed
        bubble.phase += 0.02
        bubble.x += Math.sin(bubble.phase) * 0.4  // 添加横向摆动
        bubble.radius -= 0.2  // 逐渐缩小

        // 移除超出画布的气泡
        return bubble.y > -20 && bubble.radius > 0.5
      })
    },

    drawBubbles() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.bubbles.forEach(bubble => {
        this.ctx.beginPath()
        this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        this.ctx.fillStyle = `rgba(173, 216, 230, ${bubble.opacity})`
        this.ctx.fill()
      })
    },

    animate() {
      this.updateBubbles()
      this.drawBubbles()
      this.animationFrameId = requestAnimationFrame(this.animate)
    },

    startAnimation() {
      this.animate()
    }
  }
}
</script>

<style scoped>
.bubble-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  /* 确保在内容层下方 */
  pointer-events: none;
  /* 不阻挡鼠标事件 */
}

.bubble-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(
    45deg,
    hsl(210deg 80% 85% / 0.3) 0%,
    hsl(280deg 60% 85% / 0.2) 100%
  );
}
</style>