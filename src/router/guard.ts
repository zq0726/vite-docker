import router from './index'
import { Storage } from '@/utils/storage'
import { TOKEN } from '@/config/constant'

export const routerGuard = () => {
  router.beforeEach((to, from, next) => {
    console.log('routerGuard', to, from)
    const token = Storage.get<string>(TOKEN)

    console.log('token', token)
    console.log('name', to.name)

    if (to.name === 'login' || to.name === 'register') {
      next()
    }

    if (!token) next({ name: 'login' })
    next()
  })
}
