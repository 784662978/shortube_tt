import { AppLayout } from '@/components/layout/AppLayout'
import { SearchBar } from '@/components/ui/SearchBar'
import { HeroBanner } from './HeroBanner'
import { NewArrivals } from './NewArrivals'
import { TrendingNow } from './TrendingNow'
import { AllDramas } from './AllDramas'

export function HomePage() {
  const handleSearchFocus = () => {
    // Navigate to search page (future implementation)
  }

  return (
    <AppLayout>
      {/* Header */}
      <header className="pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-sora">
            <span className="gradient-text">Shortube</span>
          </h1>
        </div>
        <SearchBar
          readonly
          placeholder="Search dramas..."
          onFocus={handleSearchFocus}
        />
      </header>

      {/* Hero Banner */}
      <section className="mb-8">
        <HeroBanner />
      </section>

      {/* New Arrivals */}
      <section className="mb-8">
        <NewArrivals />
      </section>

      {/* Trending Now */}
      <section className="mb-8">
        <TrendingNow />
      </section>

      {/* All Dramas */}
      <AllDramas />
    </AppLayout>
  )
}
