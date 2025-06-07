import { computed, ref, type Ref } from 'vue'

interface UseSelectionType {
  tableRef: any
  rowKey?: string
}

export const useSelection = (params: UseSelectionType) => {
  const selectionColumn = ref<any[]>([])

  const { tableRef, rowKey = 'id' } = params

  //选中的key
  const selectionKey = computed(() => {
    return selectionColumn.value.map((item: any) => item[(rowKey as string) || 'id'])
  })

  // 清空选中项
  const clearSelection = () => {
    selectionColumn.value = []
    tableRef.value?.clearSelection()
  }

  /**
   * 改变选中行
   */
  const handleSelectionChange = (info: Array<any>) => {
    selectionColumn.value = info
  }

  return { selectionKey, selectionColumn, clearSelection, handleSelectionChange }
}
