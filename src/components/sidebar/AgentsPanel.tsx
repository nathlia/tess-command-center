import type { Agent } from '../../types/agent'
import { SidebarAgentCard } from './SidebarAgentCard'

interface Props {
  agents: Agent[]
  selectedId: string
  onSelect: (id: string) => void
  onTogglePause?: (id: string) => void
  width: number | string
  mobile?: boolean
  mode?: 'browser' | 'sidebar'
  registerCardRef?: (agentId: string, node: HTMLElement | null) => void
}

export function AgentsPanel({
  agents,
  selectedId,
  onSelect,
  onTogglePause,
  width,
  mobile = false,
  mode = 'sidebar',
  registerCardRef,
}: Props) {
  const running = agents.filter(agent => (agent.status === 'executing' || agent.status === 'thinking') && !agent.paused).length
  const done = agents.filter(agent => agent.status === 'done').length
  const idle = agents.length - running - done
  const browser = mode === 'browser'

  return (
    <aside
      aria-label="Agents"
      style={{
        flex: browser ? 1 : undefined,
        width,
        flexShrink: 0,
        backgroundColor: 'var(--bg-white)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
        borderRight: browser || mobile ? 'none' : '1px solid var(--border-default)',
      }}
    >
      <div
        style={{
          padding: mobile ? '20px 16px 12px' : browser ? '22px 22px 12px' : '28px 20px 14px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: mobile ? 'var(--text-xl)' : 'var(--text-2xl)',
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
          padding: mobile ? '12px 10px 16px' : browser ? '16px 20px 20px' : '12px 12px 16px',
        }}
      >
        <div
          style={
            browser
              ? {
                  display: 'grid',
                  gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 14,
                  alignContent: 'start',
                }
              : {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }
          }
        >
          {agents.map(agent => (
            <SidebarAgentCard
              key={agent.id}
              agent={agent}
              selected={!browser && agent.id === selectedId}
              onClick={() => onSelect(agent.id)}
              onTogglePause={browser && agent.status !== 'done' ? () => onTogglePause?.(agent.id) : undefined}
              buttonRef={node => registerCardRef?.(agent.id, node)}
              variant={browser ? 'browser' : 'sidebar'}
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
