export interface UserInfo {
  id: number
  account: string
  username: string
  phone: string
  isActive: boolean
  email?: string
  role?: string
  avatar?: string
  createBy?: string
  createAt: string
  updateAt: string
}
