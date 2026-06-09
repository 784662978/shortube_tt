/** 短剧列表 API 返回的单条数据项 */
export interface MovieItem {
  id: string
  title: string
  description: string
  languagecode: string
  coverimage: string
  coverimagehd: string
  episodes: string
  viewcount: number
  outlock: string
  labels: string
  category: string
  duration: string
  enable: number
  created_at: string
  updated_at: string
}

/** 短剧列表 API 的 response 字段 */
export interface MoviesResponseData {
  page: number
  pageCount: number
  dataCount: number
  pageSize: number
  data: MovieItem[]
}

/** 短剧列表 API 完整响应体 */
export interface MoviesApiResponse {
  status: string
  success: boolean
  msg: string
  response: MoviesResponseData
}

/** 分类/标签项 */
export interface MovieCategory {
  id: string
  name: string
  description: string
  orderby: number
}

/** 分类列表 API 响应体 */
export interface CategoriesApiResponse {
  status: string
  success: boolean
  msg: string
  response: MovieCategory[]
}

/** 单集剧集信息 */
export interface MovieEpisode {
  episodes: string
  size: string
  fps: string
  duration: string
  height: string
  width: string
  playurl: string
}

/** 剧集列表 API 响应体 */
export interface MovieEpisodesResponse {
  status: string
  success: boolean
  msg: string
  response: MovieEpisode[]
}
