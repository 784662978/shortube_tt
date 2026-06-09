import type { MovieItem } from '@/types/movies'
import type { Drama } from '@/types/drama'

/**
 * 将短剧 API 单条数据映射为项目内部的 Drama 类型
 */
export function mapMovieToDrama(item: MovieItem, index: number): Drama {
  // 用 viewcount 生成模拟评分（0.5 ~ 5.0）
  const rawRating = ((item.viewcount % 50) / 10) || 3
  const rating = Math.min(5, Math.max(0.5, Math.round(rawRating * 10) / 10))

  // 将 labels 逗号分隔转为 Genre 数组
  const labels = item.labels
    ? item.labels.split(',').map((l, i) => ({
        id: l.trim().toLowerCase().replace(/\s+/g, '-'),
        name: l.trim(),
      }))
    : []

  const episodeCount = parseInt(item.episodes, 10) || 0

  return {
    id: item.id,
    title: item.title || 'Untitled',
    description: item.description || '',
    poster: item.coverimage || item.coverimagehd || '',
    banner: item.coverimagehd || item.coverimage || '',
    rating,
    genres: labels,
    totalEpisodes: episodeCount,
    status: item.enable === 1 ? 'ongoing' : 'completed',
    isNew: index < 5,
    isTrending: index < 10,
    trendingRank: index < 10 ? index + 1 : undefined,
    releaseDate: item.created_at || '',
    updateDay: 'Daily',
    views: item.viewcount || 0,
    likes: Math.floor((item.viewcount || 0) * 0.12),
    comments: Math.floor((item.viewcount || 0) * 0.03),
  }
}

/**
 * Fisher-Yates 洗牌算法，返回新数组
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
