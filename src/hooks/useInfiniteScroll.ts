import { useEffect, useRef, useState } from 'react'

export function useInfiniteScroll(
  callback: () => void,
  options?: { threshold?: number; enabled?: boolean }
) {
  const { threshold = 0.3, enabled = true } = options || {}
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [sentinelRef, setSentinelRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!enabled || !sentinelRef) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback()
        }
      },
      { threshold }
    )

    observerRef.current.observe(sentinelRef)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [callback, threshold, enabled, sentinelRef])

  return setSentinelRef
}
