<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { BaseOption, TableSize } from '@/types/common'
import draggable from 'vuedraggable'

const emit = defineEmits(['reload', 'changeSize', 'showIndex'])
const props = defineProps(['columns'])

// #region
// 执行刷新
const handleReload = () => {
  console.log('执行刷新')
  emit('reload')
}
// #endregion

// #region
// 改变表格尺寸
const activeItem = ref('default')
const tableSize: Array<BaseOption<TableSize>> = [
  { label: '大', value: 'large' },
  { label: '默认', value: 'default' },
  { label: '小', value: 'small' },
]
const changeSize = (value: TableSize) => {
  console.log('value', value)
  activeItem.value = value

  emit('changeSize', value)
}
// #endregion

// #region 显示的行
const tableColumn = defineModel<any>('tableColumn')
//显示序号
const showIndex = defineModel<boolean>('showIndex')
//全部显示
const checkAll = ref<boolean>(false)
//展示部分列
const indeterminate = ref<boolean>(true)
//选择全部
const changeAllSelect = (type: boolean) => {
  for (const item of tableColumn.value) {
    // item.show = !item.show
    if (type) {
      item.show = true
    } else {
      item.show = false
    }
  }
}

//固定位置
const toFixed = (index: number, position: 'left' | 'right') => {
  if (tableColumn.value[index]['fixed'] === position) {
    delete tableColumn.value[index]['fixed']
  } else {
    tableColumn.value[index]['fixed'] = position
  }
}

//重置
const reset = () => {
  const info = props.columns.map((item: any) => {
    if (item.show !== false) {
      item.show = true
    }
    return item
  })

  tableColumn.value = JSON.parse(JSON.stringify(info))
}

watch(
  () => tableColumn,
  (newV) => {
    console.log('newV', newV.value)
    if (newV.value.every((item: any) => item.show === true)) {
      checkAll.value = true
      indeterminate.value = false
      return
    }
    if (newV.value.every((item: any) => item.show === false)) {
      checkAll.value = false
      indeterminate.value = false
      return
    }
    indeterminate.value = true
  },
  {
    deep: true,
    immediate: true,
  },
)

// #endregion
</script>

<template>
  <div>
    <el-space>
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-icon @click="handleReload"><RefreshLeft /></el-icon>
      </el-tooltip>

      <el-tooltip effect="dark" content="密度" placement="top">
        <el-dropdown trigger="click" :teleported="false" placement="bottom">
          <svg-icon iconClass="density" class="density-icon" />

          <template #dropdown>
            <el-dropdown-item
              @click="changeSize(item.value)"
              :class="{ 'active-item': activeItem === item.value }"
              v-for="item in tableSize"
              :key="item.value"
              >{{ item.label }}</el-dropdown-item
            >
          </template>
        </el-dropdown>
      </el-tooltip>

      <el-tooltip effect="dark" content="设置" placement="top">
        <el-popover
          placement="bottom-end"
          :popper-style="{
            padding: 0,
          }"
          :width="280"
          trigger="click"
        >
          <template #reference>
            <el-icon><Setting /></el-icon>
          </template>
          <div class="popover-content">
            <div class="header flex items-center justify-between p-x-[10px]">
              <el-checkbox
                @change="changeAllSelect"
                :indeterminate="indeterminate"
                v-model="checkAll"
                label="列展示"
              />

              <el-checkbox v-model="showIndex" label="序号列" />
            </div>
            <draggable
              tag="ul"
              :list="tableColumn"
              class="main p-x-[10px]"
              handle=".handle"
              item-key="prop"
            >
              <template #item="{ element, index }">
                <li class="main-item">
                  <div class="main-item-left">
                    <el-icon class="handle"><Rank /></el-icon>
                    <el-checkbox :label="element.label" v-model="element.show" />
                    <div>{{ element.hidden }}</div>
                  </div>

                  <div class="main-item-right">
                    <svg-icon
                      iconClass="fixedLeft"
                      @click="toFixed(index, 'left')"
                      class="fixed-left m-r-[10px]"
                      :class="{ 'is-active': element.fixed === 'left' }"
                    />
                    <svg-icon
                      iconClass="fixedLeft"
                      @click="toFixed(index, 'right')"
                      class="fixed-right"
                      :class="{ 'is-active': element.fixed === 'right' }"
                    />
                  </div>
                </li>
              </template>
            </draggable>

            <div class="footer flex items-center p-x-[10px] justify-end">
              <el-button size="small" @click="reset">重置</el-button>
              <el-button size="small" type="primary">保存</el-button>
            </div>
          </div>
        </el-popover>
      </el-tooltip>
    </el-space>
  </div>
</template>

<style scoped lang="scss">
$padding: 10px;
.el-icon,
.svg-icon {
  font-size: 20px;
  cursor: pointer;
  color: var(--el-text-color-regular);
}

.popover-content {
  position: relative;
  max-height: 300px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .header {
    border-bottom: 1px solid var(--el-border-color);
  }

  .main {
    flex: 1;
    padding: $padding calc($padding + 4px);
    color: var(--el-text-color-regular);
    overflow-y: auto;
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-left {
        display: flex;
        justify-content: center;
        align-items: center;

        .el-icon {
          margin-right: 5px;
          font-size: 14px;
        }
      }

      &-right {
        .fixed-right,
        .fixed-left {
          color: var(--el-text-color-secondary);
          font-size: 19px;
        }
        .fixed-right {
          transform: rotateZ(180deg);
        }

        .is-active {
          color: var(--el-color-primary) !important;
        }
      }
    }
  }

  .footer {
    padding: 5px;
    border-top: 1px solid var(--el-border-color);
  }
}

:deep(.active-item) {
  background-color: var(--el-menu-active-color);
  color: white;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  justify-content: center;
}
</style>
