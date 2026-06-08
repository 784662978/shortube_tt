import { useQuery } from '@tanstack/react-query'
import { dramaService } from '@/services/dramaService'
import { DramaCard } from '@/components/ui/DramaCard'
import { TrendingCardSkeleton } from '@/components/ui/Skeleton'
import { ErrorFallback } from '@/components/ui/ErrorFallback'

export function TrendingNow() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trending-dramas'],
    queryFn: () => dramaService.getTrending().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold font-sora text-brand-text">
          Trending Now
        </h2>
        <button className="text-sm text-brand-pink hover:text-brand-muted transition-colors">
          See All
        </button>
      </div>

      {isLoading && (
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <TrendingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <ErrorFallback onRetry={() => refetch()} />}

      {data && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
          {data.map((drama, idx) => (
            <DramaCard
              key={drama.id}
              drama={drama}
              variant="trending"
              rank={drama.trendingRank || idx + 1}
            />
          ))}
        </div>
      )}
    </section>
  )
}
