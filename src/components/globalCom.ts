import type { App } from 'vue'
import SvgIcon from './SvgIcon/index.vue'

const componentsConfig = [{ name: 'SvgIcon', component: SvgIcon }]

const addGlobal = () => {
  return {
    install: (app: App) => {
      componentsConfig.forEach((config) => {
        app.component(config.name, config.component)
      })
    },
  }
}

const components = addGlobal()
export default components
