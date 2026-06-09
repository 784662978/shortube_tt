import { useState, useMemo, useCallback } from 'react'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { moviesService } from '@/services/moviesService'
import { mapMovieToDrama } from '@/utils/moviesMapper'
import { DramaCard } from '@/components/ui/DramaCard'
import { TagBadge } from '@/components/ui/TagBadge'
import { DramaCardSkeleton } from '@/components/ui/Skeleton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorFallback } from '@/components/ui/ErrorFallback'
import { EmptyState } from '@/components/ui/EmptyState'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import type { Drama } from '@/types/drama'

const CLIENT_PAGE_SIZE = 10
const API_PAGE_SIZE = 20
const ALL_TAB = '__all__'

interface AllDramasProps {
  /** 全部剧集（"All" 标签使用，客户端分页） */
  allDramas?: Drama[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function AllDramas({ allDramas: externalDramas, isLoading: externalLoading, isError: externalError, onRetry }: AllDramasProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_TAB)
  const [clientPage, setClientPage] = useState(1)

  // 获取分类列表
  const {
    data: categories = [],
    isLoading: catLoading,
    isError: catError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['movie-categories'],
    queryFn: async () => {
      const res = await moviesService.getCategories()
      return res.response || []
    },
    staleTime: 30 * 60 * 1000,
  })

  const isAllTab = activeCategoryId === ALL_TAB

  // 分类筛选时的无限滚动（API 分页）
  const {
    data: apiData,
    isLoading: apiLoading,
    isError: apiError,
    refetch: refetchApi,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['dramas-by-category', activeCategoryId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await moviesService.getByCategories({
        categorieId: activeCategoryId,
        page: pageParam,
        pageSize: API_PAGE_SIZE,
      })
      return res.response
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pageCount ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !isAllTab,
  })

  // "All" 标签客户端分页
  const clientPaginated = useMemo(() => {
    if (!externalDramas) return []
    return externalDramas.slice(0, clientPage * CLIENT_PAGE_SIZE)
  }, [externalDramas, clientPage])

  // 分类筛选时的数据
  const apiDramas = useMemo(() => {
    if (!apiData) return []
    return apiData.pages.flatMap((page) =>
      page.data.map((item, idx) => mapMovieToDrama(item, idx))
    )
  }, [apiData])

  const hasMoreClient = externalDramas
    ? clientPaginated.length < externalDramas.length
    : false
  const hasMoreApi = hasNextPage && !isFetchingNextPage

  // 无限滚动触发
  const sentinelRef = useInfiniteScroll(() => {
    if (isAllTab) {
      if (hasMoreClient) setClientPage((p) => p + 1)
    } else {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    }
  }, { enabled: isAllTab ? hasMoreClient : hasMoreApi })

  // 切换标签：重置分页
  const handleCategoryChange = useCallback((categoryId: string) => {
    if (categoryId === activeCategoryId) return
    setActiveCategoryId(categoryId)
    setClientPage(1)
  }, [activeCategoryId])

  const dramas = isAllTab ? clientPaginated : apiDramas
  const isLoading = isAllTab ? externalLoading : (catLoading || apiLoading)
  const isError = isAllTab ? externalError : (catError || apiError)
  const retry = isAllTab ? onRetry : () => {
    if (catError) refetchCategories()
    if (apiError) refetchApi()
  }
  const isFetchingMore = isAllTab ? false : isFetchingNextPage
  const noMoreData = isAllTab ? !hasMoreClient : (!hasNextPage && apiDramas.length > 0)

  return (
    <section>
      <h2 className="text-xl font-semibold font-sora text-brand-text mb-4">
        All Dramas
      </h2>

      {/* Category tags */}
      {catLoading && (
        <div className="flex gap-2 overflow-hidden mb-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-16 h-7 rounded-full bg-brand-surface/50 animate-pulse" />
          ))}
        </div>
      )}
      {!catLoading && !catError && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 mb-4">
          {/* "All" 标签 */}
          <TagBadge
            key={ALL_TAB}
            label="All"
            active={isAllTab}
            onClick={() => handleCategoryChange(ALL_TAB)}
          />
          {categories.map((cat) => (
            <TagBadge
              key={cat.id}
              label={cat.name}
              active={activeCategoryId === cat.id}
              onClick={() => handleCategoryChange(cat.id)}
            />
          ))}
        </div>
      )}

      {/* Drama grid */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DramaCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <ErrorFallback onRetry={retry ?? (() => {})} />}

      {!isLoading && !isError && dramas.length === 0 && (
        <EmptyState
          title="No dramas found"
          description="Try a different category or check back later"
        />
      )}

      {!isLoading && !isError && dramas.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {dramas.map((drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>

          <div ref={sentinelRef} className="h-4" />

          {isFetchingMore && <LoadingSpinner className="py-4" />}

          {noMoreData && (
            <p className="text-center text-brand-muted text-xs py-6">
              — You've reached the end —
            </p>
          )}
        </>
      )}
    </section>
  )
}
