import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Flame, X, ChevronUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useMoviesData } from '@/hooks/useMoviesData'
import { moviesService } from '@/services/moviesService'
import { addHistory } from '@/services/historyService'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

/* ============================================================
   DramaDetailPage — 全屏视频 + 英雄区 + 剧集底部弹窗
   排除：右侧点赞/评论/分享按钮
   ============================================================ */

export function DramaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { allDramas, isLoading: dataLoading } = useMoviesData()

  const drama = allDramas.find((d) => String(d.id) === id)

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!drama) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-muted">
        Drama not found
      </div>
    )
  }

  return <DetailContent drama={drama} onBack={() => navigate(-1)} />
}

/* ============================================================
   DetailContent — 核心渲染（分离出来避免 hooks 条件调用）
   ============================================================ */
interface DetailContentProps {
  drama: NonNullable<ReturnType<typeof useMoviesData>['allDramas'][number]>
  onBack: () => void
}

function DetailContent({ drama, onBack }: DetailContentProps) {
  // ---- 视频播放状态 ----
  const videoRef = useRef<HTMLVideoElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const isSeeking = useRef(false)

  // ---- 剧集弹窗状态 ----
  const [showEpisodes, setShowEpisodes] = useState(false)
  const [activeEpisodeIdx, setActiveEpisodeIdx] = useState(0)

  // ---- 获取剧集列表 ----
  const { data: episodes = [] } = useQuery({
    queryKey: ['movie-episodes', drama.id],
    queryFn: async () => {
      const res = await moviesService.getMovieEpisodes({ id: String(drama.id) })
      return res.response || []
    },
    staleTime: 30 * 60 * 1000,
  })

  // 当前播放地址
  const currentPlayUrl = episodes[activeEpisodeIdx]?.playurl || ''
  const totalEpisodes = parseInt(drama.totalEpisodes?.toString() || '0', 10)
  const displayEpCount = totalEpisodes > 0 ? totalEpisodes : Math.max(episodes.length, 1)

  // ---- 自动播放当前集 ----
  useEffect(() => {
    const video = videoRef.current
    if (!video || !currentPlayUrl) return

    const timer = setTimeout(() => {
      video.play().catch(() => {
        video.muted = true
        video.play().catch(() => {})
      })
    }, 200)

    return () => clearTimeout(timer)
  }, [currentPlayUrl, activeEpisodeIdx])

  // ---- 视频事件绑定 ----
  useEffect(() => {
    const video = videoRef.current
    if (!video || !currentPlayUrl) return

    const onTimeUpdate = () => {
      if (!isSeeking.current && video.duration) {
        setProgress(video.currentTime / video.duration)
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
  }, [currentPlayUrl])

  // ---- 记录浏览历史 ----
  useEffect(() => {
    addHistory({
      title: drama.title,
      url: `/drama/${drama.id}`,
      coverImage: drama.poster,
      dramaId: String(drama.id),
      episode: activeEpisodeIdx + 1,
    })
  }, [drama.id, drama.title, drama.poster, activeEpisodeIdx])

  // ---- 点击切换播放/暂停 ----
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.paused ? video.play().catch(() => {}) : video.pause()
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

  // ---- 切换剧集 ----
  const selectEpisode = (idx: number) => {
    setActiveEpisodeIdx(idx)
    setProgress(0)
    setDuration(0)
    setIsPlaying(false)
    setShowEpisodes(false)
  }

  // 分类标签
  const categoryLabel = drama.genres?.[0]?.name

  return (
    <div className="fixed inset-0 bg-[#0E0E11] z-50 max-w-[480px] mx-auto overflow-hidden flex flex-col">
      {/* ==================== 全屏视频区域 ==================== */}
      <div className="relative w-full flex-1 min-h-0 bg-black">
        {/* 视频 / 封面背景 */}
        {currentPlayUrl ? (
          <video
            ref={videoRef}
            src={currentPlayUrl}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            loop
            preload="metadata"
          />
        ) : (
          <img
            src={drama.banner || drama.poster}
            alt={drama.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* 30% 黑色遮罩 */}
        <div className="absolute inset-0 bg-black/30" />

        {/* 点击切换播放/暂停蒙层 */}
        {currentPlayUrl && (
          <div
            className="absolute inset-0 z-[15] cursor-pointer"
            onClick={togglePlay}
          />
        )}

        {/* 暂停图标 */}
        {!isPlaying && currentPlayUrl && (
          <div className="absolute inset-0 z-[20] flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        {/* ==================== 顶部导航栏 ==================== */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/60 to-transparent px-4 pt-3 pb-6">
          <div className="flex items-center justify-between h-[44px]">
            {/* 返回按钮 */}
            <button
              onClick={onBack}
              className="w-[32px] h-[32px] rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>

            {/* 剧名 */}
            <span className="text-xl font-semibold font-sora text-[#FFB3B5] truncate max-w-[180px]">
              {drama.title}
            </span>

            {/* 右侧占位（保持标题居中效果） */}
            <div className="w-[32px]" />
          </div>
        </div>

        {/* ==================== 底部信息覆盖层 ==================== */}
        <div className="absolute left-0 right-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-32 pb-8 px-4 pointer-events-none">
          {/* 玻璃标签行 */}
          <div className="flex items-center gap-2 mb-3">
            {drama.trendingRank && (
              <div className="flex items-center gap-1 h-[26px] px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span className="text-xs font-bold text-white">Trending #{drama.trendingRank}</span>
              </div>
            )}
            {categoryLabel && (
              <div className="h-[26px] px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-xs font-bold text-white">#{categoryLabel}</span>
              </div>
            )}
          </div>

          {/* 剧名 */}
          <h1 className="text-xl font-semibold font-sora text-[#E4E1E6] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] line-clamp-2">
            Episode {activeEpisodeIdx + 1}: {drama.title}
          </h1>

          {/* 描述 */}
          <p className="text-sm text-[#E6BCBD] leading-relaxed line-clamp-2 mb-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {drama.description}
          </p>

          {/* SERIES INFO 按钮 → 触发底部弹窗 */}
          <button
            onClick={() => setShowEpisodes(true)}
            className="flex items-center gap-1.5 pointer-events-auto group"
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" className="text-[#FFB3B5]">
              <path d="M7 0L8.84 5.29H14L9.58 8.42L11.41 13.71L7 10.58L2.59 13.71L4.42 8.42L0 5.29H5.16L7 0Z" fill="currentColor" />
            </svg>
            <span className="text-xs font-bold text-[#FFB3B5] tracking-widest uppercase">
              Series Info
            </span>
          </button>
        </div>

        {/* ==================== 进度条 ==================== */}
        {currentPlayUrl && duration > 0 && (
          <div className="absolute inset-x-0 bottom-0 z-[25] px-4 pb-1 pointer-events-none">
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
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-pink to-brand-purple transition-[width] duration-75"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ left: `calc(${progress * 100}% - 6px)` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ==================== 底部剧集选择弹窗 ==================== */}
      {showEpisodes && (
        <EpisodeBottomSheet
          totalCount={displayEpCount}
          activeIndex={activeEpisodeIdx}
          onSelect={selectEpisode}
          onClose={() => setShowEpisodes(false)}
        />
      )}
    </div>
  )
}

/* ============================================================
   EpisodeBottomSheet — 底部弹出剧集网格
   ============================================================ */
interface EpisodeSheetProps {
  totalCount: number
  activeIndex: number
  onSelect: (idx: number) => void
  onClose: () => void
}

function EpisodeBottomSheet({
  totalCount,
  activeIndex,
  onSelect,
  onClose,
}: EpisodeSheetProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  // 动画状态：entering → active → exiting
  const [animState, setAnimState] = useState<'entering' | 'active' | 'exiting'>('entering')

  // 挂载后下一帧触发入场：先渲染 translateY(100%)，再 transition 到 translateY(0)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setAnimState('active')
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  // 关闭：先触发退出动画，等 transition 完成后再通知父组件卸载
  const handleClose = useCallback(() => {
    if (animState === 'exiting') return
    setAnimState('exiting')
    setTimeout(onClose, 300) // 与 CSS transition duration 一致
  }, [animState, onClose])

  // 弹窗打开时自动滚动到当前播放集数（等待入场动画完成后执行）
  useEffect(() => {
    if (animState !== 'active') return
    const timer = setTimeout(() => {
      const el = document.getElementById(`episode-btn-${activeIndex}`)
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [animState, activeIndex])

  // 动画对应的 transform
  const sheetTransform =
    animState === 'active'  ? 'translateY(0)' :
    animState === 'exiting' ? 'translateY(100%)' :
    'translateY(100%)' // entering: 从底部开始

  const overlayOpacity = animState === 'exiting' || animState === 'entering' ? 'opacity-0' : 'opacity-100'

  return (
    <>
      {/* 背景遮罩 — 淡入淡出 */}
      <div
        className={`absolute inset-0 z-[35] bg-black/50 backdrop-blur-sm cursor-pointer transition-opacity duration-300 ease-out ${overlayOpacity}`}
        onClick={handleClose}
        style={{ willChange: 'opacity' }}
      />

      {/* 弹窗面板 — 从底部滑入/滑出 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[40] bg-[#1F1F22] rounded-t-xl border-t border-[#5D3F40] shadow-lg max-h-[70vh] flex flex-col"
        style={{
          transform: sheetTransform,
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        {/* 拖拽手柄 */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-[36px] h-[4px] rounded-full bg-white/20" />
        </div>

        {/* 标题栏 */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold font-sora text-[#FFB3B5]">Series Information</h2>
          <button
            onClick={handleClose}
            className="w-[22px] h-[22px] rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-[14px] h-[14px] text-[#E6BCBD]" />
          </button>
        </div>

        {/* Tab: 仅 Episodes */}
        <div className="px-4 pb-3">
          <div className="flex items-end border-b border-[#5D3F40]/30">
            <button className="pb-2 border-b-2 border-[#FFB3B5] flex items-center gap-1.5">
              <ChevronUp className="w-3.5 h-3.5 text-[#FFB3B5]" />
              <span className="text-xs font-bold text-[#FFB3B5]">Episodes</span>
            </button>
          </div>
        </div>

        {/* 剧集网格 — 直接渲染全部集数 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="grid grid-cols-5 gap-2.5" style={{ gridAutoRows: '65px' }}>
            {Array.from({ length: totalCount }).map((_, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={idx}
                  id={`episode-btn-${idx}`}
                  onClick={() => onSelect(idx)}
                  className={`rounded-lg flex items-center justify-center text-lg font-semibold font-sora transition-all ${
                    isActive
                      ? 'bg-[#FF5167] shadow-[0_0_15px_rgba(255,81,103,0.30)] outline outline-1 outline-[#FFB3B5] text-[#5B0015]'
                      : 'bg-[#353438]/50 outline outline-1 outline-white/5 text-[#E6BCBD]'
                  }`}
                  style={{ aspectRatio: '1' }}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
