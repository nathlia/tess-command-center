import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

type Side = 'top' | 'bottom' | 'left' | 'right'

interface Props {
  content: ReactNode
  side?: Side
  delay?: number
  autoHideDuration?: number
  children: ReactNode
  disabled?: boolean
}

const GAP = 8 // px between trigger and tooltip
const VIEWPORT_PADDING = 12

function getPos(rect: DOMRect, tooltipRect: DOMRect, side: Side) {
  switch (side) {
    case 'top':
      return {
        left: rect.left + rect.width / 2 - tooltipRect.width / 2,
        top: rect.top - tooltipRect.height - GAP,
      }
    case 'bottom':
      return {
        left: rect.left + rect.width / 2 - tooltipRect.width / 2,
        top: rect.bottom + GAP,
      }
    case 'right':
      return {
        left: rect.right + GAP,
        top: rect.top + rect.height / 2 - tooltipRect.height / 2,
      }
    case 'left':
      return {
        left: rect.left - tooltipRect.width - GAP,
        top: rect.top + rect.height / 2 - tooltipRect.height / 2,
      }
  }
}

function clampPos(left: number, top: number, tooltipRect: DOMRect) {
  return {
    left: Math.min(
      window.innerWidth - tooltipRect.width - VIEWPORT_PADDING,
      Math.max(VIEWPORT_PADDING, left),
    ),
    top: Math.min(
      window.innerHeight - tooltipRect.height - VIEWPORT_PADDING,
      Math.max(VIEWPORT_PADDING, top),
    ),
  }
}

const initialMotion = {
  top:    { opacity: 0, y: 5, scale: 0.94 },
  bottom: { opacity: 0, y: -5, scale: 0.94 },
  right:  { opacity: 0, x: -5, scale: 0.94 },
  left:   { opacity: 0, x: 5, scale: 0.94 },
}

export function Tooltip({ content, side = 'top', delay = 400, autoHideDuration, children, disabled = false }: Props) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const [positioned, setPositioned] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRectRef = useRef<DOMRect | null>(null)
  const suppressHoverRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const autoHideRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const updatePosition = useCallback(() => {
    if (!triggerRectRef.current || !tooltipRef.current) return

    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const nextPos = getPos(triggerRectRef.current, tooltipRect, side)
    setPos(clampPos(nextPos.left, nextPos.top, tooltipRect))
    setPositioned(true)
  }, [side])

  const show = useCallback(() => {
    if (disabled) return
    clearTimeout(timerRef.current)
    clearTimeout(autoHideRef.current)
    timerRef.current = setTimeout(() => {
      const wrap = wrapRef.current
      if (!wrap) return
      // display:contents means the span has no box — use first child instead
      const target = (getComputedStyle(wrap).display === 'contents'
        ? (wrap.firstElementChild as HTMLElement)
        : wrap) ?? wrap
      const rect = target.getBoundingClientRect()
      triggerRectRef.current = rect
      setPositioned(false)
      setVisible(true)
      if (autoHideDuration) {
        autoHideRef.current = setTimeout(() => setVisible(false), autoHideDuration)
      }
    }, delay)
  }, [autoHideDuration, delay, disabled])

  const hide = useCallback(() => {
    clearTimeout(timerRef.current)
    clearTimeout(autoHideRef.current)
    setVisible(false)
    setPositioned(false)
  }, [])

  useEffect(() => {
    if (!disabled) return
    clearTimeout(timerRef.current)
    clearTimeout(autoHideRef.current)
    const hideTimer = setTimeout(() => setVisible(false), 0)
    return () => clearTimeout(hideTimer)
  }, [disabled])

  useLayoutEffect(() => {
    if (!visible) return

    updatePosition()

    const handleViewportChange = () => updatePosition()

    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [updatePosition, visible])

  return (
    <>
      <span
        ref={wrapRef}
        onMouseEnter={() => {
          if (suppressHoverRef.current) return
          show()
        }}
        onMouseLeave={() => {
          suppressHoverRef.current = false
          hide()
        }}
        onPointerDown={() => {
          suppressHoverRef.current = true
          hide()
        }}
        onFocus={event => {
          if (!(event.target instanceof HTMLElement) || !event.target.matches(':focus-visible')) {
            return
          }
          show()
        }}
        onBlur={hide}
        style={{ display: 'contents' }}
      >
        {children}
      </span>

      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              ref={tooltipRef}
              initial={initialMotion[side]}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.13, ease: [0.2, 0, 0, 1] }}
              style={{
                position: 'fixed',
                left: pos.left,
                top: pos.top,
                zIndex: 9998,
                pointerEvents: 'none',
                visibility: positioned ? 'visible' : 'hidden',
                backgroundColor: 'var(--bg-ink)',
                color: 'var(--text-white)',
                padding: '5px 10px',
                borderRadius: 999,
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.015em',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100vw - 24px)',
                fontFamily: 'var(--font)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1)',
              }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
