import { useEffect, useRef } from 'react'

interface SwipeHandlers {
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

interface SwipeState {
  isSwiping: boolean
  deltaX: number
  deltaY: number
  direction: 'up' | 'down' | 'left' | 'right' | null
}

const SWIPE_THRESHOLD = 80
const VELOCITY_THRESHOLD = 0.3

export function useSwipe(
  elementRef: React.RefObject<HTMLElement | null>,
  handlers: SwipeHandlers
): SwipeState {
  const stateRef = useRef<SwipeState>({
    isSwiping: false,
    deltaX: 0,
    deltaY: 0,
    direction: null,
  })

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    let startY = 0
    let startX = 0
    let startTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      startTime = Date.now()
      stateRef.current.isSwiping = true
      stateRef.current.deltaX = 0
      stateRef.current.deltaY = 0
      stateRef.current.direction = null
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!stateRef.current.isSwiping) return
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY
      stateRef.current.deltaX = dx
      stateRef.current.deltaY = dy

      if (Math.abs(dx) > Math.abs(dy)) {
        stateRef.current.direction = dx > 0 ? 'right' : 'left'
      } else {
        stateRef.current.direction = dy > 0 ? 'down' : 'up'
      }
    }

    const handleTouchEnd = () => {
      if (!stateRef.current.isSwiping) return
      stateRef.current.isSwiping = false

      const { deltaX, deltaY, direction } = stateRef.current
      const elapsed = (Date.now() - startTime) / 1000
      const velocityY = Math.abs(deltaY) / elapsed
      const velocityX = Math.abs(deltaX) / elapsed

      if (direction === 'up' && (deltaY < -SWIPE_THRESHOLD || velocityY > VELOCITY_THRESHOLD)) {
        handlers.onSwipeUp?.()
      } else if (direction === 'down' && (deltaY > SWIPE_THRESHOLD || velocityY > VELOCITY_THRESHOLD)) {
        handlers.onSwipeDown?.()
      } else if (direction === 'left' && (deltaX < -SWIPE_THRESHOLD || velocityX > VELOCITY_THRESHOLD)) {
        handlers.onSwipeLeft?.()
      } else if (direction === 'right' && (deltaX > SWIPE_THRESHOLD || velocityX > VELOCITY_THRESHOLD)) {
        handlers.onSwipeRight?.()
      }

      stateRef.current.deltaX = 0
      stateRef.current.deltaY = 0
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [elementRef, handlers])

  return stateRef.current
}
