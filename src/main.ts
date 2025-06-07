import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/main.css'
import 'virtual:uno.css'
import 'element-plus/dist/index.css'
import { setupRouter } from './router'
import 'virtual:svg-icons-register'
import globalCom from '@/components/globalCom'

const app = createApp(App)

app.use(createPinia())
app.use(globalCom)
setupRouter(app)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
