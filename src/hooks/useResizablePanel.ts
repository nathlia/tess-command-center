import { useState, useRef, useEffect, useCallback } from 'react'

interface UseResizablePanelOptions {
  legacyStorageKey?: string
  resizeFrom?: 'right' | 'left'
  collapseThreshold?: number
  onCollapse?: () => void
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val))
}

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
      const nextWidth =
        dragRef.current.startW + delta * (resizeFrom === 'left' ? -1 : 1)

      if (collapseThreshold) {
        const nextWillCollapse = nextWidth < collapseThreshold
        collapseRef.current = nextWillCollapse
        setWillCollapse(nextWillCollapse)
      }

      if (collapseThreshold && nextWidth < collapseThreshold) {
        return
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
      document.body.style.cursor = ''
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
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    collapseRef.current = false
    setWillCollapse(false)
    setIsDragging(true)
  }

  return { width, onPointerDown, isDragging, willCollapse }
}
