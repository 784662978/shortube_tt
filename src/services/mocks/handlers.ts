import { http, HttpResponse, delay } from 'msw'
import { mockDramas, mockEpisodes, mockGenres } from './data/dramas'

export const handlers = [
  // GET /api/dramas - drama list with pagination
  http.get('/api/dramas', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const genre = url.searchParams.get('genre')
    const sort = url.searchParams.get('sort') // 'trending' | 'new' | 'all'
    const query = url.searchParams.get('query')

    let filtered = [...mockDramas]

    if (genre) {
      filtered = filtered.filter((d) => d.genres.some((g) => g.name.toLowerCase() === genre.toLowerCase()))
    }

    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter((d) => d.title.toLowerCase().includes(q))
    }

    if (sort === 'trending') {
      filtered = filtered.filter((d) => d.isTrending).sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99))
    } else if (sort === 'new') {
      filtered = filtered.filter((d) => d.isNew)
    }

    const start = (page - 1) * pageSize
    const paged = filtered.slice(start, start + pageSize)

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: paged,
        total: filtered.length,
        page,
        pageSize,
        hasMore: start + pageSize < filtered.length,
      },
    })
  }),

  // GET /api/dramas/trending
  http.get('/api/dramas/trending', async () => {
    await delay(300)
    const trending = mockDramas
      .filter((d) => d.isTrending)
      .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99))
    return HttpResponse.json({ code: 200, message: 'success', data: trending })
  }),

  // GET /api/dramas/new-arrivals
  http.get('/api/dramas/new-arrivals', async () => {
    await delay(300)
    const newArrivals = mockDramas.filter((d) => d.isNew)
    return HttpResponse.json({ code: 200, message: 'success', data: newArrivals })
  }),

  // GET /api/dramas/:id
  http.get('/api/dramas/:id', async ({ params }) => {
    await delay(350)
    const drama = mockDramas.find((d) => d.id === params.id)
    if (!drama) {
      return HttpResponse.json({ code: 404, message: 'Drama not found' }, { status: 404 })
    }
    const episodes = mockEpisodes[drama.id] || []
    const relatedDramas = mockDramas
      .filter((d) => d.id !== drama.id)
      .slice(0, 8)
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: { ...drama, episodes, relatedDramas },
    })
  }),

  // GET /api/genres
  http.get('/api/genres', async () => {
    await delay(200)
    return HttpResponse.json({ code: 200, message: 'success', data: mockGenres })
  }),

  // GET /api/search/suggestions
  http.get('/api/search/suggestions', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const query = url.searchParams.get('query') || ''
    const suggestions = mockDramas
      .filter((d) => d.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map((d) => ({ id: d.id, title: d.title, poster: d.poster }))
    return HttpResponse.json({ code: 200, message: 'success', data: suggestions })
  }),
]
