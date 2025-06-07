import { createRouter, createWebHistory } from 'vue-router'
import { baseRouter } from './routes/base'
import { routerGuard } from './guard'
import type { App } from 'vue'
import { systemRouter } from './routes/system'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRouter, ...systemRouter],
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
  routerGuard()
}

export default router
