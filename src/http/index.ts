import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { ResultData } from './types'

// 配置类型增强
interface RequestConfig extends Omit<InternalAxiosRequestConfig, 'headers'> {
  showLoading?: boolean
  hideErrorToast?: boolean
  headers?: AxiosRequestHeaders // 明确headers为可选
}

const config = {
  baseURL: import.meta.env.VITE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

class RequestHttp {
  service: AxiosInstance

  constructor() {
    this.service = axios.create(config)

    // 请求拦截器
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加通用headers
        const token = localStorage.getItem('token')
        if (token) {
          config.headers!.Authorization = `Bearer ${token}`
        }

        // 添加时间戳防止缓存
        if (config.params) {
          config.params = {
            ...config.params,
            _t: Date.now(),
          }
        }

        return config
      },
      (error: AxiosError) => Promise.reject(error),
    )

    // 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, status } = response

        // 统一状态码判断
        if (status >= 200 && status < 300) {
          return data // 兼容两种数据格式
        }

        // 非2xx状态码处理
        return Promise.reject({
          code: data.code || status,
          message: data.message || '请求异常',
          data: data.data || null,
        })
      },
      (error: AxiosError) => {
        const { response, code, message } = error

        // 网络错误处理
        if (!response) {
          return Promise.reject({
            code: code || 'ERR_NETWORK',
            message: message || '网络连接异常',
            data: null,
          })
        }

        // HTTP状态码处理
        const { status, data } = response as AxiosResponse<ResultData>

        let errMsg = data.message || '请求失败'

        switch (status) {
          case 401:
            errMsg = '认证失效，请重新登录'
            // 这里可以添加跳转登录页逻辑
            break
          case 403:
            errMsg = '无权访问'
            break
          case 404:
            errMsg = '接口不存在'
            break
          case 500:
            errMsg = '服务器内部错误'
            break
        }

        return Promise.reject({
          code: data.code || status,
          message: errMsg,
          data: data.data || null,
        })
      },
    )
  }

  // 通用请求方法
  async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: object,
    config?: RequestConfig,
  ): Promise<T> {
    const options: RequestConfig = {
      method,
      url,
      ...config,
      params: method === 'get' ? data : undefined,
      data: method !== 'get' ? data : undefined,
    }

    try {
      const res = await this.service(options)
      return res.data
    } catch (err) {
      if (!config?.hideErrorToast) {
        // 这里可以添加全局错误提示，如ElMessage.error(err.message)
        console.error('请求错误:', err)
      }
      return Promise.reject(err)
    }
  }

  // 方法别名
  get<T>(url: string, params?: object, config?: RequestConfig): Promise<T> {
    return this.request('get', url, params, config)
  }

  post<T>(url: string, data?: object, config?: RequestConfig): Promise<T> {
    return this.request('post', url, data, config)
  }

  put<T>(url: string, data?: object, config?: RequestConfig): Promise<T> {
    return this.request('put', url, data, config)
  }

  delete<T>(url: string, params?: object, config?: RequestConfig): Promise<T> {
    return this.request('delete', url, params, config)
  }
}

const request = new RequestHttp()
export default request
