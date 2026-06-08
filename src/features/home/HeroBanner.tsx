import { useRef } from 'react'
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { dramaService } from '@/services/dramaService'
import { GradientButton } from '@/components/ui/GradientButton'
import { HeroBannerSkeleton } from '@/components/ui/Skeleton'
import { ErrorFallback } from '@/components/ui/ErrorFallback'
import { formatNumber } from '@/utils/format'

export function HeroBanner() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trending-dramas'],
    queryFn: () => dramaService.getTrending().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <HeroBannerSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorFallback onRetry={() => refetch()} />
  }

  const dramas = data || []

  return (
    <div className="relative group/hero">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hidden sm:flex border border-white/10"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hidden sm:flex border border-white/10"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x-mandatory -mx-4 px-4"
      >
        {dramas.map((drama, idx) => (
          <div
            key={drama.id}
            className="flex-shrink-0 w-[280px] sm:w-[320px] snap-center cursor-pointer group/card"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src={drama.banner || drama.poster}
                alt={drama.title}
                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
              />
              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent" />
              {/* Top gradient for text readability */}
              <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/40 to-transparent" />

              {/* Trending rank badge */}
              <div className="absolute top-3 left-3 glass-card px-3 py-1.5 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold text-white">Trending #{idx + 1}</span>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 pb-5">
                <h3 className="text-xl sm:text-2xl font-bold font-sora text-white mb-1.5 leading-tight">
                  {drama.title}
                </h3>
                <p className="text-sm text-brand-muted mb-3 line-clamp-2 leading-relaxed">
                  {drama.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white">{drama.rating}</span>
                  </div>
                  <span className="text-xs text-brand-muted">
                    {formatNumber(drama.views)} views
                  </span>
                </div>
                <GradientButton
                  icon={<Play className="w-4 h-4 fill-white" />}
                  size="sm"
                >
                  Watch Now
                </GradientButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-3">
        {dramas.map((_, idx) => (
          <div
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              idx === 0 ? 'bg-brand-pink' : 'bg-brand-muted/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
