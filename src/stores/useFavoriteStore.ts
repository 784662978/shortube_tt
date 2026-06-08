import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteState {
  favoriteIds: string[]
  toggleFavorite: (dramaId: string) => void
  isFavorite: (dramaId: string) => boolean
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (dramaId) =>
        set((s) => {
          if (s.favoriteIds.includes(dramaId)) {
            return { favoriteIds: s.favoriteIds.filter((id) => id !== dramaId) }
          }
          return { favoriteIds: [...s.favoriteIds, dramaId] }
        }),
      isFavorite: (dramaId) => get().favoriteIds.includes(dramaId),
    }),
    { name: 'shortube-favorites' }
  )
)
