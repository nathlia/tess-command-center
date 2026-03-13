import type { Agent } from '../../types/agent'
import { Badge } from '../ui/Badge'
import { ControlButton } from '../ui/ControlButton'

interface Props {
  agent: Agent
  onPause: () => void
  onSplit: () => void
  splitActive: boolean
  showSplit?: boolean
}

export function FeedHeader({ agent, onPause, onSplit, splitActive, showSplit = true }: Props) {
  const isLive = agent.status !== 'done' && !agent.paused
  const statusTone = isLive ? 'teal' : agent.paused ? 'amber' : 'emerald'
  const statusLabel = isLive ? 'Live' : agent.paused ? 'Paused' : 'Done'

  return (
    <div
      style={{
        minHeight: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '0 20px',
        borderBottom: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
        flexShrink: 0,
      }}
    >
      <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--bold)',
            color: 'var(--text-ink)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {agent.name}
        </h2>

        <Badge tone={statusTone} dot>
          {statusLabel}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <ControlButton
          icon={
            agent.paused ? (
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 2.5 9 6 3 9.5V2.5Z" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3.5 2.5v7M8.5 2.5v7" strokeLinecap="round" />
              </svg>
            )
          }
          onClick={onPause}
          active={agent.paused}
          tone={agent.paused ? 'amber' : 'neutral'}
        >
          {agent.paused ? 'Resume' : 'Pause'}
        </ControlButton>

        {showSplit && (
          <ControlButton
            icon={
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1.5" y="1.5" width="9" height="9" rx="2" />
                <path d="M6 1.5v9" />
              </svg>
            }
            onClick={onSplit}
            active={splitActive}
          >
            Split
          </ControlButton>
        )}
      </div>
    </div>
  )
}
