import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Compass, Clock, User } from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: typeof Home
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/for-you', label: 'For You', icon: Compass },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-lg border-t border-white/5 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-[480px] mx-auto flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors duration-200 ${
                active
                  ? 'text-brand-pink'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  active ? 'fill-brand-pink/20' : ''
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium leading-none ${
                active ? 'text-brand-pink' : ''
              }`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
