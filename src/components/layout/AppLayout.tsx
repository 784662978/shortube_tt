import { PageContainer } from './PageContainer'
import { BottomNav } from './BottomNav'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <div className="px-4 pb-24">{children}</div>
      <BottomNav />
    </PageContainer>
  )
}
