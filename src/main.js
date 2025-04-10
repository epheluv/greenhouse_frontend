import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'

// 创建 Vue 应用
const app = createApp(App);

// 创建 Pinia 实例并挂载到 Vue 应用
const pinia = createPinia();
app.use(pinia);

// 挂载 Vue 应用
app.mount('#app');
