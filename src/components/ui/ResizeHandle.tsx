import { useState } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent } from 'react'
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
  expandTooltip?: string
  collapseTooltip?: string
  resizeTooltip?: string
  expandAriaLabel?: string
  collapseAriaLabel?: string
}

const PILL_H = 26

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
  expandTooltip = 'Open panel',
  collapseTooltip = 'Hide panel',
  resizeTooltip = 'Drag to resize',
  expandAriaLabel,
  collapseAriaLabel,
}: Props) {
  const [handleHovered, setHandleHovered] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  const [buttonFocused, setButtonFocused] = useState(false)
  const [indicatorOffset, setIndicatorOffset] = useState<number | null>(null)

  const tooltipSide = side === 'left' ? 'right' : 'left'
  const showCollapseButton = !dragging && (collapsed || handleHovered || buttonHovered || buttonFocused)
  const collapseTooltipLabel = collapsed ? expandTooltip : collapseTooltip
  const collapseAria = collapsed ? (expandAriaLabel ?? expandTooltip) : (collapseAriaLabel ?? collapseTooltip)
  const dragIndicatorVisible = indicatorOffset !== null && !disabled && !buttonHovered && (handleHovered || dragging)
  const releaseLabelTop = indicatorOffset !== null ? indicatorOffset + PILL_H / 2 : '50%'

  function updateIndicatorPosition(clientY: number, rect: DOMRect) {
    const minOffset = 6
    const maxOffset = Math.max(minOffset, rect.height - PILL_H - 6)
    const nextOffset = Math.min(maxOffset, Math.max(minOffset, clientY - rect.top - PILL_H / 2))
    setIndicatorOffset(nextOffset)
  }

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    updateIndicatorPosition(e.clientY, e.currentTarget.getBoundingClientRect())
  }

  function handleMouseLeave() {
    setHandleHovered(false)
    setButtonHovered(false)
  }

  function handleResizePointerDown(e: PointerEvent<HTMLElement>) {
    updateIndicatorPosition(e.clientY, e.currentTarget.getBoundingClientRect())
    onPointerDown(e)
  }

  const inner = (
    <div
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      onPointerDown={disabled ? undefined : handleResizePointerDown}
      onDoubleClick={disabled ? undefined : onDoubleClick}
      onMouseEnter={() => setHandleHovered(true)}
      onMouseMove={handleMouseMove}
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
        cursor: disabled || buttonHovered ? 'default' : 'none',
        zIndex: 10,
        userSelect: 'none',
      }}
    >
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
          transition: 'background-color 150ms, width 150ms, opacity 150ms',
          pointerEvents: 'none',
        }}
      />

      <div
        className="resize-drag-pill"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: `translate(-50%, ${indicatorOffset ?? 0}px)`,
          width: PILL_H,
          height: PILL_H,
          borderRadius: 999,
          backgroundColor: willCollapse ? 'var(--text-amber)' : 'var(--bg-teal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: dragIndicatorVisible ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 3,
          boxShadow: '0 2px 10px rgba(15,76,92,0.3)',
          transition: 'transform 120ms cubic-bezier(0.22,1,0.36,1), opacity 150ms, background-color 150ms',
        }}
      >
        <DragIcon />
      </div>

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

      <Tooltip content={collapseTooltipLabel} side={tooltipSide} delay={240}>
        <button
          type="button"
          className="resize-collapse-btn"
          aria-label={collapseAria}
          onClick={onCollapse}
          onPointerDown={e => {
            setButtonFocused(false)
            e.stopPropagation()
          }}
          onDoubleClick={e => { e.stopPropagation() }}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          onFocus={e => setButtonFocused(e.currentTarget.matches(':focus-visible'))}
          onBlur={() => setButtonFocused(false)}
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
            transition: 'opacity 120ms, background-color 120ms, border-color 120ms, transform 120ms',
            opacity: showCollapseButton ? 1 : 0,
            pointerEvents: showCollapseButton ? 'auto' : 'none',
          }}
        >
          {side === 'right' ? (
            <RightChevron expanded={!collapsed} />
          ) : (
            <LeftChevron expanded={!collapsed} />
          )}
        </button>
      </Tooltip>

      <div
        style={{
          position: 'absolute',
          top: releaseLabelTop,
          [side === 'left' ? 'right' : 'left']: 'calc(100% + 10px)',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <AnimatePresence>
          {dragging && willCollapse && (
            <motion.div
              initial={{ opacity: 0, x: side === 'left' ? 8 : -8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: side === 'left' ? 5 : -5, scale: 0.96 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                backgroundColor: 'var(--text-amber)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'var(--medium)',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(217,119,6,0.35)',
              }}
            >
              Release to close
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .resize-handle-root:not([data-disabled="true"]):hover .resize-line {
          background-color: var(--bg-teal);
          opacity: 0.45;
        }

        .resize-handle-root[data-dragging="true"] .resize-grip {
          opacity: 1;
          height: 52px;
        }

        .resize-handle-root[data-dragging="true"] .resize-line {
          background-color: var(--bg-teal);
          width: 2px;
          opacity: 0.9;
        }

        .resize-handle-root[data-collapse="true"] .resize-line {
          background-color: var(--text-amber);
          width: 2px;
          opacity: 0.8;
        }

        .resize-handle-root[data-dragging="true"] .resize-collapse-btn {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        .resize-collapse-btn:hover,
        .resize-collapse-btn:focus-visible {
          background-color: var(--bg-subtle) !important;
          border-color: var(--border-black-10) !important;
          box-shadow: 0 4px 12px rgba(17,24,39,0.12) !important;
          transform: translateY(-50%) scale(1.02) !important;
        }

        .resize-collapse-btn:focus-visible {
          outline: 2px solid var(--border-teal-15);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )

  if (disabled) return inner

  return (
    <Tooltip
      content={resizeTooltip}
      side={tooltipSide}
      delay={550}
      autoHideDuration={2200}
      disabled={buttonHovered || dragging || !handleHovered}
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
