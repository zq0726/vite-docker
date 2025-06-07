<script setup lang="ts">
import { computed } from 'vue'
import Aside from './component/aside/aside.vue'
import Header from './component/header/header.vue'
import Footer from './component/footer.vue'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const target = useTemplateRef<HTMLElement>('target')
onClickOutside(target, (event) => {
  console.log(event)
  isCollapse.value = true
})

const { isCollapse, platform } = storeToRefs(useLayout())

const asideWidth = computed(() => (isCollapse.value ? '70px' : '200px'))
const mobileAsideWidth = computed(() => (isCollapse.value ? '0px' : '200px'))
</script>

<template>
  <el-container>
    <el-aside v-if="platform != 'mobile'" :width="asideWidth" :collapse-transition="false">
      <Aside />
    </el-aside>

    <el-aside
      ref="target"
      v-else
      class="mobile-aside"
      :width="mobileAsideWidth"
      :collapse-transition="false"
    >
      <Aside />
    </el-aside>

    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.el-container {
  width: 100vw;
  height: 100vh;

  .el-aside {
    transition: width 0.3s ease;
  }

  .el-header {
    border-bottom: 1px solid var(--el-border-color);
  }

  .el-main {
    background-color: var(--el-bg-color-page);
    padding: 12px;
  }

  .el-footer {
    border-top: 1px solid var(--el-border-color);
    height: 50px;
  }

  .mobile-aside {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;

    height: 100%;
    background-color: var(--el-bg-color);
    transition: width 0.3s ease;
  }
}
</style>
