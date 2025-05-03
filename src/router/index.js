import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomePage.vue'
import Dashboard from '@/views/DashBoard.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router