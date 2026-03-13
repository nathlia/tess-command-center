import type { CSSProperties } from 'react'
import { useState } from 'react'
import { memoryData } from '../../data/memoryData'
import type { MemoryType } from '../../data/memoryData'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { SurfaceCard } from '../ui/SurfaceCard'
import type { UiTone } from '../ui/uiTones'

const TYPE_TONES: Record<MemoryType, UiTone> = {
  str: 'teal',
  list: 'purple',
  obj: 'amber',
  num: 'emerald',
  note: 'neutral',
  warn: 'amber',
}

interface Props {
  agentId: string
}

export function MemoryTab({ agentId }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const entries = memoryData[agentId] ?? []

  if (entries.length === 0) {
    return <EmptyState>No memory entries.</EmptyState>
  }

  return (
    <div style={{ padding: '12px 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {entries.map(entry => {
        const tone = TYPE_TONES[entry.type]
        const isLong = entry.val.length > 56
        const isOpen = expanded.has(entry.key)

        return (
          <SurfaceCard
            key={entry.key}
            style={{
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <code style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 'var(--semibold)', color: 'var(--text-ink)' }}>
                {entry.key}
              </code>

              <Badge tone={tone} size="sm" uppercase>
                {entry.type}
              </Badge>

              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted-400)' }}>{entry.updated}</span>
            </div>

            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-ink)', lineHeight: 'var(--lh-base)' }}>
              {isLong && !isOpen ? (
                <>
                  {entry.val.slice(0, 56)}...{' '}
                  <InlineToggleButton
                    label="more"
                    onClick={() => setExpanded(current => new Set(current).add(entry.key))}
                  />
                </>
              ) : (
                entry.val
              )}

              {isLong && isOpen && (
                <InlineToggleButton
                  label="less"
                  onClick={() =>
                    setExpanded(current => {
                      const next = new Set(current)
                      next.delete(entry.key)
                      return next
                    })
                  }
                  style={{ marginLeft: 6 }}
                />
              )}
            </div>
          </SurfaceCard>
        )
      })}
    </div>
  )
}

function InlineToggleButton({
  label,
  onClick,
  style,
}: {
  label: string
  onClick: () => void
  style?: CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: 'pointer',
        color: 'var(--text-teal)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--semibold)',
        ...style,
      }}
    >
      {label}
    </button>
  )
}
