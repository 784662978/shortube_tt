import { AppLayout } from '@/components/layout/AppLayout'
import { SearchBar } from '@/components/ui/SearchBar'
import { HeroBanner } from './HeroBanner'
import { NewArrivals } from './NewArrivals'
import { TrendingNow } from './TrendingNow'
import { AllDramas } from './AllDramas'
import { useMoviesData } from '@/hooks/useMoviesData'

export function HomePage() {
  const handleSearchFocus = () => {
    // Navigate to search page (future implementation)
  }

  const {
    heroDramas,
    newArrivals,
    trendingDramas,
    allDramas,
    isLoading,
    isError,
    refetch,
  } = useMoviesData()

  return (
    <AppLayout>
      {/* Header */}
      <header className="pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Shortube"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold font-sora gradient-text">Shortube</span>
          </div>
        </div>
        <SearchBar
          readonly
          placeholder="Search dramas..."
          onFocus={handleSearchFocus}
        />
      </header>

      {/* Hero Banner */}
      <section className="mb-8">
        <HeroBanner
          dramas={heroDramas}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </section>

      {/* New Arrivals */}
      <section className="mb-8">
        <NewArrivals
          dramas={newArrivals}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </section>

      {/* Trending Now */}
      <section className="mb-8">
        <TrendingNow
          dramas={trendingDramas}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </section>

      {/* All Dramas */}
      <AllDramas
        allDramas={allDramas}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />
    </AppLayout>
  )
}
