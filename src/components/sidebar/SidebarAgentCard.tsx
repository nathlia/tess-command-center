import type { Agent } from '../../types/agent'
import { AgentIcon } from '../ui/AgentIcon'
import { Badge } from '../ui/Badge'
import { ModalityIcons } from '../ui/ModalityIcons'
import { ProgressBar } from '../ui/ProgressBar'
import type { UiTone } from '../ui/uiTones'

interface Props {
  agent: Agent
  selected: boolean
  onClick: () => void
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}m${String(remainder).padStart(2, '0')}s`
}

function formatTokens(tokens: number) {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k tk`
  return `${tokens} tk`
}

function statusStyles(agent: Agent) {
  if (agent.paused) {
    return {
      label: 'Paused',
      tone: 'amber' as UiTone,
      progressTone: 'amber' as const,
    }
  }

  if (agent.status === 'done') {
    return {
      label: 'Done',
      tone: 'emerald' as UiTone,
      progressTone: 'emerald' as const,
    }
  }

  if (agent.status === 'thinking') {
    return {
      label: 'Thinking',
      tone: 'amber' as UiTone,
      progressTone: 'amber' as const,
    }
  }

  return {
    label: 'Live',
    tone: 'teal' as UiTone,
    progressTone: 'teal' as const,
  }
}

export function SidebarAgentCard({ agent, selected, onClick }: Props) {
  const status = statusStyles(agent)

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '12px',
        borderRadius: 14,
        border: `1px solid ${selected ? 'var(--border-ink)' : 'var(--border-default)'}`,
        backgroundColor: selected ? 'var(--bg-subtle)' : 'var(--bg-white)',
        cursor: 'pointer',
        transition: 'background-color 120ms, border-color 120ms, transform 120ms',
      }}
      className="sidebar-agent-card"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 11,
            border: '1px solid var(--border-default)',
            backgroundColor: selected ? 'var(--bg-white)' : 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AgentIcon icon={agent.icon} size={16} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--semibold)',
                color: 'var(--text-ink)',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {agent.name}
            </span>

            <Badge tone={status.tone} size="sm" uppercase style={{ flexShrink: 0 }}>
              {status.label}
            </Badge>
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 'var(--text-xs)',
              color: 'var(--text-mid)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {agent.provider.group} / {agent.model}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <ProgressBar value={agent.progress} tone={status.progressTone} style={{ flex: 1 }} />
        <span
          style={{
            minWidth: 34,
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--semibold)',
            color: 'var(--text-ink)',
            textAlign: 'right',
          }}
        >
          {Math.round(agent.progress)}%
        </span>
      </div>

      <div
        style={{
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 'var(--text-xs)',
          color: 'var(--text-mid)',
        }}
      >
        <span>{agent.archetype}</span>
        <span>/</span>
        <span>{Math.round(agent.ctx)}% ctx</span>
        <span>/</span>
        <span>{formatElapsed(agent.elapsed)}</span>
        <span style={{ marginLeft: 'auto' }}>{formatTokens(agent.tokens)}</span>
      </div>

      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
        <ModalityIcons active={agent.modalities} generating={agent.generatingModality} />
      </div>

      <style>{`
        .sidebar-agent-card:hover {
          background-color: var(--bg-subtle) !important;
          border-color: var(--border-black-10) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </button>
  )
}
