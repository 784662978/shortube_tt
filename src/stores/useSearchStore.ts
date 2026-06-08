import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchState {
  history: string[]
  addToHistory: (query: string) => void
  removeFromHistory: (query: string) => void
  clearHistory: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (query) =>
        set((s) => {
          const filtered = s.history.filter((h) => h !== query)
          return { history: [query, ...filtered].slice(0, 10) }
        }),
      removeFromHistory: (query) =>
        set((s) => ({ history: s.history.filter((h) => h !== query) })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'shortube-search' }
  )
)
