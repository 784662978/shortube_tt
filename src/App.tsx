import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const HomePage = lazy(() =>
  import('@/features/home/HomePage').then((m) => ({ default: m.HomePage }))
)
const ForYouPage = lazy(() =>
  import('@/features/for-you/ForYouPage').then((m) => ({ default: m.ForYouPage }))
)
const HistoryPage = lazy(() =>
  import('@/features/history/HistoryPage').then((m) => ({ default: m.HistoryPage }))
)
const ProfilePage = lazy(() =>
  import('@/features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage }))
)
const DramaDetailPage = lazy(() =>
  import('@/features/drama/DramaDetailPage').then((m) => ({ default: m.DramaDetailPage }))
)
const TermsPage = lazy(() =>
  import('@/features/profile/TermsPage').then((m) => ({ default: m.TermsPage }))
)
const PrivacyPage = lazy(() =>
  import('@/features/profile/PrivacyPage').then((m) => ({ default: m.PrivacyPage }))
)
const SearchPage = lazy(() =>
  import('@/features/search/SearchPage').then((m) => ({ default: m.SearchPage }))
)

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/for-you" element={<ForYouPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/drama/:id" element={<DramaDetailPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
