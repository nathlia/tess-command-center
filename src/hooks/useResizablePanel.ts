import { useState, useRef, useEffect, useCallback } from 'react'

interface UseResizablePanelOptions {
  legacyStorageKey?: string
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
  const [width, setWidthState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) return clamp(Number(stored), min, max)

      if (options?.legacyStorageKey) {
        const legacyStored = localStorage.getItem(options.legacyStorageKey)
        if (legacyStored) return clamp(Number(legacyStored), min, max)
      }
    } catch { /* ignore */ }
    return defaultWidth
  })
  const dragRef = useRef({ dragging: false, startX: 0, startW: 0 })

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
      setWidth(dragRef.current.startW + delta)
    }
    const onPointerUp = () => {
      if (!dragRef.current.dragging) return
      dragRef.current.dragging = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }, [setWidth])

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    dragRef.current = { dragging: true, startX: e.clientX, startW: width }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  return { width, onPointerDown }
}
