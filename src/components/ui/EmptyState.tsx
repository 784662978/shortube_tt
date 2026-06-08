import { Film } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center mb-4">
        {icon || <Film className="w-8 h-8 text-brand-muted" />}
      </div>
      <h3 className="text-brand-text text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-brand-muted text-sm text-center max-w-[240px]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
