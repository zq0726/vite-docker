<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import { useLayout } from '@/stores/layout'
import { storeToRefs } from 'pinia'
import Logo from '../logo.vue'
import menuItem from './menuItem.vue'

const { isCollapse } = storeToRefs(useLayout())

const menuList = reactive([
  {
    index: '1',
    title: '系统管理',
    icon: 'setting',
    children: [
      { index: '1-1', title: '用户管理', url: '/system/user' },
      { index: '1-2', title: '角色管理', url: '/system/role' },
      { index: '1-3', title: '菜单管理', url: '/system/menu' },
      { index: '1-4', title: '部门管理', url: '/system/department' },
    ],
  },
  {
    index: '2',
    title: '客户管理',
    icon: 'grid',
  },
])
</script>

<template>
  <div class="aside-container">
    <Logo />
    <el-menu
      default-active="2"
      :collapse="isCollapse"
      class="el-menu-vertical-demo"
      active-text-color="#ffd04b"
      background-color="#409eff"
      text-color="#fff"
      :collapse-transition="false"
      :unique-opened="true"
    >
      <menuItem :menuList="menuList" />
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: 60px;
  color: white;
  font-size: 16px;
  line-height: 60px;
  text-align: center;
}

.el-menu {
  border: none !important;
}
.aside-container {
  height: 100vh;
  background-color: #409eff;
  overflow-y: hidden;
}

:deep(.el-menu-item-group__title) {
  padding: 0 !important;
  height: 0;
}
</style>
