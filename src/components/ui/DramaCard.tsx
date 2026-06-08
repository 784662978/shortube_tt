import type { Drama } from '@/types/drama'
import { Play, Star } from 'lucide-react'
import { formatNumber } from '@/utils/format'

interface DramaCardProps {
  drama: Drama
  variant?: 'vertical' | 'horizontal' | 'trending'
  rank?: number
  className?: string
  onClick?: () => void
}

export function DramaCard({ drama, variant = 'vertical', rank, className = '', onClick }: DramaCardProps) {
  if (variant === 'trending') {
    return (
      <div
        onClick={onClick}
        className={`flex-shrink-0 w-[140px] cursor-pointer group ${className}`}
      >
        <div className="relative rounded-xl overflow-hidden mb-2 aspect-[2/3]">
          <img
            src={drama.poster}
            alt={drama.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent" />
          {rank && (
            <span className="absolute bottom-2 left-2 text-[40px] font-black font-sora text-brand-pink/30 text-shadow-glow leading-none">
              {rank}
            </span>
          )}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white">{drama.rating}</span>
          </div>
        </div>
        <h4 className="text-sm font-medium text-brand-text truncate">{drama.title}</h4>
        <p className="text-xs text-brand-muted mt-0.5">{formatNumber(drama.views)} views</p>
      </div>
    )
  }

  if (variant === 'horizontal') {
    return (
      <div
        onClick={onClick}
        className={`flex gap-3 p-2 glass-card cursor-pointer group ${className}`}
      >
        <div className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={drama.poster}
            alt={drama.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <h4 className="text-sm font-semibold text-brand-text truncate">{drama.title}</h4>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {drama.genres.slice(0, 2).map((g) => (
              <span
                key={g.id}
                className="text-[10px] px-2 py-0.5 bg-brand-surface rounded-md text-brand-muted"
              >
                {g.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-brand-muted mt-2 line-clamp-2">{drama.description}</p>
        </div>
      </div>
    )
  }

  // vertical (default)
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group ${className}`}
    >
      <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-2.5">
        <img
          src={drama.poster}
          alt={drama.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* NEW badge */}
        {drama.isNew && (
          <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-400/50 bg-red-500/20 text-red-300 backdrop-blur-sm">
            NEW
          </span>
        )}

        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-white">{drama.rating}</span>
        </div>

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <h4 className="text-sm font-semibold text-brand-text truncate">{drama.title}</h4>
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        {drama.genres.slice(0, 2).map((g) => (
          <span
            key={g.id}
            className="text-[10px] px-2 py-0.5 bg-brand-surface rounded-md text-brand-muted"
          >
            {g.name}
          </span>
        ))}
      </div>
      <p className="text-xs text-brand-muted mt-1.5 line-clamp-2 leading-relaxed">
        {drama.description}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`text-[10px] font-medium ${
          drama.status === 'ongoing' ? 'text-brand-pink' : 'text-gray-400'
        }`}>
          {drama.status === 'ongoing' ? `🟢 ${drama.updateDay} update` : 
           drama.status === 'completed' ? '✓ Completed' : '🔜 Coming Soon'}
        </span>
      </div>
    </div>
  )
}
