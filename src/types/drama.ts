export interface Genre {
  id: string
  name: string
}

export interface Episode {
  id: string
  dramaId: string
  episodeNumber: number
  title: string
  thumbnail: string
  videoUrl: string
  duration: number // seconds
}

export interface Drama {
  id: string
  title: string
  description: string
  poster: string
  banner: string
  rating: number
  genres: Genre[]
  totalEpisodes: number
  status: 'ongoing' | 'completed' | 'coming_soon'
  isNew: boolean
  isTrending: boolean
  trendingRank?: number
  releaseDate: string
  updateDay: string
  views: number
  likes: number
  comments: number
}

export interface DramaListResponse {
  data: Drama[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface DramaDetailResponse {
  data: Drama & {
    episodes: Episode[]
    relatedDramas: Drama[]
  }
}
