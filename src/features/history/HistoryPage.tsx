import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import {
  Search, Trash2, X, Clock, Trash2Icon, AlertTriangle,
} from 'lucide-react'
import { getHistory, removeHistory, clearHistory } from '@/services/historyService'
import type { HistoryEntry } from '@/types/history'

/* ============================================================
   HistoryPage — 完整浏览历史页面
   搜索 | 时间筛选 | 日期分组 | 单条删除 | 一键清空
   ============================================================ */

type TimeFilter = 'all' | 'today' | 'week' | 'month'

export function HistoryPage() {
  // ---- 状态 ----
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [historyList, setHistoryList] = useState<HistoryEntry[]>(() => getHistory())

  const navigate = useNavigate()

  // ---- 刷新列表 ----
  const refresh = useCallback(() => {
    setHistoryList(getHistory())
  }, [])

  // ---- 过滤 & 分组 ----
  const filtered = useMemo(() => {
    let list = [...historyList]

    // 时间范围筛选
    if (timeFilter !== 'all') {
      const now = Date.now()
      const ranges: Record<TimeFilter, number> = {
        all: 0,
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
      }
      const threshold = ranges[timeFilter]
      list = list.filter((e) => now - new Date(e.visitTime).getTime() <= threshold)
    }

    // 关键词模糊搜索
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.url.toLowerCase().includes(q)
      )
    }

    return list
  }, [historyList, searchQuery, timeFilter])

  // 按日期分组
  const grouped = useMemo(() => {
    const groups: { label: string; entries: HistoryEntry[] }[] = []
    const seen = new Map<string, HistoryEntry[]>()

    filtered.forEach((entry) => {
      const date = new Date(entry.visitTime)
      const label = getDateLabel(date)
      if (!seen.has(label)) {
        seen.set(label, [])
        groups.push({ label, entries: seen.get(label)! })
      }
      seen.get(label)!.push(entry)
    })

    return groups
  }, [filtered])

  // ---- 删除操作 ----
  const handleDelete = useCallback((id: string) => {
    removeHistory(id)
    setConfirmDeleteId(null)
    refresh()
  }, [refresh])

  const handleClearAll = useCallback(() => {
    clearHistory()
    setConfirmClear(false)
    refresh()
  }, [refresh])

  // ---- 渲染 ----   
  return (
    <AppLayout>
      {/* ==================== Header ==================== */}
      <header className="pt-4 pb-3">
        <h1 className="text-2xl font-bold font-sora text-brand-text mb-1">
          Watch History
        </h1>
        <p className="text-sm text-brand-muted">
          {historyList.length > 0
            ? `${historyList.length} ${historyList.length === 1 ? 'entry' : 'entries'}`
            : 'Track your recently watched dramas'}
        </p>
      </header>

      {/* ==================== 搜索 + 筛选工具栏 ==================== */}
      <div className="mb-5 space-y-3">
        {/* 搜索栏 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full h-10 pl-9 pr-8 rounded-xl bg-brand-surface border border-white/5
                       text-sm text-brand-text placeholder:text-brand-muted
                       focus:outline-none focus:border-brand-pink/30 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5 text-brand-muted" />
            </button>
          )}
        </div>

        {/* 时间筛选 + 清空按钮 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex gap-1.5">
            {(['all', 'today', 'week', 'month'] as TimeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  timeFilter === f
                    ? 'bg-brand-pink/15 text-brand-pink border border-brand-pink/30'
                    : 'bg-brand-surface text-brand-muted border border-white/5 hover:text-brand-text'
                }`}
              >
                {f === 'all' ? 'All' : f === 'today' ? 'Today' : f === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>

          {/* 一键清空 */}
          {historyList.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium
                         bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex-shrink-0"
            >
              <Trash2Icon className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ==================== 确认清空弹窗 ==================== */}
      {confirmClear && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-brand-surface rounded-2xl border border-white/10 p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/15 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-brand-text mb-1">Clear all history?</h3>
            <p className="text-sm text-brand-muted mb-5">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-bg border border-white/5 text-sm font-medium text-brand-text transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 空状态 ==================== */}
      {historyList.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-surface flex items-center justify-center">
            <Clock className="w-8 h-8 text-brand-muted" />
          </div>
          <h2 className="text-lg font-semibold text-brand-text">No watch history</h2>
          <p className="text-sm text-brand-muted max-w-[240px]">
            Dramas you visit will appear here
          </p>
        </div>
      )}

      {/* ==================== 空搜索结果 ==================== */}
      {historyList.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-center gap-3">
          <p className="text-brand-muted text-sm">No results found</p>
          <button
            onClick={() => { setSearchQuery(''); setTimeFilter('all') }}
            className="text-sm text-brand-pink hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ==================== 历史列表（按日期分组） ==================== */}
      {filtered.length > 0 && (
        <div className="space-y-6 pb-4">
          {grouped.map((group) => (
            <div key={group.label}>
              {/* 日期分组标题 */}
              <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3 sticky top-0 bg-brand-bg/95 backdrop-blur-sm py-1 z-[5]">
                {group.label}
              </h3>

              <div className="space-y-1.5">
                {group.entries.map((entry) => (
                  <HistoryItem
                    key={entry.id}
                    entry={entry}
                    isConfirming={confirmDeleteId === entry.id}
                    onDeleteRequest={() => setConfirmDeleteId(entry.id)}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                    onConfirmDelete={() => handleDelete(entry.id)}
                    onClick={() => navigate(entry.url)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 清除确认弹窗遮罩层（关闭已有的confirm clear） */}
    </AppLayout>
  )
}

/* ============================================================
   HistoryItem — 单条历史记录
   ============================================================ */
interface HistoryItemProps {
  entry: HistoryEntry
  isConfirming: boolean
  onDeleteRequest: () => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
  onClick: () => void
}

function HistoryItem({
  entry,
  isConfirming,
  onDeleteRequest,
  onCancelDelete,
  onConfirmDelete,
  onClick,
}: HistoryItemProps) {
  const timeStr = formatVisitTime(entry.visitTime)

  return (
    <div
      className={`group relative rounded-xl overflow-hidden transition-all duration-200 ${
        isConfirming ? 'bg-red-500/10 border border-red-500/20' : 'bg-brand-surface/50 hover:bg-brand-surface border border-white/5'
      }`}
    >
      <div className="flex items-center gap-3 p-3">
        {/* 缩略图 */}
        <div
          className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-brand-bg cursor-pointer"
          onClick={onClick}
        >
          {entry.coverImage ? (
            <img src={entry.coverImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-brand-muted/40" />
            </div>
          )}
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
          <h4 className="text-sm font-semibold text-brand-text truncate">{entry.title}</h4>
          {entry.episode != null && (
            <p className="text-xs text-brand-pink/70 mt-0.5">Episode {entry.episode}</p>
          )}
          <p className="text-[11px] text-brand-muted mt-1 truncate">{entry.url}</p>
        </div>

        {/* 右侧：时间 + 删除 */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-[11px] text-brand-muted whitespace-nowrap">{timeStr}</span>

          {isConfirming ? (
            <div className="flex gap-1.5">
              <button
                onClick={onConfirmDelete}
                className="text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={onCancelDelete}
                className="text-[11px] text-brand-muted hover:text-brand-text transition-colors"
              >
                Keep
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteRequest() }}
              className="w-6 h-6 flex items-center justify-center rounded-full
                         opacity-0 group-hover:opacity-100 transition-all
                         hover:bg-red-500/15 text-brand-muted hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   时间格式化工具
   ============================================================ */

/** 按日期分组标签 */
function getDateLabel(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = (today.getTime() - target.getTime()) / (24 * 60 * 60 * 1000)

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return 'This Week'
  if (diff < 30) return 'This Month'

  const month = date.toLocaleString('en-US', { month: 'long' })
  return `${month} ${date.getFullYear()}`
}

/** 格式化访问时间 */
function formatVisitTime(iso: string): string {
  const d = new Date(iso)
  const hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${minutes} ${ampm}`
}
