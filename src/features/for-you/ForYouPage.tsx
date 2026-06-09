import { AppLayout } from '@/components/layout/AppLayout'
import { Compass } from 'lucide-react'

export function ForYouPage() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center">
          <Compass className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-brand-text">For You</h2>
        <p className="text-sm text-brand-muted max-w-[240px]">
          Personalized recommendations coming soon.
        </p>
      </div>
    </AppLayout>
  )
}
