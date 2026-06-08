import { create } from 'zustand'

interface PlayerState {
  currentDramaId: string | null
  currentEpisodeIndex: number
  playbackPosition: number
  isPlaying: boolean
  setCurrentDrama: (dramaId: string, episodeIndex?: number) => void
  setPlaybackPosition: (position: number) => void
  setIsPlaying: (playing: boolean) => void
  nextEpisode: () => void
  prevEpisode: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentDramaId: null,
  currentEpisodeIndex: 0,
  playbackPosition: 0,
  isPlaying: false,
  setCurrentDrama: (dramaId, episodeIndex = 0) =>
    set({ currentDramaId: dramaId, currentEpisodeIndex: episodeIndex, playbackPosition: 0 }),
  setPlaybackPosition: (position) => set({ playbackPosition: position }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  nextEpisode: () => set((s) => ({ currentEpisodeIndex: s.currentEpisodeIndex + 1 })),
  prevEpisode: () =>
    set((s) => ({
      currentEpisodeIndex: Math.max(0, s.currentEpisodeIndex - 1),
    })),
}))
