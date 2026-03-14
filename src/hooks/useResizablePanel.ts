import { useState, useRef, useEffect, useCallback } from 'react'

interface UseResizablePanelOptions {
  legacyStorageKey?: string
  resizeFrom?: 'right' | 'left'
  collapseThreshold?: number
  onCollapse?: () => void
  snapPoints?: number[]
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val))
}

const SNAP_RADIUS = 14

export function useResizablePanel(
  storageKey: string,
  defaultWidth: number,
  min: number,
  max: number,
  options?: UseResizablePanelOptions,
) {
  const legacyStorageKey = options?.legacyStorageKey
  const resizeFrom = options?.resizeFrom ?? 'right'
  const collapseThreshold = options?.collapseThreshold
  const onCollapse = options?.onCollapse

  // Keep mutable refs so the pointermove closure never goes stale
  const snapPointsRef = useRef(options?.snapPoints)
  snapPointsRef.current = options?.snapPoints
  const defaultWidthRef = useRef(defaultWidth)
  defaultWidthRef.current = defaultWidth

  const [width, setWidthState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) return clamp(Number(stored), min, max)

      if (legacyStorageKey) {
        const legacyStored = localStorage.getItem(legacyStorageKey)
        if (legacyStored) return clamp(Number(legacyStored), min, max)
      }
    } catch { /* ignore */ }
    return defaultWidth
  })
  const [isDragging, setIsDragging] = useState(false)
  const [willCollapse, setWillCollapse] = useState(false)
  const collapseRef = useRef(false)
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startW: 0,
    pointerId: 0,
    target: null as HTMLElement | null,
  })

  const setWidth = useCallback((w: number) => {
    setWidthState(clamp(w, min, max))
  }, [max, min])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(width))
    } catch {
      /* ignore */
    }
  }, [storageKey, width])

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.dragging) return
      const delta = e.clientX - dragRef.current.startX
      let nextWidth = dragRef.current.startW + delta * (resizeFrom === 'left' ? -1 : 1)

      if (collapseThreshold) {
        const nextWillCollapse = nextWidth < collapseThreshold
        collapseRef.current = nextWillCollapse
        setWillCollapse(nextWillCollapse)
        if (nextWillCollapse) return
      }

      // Snap to natural sizes when close enough
      const snaps = snapPointsRef.current
      if (snaps?.length) {
        for (const snap of snaps) {
          if (Math.abs(nextWidth - snap) < SNAP_RADIUS) {
            nextWidth = snap
            break
          }
        }
      }

      setWidth(nextWidth)
    }

    const onPointerUp = () => {
      if (!dragRef.current.dragging) return
      const shouldCollapse = collapseRef.current && Boolean(collapseThreshold && onCollapse)

      if (dragRef.current.target?.hasPointerCapture(dragRef.current.pointerId)) {
        dragRef.current.target.releasePointerCapture(dragRef.current.pointerId)
      }

      dragRef.current.dragging = false
      dragRef.current.target = null
      delete document.body.dataset.resizing
      document.body.style.userSelect = ''
      setIsDragging(false)
      collapseRef.current = false
      setWillCollapse(false)

      if (shouldCollapse && onCollapse) {
        onCollapse()
      }
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }, [collapseThreshold, onCollapse, resizeFrom, setWidth])

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startW: width,
      pointerId: e.pointerId,
      target: e.currentTarget,
    }
    document.body.dataset.resizing = 'true'
    document.body.style.userSelect = 'none'
    collapseRef.current = false
    setWillCollapse(false)
    setIsDragging(true)
  }

  // Double-click to reset to the default width
  const onDoubleClick = useCallback(() => {
    const target = defaultWidthRef.current
    setWidthState(clamp(target, min, max))
    try {
      localStorage.setItem(storageKey, String(clamp(target, min, max)))
    } catch { /* ignore */ }
  }, [min, max, storageKey])

  return { width, onPointerDown, onDoubleClick, isDragging, willCollapse }
}
