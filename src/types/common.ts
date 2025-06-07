export interface PaginationList<T = any> {
  data: T[]
  page: number
  size: number
  total: number
  totalPage: number
}

/**
 * 基础的下拉列表
 */
export interface BaseOption<T = string> {
  label: string
  value: T
}
// 尺寸
export type TableSize = 'large' | 'default' | 'small'
