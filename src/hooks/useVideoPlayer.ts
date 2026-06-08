import { useRef, useCallback } from 'react'

export interface VideoPlayerControls {
  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => void
  setVolume: (vol: number) => void
  getCurrentTime: () => number
  getDuration: () => number
}

export function useVideoPlayer(): {
  playerRef: React.RefObject<HTMLVideoElement | null>
  controls: VideoPlayerControls
} {
  const playerRef = useRef<HTMLVideoElement | null>(null)

  const controls: VideoPlayerControls = {
    play: async () => {
      if (playerRef.current) {
        try {
          await playerRef.current.play()
        } catch {
          // Autoplay blocked
        }
      }
    },
    pause: () => {
      playerRef.current?.pause()
    },
    seek: (time) => {
      if (playerRef.current) {
        playerRef.current.currentTime = time
      }
    },
    setVolume: (vol) => {
      if (playerRef.current) {
        playerRef.current.volume = vol
      }
    },
    getCurrentTime: () => playerRef.current?.currentTime || 0,
    getDuration: () => playerRef.current?.duration || 0,
  }

  return { playerRef, controls }
}
