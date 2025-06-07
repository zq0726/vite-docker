<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { PropsType } from './types/props'
import TableSetting from './components/setting.vue'
import type { TableSize } from '@/types/common'
import type { ElTable } from 'element-plus'
import { useSelection } from './hooks/useSelection'

const props = withDefaults(defineProps<PropsType>(), {
  data: () => [],
  columns: () => [],
  total: 0,
  showPagination: true,
  showIndex: false,
  showSelection: false,
  initFetch: true,
  rowKey: 'id',
  pageSizes: () => [10, 20, 50, 100],
  size: 'default',
})

const tableRef = ref<InstanceType<typeof ElTable>>()
const showIndex = ref(props.showIndex) //是否显示序号
const loading = ref(false)
const tableData = ref<any[]>(props.data || [])
const currentPage = defineModel<number>('currentPage', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })
const emit = defineEmits(['selection-change', 'size-change', 'current-change', 'table-reload'])

const getTableColumn = () => {
  const info = JSON.parse(JSON.stringify(props.columns))

  return info.map((item: any) => {
    if (item.show !== false) {
      item.show = true
    }

    return item
  })
}

const { selectionKey, selectionColumn, clearSelection, handleSelectionChange } = useSelection({
  tableRef,
  rowKey: props?.rowKey ?? 'id',
})

const tableColumn = ref(getTableColumn())
const tableSize = ref<TableSize>('default')

watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      tableData.value = newVal
    }
  },
  { immediate: true },
)

/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.fetchData) return
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      ...props.searchInfo,
    }

    if (props.searchInfo) {
      Object.assign(params, props.searchInfo)
    }

    const res = await props.fetchData(params)
    console.log(333333, res)
    tableData.value = res.data.list || res.data
  } catch (error) {
    console.log('error', error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.initFetch,
  (newV) => {
    if (newV && props.fetchData) {
      loadData()
    }
  },
  { immediate: true },
)

/**
 * 改变每页数量
 */
const handleSizeChange = () => {}

/**
 * 改变当前页码
 */
const handleCurrentChange = () => {}

/**
 * 执行刷新
 */
const handleReload = () => {
  console.log('准备刷新')
  if (props.fetchData) {
    loadData()
  } else {
    emit('table-reload')
  }
}

/**
 * 改变表格尺寸
 */
const changeTableSize = (value: TableSize) => (tableSize.value = value)

onMounted(() => {})
defineExpose({ loadData, selectionKey })
</script>

<template>
  <div class="base-table">
    <div class="table-action">
      <div>
        <slot name="table-header"></slot>
      </div>

      <div class="table-edit">
        <TableSetting
          v-model:tableColumn="tableColumn"
          v-model:showIndex="showIndex"
          @reload="handleReload"
          @changeSize="changeTableSize"
          :columns="columns"
        />
      </div>
    </div>
    <div class="selection-info" v-if="showSelection">
      <el-icon><Warning /></el-icon>
      <span v-if="selectionColumn.length == 0">未选中任何数据</span>
      <div v-else>
        {{ `已选  ${selectionKey.length} 条数据` }}
        <el-button type="primary" link @click="clearSelection"> 清空 </el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      v-bind="$attrs"
      :data="tableData"
      @selection-change="handleSelectionChange"
      :size="tableSize"
      ref="tableRef"
    >
      <el-table-column v-if="showIndex" type="index" width="50" align="center" />
      <el-table-column v-if="showSelection" type="selection" width="50" align="center" />

      <template v-for="col in tableColumn" :key="col.prop">
        <el-table-column v-if="col.show" v-bind="col" :align="col.align || 'center'">
          <!-- 自定义列内容 -->
          <template v-if="col.slot" #default="scope">
            <slot :name="col.slot" :row="scope.row" :index="scope.$index" />
          </template>
        </el-table-column>
      </template>

      <el-table-column
        v-if="$slots.operation"
        label="操作"
        fixed="right"
        width="120"
        align="center"
      >
        <template #default="scope">
          <slot name="operation" :row="scope.row" :index="scope.$index"></slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      v-if="showPagination"
      background
      size="small"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
      layout="sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped lang="scss">
.base-table {
  border: 1px solid var(--el-border-color);
  padding: 12px;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);

  .table-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  :deep(.el-pagination) {
    display: flex;
    justify-content: flex-end !important;
    margin-top: 10px;
  }
}

.selection-info {
  display: flex;
  align-items: center;
  border: 1px solid var(--el-color-primary-light-5);
  padding: 8px 12px;
  margin-bottom: 10px;
  font-size: 14px;
  background-color: var(--el-color-primary-light-8);

  .el-icon {
    margin-right: 6px;
    font-size: 16px;
    color: var(--el-color-primary);
  }

  & > div {
    display: flex;
    align-items: center;
    line-height: 20px;

    .el-button {
      margin-left: 8px;
    }
  }
}

:deep(.el-space__item) {
  &:focus-visible {
    outline: 1px solid transparent;
  }

  svg {
    outline: none !important;
  }
}
</style>
