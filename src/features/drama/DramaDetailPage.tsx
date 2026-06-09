import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useMoviesData } from '@/hooks/useMoviesData'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function DramaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { allDramas, isLoading } = useMoviesData()

  const drama = allDramas.find((d) => d.id === id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!drama) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-muted">
        Drama not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-brand-bg/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-[480px] mx-auto px-4 h-12 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-brand-text" />
          </button>
          <h1 className="text-lg font-semibold text-brand-text font-sora truncate">
            {drama.title}
          </h1>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 pt-4">
        {/* Cover */}
        <div className="relative rounded-2xl overflow-hidden aspect-[2/3] mb-4">
          <img
            src={drama.banner || drama.poster}
            alt={drama.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Info */}
        <h2 className="text-2xl font-bold text-brand-text font-sora mb-2">{drama.title}</h2>

        <div className="flex items-center gap-3 text-sm text-brand-muted mb-4">
          <span>{drama.totalEpisodes} Episodes</span>
          <span>{drama.views.toLocaleString()} views</span>
        </div>

        <p className="text-sm text-brand-text/80 leading-relaxed mb-6">
          {drama.description}
        </p>

        {/* Genres */}
        {drama.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {drama.genres.map((g) => (
              <span
                key={g.id}
                className="text-xs px-3 py-1 rounded-full bg-brand-surface text-brand-muted border border-white/5"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
