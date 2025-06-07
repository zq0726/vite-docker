<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const { isCollapse } = storeToRefs(useLayout())
const changeCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <div class="header-left">
    <el-icon v-if="isCollapse" @click="changeCollapse"><Expand /></el-icon>
    <el-icon v-else @click="changeCollapse"><Fold /></el-icon>
  </div>
</template>

<style scoped lang="scss">
.header-left {
  font-size: 20px;

  .el-icon {
    cursor: pointer;
  }
}
</style>
