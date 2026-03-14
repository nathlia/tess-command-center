import type { RefObject } from 'react'
import type { Agent } from '../../types/agent'
import { Badge } from '../ui/Badge'
import { ControlButton } from '../ui/ControlButton'
import { ProviderDot } from '../ui/ProviderDot'
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
  const badgeTone = getStatusTone(agent)
  const pauseLabel = agent.paused ? 'Resume agent' : 'Pause agent'
  const detailsLabel = detailsOpen ? 'Hide details panel' : 'Open details panel'
  const actionButtonLabel = agent.status === 'done' ? 'Done' : agent.paused ? 'Resume' : 'Pause'
  const detailsButtonLabel = 'Details'
  const actionButtonTone = agent.status === 'done' ? 'emerald' : agent.paused ? 'neutral' : 'teal'
  const actionIcon = agent.status === 'done'
    ? (
        <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M2.5 6 5 8.5 9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    : agent.paused
      ? (
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M3.5 2.5 8.5 6l-5 3.5V2.5Z" strokeLinejoin="round" />
          </svg>
        )
      : (
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M4 2.5v7M8 2.5v7" strokeLinecap="round" />
          </svg>
        )
  const actionTooltip = agent.status === 'done' ? 'Task complete' : pauseLabel

  return (
    <header
      style={{
        padding: mobile ? '14px 14px 0' : '16px 18px 0',
        borderBottom: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          paddingBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0, flex: 1 }}>
          <Tooltip content={mobile ? 'Back to agents' : 'Back to agents'} side="bottom" delay={300}>
            <ControlButton
              icon={
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M7.75 2.5 4.25 6l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              onClick={onClose}
              variant="ghost"
              size="sm"
              aria-label="Back to agents"
              style={{ marginTop: 1 }}
            />
          </Tooltip>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <h2
                style={{
                  margin: 0,
                  minWidth: 0,
                  fontSize: mobile ? 'var(--text-xl)' : 'var(--text-2xl)',
                  lineHeight: 1.05,
                  fontWeight: 'var(--bold)',
                  color: 'var(--text-ink)',
                  letterSpacing: '-0.02em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {agent.name}
              </h2>
              <Badge tone={badgeTone} size="sm" dot shimmer={!agent.paused && agent.status !== 'done'} style={{ flexShrink: 0 }}>
                {statusLabel(agent)}
              </Badge>
            </div>

            <div
              style={{
                marginTop: 5,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                minWidth: 0,
                color: 'var(--text-mid)',
              }}
            >
              <ProviderDot provider={agent.provider} size={12} />
              <span
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--medium)',
                  color: 'var(--text-mid)',
                }}
              >
                {agent.model}
              </span>
              <span aria-hidden style={{ flexShrink: 0, opacity: 0.45 }}>
                &middot;
              </span>
              <span
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-mid)',
                }}
              >
                {agent.currentTask}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <Tooltip content={actionTooltip} side="bottom" delay={300}>
            <ControlButton
              icon={actionIcon}
              onClick={agent.status === 'done' ? undefined : onPause}
              active
              tone={actionButtonTone}
              variant="outline"
              size="md"
              aria-label={actionTooltip}
            >
              {actionButtonLabel}
            </ControlButton>
          </Tooltip>

          <Tooltip content={detailsLabel} side="bottom" delay={300}>
            <ControlButton
              ref={detailsButtonRef}
              icon={
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2.5 3.5h7M2.5 6h7M2.5 8.5h7" strokeLinecap="round" />
                </svg>
              }
              onClick={onOpenDetails}
              active={detailsOpen}
              tone="teal"
              variant="outline"
              size="md"
              aria-label={detailsLabel}
            >
              {detailsButtonLabel}
            </ControlButton>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}

function getStatusTone(agent: Agent) {
  if (agent.paused) return 'neutral'
  if (agent.status === 'done') return 'emerald'
  if (agent.status === 'thinking') return 'amber'
  return 'teal'
}

function statusLabel(agent: Agent) {
  if (agent.paused) return 'Paused'
  if (agent.status === 'done') return 'Done'
  if (agent.status === 'thinking') return 'Thinking'
  return 'Executing'
}
