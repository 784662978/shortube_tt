export interface User {
  id: string
  name: string
  avatar: string
  stats: {
    hoursWatched: number
    favorites: number
    history: number
  }
}

export interface HistoryItem {
  dramaId: string
  episodeId: string
  episodeNumber: number
  dramaTitle: string
  dramaPoster: string
  progress: number // seconds
  totalDuration: number // seconds
  watchedAt: string // ISO date string
}
