import type { KeyboardEvent, MouseEvent } from 'react'
import type { Agent } from '../../types/agent'
import { formatElapsed, formatTokens, getPrimaryStep } from '../../utils/agentHelpers'
import { Badge } from '../ui/Badge'
import { AgentIcon } from '../ui/AgentIcon'
import { ProgressBar } from '../ui/ProgressBar'
import { ProviderDot } from '../ui/ProviderDot'
import type { UiTone } from '../ui/uiTones'

interface Props {
  agent: Agent
  selected: boolean
  onClick: () => void
  onTogglePause?: () => void
  buttonRef?: (node: HTMLDivElement | null) => void
  variant?: 'sidebar' | 'browser'
}

type ProgressTone = 'neutral' | 'teal' | 'purple' | 'amber' | 'emerald'

interface StatusConfig {
  label: string
  tone: UiTone
  shimmer: boolean
  snippetLabel: string
  ctxTone: ProgressTone
}

function statusConfig(agent: Agent): StatusConfig {
  if (agent.paused) {
    return { label: 'Paused', tone: 'neutral', shimmer: false, snippetLabel: 'PAUSED', ctxTone: 'neutral' }
  }
  if (agent.status === 'done') {
    return { label: 'Done', tone: 'emerald', shimmer: false, snippetLabel: '', ctxTone: 'emerald' }
  }
  if (agent.status === 'thinking') {
    return { label: 'Thinking', tone: 'amber', shimmer: true, snippetLabel: 'THINKING', ctxTone: 'amber' }
  }
  return { label: 'Executing', tone: 'teal', shimmer: true, snippetLabel: 'EXECUTING', ctxTone: 'teal' }
}

function stopEvent(e: MouseEvent<HTMLButtonElement>) {
  e.preventDefault()
  e.stopPropagation()
}

// ─── Done card: compact horizontal row ─────────────────────────────────────

function DoneCard({ agent, onClick }: { agent: Agent; onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 14,
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
        cursor: 'pointer',
        transition: 'border-color 150ms, box-shadow 150ms',
      }}
      className="done-card"
    >
      {/* Checkmark + icon stack */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-emerald-tint)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <AgentIcon icon={agent.icon} size={15} />
        </div>
        {/* Done checkmark badge */}
        <div style={{
          position: 'absolute',
          bottom: -3,
          right: -3,
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: 'var(--text-emerald)',
          border: '2px solid var(--bg-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width={7} height={7} viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1.5 4l2 2 3-3" />
          </svg>
        </div>
      </div>

      {/* Name + task */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--semibold)', color: 'var(--text-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {agent.name}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
          {agent.currentTask}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-mid)' }}>
          {formatElapsed(agent.elapsed)}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'JetBrains Mono, ui-monospace, monospace', color: 'var(--text-mid)' }}>
          {formatTokens(agent.tokens, ' tk')}
        </span>
      </div>

      <style>{`
        .done-card:hover { border-color: var(--border-black-10) !important; box-shadow: 0 2px 8px rgba(17,24,39,0.05); }
        .done-card:focus-visible { outline: 2px solid var(--bg-teal); outline-offset: 2px; }
      `}</style>
    </div>
  )
}

// ─── Sidebar compact card ───────────────────────────────────────────────────

function SidebarCard({
  agent,
  selected,
  onClick,
  buttonRef,
}: {
  agent: Agent
  selected: boolean
  onClick: () => void
  buttonRef?: (node: HTMLDivElement | null) => void
}) {
  const cfg = statusConfig(agent)
  const primaryStep = getPrimaryStep(agent.steps)

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.currentTarget !== e.target) return
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() }
  }

  return (
    <div
      ref={buttonRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      aria-label={`Open ${agent.name}`}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '11px 13px',
        borderRadius: 12,
        border: `1px solid ${selected ? 'var(--border-ink)' : 'var(--border-default)'}`,
        backgroundColor: selected ? 'var(--bg-subtle)' : 'var(--bg-white)',
        cursor: 'pointer',
        transition: 'background-color 120ms, border-color 120ms',
      }}
      className="sidebar-compact-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <AgentIcon icon={agent.icon} size={14} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--semibold)', color: 'var(--text-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {agent.name}
            </span>
            <Badge tone={cfg.tone} size="sm" shimmer={cfg.shimmer} style={{ flexShrink: 0 }}>
              {cfg.label}
            </Badge>
          </div>
          <div style={{ marginTop: 3, fontSize: 'var(--text-xs)', color: 'var(--text-mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {primaryStep?.label ?? agent.currentTask}
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-compact-card:hover { background-color: var(--bg-subtle) !important; border-color: var(--border-black-10) !important; }
        .sidebar-compact-card:focus-visible { outline: 2px solid var(--bg-teal); outline-offset: 2px; }
      `}</style>
    </div>
  )
}

// ─── Browser full card ──────────────────────────────────────────────────────

function BrowserCard({
  agent,
  onClick,
  onTogglePause,
  buttonRef,
}: {
  agent: Agent
  selected: boolean
  onClick: () => void
  onTogglePause?: () => void
  buttonRef?: (node: HTMLDivElement | null) => void
}) {
  const cfg = statusConfig(agent)
  const primaryStep = getPrimaryStep(agent.steps)
  const latestLog = agent.logs[agent.logs.length - 1]
  const snippetText = latestLog?.thought ?? latestLog?.message ?? primaryStep?.label ?? agent.currentTask
  const ctxValue = Math.round(agent.ctx)
  const ctxColor = ctxValue >= 95
    ? 'var(--text-red)'
    : ctxValue >= 80
      ? 'var(--text-amber)'
      : 'var(--text-mid)'

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.currentTarget !== e.target) return
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() }
  }

  return (
    <div
      ref={buttonRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${agent.name}`}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '16px 18px',
        borderRadius: 14,
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
        cursor: 'pointer',
        transition: 'transform 200ms, box-shadow 200ms, border-color 300ms, background-color 300ms',
      }}
      className="agent-browser-card"
    >
      {/* 1 — Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <AgentIcon icon={agent.icon} size={15} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--semibold)', color: 'var(--text-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.15 }}>
            {agent.name}
          </div>
          <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
            <ProviderDot provider={agent.provider} size={12} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {agent.model}
            </span>
          </div>
        </div>
        <Badge tone={cfg.tone} size="sm" shimmer={cfg.shimmer} style={{ flexShrink: 0 }}>
          {cfg.label}
        </Badge>
      </div>

      {/* 2 — Context bar */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 'var(--semibold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-mid)',
          }}>
            Context
          </span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--semibold)', color: ctxColor, transition: 'color 500ms' }}>
            {ctxValue}%
          </span>
        </div>
        <ProgressBar value={ctxValue} tone={cfg.ctxTone} height={3} trackColor="var(--bg-light)" />
      </div>

      {/* 3 — Meta row */}
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-mid)' }}>
        <span style={{ fontWeight: 'var(--medium)' }}>{agent.archetype}</span>
        <span style={{ margin: '0 5px', opacity: 0.4 }}>·</span>
        <span>{formatElapsed(agent.elapsed)}</span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          color: 'var(--text-ink)',
        }}>
          {formatTokens(agent.tokens, ' tk')}
        </span>
      </div>

      {/* 4 — Snippet */}
      <div style={{
        marginTop: 10,
        padding: '10px 12px',
        borderRadius: 10,
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-subtle)',
        transition: 'background-color 400ms, border-color 400ms',
      }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 'var(--semibold)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-mid)',
          marginBottom: 5,
        }}>
          {cfg.snippetLabel}
        </div>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-ink)',
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {snippetText}
        </div>
      </div>

      {/* 5 — Footer */}
      <div style={{
        marginTop: 12,
        paddingTop: 10,
        borderTop: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          type="button"
          onClick={e => { stopEvent(e); onClick() }}
          style={{
            border: 'none',
            background: 'none',
            padding: 0,
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--semibold)',
            color: 'var(--text-teal)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            opacity: 0.65,
            transition: 'opacity 150ms',
          }}
          className="view-details-link"
        >
          View details
          <svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2.5 6h7" strokeLinecap="round" />
            <path d="m6.5 2.5 3.5 3.5-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {onTogglePause && agent.status !== 'done' && (
          <button
            type="button"
            onClick={e => { stopEvent(e); onTogglePause() }}
            aria-label={agent.paused ? `Resume ${agent.name}` : `Pause ${agent.name}`}
            style={footerActionStyle}
            className="footer-action-btn"
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

      <style>{`
        .agent-browser-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(17,24,39,0.07);
          border-color: var(--border-black-10) !important;
        }
        .agent-browser-card:focus-visible {
          outline: 2px solid var(--bg-teal);
          outline-offset: 2px;
        }
        .view-details-link:hover { opacity: 1 !important; }
        .footer-action-btn:hover {
          background-color: var(--bg-subtle) !important;
          border-color: var(--border-black-10) !important;
        }
      `}</style>
    </div>
  )
}

// ─── Main export ────────────────────────────────────────────────────────────

export function SidebarAgentCard({
  agent,
  selected,
  onClick,
  onTogglePause,
  buttonRef,
  variant = 'sidebar',
}: Props) {
  if (variant === 'sidebar') {
    return <SidebarCard agent={agent} selected={selected} onClick={onClick} buttonRef={buttonRef} />
  }

  // Done agents in the grid render as a compact row
  if (agent.status === 'done' && !agent.paused) {
    return <DoneCard agent={agent} onClick={onClick} />
  }

  return (
    <BrowserCard
      agent={agent}
      selected={selected}
      onClick={onClick}
      onTogglePause={onTogglePause}
      buttonRef={buttonRef}
    />
  )
}

const footerActionStyle = {
  width: 28,
  height: 28,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  border: '1px solid var(--border-default)',
  backgroundColor: 'var(--bg-white)',
  color: 'var(--text-mid)',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background-color 150ms, border-color 150ms',
} as const
