import type { PointerEvent } from 'react'
import { ControlButton } from './ControlButton'

interface Props {
  onPointerDown: (e: PointerEvent<HTMLElement>) => void
  onCollapse: () => void
  collapsed: boolean
  side: 'left' | 'right'
  label?: string
  disabled?: boolean
  dragging?: boolean
  willCollapse?: boolean
}

export function ResizeHandle({
  onPointerDown,
  onCollapse,
  collapsed,
  side,
  label = 'Resize panel',
  disabled = false,
  dragging = false,
  willCollapse = false,
}: Props) {
  return (
    <div
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      style={{
        width: 24,
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        background:
          'linear-gradient(180deg, var(--bg-white) 0%, var(--bg-subtle) 50%, var(--bg-white) 100%)',
      }}
      className="resize-handle-root"
      data-dragging={dragging ? 'true' : 'false'}
      data-collapse={willCollapse ? 'true' : 'false'}
    >
      <div
        className="resize-handle-line"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 1,
          backgroundColor: willCollapse ? 'var(--text-amber)' : 'var(--border-default)',
          transition: 'background-color 150ms, opacity 150ms',
        }}
      />

      <button
        type="button"
        aria-label={label}
        className="resize-handle-grip"
        style={{
          width: 10,
          height: 44,
          borderRadius: 999,
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-white-eb)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: 0,
          opacity: disabled ? 0.35 : 0.72,
          transition: 'transform 150ms, opacity 150ms, border-color 150ms, background-color 150ms',
          backdropFilter: 'blur(4px)',
          cursor: disabled ? 'default' : 'col-resize',
        }}
        onPointerDown={disabled ? undefined : onPointerDown}
        disabled={disabled}
      >
        <GripDot />
        <GripDot />
        <GripDot />
      </button>

      <ControlButton
        icon={side === 'right' ? <RightChevron expanded={!collapsed} /> : <LeftChevron expanded={!collapsed} />}
        onPointerDown={event => event.stopPropagation()}
        onClick={onCollapse}
        aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
        disabled={disabled}
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 20,
          height: 32,
          borderRadius: 999,
          opacity: dragging || willCollapse ? 1 : 0.55,
          transition: 'opacity 150ms, transform 150ms, border-color 150ms, background-color 150ms',
          zIndex: 1,
          padding: 0,
          boxShadow: '0 6px 16px rgba(17, 24, 39, 0.08)',
          backgroundColor: willCollapse ? 'var(--bg-warm)' : undefined,
        }}
        className="resize-handle-btn"
      />

      {dragging && willCollapse && (
        <div
          style={{
            position: 'absolute',
            top: 18,
            [side === 'left' ? 'left' : 'right']: 14,
            padding: '4px 8px',
            borderRadius: 999,
            backgroundColor: 'var(--bg-ink)',
            color: 'var(--text-white)',
            fontSize: '10px',
            fontWeight: 'var(--semibold)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          Release to close
        </div>
      )}

      <style>{`
        .resize-handle-root:hover .resize-handle-line {
          background-color: var(--bg-teal);
          opacity: 0.8;
        }
        .resize-handle-root:hover .resize-handle-grip {
          transform: scale(1.03);
          border-color: var(--border-teal-15);
          opacity: 1;
        }
        .resize-handle-root[data-dragging="true"] .resize-handle-grip,
        .resize-handle-root[data-dragging="true"] .resize-handle-btn {
          opacity: 1;
        }
        .resize-handle-root[data-collapse="true"] .resize-handle-grip {
          border-color: var(--border-tan-20);
          background-color: var(--bg-warm);
        }
        .resize-handle-grip:focus-visible {
          outline: 2px solid var(--border-teal-15);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}

function GripDot() {
  return (
    <span
      style={{
        width: 3,
        height: 3,
        borderRadius: '50%',
        backgroundColor: 'var(--text-muted-400)',
      }}
    />
  )
}

function LeftChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d={expanded ? 'M4 2.5 8 6 4 9.5' : 'M8 2.5 4 6l4 3.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
