import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { moviesService } from '@/services/moviesService'
import { mapMovieToDrama, shuffle } from '@/utils/moviesMapper'
import type { Drama } from '@/types/drama'

interface MoviesDataDistribution {
  /** 轮播/ Hero Banner 使用的剧集（前 5~8 条） */
  heroDramas: Drama[]
  /** 新剧集（4 条） */
  newArrivals: Drama[]
  /** 热门横向滚动（6~8 条） */
  trendingDramas: Drama[]
  /** 全部剧集（用于 AllDramas 模块，分页由该模块自行管理） */
  allDramas: Drama[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

/**
 * 拉取短剧列表并将数据随机分配到首页各模块
 * - HeroBanner：前 5~8 条
 * - NewArrivals：随机 4 条
 * - TrendingNow：随机 6~8 条
 * - AllDramas：全部数据
 */
export function useMoviesData(): MoviesDataDistribution {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['movies-list'],
    queryFn: async () => {
      const res = await moviesService.getMovies({
        page: 1,
        pageSize: 10000,
        category: 'video',
      })
      return res.response.data
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  })

  const distribution = useMemo(() => {
    if (!data || data.length === 0) {
      return { heroDramas: [], newArrivals: [], trendingDramas: [], allDramas: [] }
    }

    // AllDramas：原始顺序，不去重不乱序
    const allDramas = data.map((item, idx) => mapMovieToDrama(item, idx))

    // 其他模块：洗牌后随机分配
    const shuffled = shuffle(data).map((item, idx) => mapMovieToDrama(item, idx))

    // HeroBanner：前 8 条
    const heroCount = Math.min(8, shuffled.length)
    const heroDramas = shuffled.slice(0, heroCount)

    // NewArrivals：接续取 4 条
    const newStart = heroCount
    const newCount = Math.min(4, shuffled.length - newStart)
    const newArrivals = shuffled.slice(newStart, newStart + newCount)

    // TrendingNow：接续取 8 条
    const trendingStart = newStart + newCount
    const trendingCount = Math.min(8, shuffled.length - trendingStart)
    const trendingDramas = shuffled.slice(trendingStart, trendingStart + trendingCount).map(
      (d, i) => ({ ...d, trendingRank: i + 1, isTrending: true })
    )

    return { heroDramas, newArrivals, trendingDramas, allDramas }
  }, [data])

  return {
    ...distribution,
    isLoading,
    isError,
    error: error as Error | null,
    refetch: refetch as () => void,
  }
}
