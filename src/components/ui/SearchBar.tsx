import { Search } from 'lucide-react'

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onSubmit?: (value: string) => void
  placeholder?: string
  readonly?: boolean
  autoFocus?: boolean
  className?: string
}

export function SearchBar({
  value = '',
  onChange,
  onFocus,
  onSubmit,
  placeholder = 'Search dramas...',
  readonly = false,
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit?.(value.trim())
    }
  }

  if (readonly) {
    return (
      <div
        onClick={onFocus}
        className={`flex items-center gap-3 bg-brand-card border border-white/5 rounded-xl px-4 py-3 cursor-pointer hover:border-brand-pink/30 transition-colors ${className}`}
      >
        <Search className="w-5 h-5 text-brand-muted" />
        <span className="text-brand-muted text-sm">{placeholder}</span>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-3 bg-brand-card border border-white/5 rounded-xl px-4 py-3 focus-within:border-brand-pink/50 transition-colors ${className}`}
    >
      <Search className="w-5 h-5 text-brand-muted flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="flex-1 bg-transparent text-sm text-brand-text placeholder-brand-muted outline-none"
      />
    </div>
  )
}
