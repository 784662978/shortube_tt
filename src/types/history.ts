/** 浏览历史记录条目 */
export interface HistoryEntry {
  /** 唯一标识 */
  id: string
  /** 页面/短剧标题 */
  title: string
  /** 页面 URL（路由路径） */
  url: string
  /** 封面图 */
  coverImage?: string
  /** 短剧 ID */
  dramaId?: string
  /** 访问时间戳 (ISO 8601) */
  visitTime: string
  /** 剧集编号（若来自详情页） */
  episode?: number
}
