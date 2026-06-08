interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-brand-card rounded-xl ${className}`}
    />
  )
}

export function DramaCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[2/3] mb-2.5" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}

export function HeroBannerSkeleton() {
  return <Skeleton className="w-[280px] h-[350px] rounded-2xl flex-shrink-0" />
}

export function TrendingCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[140px]">
      <Skeleton className="aspect-[2/3] rounded-xl mb-2" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}
