<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps(['menuList'])

const goPath = (path: string) => {
  router.push({
    path,
  })
}
</script>

<template>
  <template v-for="item in menuList" :key="item.index">
    <el-sub-menu v-if="item.children" :index="item.index">
      <template #title>
        <el-icon v-if="item.icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </template>
      <menuItem v-for="child in item.children" :key="child.index" :menuList="[child]" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.index" @click="goPath(item.url)">
      <el-icon v-if="item.icon">
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </template>
</template>

<style scoped lang="scss">
:deep(.el-menu-item-group__title) {
  padding: 0;
}
</style>
