import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { dramaService } from '@/services/dramaService'
import { GradientButton } from '@/components/ui/GradientButton'
import { HeroBannerSkeleton } from '@/components/ui/Skeleton'
import { ErrorFallback } from '@/components/ui/ErrorFallback'
import { formatNumber } from '@/utils/format'
import type { Drama } from '@/types/drama'

interface HeroBannerProps {
  dramas?: Drama[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

const AUTO_PLAY_INTERVAL = 4000

export function HeroBanner({ dramas: externalDramas, isLoading: externalLoading, isError: externalError, onRetry }: HeroBannerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const hoverRef = useRef(false)
  const { data: queriedData, isLoading: queriedLoading, isError: queriedError, refetch } = useQuery({
    queryKey: ['trending-dramas'],
    queryFn: () => dramaService.getTrending().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    enabled: externalDramas === undefined,
  })

  const data = externalDramas ?? queriedData
  const loading = externalLoading ?? queriedLoading
  const error = externalError ?? queriedError

  const dramas = data || []
  const [activeIndex, setActiveIndex] = useState(0)

  // IntersectionObserver: 跟踪当前最可见的卡片
  useEffect(() => {
    const container = scrollRef.current
    if (!container || dramas.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到当前 intersection ratio 最高的卡片
        let maxRatio = 0
        let maxIdx = activeIndex
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            const idx = cardRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) maxIdx = idx
          }
        })
        if (maxRatio > 0.5) {
          setActiveIndex(maxIdx)
        }
      },
      {
        root: container,
        threshold: [0.5, 0.7, 0.9],
      }
    )

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [dramas]) // eslint-disable-line react-hooks/exhaustive-deps

  // 滚动到指定索引的卡片
  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollRef.current
      const el = cardRefs.current[index]
      if (!el || !container) return

      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      // 目标位置：让卡片在容器内水平居中
      const targetScrollLeft =
        container.scrollLeft + elRect.left - containerRect.left - (containerRect.width - elRect.width) / 2

      container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' })
      setActiveIndex(index)
    },
    []
  )

  const scroll = useCallback(
    (direction: 'left' | 'right') => {
      const nextIdx =
        direction === 'left'
          ? Math.max(0, activeIndex - 1)
          : Math.min(dramas.length - 1, activeIndex + 1)
      scrollToIndex(nextIdx)
    },
    [activeIndex, dramas.length, scrollToIndex]
  )

  // 自动轮播
  useEffect(() => {
    if (dramas.length <= 1) return

    const timer = setInterval(() => {
      if (hoverRef.current) return
      setActiveIndex((prev) => {
        const next = prev + 1 >= dramas.length ? 0 : prev + 1
        const container = scrollRef.current
        const el = cardRefs.current[next]
        if (el && container) {
          const containerRect = container.getBoundingClientRect()
          const elRect = el.getBoundingClientRect()
          const targetScrollLeft =
            container.scrollLeft + elRect.left - containerRect.left - (containerRect.width - elRect.width) / 2
          container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' })
        }
        return next
      })
    }, AUTO_PLAY_INTERVAL)

    return () => clearInterval(timer)
  }, [dramas.length])

  if (loading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <HeroBannerSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorFallback onRetry={() => (onRetry ? onRetry() : refetch())} />
  }

  return (
    <div
      className="relative group/hero"
      onMouseEnter={() => { hoverRef.current = true }}
      onMouseLeave={() => { hoverRef.current = false }}
      onTouchStart={() => { hoverRef.current = true }}
      onTouchEnd={() => { setTimeout(() => { hoverRef.current = false }, 2000) }}
    >
      {/* Scroll buttons */}
      {activeIndex > 0 && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hidden sm:flex border border-white/10"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
      )}
      {activeIndex < dramas.length - 1 && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hidden sm:flex border border-white/10"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 scroll-smooth"
      >
        {dramas.map((drama, idx) => (
          <div
            key={drama.id}
            ref={(el) => { cardRefs.current[idx] = el }}
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
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? 'bg-brand-pink w-4'
                : 'bg-brand-muted/30 hover:bg-brand-muted/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
