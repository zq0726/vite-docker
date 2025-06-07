import http from '@/utils/http/index'
import type { CaptchaRes, LoginForm } from './type'

enum Api {
  login = '/user/login',
  captcha = '/user/captcha',
}

/**
 * 登录接口
 * @param params
 * @returns
 */
export const loginApi = (params: LoginForm) =>
  http.post<{ token: string }>(Api.login, params, { showMessage: true })

/**
 * 获取验证码
 * @returns
 */
export const captchaApi = () => http.get<CaptchaRes>(Api.captcha)
