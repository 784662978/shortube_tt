import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { dramaService } from '@/services/dramaService'
import { DramaCard } from '@/components/ui/DramaCard'
import { TagBadge } from '@/components/ui/TagBadge'
import { DramaCardSkeleton } from '@/components/ui/Skeleton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorFallback } from '@/components/ui/ErrorFallback'
import { EmptyState } from '@/components/ui/EmptyState'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

const FILTERS = ['All', 'Romance', 'Thriller', 'Action', 'Comedy', 'Fantasy', 'Drama']

export function AllDramas() {
  const [activeFilter, setActiveFilter] = useState('All')

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['all-dramas', activeFilter],
    queryFn: ({ pageParam = 1 }) =>
      dramaService.getDramas({
        page: pageParam,
        pageSize: 10,
        genre: activeFilter === 'All' ? undefined : activeFilter,
        sort: 'all',
      }),
    getNextPageParam: (lastPage) => (lastPage.data.hasMore ? lastPage.data.page + 1 : undefined),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  })

  const sentinelRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, { enabled: hasNextPage && !isFetchingNextPage })

  const allDramas = data?.pages.flatMap((page) => page.data.list) || []

  return (
    <section>
      <h2 className="text-xl font-semibold font-sora text-brand-text mb-4">
        All Dramas
      </h2>

      {/* Filter tags */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 mb-4">
        {FILTERS.map((filter) => (
          <TagBadge
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>

      {/* Drama grid */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DramaCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <ErrorFallback onRetry={() => refetch()} />}

      {!isLoading && !isError && allDramas.length === 0 && (
        <EmptyState
          title="No dramas found"
          description="Try a different filter or check back later"
        />
      )}

      {!isLoading && !isError && allDramas.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {allDramas.map((drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {isFetchingNextPage && <LoadingSpinner className="py-4" />}

          {!hasNextPage && allDramas.length > 0 && (
            <p className="text-center text-brand-muted text-xs py-6">
              — You've reached the end —
            </p>
          )}
        </>
      )}
    </section>
  )
}
