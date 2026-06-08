import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryItem } from '@/types/user'

interface HistoryState {
  items: HistoryItem[]
  addToHistory: (item: HistoryItem) => void
  removeFromHistory: (dramaId: string) => void
  clearHistory: () => void
  getByDramaId: (dramaId: string) => HistoryItem | undefined
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      addToHistory: (item) =>
        set((s) => {
          const filtered = s.items.filter((i) => i.dramaId !== item.dramaId)
          return { items: [item, ...filtered].slice(0, 100) }
        }),
      removeFromHistory: (dramaId) =>
        set((s) => ({ items: s.items.filter((i) => i.dramaId !== dramaId) })),
      clearHistory: () => set({ items: [] }),
      getByDramaId: (dramaId) => get().items.find((i) => i.dramaId === dramaId),
    }),
    { name: 'shortube-history' }
  )
)
