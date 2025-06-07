import { defineStore } from 'pinia'
import { computed, reactive, ref, toRefs } from 'vue'

export const useLayout = defineStore('layout', () => {
  // 侧边栏配置
  const menuSetting = reactive({
    uniqueOpened: true,
    isCollapse: false,
  })

  const windowWidth = ref(0) //浏览器宽度
  const platform = computed(() => {
    if (windowWidth.value < 768) {
      return 'mobile'
    }
    if (windowWidth.value >= 768 && windowWidth.value < 992) {
      return 'tablet'
    }
    if (windowWidth.value >= 992 && windowWidth.value < 1200) {
      return 'desktop'
    }
    return 'large-desktop'
  }) //平台

  return { ...toRefs(menuSetting), windowWidth, platform }
})
