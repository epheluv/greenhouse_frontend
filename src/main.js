import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'  // 这个应该是带路由出口的容器
import router from './router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(autoAnimatePlugin)

app.mount('#app')