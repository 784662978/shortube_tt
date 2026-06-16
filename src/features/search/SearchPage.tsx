import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, X, Clock, Flame, SearchX, WifiOff, RefreshCw } from 'lucide-react'
import { SearchBar } from '@/components/ui/SearchBar'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchStore } from '@/stores/useSearchStore'
import { dramaService } from '@/services/dramaService'
import type { Drama } from '@/types/drama'

export function SearchPage() {
  const navigate = useNavigate()
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchStore()

  // Search state
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<Drama[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hot search state
  const [hotSearches, setHotSearches] = useState<string[]>([])

  // Fetch hot/trending topics on mount
  useEffect(() => {
    dramaService
      .getTrending()
      .then((res) => {
        const titles = (res.data || []).slice(0, 8).map((d: Drama) => d.title)
        setHotSearches(titles)
      })
      .catch(() => {
        // Fallback hot topics
        setHotSearches([
          'Midnight Whispers',
          'Shadow Protocol',
          'Eternal Summer',
          'Crimson Peak',
          'Neon Dynasty',
          'Love in Tokyo',
          'Frozen Hearts',
          'Starfall Academy',
        ])
      })
  }, [])

  // Debounced search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setError(null)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    dramaService
      .getDramas({ query: debouncedQuery.trim(), pageSize: 20 })
      .then((res) => {
        if (cancelled) return
        setResults(res.data?.list || [])
        setIsLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'Network error, please try again')
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  // Handle search submit (Enter key)
  const handleSubmit = useCallback(
    (value: string) => {
      if (!value.trim()) return
      addToHistory(value.trim())
      setQuery(value.trim())
    },
    [addToHistory]
  )

  // Handle tapping a history/hot item
  const handleTapSuggestion = useCallback(
    (term: string) => {
      addToHistory(term)
      setQuery(term)
    },
    [addToHistory]
  )

  // Handle result click → navigate to detail
  const handleResultClick = useCallback(
    (drama: Drama) => {
      addToHistory(drama.title)
      navigate(`/drama/${drama.id}`)
    },
    [addToHistory, navigate]
  )

  // Determine what to show in the content area
  const showInitial = !query.trim()
  const showLoading = !!query.trim() && isLoading
  const showError = !!query.trim() && !!error && !isLoading
  const showEmpty = !!query.trim() && !isLoading && !error && results.length === 0
  const showResults = !!query.trim() && !isLoading && !error && results.length > 0

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top Bar: back + search input */}
      <header className="sticky top-0 z-20 bg-brand-bg/95 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-brand-surface flex items-center justify-center hover:bg-white/5 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-brand-text" />
          </button>
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              placeholder="Search dramas..."
              autoFocus
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[480px] mx-auto px-4 py-4">
        {/* ====== INITIAL STATE: History + Hot Searches ====== */}
        {showInitial && (
          <div className="space-y-6">
            {/* Search History */}
            {history.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-brand-text font-sora flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-muted" />
                    Search History
                  </h2>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-brand-muted/60 hover:text-brand-pink transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((term) => (
                    <div
                      key={term}
                      className="flex items-center gap-1.5 bg-brand-card border border-white/5 rounded-full pl-3 pr-1.5 py-1.5 group"
                    >
                      <button
                        onClick={() => handleTapSuggestion(term)}
                        className="text-xs text-brand-muted hover:text-brand-text transition-colors max-w-[160px] truncate"
                      >
                        {term}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFromHistory(term)
                        }}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-brand-muted/40 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hot Searches */}
            {hotSearches.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-brand-text font-sora flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-brand-pink" />
                  Hot Searches
                </h2>
                <div className="space-y-0.5">
                  {hotSearches.map((term, idx) => (
                    <button
                      key={term}
                      onClick={() => handleTapSuggestion(term)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-brand-card transition-colors text-left"
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                          idx < 3
                            ? 'bg-brand-pink/20 text-brand-pink'
                            : 'bg-brand-surface text-brand-muted'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-sm text-brand-text truncate">{term}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ====== LOADING STATE ====== */}
        {showLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-brand-pink/30 border-t-brand-pink rounded-full animate-spin" />
            <p className="text-sm text-brand-muted">Searching...</p>
          </div>
        )}

        {/* ====== ERROR STATE ====== */}
        {showError && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center">
              <WifiOff className="w-8 h-8 text-brand-muted" />
            </div>
            <p className="text-sm text-brand-muted text-center max-w-[240px]">
              {error}
            </p>
            <button
              onClick={() => {
                setError(null)
                setIsLoading(true)
                dramaService
                  .getDramas({ query: debouncedQuery.trim(), pageSize: 20 })
                  .then((res) => {
                    setResults(res.data?.list || [])
                    setIsLoading(false)
                  })
                  .catch((err) => {
                    setError(err.message || 'Network error, please try again')
                    setIsLoading(false)
                  })
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-pink/10 text-brand-pink text-sm font-medium hover:bg-brand-pink/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* ====== EMPTY STATE ====== */}
        {showEmpty && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center">
              <SearchX className="w-8 h-8 text-brand-muted" />
            </div>
            <p className="text-sm text-brand-muted text-center">
              No results for "{debouncedQuery}"
            </p>
            <p className="text-xs text-brand-muted/50 text-center max-w-[240px]">
              Try different keywords or check the spelling
            </p>
          </div>
        )}

        {/* ====== RESULTS ====== */}
        {showResults && (
          <section>
            <p className="text-xs text-brand-muted/60 mb-4">
              {results.length} result{results.length > 1 ? 's' : ''} for "{debouncedQuery}"
            </p>
            <div className="space-y-3">
              {results.map((drama) => (
                <SearchResultItem
                  key={drama.id}
                  drama={drama}
                  onClick={() => handleResultClick(drama)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

/* ---- Search Result Item ---- */
function SearchResultItem({ drama, onClick }: { drama: Drama; onClick: () => void }) {
  const statusLabel =
    drama.status === 'ongoing'
      ? 'Ongoing'
      : drama.status === 'completed'
        ? 'Completed'
        : 'Coming Soon'

  const statusStyle =
    drama.status === 'ongoing'
      ? 'bg-brand-pink/15 text-brand-pink'
      : drama.status === 'completed'
        ? 'bg-green-500/15 text-green-400'
        : 'bg-blue-500/15 text-blue-400'

  return (
    <div
      onClick={onClick}
      className="flex gap-3 p-2 rounded-xl hover:bg-brand-card transition-colors cursor-pointer group"
    >
      {/* Cover */}
      <div className="w-[72px] h-[96px] rounded-lg overflow-hidden flex-shrink-0 bg-brand-surface">
        <img
          src={drama.poster}
          alt={drama.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-brand-text truncate">
            {drama.title}
          </h3>
          <p className="text-xs text-brand-muted mt-1">
            {drama.totalEpisodes} episode{drama.totalEpisodes > 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {drama.genres.slice(0, 2).map((g) => (
              <span
                key={g.id}
                className="text-[10px] px-2 py-0.5 bg-brand-surface rounded-md text-brand-muted"
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full self-start ${statusStyle}`}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  )
}
