import { useState, useRef, useCallback } from 'react'
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
}

const GAP = 8 // px between trigger and tooltip

function getPos(rect: DOMRect, side: Side) {
  switch (side) {
    case 'top':    return { x: rect.left + rect.width / 2, y: rect.top }
    case 'bottom': return { x: rect.left + rect.width / 2, y: rect.bottom }
    case 'right':  return { x: rect.right, y: rect.top + rect.height / 2 }
    case 'left':   return { x: rect.left,  y: rect.top + rect.height / 2 }
  }
}

function getTransform(side: Side) {
  switch (side) {
    case 'top':    return `translate(-50%, calc(-100% - ${GAP}px))`
    case 'bottom': return `translate(-50%, ${GAP}px)`
    case 'right':  return `translate(${GAP}px, -50%)`
    case 'left':   return `translate(calc(-100% - ${GAP}px), -50%)`
  }
}

const initialMotion = {
  top:    { opacity: 0, y: 5, scale: 0.94 },
  bottom: { opacity: 0, y: -5, scale: 0.94 },
  right:  { opacity: 0, x: -5, scale: 0.94 },
  left:   { opacity: 0, x: 5, scale: 0.94 },
}

export function Tooltip({ content, side = 'top', delay = 400, autoHideDuration, children }: Props) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const wrapRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const autoHideRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const show = useCallback(() => {
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
      setPos(getPos(rect, side))
      setVisible(true)
      if (autoHideDuration) {
        autoHideRef.current = setTimeout(() => setVisible(false), autoHideDuration)
      }
    }, delay)
  }, [delay, side, autoHideDuration])

  const hide = useCallback(() => {
    clearTimeout(timerRef.current)
    clearTimeout(autoHideRef.current)
    setVisible(false)
  }, [])

  return (
    <>
      <span
        ref={wrapRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{ display: 'contents' }}
      >
        {children}
      </span>

      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={initialMotion[side]}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.13, ease: [0.2, 0, 0, 1] }}
              style={{
                position: 'fixed',
                left: pos.x,
                top: pos.y,
                transform: getTransform(side),
                zIndex: 9998,
                pointerEvents: 'none',
                backgroundColor: 'var(--bg-ink)',
                color: 'var(--text-white)',
                padding: '5px 10px',
                borderRadius: 999,
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.015em',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
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
