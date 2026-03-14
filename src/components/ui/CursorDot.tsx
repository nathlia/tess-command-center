import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Don't render on touch-primary devices
const isTouchPrimary =
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

export function CursorDot() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isTouchPrimary) return
    const root = rootRef.current
    if (!root) return

    // Position: direct DOM update — zero React overhead, zero lag
    const onMove = (e: MouseEvent) => {
      root.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    // State: detect what's under the pointer and switch cursor appearance
    const onOver = (e: MouseEvent) => {
      // Keep resize appearance locked while dragging
      if (document.body.dataset.resizing === 'true') return
      const el = e.target as HTMLElement
      let next = 'default'
      if (el.closest('input, textarea, select, [contenteditable]')) next = 'text'
      else if (el.closest('.resize-handle-root')) next = 'resize'
      else if (el.closest('button:not([disabled]), a, [role="button"]:not([aria-disabled="true"])')) next = 'pointer'
      root.dataset.cursor = next
    }

    const onLeave = () => { root.style.opacity = '0' }
    const onEnter = () => { root.style.opacity = '1' }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  if (isTouchPrimary) return null

  return createPortal(
    <div
      ref={rootRef}
      data-cursor="default"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        willChange: 'transform',
      }}
    >
      {/* Dot — centered at cursor tip */}
      <div className="c-dot" />
      {/* Ring — expands on pointer hover */}
      <div className="c-ring" />

      <style>{`
        .c-dot {
          position: absolute;
          top: -4px;
          left: -4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--text-ink);
          transition:
            width 140ms cubic-bezier(0.34, 1.56, 0.64, 1),
            height 140ms cubic-bezier(0.34, 1.56, 0.64, 1),
            top 140ms cubic-bezier(0.34, 1.56, 0.64, 1),
            left 140ms cubic-bezier(0.34, 1.56, 0.64, 1),
            border-radius 140ms,
            background 140ms,
            opacity 120ms;
        }

        .c-ring {
          position: absolute;
          top: -14px;
          left: -14px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid var(--bg-teal);
          opacity: 0;
          transform: scale(0.4);
          transition: opacity 160ms, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* ── Pointer state: teal dot + expanding ring ── */
        [data-cursor="pointer"] .c-dot {
          top: -3px;
          left: -3px;
          width: 6px;
          height: 6px;
          background: var(--bg-teal);
        }
        [data-cursor="pointer"] .c-ring {
          opacity: 0.7;
          transform: scale(1);
        }

        /* ── Resize state: horizontal bar ── */
        [data-cursor="resize"] .c-dot {
          top: -2px;
          left: -7px;
          width: 14px;
          height: 4px;
          border-radius: 3px;
          background: var(--bg-teal);
        }

        /* ── Text state: hide dot, OS I-beam takes over ── */
        [data-cursor="text"] .c-dot {
          opacity: 0;
        }

        /* ── Keep resize bar locked during active drag ── */
        body[data-resizing="true"] .c-dot {
          top: -2px;
          left: -7px;
          width: 14px;
          height: 4px;
          border-radius: 3px;
          background: var(--bg-teal);
        }
      `}</style>
    </div>,
    document.body,
  )
}
