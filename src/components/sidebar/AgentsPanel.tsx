import type { Agent } from '../../types/agent'
import { SidebarAgentCard } from './SidebarAgentCard'

interface Props {
  agents: Agent[]
  selectedId: string
  onSelect: (id: string) => void
  width: number
}

export function AgentsPanel({ agents, selectedId, onSelect, width }: Props) {
  const running = agents.filter(agent => agent.status === 'executing' && !agent.paused).length
  const done = agents.filter(agent => agent.status === 'done').length
  const idle = agents.length - running - done

  return (
    <aside
      style={{
        width,
        flexShrink: 0,
        backgroundColor: 'var(--bg-white)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '28px 20px 14px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 'var(--text-2xl)',
            lineHeight: 1,
            fontWeight: 'var(--bold)',
            color: 'var(--text-ink)',
            letterSpacing: '-0.02em',
          }}
        >
          Agents
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
            marginTop: 12,
          }}
        >
          <AgentCount label="Running" value={running} color="var(--bg-teal)" />
          <AgentCount label="Done" value={done} color="var(--text-emerald)" />
          <AgentCount label="Idle" value={idle} color="var(--text-muted-400)" />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '12px 12px 16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {agents.map(agent => (
            <SidebarAgentCard
              key={agent.id}
              agent={agent}
              selected={agent.id === selectedId}
              onClick={() => onSelect(agent.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}

function AgentCount({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-mid)' }}>
        {value} {label}
      </span>
    </div>
  )
}
