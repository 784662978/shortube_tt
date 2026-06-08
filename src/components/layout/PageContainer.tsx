export function PageContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-[480px] mx-auto min-h-screen ${className}`}>
      {children}
    </div>
  )
}
