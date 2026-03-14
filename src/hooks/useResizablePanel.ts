import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react'

interface UseResizablePanelOptions {
  legacyStorageKey?: string
  resizeFrom?: 'right' | 'left'
  collapseThreshold?: number
  onCollapse?: () => void
  snapPoints?: number[]
  liveElementRef?: RefObject<HTMLElement | null>
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val))
}

function getSnappedWidth(width: number, snapPoints?: number[]) {
  if (!snapPoints?.length) return width

  const SNAP_RADIUS = 10

  for (const snap of snapPoints) {
    if (Math.abs(width - snap) < SNAP_RADIUS) {
      return snap
    }
  }

  return width
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
  const snapPoints = options?.snapPoints
  const liveElementRef = options?.liveElementRef

  const [width, setWidthState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) return clamp(Number(stored), min, max)

      if (legacyStorageKey) {
        const legacyStored = localStorage.getItem(legacyStorageKey)
        if (legacyStored) return clamp(Number(legacyStored), min, max)
      }
    } catch {
      /* ignore */
    }

    return defaultWidth
  })

  const [isDragging, setIsDragging] = useState(false)
  const [willCollapse, setWillCollapse] = useState(false)
  const widthRef = useRef(width)
  const pendingWidthRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)
  const collapseRef = useRef(false)
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startW: 0,
    pointerId: 0,
    target: null as HTMLElement | null,
  })

  const persistWidth = useCallback((nextWidth: number) => {
    try {
      localStorage.setItem(storageKey, String(nextWidth))
    } catch {
      /* ignore */
    }
  }, [storageKey])

  const applyLiveWidth = useCallback((nextWidth: number) => {
    const clamped = clamp(nextWidth, min, max)
    widthRef.current = clamped

    if (liveElementRef?.current) {
      liveElementRef.current.style.width = `${clamped}px`
    }

    return clamped
  }, [liveElementRef, max, min])

  const commitWidth = useCallback((nextWidth: number) => {
    const clamped = applyLiveWidth(nextWidth)
    setWidthState(currentWidth => (currentWidth === clamped ? currentWidth : clamped))
    return clamped
  }, [applyLiveWidth])

  useLayoutEffect(() => {
    applyLiveWidth(width)
  }, [applyLiveWidth, width])

  const flushPendingWidth = useCallback(() => {
    frameRef.current = null

    if (pendingWidthRef.current === null) {
      return widthRef.current
    }

    const nextWidth = pendingWidthRef.current
    pendingWidthRef.current = null
    return applyLiveWidth(nextWidth)
  }, [applyLiveWidth])

  const scheduleWidthUpdate = useCallback((nextWidth: number) => {
    pendingWidthRef.current = nextWidth

    if (frameRef.current !== null) {
      return
    }

    frameRef.current = requestAnimationFrame(() => {
      flushPendingWidth()
    })
  }, [flushPendingWidth])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.dragging) return

      const delta = e.clientX - dragRef.current.startX
      const nextWidth = dragRef.current.startW + delta * (resizeFrom === 'left' ? -1 : 1)

      if (collapseThreshold) {
        const nextWillCollapse = nextWidth < collapseThreshold
        if (collapseRef.current !== nextWillCollapse) {
          collapseRef.current = nextWillCollapse
          setWillCollapse(nextWillCollapse)
        }

        if (nextWillCollapse) {
          return
        }
      }

      scheduleWidthUpdate(nextWidth)
    }

    const onPointerUp = () => {
      if (!dragRef.current.dragging) return

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        flushPendingWidth()
      }

      const shouldCollapse = collapseRef.current && Boolean(collapseThreshold && onCollapse)

      if (dragRef.current.target?.hasPointerCapture(dragRef.current.pointerId)) {
        dragRef.current.target.releasePointerCapture(dragRef.current.pointerId)
      }

      dragRef.current.dragging = false
      dragRef.current.target = null
      delete document.body.dataset.resizing
      document.body.style.userSelect = ''
      setIsDragging(false)

      if (!shouldCollapse) {
        const snappedWidth = commitWidth(getSnappedWidth(widthRef.current, snapPoints))
        persistWidth(snappedWidth)
      }

      pendingWidthRef.current = null
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
  }, [
    collapseThreshold,
    commitWidth,
    flushPendingWidth,
    onCollapse,
    persistWidth,
    resizeFrom,
    scheduleWidthUpdate,
    snapPoints,
  ])

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startW: widthRef.current,
      pointerId: e.pointerId,
      target: e.currentTarget,
    }
    document.body.dataset.resizing = 'true'
    document.body.style.userSelect = 'none'
    collapseRef.current = false
    pendingWidthRef.current = null
    setWillCollapse(false)
    setIsDragging(true)
  }

  const onDoubleClick = useCallback(() => {
    const nextWidth = commitWidth(defaultWidth)
    persistWidth(nextWidth)
  }, [commitWidth, defaultWidth, persistWidth])

  return { width, onPointerDown, onDoubleClick, isDragging, willCollapse }
}
