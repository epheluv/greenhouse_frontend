<template>
  <div class="home-container">
    <BubbleBackground />

    <div class="hero-section">
      <h1>
        <span class="chinese-stroke">智慧耘境</span>
      </h1>
      <p class="poetic-text">
        <span>观天时于方寸 </span>
        <span>察生机于毫芒</span>
      </p>
      <button @click="router.push('/dashboard')"><span>进入监测</span></button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BubbleBackground from '@/components/BubbleBackground.vue'

const router = useRouter()
</script>

<style scoped>
.home-container {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.hero-section {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 45px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  width: 65%;
  max-width: 700px;

  h1 {
    font-size: 3.3rem;
    margin-bottom: 1.3rem;
    color: #2c3e50;
    font-weight: 500;
    letter-spacing: 2px;
  }

  .poetic-text {
    font-size: 1.4rem;
    margin-bottom: 2.5rem;
    color: #7f8c8d;
    font-weight: 300;
    line-height: 1.6;
  }

  button {
    padding: 15px 45px;
    font-size: 1.15rem;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 10px rgba(44, 62, 80, 0.18);

    &:hover {
      background: #34495e;
      box-shadow: 0 8px 20px rgba(44, 62, 80, 0.25);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>