<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import headerLeft from './headerLeft.vue'
</script>

<template>
  <div class="flex items-center h-full justify-between">
    <div class="">
      <headerLeft />
    </div>
    <div class="header-right">右侧</div>
  </div>
</template>

<style scoped lang="scss">
.header-box {
  display: flex;
  justify-content: space-between;
}
</style>
