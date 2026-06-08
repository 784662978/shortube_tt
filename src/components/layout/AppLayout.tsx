import { PageContainer } from './PageContainer'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <div className="px-4 pb-8">{children}</div>
    </PageContainer>
  )
}
