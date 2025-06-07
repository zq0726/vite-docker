<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { watch } from 'vue'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const { windowWidth, platform, isCollapse } = storeToRefs(useLayout())
const { width } = useWindowSize()

watch(
  width,
  (newWidth) => {
    windowWidth.value = newWidth
  },
  { immediate: true },
)

watch(platform, (newValue) => {
  if (newValue === 'mobile' || newValue === 'tablet') {
    isCollapse.value = true
  } else {
    isCollapse.value = false
  }
})
</script>

<template>
  <div class="w-full h-full">
    <el-config-provider>
      <RouterView />
    </el-config-provider>
  </div>
</template>

<style lang="scss">
@use '@/assets/scss/base.scss';
</style>
