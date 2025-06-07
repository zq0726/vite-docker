export interface LoginForm {
  account: string
  password: string
  captcha: string
}

export interface CaptchaRes {
  id: string
  img: string
}
