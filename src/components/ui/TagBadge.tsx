interface TagBadgeProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function TagBadge({ label, active = false, onClick, className = '' }: TagBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
        active
          ? 'bg-gradient-brand text-white shadow-glow'
          : 'bg-brand-surface text-brand-muted hover:bg-brand-card border border-white/5'
      } ${className}`}
    >
      {label}
    </button>
  )
}
