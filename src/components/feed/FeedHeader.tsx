import type { RefObject } from 'react'
import type { Agent } from '../../types/agent'
import { Badge } from '../ui/Badge'
import { ControlButton } from '../ui/ControlButton'
import { Tooltip } from '../ui/Tooltip'

interface Props {
  agent: Agent
  onPause: () => void
  onClose: () => void
  onOpenDetails: () => void
  detailsOpen: boolean
  detailsButtonRef?: RefObject<HTMLButtonElement | null>
  mobile?: boolean
}

export function FeedHeader({
  agent,
  onPause,
  onClose,
  onOpenDetails,
  detailsOpen,
  detailsButtonRef,
  mobile = false,
}: Props) {
  const statusTone = agent.paused ? 'amber' : agent.status === 'done' ? 'emerald' : agent.status === 'thinking' ? 'amber' : 'teal'
  const statusLabel = agent.paused ? 'Paused' : agent.status === 'done' ? 'Done' : agent.status === 'thinking' ? 'Thinking' : 'Executing'

  return (
    <div
      style={{
        minHeight: mobile ? 72 : 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: mobile ? '12px 16px' : '0 20px',
        backgroundColor: 'var(--bg-white)',
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0,
        flexWrap: mobile ? 'wrap' : 'nowrap',
      }}
    >
      <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Tooltip content={mobile ? 'Back to agents' : 'Back'} side="bottom" delay={500}>
          <ControlButton
            icon={
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7.5 2.5 4 6l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            onClick={onClose}
            variant="ghost"
            size="sm"
            aria-label={mobile ? 'Back to agents' : 'Close agent view'}
          />
        </Tooltip>

        <h2
          style={{
            margin: 0,
            fontSize: mobile ? 'var(--text-xl)' : 'var(--text-2xl)',
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

      <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
        <ControlButton
          ref={detailsButtonRef}
          icon={
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2.5 3.5h7M2.5 6h7M2.5 8.5h7" strokeLinecap="round" />
            </svg>
          }
          onClick={onOpenDetails}
          active={detailsOpen}
          tone="teal"
          variant={detailsOpen ? 'soft' : 'outline'}
          aria-expanded={detailsOpen}
          aria-controls="agent-details-panel"
        >
          {detailsOpen ? 'Hide details' : 'See details'}
        </ControlButton>

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
      </div>
    </div>
  )
}
