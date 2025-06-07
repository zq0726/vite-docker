<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const { isCollapse } = storeToRefs(useLayout())

import LogoImg from '@/assets/logo.png'
</script>

<template>
  <div class="logo-container">
    <img :src="LogoImg" alt="" srcset="" />
    <div v-if="!isCollapse">学习</div>
  </div>
</template>

<style scoped lang="scss">
.logo-container {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  color: white;
  font-size: 16px;

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
  }
}
</style>
