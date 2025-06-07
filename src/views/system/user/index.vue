<script setup lang="ts">
import { ref } from 'vue'
import { userListApi } from '@/api/user/index'
import type { UserInfo } from '@/api/user/type'
import { BaseTable } from '@/components/BaseTable'
import { columns } from './data'
import UserModel from './components/userModel.vue'

const userModelRef = ref()
const tableData = ref<Array<UserInfo>>([])
const userTableRef = ref()

// 获取用户信息
const getUserInfo = async () => {
  try {
    const { data, total } = await userListApi()
    tableData.value = data
  } catch (error) {}
}
getUserInfo()

const handleAdd = () => {
  console.log('用户新增')
  userModelRef.value.showModel({
    width: '50%',
  })
}

const handleReload = () => {
  userTableRef.value.loadData()
}
</script>

<template>
  <div>
    <BaseTable
      :columns="columns"
      :data="tableData"
      :border="true"
      :show-selection="true"
      :init-fetch="true"
      :fetch-data="userListApi"
      ref="userTableRef"
    >
      <template #table-header>
        <el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
      </template>
      <template #operation>
        <el-button type="primary" link>修改</el-button>
        <el-button type="primary" link>删除</el-button>
      </template>

      <template #test>试一下</template>
    </BaseTable>

    <user-model ref="userModelRef" @success="handleReload" />
  </div>
</template>

<style scoped lang="scss"></style>
