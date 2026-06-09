import { useRef, useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMoviesData } from '@/hooks/useMoviesData'
import { shuffle } from '@/utils/moviesMapper'
import { ForYouVideoSlide } from './ForYouVideoSlide'
import { PageContainer } from '@/components/layout/PageContainer'
import { BottomNav } from '@/components/layout/BottomNav'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorFallback } from '@/components/ui/ErrorFallback'
import { Compass } from 'lucide-react'

export function ForYouPage() {
  const navigate = useNavigate()
  const { allDramas, isLoading, isError, refetch } = useMoviesData()
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const shuffledDramas = useMemo(() => {
    return shuffle(allDramas)
  }, [allDramas])

  useEffect(() => {
    const container = containerRef.current
    if (!container || shuffledDramas.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.7) {
            const idx = slideRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) setActiveIndex(idx)
          }
        }
      },
      { root: container, threshold: [0.7] }
    )

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [shuffledDramas])

  const handleViewDetail = (dramaId: string) => {
    navigate(`/drama/${dramaId}`)
  }

  if (isLoading) {
    return (
      <PageContainer className="bg-brand-bg">
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
        <BottomNav />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer className="bg-brand-bg">
        <div className="flex items-center justify-center h-screen">
          <ErrorFallback onRetry={() => refetch()} />
        </div>
        <BottomNav />
      </PageContainer>
    )
  }

  if (shuffledDramas.length === 0) {
    return (
      <PageContainer className="bg-brand-bg">
        <div className="flex flex-col items-center justify-center h-screen text-center gap-3">
          <Compass className="w-12 h-12 text-brand-muted/50" />
          <p className="text-brand-muted text-sm">No videos available</p>
        </div>
        <BottomNav />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="bg-black overflow-hidden">
      <div className="relative h-[calc(100dvh-64px)]">
        {/* 垂直滑动容器 */}
        <div
          ref={containerRef}
          className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        >
          {shuffledDramas.map((drama, idx) => (
            <div
              key={drama.id}
              ref={(el) => { slideRefs.current[idx] = el }}
              className="w-full h-[calc(100dvh-64px)] snap-start flex-shrink-0"
            >
              <ForYouVideoSlide
                drama={drama}
                isActive={idx === activeIndex}
                onViewDetail={handleViewDetail}
              />
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </PageContainer>
  )
}
