import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

const app = createApp(App)

// 必须优先注册 Pinia
const pinia = createPinia()
app.use(pinia)

// 后注册其他插件
app.use(autoAnimatePlugin)

app.mount('#app')