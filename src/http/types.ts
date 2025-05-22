export interface ResultData<T = any> {
  code: number
  data: T
  message: string
  [key: string]: any
}
