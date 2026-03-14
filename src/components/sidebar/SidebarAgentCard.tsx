import type { KeyboardEvent, MouseEvent } from 'react'
import type { Agent } from '../../types/agent'
import { formatElapsed, formatTokens, getPrimaryStep } from '../../utils/agentHelpers'
import { Badge } from '../ui/Badge'
import { AgentIcon } from '../ui/AgentIcon'
import { ModalityIcons } from '../ui/ModalityIcons'
import { ProgressBar } from '../ui/ProgressBar'
import { ProviderDot } from '../ui/ProviderDot'
import { SectionLabel } from '../ui/SectionLabel'
import { SurfaceCard } from '../ui/SurfaceCard'
import type { UiTone } from '../ui/uiTones'

interface Props {
  agent: Agent
  selected: boolean
  onClick: () => void
  onTogglePause?: () => void
  buttonRef?: (node: HTMLDivElement | null) => void
  variant?: 'sidebar' | 'browser'
}

function statusStyles(agent: Agent) {
  if (agent.paused) {
    return {
      label: 'Paused',
      tone: 'amber' as UiTone,
      shimmer: false,
    }
  }

  if (agent.status === 'done') {
    return {
      label: 'Done',
      tone: 'emerald' as UiTone,
      shimmer: false,
    }
  }

  if (agent.status === 'thinking') {
    return {
      label: 'Thinking',
      tone: 'amber' as UiTone,
      shimmer: true,
    }
  }

  return {
    label: 'Executing',
    tone: 'teal' as UiTone,
    shimmer: true,
  }
}

function contextTone(ctx: number) {
  if (ctx >= 80) return 'amber' as const
  return 'neutral' as const
}

function stopEvent(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault()
  event.stopPropagation()
}

export function SidebarAgentCard({
  agent,
  selected,
  onClick,
  onTogglePause,
  buttonRef,
  variant = 'sidebar',
}: Props) {
  const status = statusStyles(agent)
  const browser = variant === 'browser'
  const primaryStep = getPrimaryStep(agent.steps)
  const latestLog = agent.logs[agent.logs.length - 1]
  const contextValue = Math.round(agent.ctx)
  const panelLabel = agent.paused
    ? 'Paused'
    : agent.status === 'done'
      ? 'Latest action'
      : latestLog?.type === 'think'
        ? 'Thinking'
        : 'Current action'
  const panelText = latestLog?.thought ?? latestLog?.message ?? primaryStep?.label ?? agent.currentTask

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.currentTarget !== event.target) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      ref={buttonRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-pressed={!browser && selected}
      aria-label={`Open ${agent.name}`}
      data-browser={browser ? 'true' : 'false'}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: browser ? '18px' : '14px',
        borderRadius: browser ? 20 : 16,
        border: `1px solid ${selected ? 'var(--border-ink)' : 'var(--border-default)'}`,
        backgroundColor: 'var(--bg-white)',
        cursor: 'pointer',
        boxShadow: browser
          ? '0 8px 22px rgba(17, 24, 39, 0.04)'
          : 'none',
        transition: 'background-color 120ms, border-color 120ms, transform 120ms, box-shadow 120ms',
      }}
      className="sidebar-agent-card"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: browser ? 12 : 10 }}>
        <div
          style={{
            width: browser ? 46 : 36,
            height: browser ? 46 : 36,
            borderRadius: browser ? 14 : 12,
            border: '1px solid var(--border-default)',
            backgroundColor: selected ? 'var(--bg-subtle)' : 'var(--bg-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AgentIcon icon={agent.icon} size={browser ? 17 : 15} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 'var(--semibold)',
                  color: 'var(--text-ink)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: browser ? 'var(--text-2xl)' : 'var(--text-sm)',
                  lineHeight: 1.08,
                }}
              >
                {agent.name}
              </div>

              <div
                style={{
                  marginTop: browser ? 5 : 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 0,
                  color: 'var(--text-mid)',
                  fontSize: browser ? 'var(--text-lg)' : 'var(--text-xs)',
                }}
              >
                <ProviderDot provider={agent.provider} size={browser ? 14 : 12} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {agent.model}
                </span>
              </div>
            </div>

            <Badge tone={status.tone} size={browser ? 'sm' : 'sm'} uppercase shimmer={status.shimmer} style={{ flexShrink: 0 }}>
              {status.label}
            </Badge>
          </div>

          {!browser && (
            <div
              style={{
                marginTop: 6,
                fontSize: 'var(--text-xs)',
                color: 'var(--text-mid)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {primaryStep?.label ?? agent.currentTask}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: browser ? 16 : 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SectionLabel style={{ fontSize: browser ? '10px' : '9px' }}>Context</SectionLabel>
          <span
            style={{
              marginLeft: 'auto',
              minWidth: browser ? 40 : 34,
              fontSize: browser ? 'var(--text-lg)' : 'var(--text-xs)',
              fontWeight: 'var(--semibold)',
              color: agent.ctx >= 80 ? 'var(--text-amber)' : 'var(--text-mid)',
              textAlign: 'right',
            }}
          >
            {contextValue}%
          </span>
        </div>

        <ProgressBar
          value={contextValue}
          tone={contextTone(agent.ctx)}
          height={browser ? 6 : 5}
          style={{ marginTop: browser ? 9 : 8 }}
          trackColor="var(--bg-light)"
        />
      </div>

      <div
        style={{
          marginTop: browser ? 12 : 10,
          display: 'flex',
          alignItems: 'center',
          gap: browser ? 8 : 6,
          flexWrap: 'wrap',
          fontSize: browser ? 'var(--text-lg)' : 'var(--text-xs)',
          color: 'var(--text-mid)',
        }}
      >
        <span>{agent.archetype}</span>
        <span>/</span>
        <span>{formatElapsed(agent.elapsed)}</span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
            color: 'var(--text-ink)',
            fontSize: browser ? 'var(--text-lg)' : 'var(--text-xs)',
          }}
        >
          {formatTokens(agent.tokens, ' tk')}
        </span>
      </div>

      {browser ? (
        <SurfaceCard tone="subtle" padding="12px 14px" radius={14} style={{ marginTop: 14 }}>
          <SectionLabel style={{ display: 'block', marginBottom: 8, fontSize: '10px' }}>
            {panelLabel}
          </SectionLabel>
          <div
            style={{
              minHeight: 44,
              color: 'var(--text-ink)',
              fontSize: 'var(--text-xl)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {panelText}
          </div>
        </SurfaceCard>
      ) : null}

      {browser ? (
        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={event => {
              stopEvent(event)
              onClick()
            }}
            style={{
              border: 'none',
              background: 'none',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              color: 'var(--text-teal)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--semibold)',
              cursor: 'pointer',
            }}
          >
            View activity
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2.5 6h7" strokeLinecap="round" />
              <path d="m6.5 2.5 3.5 3.5-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            {onTogglePause && (
              <button
                type="button"
                onClick={event => {
                  stopEvent(event)
                  onTogglePause()
                }}
                aria-label={agent.paused ? `Resume ${agent.name}` : `Pause ${agent.name}`}
                style={footerActionStyle}
              >
                {agent.paused ? (
                  <svg width={13} height={13} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 2.5 9 6 3 9.5V2.5Z" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width={13} height={13} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3.5 2.5v7M8.5 2.5v7" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
          <ModalityIcons active={agent.modalities} generating={agent.generatingModality} />
        </div>
      )}

      <style>{`
        .sidebar-agent-card:hover {
          background-color: var(--bg-subtle) !important;
          border-color: var(--border-black-10) !important;
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(17, 24, 39, 0.07);
        }
        .sidebar-agent-card:focus-visible {
          outline: 2px solid var(--border-teal-15);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}

const footerActionStyle = {
  width: 30,
  height: 30,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  border: '1px solid var(--border-default)',
  backgroundColor: 'var(--bg-white)',
  color: 'var(--text-mid)',
  cursor: 'pointer',
  flexShrink: 0,
} as const
