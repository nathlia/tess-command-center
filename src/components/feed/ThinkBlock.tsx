import { useEffect, useState } from 'react'
import type { LogEntry } from '../../types/agent'
import { SectionLabel } from '../ui/SectionLabel'
import { SurfaceCard } from '../ui/SurfaceCard'
import { ToneTile } from '../ui/ToneTile'

interface Props {
  event: LogEntry
  isNew?: boolean
}

export function ThinkBlock({ event, isNew = false }: Props) {
  const [open, setOpen] = useState(() => isNew && Boolean(event.thought))

  useEffect(() => {
    if (open && isNew && event.thought) {
      const timeout = setTimeout(() => setOpen(false), 2500)
      return () => clearTimeout(timeout)
    }
  }, [event.thought, isNew, open])

  if (!event.thought) {
    return (
      <div style={{ padding: '6px 18px' }}>
        <ThinkShell
          label="Thinking"
          message={event.message}
          open={false}
          onToggle={() => {}}
          disabled
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '6px 18px' }}>
      <ThinkShell
        label="Thinking"
        message={event.message}
        open={open}
        onToggle={() => setOpen(value => !value)}
      />

      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 220 : 0,
          transition: 'max-height 260ms ease',
        }}
      >
        <SurfaceCard
          tone="warm"
          padding="12px 14px"
          radius={12}
          style={{
            margin: '8px 0 0 44px',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-ink)',
            lineHeight: 'var(--lh-base)',
          }}
        >
          {event.thought}
        </SurfaceCard>
      </div>
    </div>
  )
}

function ThinkShell({
  label,
  message,
  open,
  onToggle,
  disabled = false,
}: {
  label: string
  message: string
  open: boolean
  onToggle: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: disabled ? 'default' : 'pointer',
        textAlign: 'left',
      }}
    >
      <ToneTile tone="amber">
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="7" cy="7" r="5.3" />
          <path d="M5.7 5.6c0-.9 1.3-1.4 1.8 0 .4 1.3-.4 1.4-.4 2M7.1 10v.3" strokeLinecap="round" />
        </svg>
      </ToneTile>

      <div style={{ flex: 1, minWidth: 0 }}>
        <SectionLabel>{label}</SectionLabel>
        <div
          style={{
            marginTop: 2,
            fontSize: 'var(--text-sm)',
            color: 'var(--text-ink)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {message}
        </div>
      </div>

      {!disabled && (
        <svg
          width={14}
          height={14}
          viewBox="0 0 14 14"
          fill="none"
          stroke="var(--text-mid)"
          strokeWidth="1.4"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 180ms ease' }}
        >
          <path d="m3.5 5.5 3.5 3 3.5-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
