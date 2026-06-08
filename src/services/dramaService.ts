import apiClient from './apiClient'
import type { Drama, DramaDetailResponse, DramaListResponse } from '@/types/drama'
import type { PaginatedResponse } from '@/types/api'

export const dramaService = {
  getDramas: (params?: {
    page?: number
    pageSize?: number
    genre?: string
    sort?: string
    query?: string
  }) =>
    apiClient.get<any, PaginatedResponse<Drama>>('/dramas', { params }),

  getTrending: () =>
    apiClient.get<any, { code: number; data: Drama[] }>('/dramas/trending'),

  getNewArrivals: () =>
    apiClient.get<any, { code: number; data: Drama[] }>('/dramas/new-arrivals'),

  getDramaDetail: (id: string) =>
    apiClient.get<any, { code: number; data: DramaDetailResponse['data'] }>(`/dramas/${id}`),

  getGenres: () =>
    apiClient.get<any, { code: number; data: { id: string; name: string }[] }>('/genres'),

  getSearchSuggestions: (query: string) =>
    apiClient.get<any, { code: number; data: { id: string; title: string; poster: string }[] }>(
      '/search/suggestions',
      { params: { query } }
    ),
}
