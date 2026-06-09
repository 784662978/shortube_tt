import moviesApiClient from './moviesApiClient'
import type { MoviesApiResponse, CategoriesApiResponse, MovieEpisodesResponse } from '@/types/movies'

export const moviesService = {
  /** 获取短剧列表（分页） */
  getMovies: (params: { page: number; pageSize: number; category?: string }) =>
    moviesApiClient.get<any, MoviesApiResponse>('/api/Movies', { params }),

  /** 获取分类/标签列表 */
  getCategories: () =>
    moviesApiClient.get<any, CategoriesApiResponse>('/api/MovieCategories'),

  /** 按分类获取短剧列表（分页） */
  getByCategories: (params: { categorieId: string; page: number; pageSize: number }) =>
    moviesApiClient.get<any, MoviesApiResponse>('/api/Movies/GetByCategories', { params }),

  /** 获取短剧剧集列表 */
  getMovieEpisodes: (params: { id: string }) =>
    moviesApiClient.get<any, MovieEpisodesResponse>('/api/MovieEpisodes/GetByMovieId', { params }),
}
