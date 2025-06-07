import type { ColumnConfig } from './column'

interface Params {
  page: number
  size: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}

export interface PropsType {
  data?: any[]
  columns: ColumnConfig[]
  total?: number
  showPagination?: boolean
  showIndex?: boolean
  showSelection?: boolean
  pageSizes?: number[]
  initFetch?: boolean
  rowKey?: string
  fetchData?: (params: Params) => Promise<any> // 异步获取数据
  searchInfo?: Record<string, unknown>
  size?: 'large' | 'default' | 'small'
}
