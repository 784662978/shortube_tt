interface ErrorFallbackProps {
  message?: string
  onRetry?: () => void
}

export function ErrorFallback({
  message = 'Something went wrong',
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <span className="text-2xl">!</span>
      </div>
      <h3 className="text-brand-text text-lg font-semibold mb-1">Oops!</h3>
      <p className="text-brand-muted text-sm text-center mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="gradient-btn px-5 py-2 text-sm"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
