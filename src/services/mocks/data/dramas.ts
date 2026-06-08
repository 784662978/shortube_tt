import type { Drama, Episode } from '@/types/drama'

// Use actual poster images from the assets folder
const posters = [
  '/assets/CodeBuddyAssets/1_220/1.png',
  '/assets/CodeBuddyAssets/1_220/2.png',
  '/assets/CodeBuddyAssets/1_220/3.png',
  '/assets/CodeBuddyAssets/1_220/4.png',
  '/assets/CodeBuddyAssets/1_220/5.png',
  '/assets/CodeBuddyAssets/1_220/6.png',
  '/assets/CodeBuddyAssets/1_220/7.png',
  '/assets/CodeBuddyAssets/1_220/8.png',
  '/assets/CodeBuddyAssets/1_220/9.png',
  '/assets/CodeBuddyAssets/1_220/10.png',
  '/assets/CodeBuddyAssets/1_220/11.png',
  '/assets/CodeBuddyAssets/1_220/12.png',
  '/assets/CodeBuddyAssets/1_220/13.png',
]

const genres = [
  { id: 'g1', name: 'Romance' },
  { id: 'g2', name: 'Thriller' },
  { id: 'g3', name: 'Action' },
  { id: 'g4', name: 'Comedy' },
  { id: 'g5', name: 'Fantasy' },
  { id: 'g6', name: 'Drama' },
]

export const mockGenres = genres

export const mockDramas: Drama[] = Array.from({ length: 30 }, (_, i) => {
  const posterIdx = i % posters.length
  return {
    id: `drama-${i + 1}`,
    title: [
      'Midnight Whispers',
      'The Last Crown',
      'Eternal Summer',
      'Shadow Protocol',
      'Love in Tokyo',
      'Crimson Peak',
      'Neon Dynasty',
      'Starfall Academy',
      'Frozen Hearts',
      'The Gambit',
      'Silent Waves',
      'Sakura Dreams',
      'Iron Vow',
      'Daybreak',
      'Vendetta',
      'Phoenix Rising',
      'Blue Horizon',
      'Dark Waters',
      'Golden Hour',
      'Storm Chaser',
      'Lunar Eclipse',
      'Wildfire',
      'Obsidian',
      'Reverie',
      'Aftermath',
      'Nova',
      'Cipher',
      'Vertigo',
      'Aurora',
      'Mirage',
    ][i],
    description:
      'A captivating story that unfolds across multiple timelines, blending romance, suspense, and unexpected twists that will keep you on the edge of your seat.',
    poster: posters[posterIdx],
    banner: posters[posterIdx],
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    genres: [genres[i % genres.length], genres[(i + 1) % genres.length]].filter(
      (g, idx, arr) => arr.indexOf(g) === idx
    ),
    totalEpisodes: 12 + Math.floor(Math.random() * 24),
    status: (['ongoing', 'completed', 'coming_soon'] as const)[i % 3],
    isNew: i < 8,
    isTrending: i < 10,
    trendingRank: i < 10 ? i + 1 : undefined,
    releaseDate: new Date(2024, Math.floor(i / 2) % 12, (i % 28) + 1).toISOString(),
    updateDay: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
    views: Math.floor(100000 + Math.random() * 9_900_000),
    likes: Math.floor(10000 + Math.random() * 99_000),
    comments: Math.floor(1000 + Math.random() * 9_000),
  }
})

export const mockEpisodes: Record<string, Episode[]> = {}
mockDramas.forEach((drama) => {
  mockEpisodes[drama.id] = Array.from({ length: drama.totalEpisodes }, (_, i) => ({
    id: `ep-${drama.id}-${i + 1}`,
    dramaId: drama.id,
    episodeNumber: i + 1,
    title: `Episode ${i + 1}`,
    thumbnail: drama.poster,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 180 + Math.floor(Math.random() * 420), // 3-10 min
  }))
})
