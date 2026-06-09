import { useQuery } from '@tanstack/react-query'
import { dramaService } from '@/services/dramaService'
import { DramaCard } from '@/components/ui/DramaCard'
import { DramaCardSkeleton } from '@/components/ui/Skeleton'
import { ErrorFallback } from '@/components/ui/ErrorFallback'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Drama } from '@/types/drama'

interface NewArrivalsProps {
  dramas?: Drama[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function NewArrivals({ dramas: externalDramas, isLoading: externalLoading, isError: externalError, onRetry }: NewArrivalsProps) {
  const { data: queriedData, isLoading: queriedLoading, isError: queriedError, refetch } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => dramaService.getNewArrivals().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    enabled: externalDramas === undefined,
  })

  const data = externalDramas ?? queriedData
  const isLoading = externalLoading ?? queriedLoading
  const isError = externalError ?? queriedError

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold font-sora text-brand-text">
          New Arrivals
        </h2>
        <button className="text-sm text-brand-pink hover:text-brand-muted transition-colors">
          See All
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <DramaCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <ErrorFallback onRetry={() => (onRetry ? onRetry() : refetch())} />}

      {data && data.length === 0 && (
        <EmptyState title="No new dramas yet" description="Check back later for fresh content" />
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {data.slice(0, 4).map((drama) => (
            <DramaCard key={drama.id} drama={drama} />
          ))}
        </div>
      )}
    </section>
  )
}
