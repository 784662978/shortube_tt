import { AppLayout } from '@/components/layout/AppLayout'
import { User } from 'lucide-react'

export function ProfilePage() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-brand-text">Profile</h2>
        <p className="text-sm text-brand-muted max-w-[240px]">
          Your profile and settings will be available here.
        </p>
      </div>
    </AppLayout>
  )
}
