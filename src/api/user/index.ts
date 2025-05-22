import http from '@/http/index'
import type { UserInfo } from './type'

enum Api {
  user = '/user',
}

/**
 * 获取用户列表
 */
export const getUserList = () => http.get<Array<UserInfo>>(Api.user)
