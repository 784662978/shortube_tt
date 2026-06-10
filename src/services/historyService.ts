import type { HistoryEntry } from '@/types/history'

const STORAGE_KEY = 'shortube_history'
const MAX_ENTRIES = 200

/** 从 localStorage 读取全部历史记录（按时间倒序） */
export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list: HistoryEntry[] = JSON.parse(raw)
    return list.sort(
      (a, b) => new Date(b.visitTime).getTime() - new Date(a.visitTime).getTime()
    )
  } catch {
    return []
  }
}

/** 写入一条历史记录（去重同 dramaId，保留最新 episode） */
export function addHistory(entry: Omit<HistoryEntry, 'id' | 'visitTime'>): void {
  const list = getHistory()

  // 若同 dramaId 已存在，更新而非新增
  const existingIdx = entry.dramaId
    ? list.findIndex((e) => e.dramaId === entry.dramaId)
    : -1

  const now = new Date().toISOString()

  if (existingIdx !== -1) {
    // 更新现有记录：时间 + episode
    list[existingIdx] = {
      ...list[existingIdx],
      ...entry,
      visitTime: now,
    }
  } else {
    // 新增记录
    list.unshift({
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      visitTime: now,
    })
  }

  // 裁剪到最大条数
  if (list.length > MAX_ENTRIES) {
    list.length = MAX_ENTRIES
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/** 删除单条历史记录 */
export function removeHistory(id: string): void {
  const list = getHistory().filter((e) => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/** 清空全部历史记录 */
export function clearHistory(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
}
