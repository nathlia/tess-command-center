import { useRef } from 'react'
import type { PointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Tooltip } from './Tooltip'

interface Props {
  onPointerDown: (e: PointerEvent<HTMLElement>) => void
  onDoubleClick?: () => void
  onCollapse: () => void
  collapsed: boolean
  side: 'left' | 'right'
  label?: string
  disabled?: boolean
  dragging?: boolean
  willCollapse?: boolean
}

const PILL_H = 26  // pill height in px — used to center on cursor

export function ResizeHandle({
  onPointerDown,
  onDoubleClick,
  onCollapse,
  collapsed,
  side,
  label = 'Resize panel',
  disabled = false,
  dragging = false,
  willCollapse = false,
}: Props) {
  const pillRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  // Track whether the pill has been positioned at least once (prevents initial jump)
  const pillPositioned = useRef(false)
  // Track current cursor Y so label can read it on mount (React re-render)
  const currentY = useRef(0)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const pill = pillRef.current
    if (!pill) return
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    currentY.current = y
    // Use transform for Y — avoids percentage→pixel animation jump
    pill.style.transform = `translate(-50%, ${y - PILL_H / 2}px)`
    if (!pillPositioned.current) {
      // First frame: snap with no opacity transition so it appears exactly at cursor
      pill.style.transition = 'background-color 150ms'
      pillPositioned.current = true
      requestAnimationFrame(() => {
        if (pill) pill.style.transition = 'opacity 150ms, background-color 150ms'
      })
    }
    pill.style.opacity = '1'
    // Label tracks pill Y via direct DOM update (no state, no lag)
    const lbl = labelRef.current
    if (lbl) lbl.style.transform = `translateY(${y - PILL_H / 2}px)`
  }

  function handleMouseLeave() {
    const pill = pillRef.current
    if (!pill) return
    pill.style.opacity = '0'
    pillPositioned.current = false
  }

  const tooltipSide = side === 'left' ? 'right' : 'left'

  const inner = (
    <div
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      onPointerDown={disabled ? undefined : onPointerDown}
      onDoubleClick={disabled ? undefined : onDoubleClick}
      onMouseMove={disabled ? undefined : handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-dragging={dragging ? 'true' : 'false'}
      data-collapse={willCollapse ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-collapsed={collapsed ? 'true' : 'false'}
      className="resize-handle-root"
      style={{
        width: 20,
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'default' : 'none',
        zIndex: 10,
        userSelect: 'none',
      }}
    >
      {/* Separator line */}
      <div
        className="resize-line"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 1,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--border-default)',
          transition: 'background-color 150ms, width 150ms',
          pointerEvents: 'none',
        }}
      />

      {/* Drag pill — follows the mouse Y via transform, stays visible during drag */}
      <div
        ref={pillRef}
        className="resize-drag-pill"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: `translate(-50%, 0px)`,  // JS updates this
          width: PILL_H,
          height: PILL_H,
          borderRadius: 999,
          backgroundColor: willCollapse ? 'var(--text-amber)' : 'var(--bg-teal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 3,
          boxShadow: '0 2px 10px rgba(15,76,92,0.3)',
          transition: 'opacity 150ms, background-color 150ms',
        }}
      >
        <DragIcon />
      </div>

      {/* Grip strip — grows during active drag */}
      <div
        className="resize-grip"
        style={{
          width: 3,
          height: 24,
          borderRadius: 999,
          backgroundColor: willCollapse ? 'var(--text-amber)' : 'var(--bg-teal)',
          opacity: 0,
          transition: 'opacity 120ms, height 200ms cubic-bezier(0.34,1.56,0.64,1), background-color 150ms',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Collapse/expand button — revealed on hover + always visible when collapsed */}
      <Tooltip
        content={collapsed ? 'Expand' : 'Collapse'}
        side={tooltipSide}
        delay={300}
      >
        <button
          type="button"
          className="resize-collapse-btn"
          aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
          onClick={onCollapse}
          onPointerDown={e => { e.stopPropagation() }}
          onDoubleClick={e => { e.stopPropagation() }}
          onMouseEnter={() => {
            // Hide drag pill when hovering the button to avoid collision
            const pill = pillRef.current
            if (pill) pill.style.opacity = '0'
          }}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 20,
            height: 28,
            borderRadius: 999,
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            cursor: 'pointer',
            zIndex: 4,
            boxShadow: '0 2px 8px rgba(17,24,39,0.08)',
            transition: 'opacity 120ms, background-color 120ms, border-color 120ms',
          }}
        >
          {side === 'right' ? (
            <RightChevron expanded={!collapsed} />
          ) : (
            <LeftChevron expanded={!collapsed} />
          )}
        </button>
      </Tooltip>

      {/* Release-to-close label — follows pill Y, animates in/out */}
      <div
        ref={labelRef}
        style={{
          position: 'absolute',
          top: 0,
          [side === 'left' ? 'right' : 'left']: 'calc(100% + 10px)',
          transform: `translateY(${currentY.current - PILL_H / 2}px)`,
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <AnimatePresence>
          {dragging && willCollapse && (
            <motion.div
              initial={{ opacity: 0, x: side === 'left' ? 8 : -8, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: side === 'left' ? 5 : -5, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                backgroundColor: 'var(--text-amber)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'var(--semibold)',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(217,119,6,0.4)',
              }}
            >
              Release to close
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        /* Hover — tint line */
        .resize-handle-root:not([data-disabled="true"]):hover .resize-line {
          background-color: var(--bg-teal);
          opacity: 0.5;
        }

        /* Active drag — grow grip strip, thicken line */
        .resize-handle-root[data-dragging="true"] .resize-grip {
          opacity: 1;
          height: 52px;
        }
        .resize-handle-root[data-dragging="true"] .resize-line {
          background-color: var(--bg-teal);
          width: 2px;
          opacity: 0.9;
        }

        /* Will-collapse — amber */
        .resize-handle-root[data-collapse="true"] .resize-line {
          background-color: var(--text-amber);
          width: 2px;
          opacity: 0.8;
        }

        /* Collapse button — hidden by default, shown on hover or when panel is collapsed */
        .resize-collapse-btn {
          opacity: 0;
          pointer-events: none;
        }
        .resize-handle-root:not([data-disabled="true"]):hover .resize-collapse-btn,
        .resize-handle-root[data-collapsed="true"] .resize-collapse-btn {
          opacity: 1;
          pointer-events: auto;
        }
        .resize-handle-root[data-dragging="true"] .resize-collapse-btn {
          opacity: 0 !important;
          pointer-events: none !important;
        }
        .resize-collapse-btn:hover {
          background-color: var(--bg-subtle) !important;
          border-color: var(--border-black-10) !important;
          box-shadow: 0 4px 12px rgba(17,24,39,0.12) !important;
        }
        .resize-collapse-btn:focus-visible {
          outline: 2px solid var(--border-teal-15);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )

  // Outer tooltip (drag hint) only makes sense when the handle is draggable
  if (disabled) return inner

  return (
    <Tooltip
      content="Drag to resize · Double-click to reset"
      side={tooltipSide}
      delay={700}
      autoHideDuration={3000}
    >
      {inner}
    </Tooltip>
  )
}

function DragIcon() {
  return (
    <svg width={12} height={9} viewBox="0 0 12 9" fill="none">
      <path d="M1 4.5H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.5 2L1 4.5L3.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 2L11 4.5L8.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LeftChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg width={10} height={10} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d={expanded ? 'M8 2.5 4 6l4 3.5' : 'M4 2.5 8 6 4 9.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RightChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg width={10} height={10} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d={expanded ? 'M4 2.5 8 6 4 9.5' : 'M8 2.5 4 6l4 3.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
