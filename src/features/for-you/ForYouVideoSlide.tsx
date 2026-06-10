import { useRef, useEffect, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { moviesService } from '@/services/moviesService'
import { addHistory } from '@/services/historyService'
import { Flame, ChevronRight, Play } from 'lucide-react'
import type { Drama } from '@/types/drama'

/** 观看记录阈值：播放 ≥ 10s 或 ≥ 30% 进度即记录 */
const WATCH_TIME_THRESHOLD = 10
const WATCH_PROGRESS_THRESHOLD = 0.3

interface ForYouVideoSlideProps {
  drama: Drama
  isActive: boolean
  onViewDetail: (dramaId: string) => void
}

export function ForYouVideoSlide({ drama, isActive, onViewDetail }: ForYouVideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const isSeeking = useRef(false)
  const hasRecorded = useRef(false)

  const { data: episodes } = useQuery({
    queryKey: ['movie-episodes', drama.id],
    queryFn: async () => {
      const res = await moviesService.getMovieEpisodes({ id: drama.id })
      return res.response || []
    },
    staleTime: 30 * 60 * 1000,
  })

  const playUrl = episodes?.[0]?.playurl || ''
  const episodesCount = parseInt(drama.totalEpisodes?.toString() || '0', 10)
  const displayEpCount = episodesCount > 0 ? episodesCount : (episodes?.length || 1)

  // ---- active slide 自动播放 ----
  useEffect(() => {
    const video = videoRef.current
    if (!video || !playUrl) return

    if (isActive) {
      hasRecorded.current = false
      video.play().catch(() => {
        video.muted = true
        video.play().catch(() => {})
      })
    } else {
      video.pause()
      video.currentTime = 0
      setProgress(0)
      setIsPlaying(false)
    }
  }, [isActive, playUrl])

  // ---- 视频事件绑定 ----
  useEffect(() => {
    const video = videoRef.current
    if (!video || !playUrl) return

    const onTimeUpdate = () => {
      if (!isSeeking.current && video.duration) {
        const cur = video.currentTime
        setProgress(cur / video.duration)

        // 达到阈值时写入历史记录（仅一次）
        if (
          !hasRecorded.current &&
          (cur >= WATCH_TIME_THRESHOLD || cur / video.duration >= WATCH_PROGRESS_THRESHOLD)
        ) {
          hasRecorded.current = true
          addHistory({
            title: drama.title,
            url: `/drama/${drama.id}`,
            coverImage: drama.poster,
            dramaId: String(drama.id),
            episode: 1,
          })
        }
      }
    }
    const onDurationChange = () => setDuration(video.duration)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [playUrl])

  // ---- 点击切换 播放/暂停 ----
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [])

  // ---- 进度条拖动 ----
  const seek = useCallback((clientX: number) => {
    const bar = barRef.current
    const video = videoRef.current
    if (!bar || !video || !video.duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    video.currentTime = ratio * video.duration
    setProgress(ratio)
  }, [])

  const handleSeekStart = useCallback((clientX: number) => {
    isSeeking.current = true
    seek(clientX)
  }, [seek])

  const handleSeekMove = useCallback((clientX: number) => {
    if (!isSeeking.current) return
    seek(clientX)
  }, [seek])

  const handleSeekEnd = useCallback(() => {
    isSeeking.current = false
  }, [])

  const categoryLabel = drama.genres?.[0]?.name

  return (
    <div className="relative w-full h-full bg-black">
      {/* 视频背景 */}
      {playUrl ? (
        <video
          ref={videoRef}
          src={playUrl}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted
          preload="metadata"
        />
      ) : (
        <img
          src={drama.banner || drama.poster}
          alt={drama.title}
          className="w-full h-full object-cover"
        />
      )}

      {/* 点击切换播放/暂停的透明蒙层 */}
      {playUrl && (
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={togglePlay}
        />
      )}

      {/* 暂停状态指示器（始终可见） */}
      {!isPlaying && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* 底部渐变遮罩 */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/50 to-transparent pointer-events-none" />

      {/* 进度条区域（仅进度条，无时间信息） */}
      {playUrl && duration > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-1 pointer-events-none">
          <div
            ref={barRef}
            className="w-full h-1 bg-white/15 rounded-full overflow-hidden cursor-pointer pointer-events-auto group relative"
            onMouseDown={(e) => handleSeekStart(e.clientX)}
            onMouseMove={(e) => { if (isSeeking.current) handleSeekMove(e.clientX) }}
            onMouseUp={handleSeekEnd}
            onMouseLeave={handleSeekEnd}
            onTouchStart={(e) => { e.stopPropagation(); handleSeekStart(e.touches[0].clientX) }}
            onTouchMove={(e) => { e.stopPropagation(); handleSeekMove(e.touches[0].clientX) }}
            onTouchEnd={(e) => { e.stopPropagation(); handleSeekEnd() }}
          >
            {/* 已播放部分 */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-pink to-brand-purple transition-[width] duration-75"
              style={{ width: `${progress * 100}%` }}
            />
            {/* 拖动手柄 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${progress * 100}% - 6px)` }}
            />
          </div>
        </div>
      )}

      {/* 信息覆盖层 */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-12 w-[80%] pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          {drama.trendingRank && (
            <div className="flex items-center gap-1 h-[26px] px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span className="text-xs font-bold text-white">Trending</span>
            </div>
          )}
          {categoryLabel && (
            <div className="h-[26px] px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-xs font-bold text-white">#{categoryLabel}</span>
            </div>
          )}
        </div>

        <h3 className="text-2xl font-black font-sora text-white mb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] leading-tight line-clamp-2">
          {drama.title}
        </h3>

        <p className="text-sm text-[#E6BCBD] leading-relaxed line-clamp-2 mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          {drama.description}
        </p>

        <div className="flex items-center h-[102px] px-3 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 pointer-events-auto">
          <div className="w-[33px] h-[40px] rounded-lg overflow-hidden flex-shrink-0 bg-[#1F1F22] mr-3">
            <img
              src={drama.poster}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold font-sora text-white truncate leading-tight">
              {drama.title}
            </h4>
            <p className="text-sm text-[#FFB3B5] mt-1">
              Episode 1 / {displayEpCount}
            </p>
          </div>

          <button
            onClick={() => onViewDetail(drama.id)}
            className="flex items-center gap-1 flex-shrink-0 ml-2 pointer-events-auto"
          >
            <span className="text-xs font-bold text-[#FFB3B5]">Watch</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#FFB3B5]" />
          </button>
        </div>
      </div>
    </div>
  )
}
