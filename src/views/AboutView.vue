<script setup lang="ts">
import { ref } from 'vue'
import { getUserList } from '@/api/user/index'
import type { UserInfo } from '@/api/user/type'

const data = ref<Array<UserInfo>>([])
const pagination = {
  pageSize: 10,
}

// 修改
const handleEdit = () => {}

// 初始化数据
const initData = async () => {
  console.log(3333333333333)
  try {
    const res = await getUserList()
    console.log('res', res)
    data.value = res
  } catch (error) {
    console.log('有问题', error)
  }
}
initData()
</script>

<template>
  <el-table :data="data" border style="width: 100%" empty-text="--">
    <el-table-column prop="account" align="center" label="账号" />
    <el-table-column prop="username" align="center" label="用户名" />
    <el-table-column prop="phone" align="center" label="手机号" />
    <el-table-column fixed="right" align="center" label="操作">
      <template #default>
        <el-button link type="primary" size="small">详情</el-button>
        <el-button link type="primary" size="small" @click="handleEdit">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.title {
  color: yellow;
  padding: 10px 2px;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
  margin: 0;
  display: flex;
}
</style>
