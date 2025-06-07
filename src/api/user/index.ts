import http from '@/utils/http/index'
import type { UserInfo } from './type'
import type { PaginationList } from '@/types/common'

enum Api {
  user = '/user',
}

/**
 * 获取用户列表
 */
export const userListApi = () => http.get<PaginationList<UserInfo>>(Api.user)

/**
 * 新增用户
 */
export const userAddApi = (params: Partial<UserInfo>) => http.post(Api.user, params)
