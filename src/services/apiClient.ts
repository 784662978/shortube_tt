import axios from 'axios'

// 根据环境选择 baseURL：本地开发走 Vite proxy，线上直接请求真实域名
const BASE_URL = import.meta.env.PROD
  ? 'https://api.aipopshort.com'
  : '/api'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available in the future
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 线上环境输出详细错误日志，便于排查根因
    if (import.meta.env.PROD) {
      console.error('[API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
    }
    const message =
      error.response?.data?.message ||
      `Request failed (${error.response?.status || 'network error'})`
    return Promise.reject(new Error(message))
  }
)

export default apiClient
