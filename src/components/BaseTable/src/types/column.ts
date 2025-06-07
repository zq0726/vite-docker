import type { TableColumnCtx } from 'element-plus'

export type ColumnConfig = Partial<TableColumnCtx<any>> & {
  show?: boolean
  slot?: string
  formatter?: (row: any) => string
  showOverflowTooltip?: boolean
}
