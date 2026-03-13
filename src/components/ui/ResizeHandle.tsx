import type { PointerEvent } from 'react'
import { ControlButton } from './ControlButton'

interface Props {
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void
  onCollapse: () => void
  collapsed: boolean
  side: 'left' | 'right'
}

export function ResizeHandle({ onPointerDown, onCollapse, collapsed, side }: Props) {
  return (
    <div
      style={{
        width: 18,
        flexShrink: 0,
        position: 'relative',
        cursor: 'col-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        backgroundColor: 'var(--bg-white)',
      }}
      onPointerDown={onPointerDown}
      className="resize-handle-root"
    >
      <div
        className="resize-handle-line"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 1,
          backgroundColor: 'var(--border-default)',
          transition: 'background-color 150ms',
        }}
      />

      <ControlButton
        icon={side === 'right' ? <RightChevron expanded={!collapsed} /> : <LeftChevron expanded={!collapsed} />}
        onPointerDown={event => event.stopPropagation()}
        onClick={onCollapse}
        aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 18,
          height: 28,
          borderRadius: 8,
          opacity: 0,
          transition: 'opacity 150ms',
          zIndex: 1,
          padding: 0,
        }}
        className="resize-handle-btn"
      />

      <style>{`
        .resize-handle-root:hover .resize-handle-line {
          background-color: var(--bg-teal);
        }
        .resize-handle-root:hover .resize-handle-btn {
          opacity: 1;
        }
      `}</style>
    </div>
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
