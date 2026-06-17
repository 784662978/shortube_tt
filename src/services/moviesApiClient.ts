import axios from 'axios'
import MD5 from 'crypto-js/md5'

const API_KEY = 'D8A4A2624D3CED206DFDBA019A53DB72'
const SECRET = 'B1DB31F046AEEBC14049037C268A9FFD'

// 根据环境选择 baseURL：本地开发走 Vite proxy，线上直接请求真实域名
const BASE_URL = import.meta.env.PROD
  ? 'https://api.aipopshort.com'
  : '/movies-api'

/**
 * 生成请求签名
 * 规则：将请求接口的所有参数用 '&' 拼接，末尾拼接 '&secret=xxx'，最后 MD5 加密
 */
function generateSign(params: Record<string, string | number>): string {
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')

  const raw = `${sorted}&secret=${SECRET}`
  return MD5(raw).toString()
}

/**
 * 短剧列表 API 专用 axios 实例
 * 自动注入 X-Api-Key 和 sign 请求头
 */
const moviesApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：注入鉴权头
moviesApiClient.interceptors.request.use(
  (config) => {
    const params = config.params as Record<string, string | number> | undefined
    const sign = generateSign(params || {})
    config.headers['X-Api-Key'] = API_KEY
    config.headers['sign'] = sign
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：解包 + 统一错误处理
moviesApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 线上环境输出详细错误日志，便于排查根因
    if (import.meta.env.PROD) {
      console.error('[MoviesAPI Error]', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
    }
    const message =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      `Request failed (${error.response?.status || 'network error'})`
    return Promise.reject(new Error(message))
  }
)

export default moviesApiClient
