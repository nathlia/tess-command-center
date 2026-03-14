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

interface ChatGroup {
  id: string
  name: string
  time: string
  active: Agent[]
  done: Agent[]
}

function groupByChat(agents: Agent[]): ChatGroup[] {
  const map = new Map<string, ChatGroup>()

  for (const agent of agents) {
    const { id, name, time } = agent.chat
    if (!map.has(id)) {
      map.set(id, { id, name, time, active: [], done: [] })
    }
    const group = map.get(id)!
    if (agent.status === 'done' && !agent.paused) {
      group.done.push(agent)
    } else {
      group.active.push(agent)
    }
  }

  return Array.from(map.values())
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
  const running = agents.filter(a => (a.status === 'executing' || a.status === 'thinking') && !a.paused).length
  const done = agents.filter(a => a.status === 'done').length
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
      {/* Header */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
          <AgentCount label="Running" value={running} color="var(--bg-teal)" />
          <AgentCount label="Done" value={done} color="var(--text-emerald)" />
          <AgentCount label="Idle" value={idle} color="var(--text-muted-400)" />
        </div>
      </div>

      {/* Scroll area */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: mobile ? '12px 10px 16px' : browser ? '16px 20px 24px' : '12px 12px 16px',
        }}
      >
        {browser ? (
          <BrowserGroups
            groups={groupByChat(agents)}
            selectedId={selectedId}
            onSelect={onSelect}
            onTogglePause={onTogglePause}
            registerCardRef={registerCardRef}
            mobile={mobile}
          />
        ) : (
          // Sidebar: flat compact list, no grouping headers
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {agents.map(agent => (
              <SidebarAgentCard
                key={agent.id}
                agent={agent}
                selected={agent.id === selectedId}
                onClick={() => onSelect(agent.id)}
                buttonRef={node => registerCardRef?.(agent.id, node)}
                variant="sidebar"
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

// ─── Browser grouped layout ─────────────────────────────────────────────────

function BrowserGroups({
  groups,
  selectedId,
  onSelect,
  onTogglePause,
  registerCardRef,
  mobile,
}: {
  groups: ChatGroup[]
  selectedId: string
  onSelect: (id: string) => void
  onTogglePause?: (id: string) => void
  registerCardRef?: (agentId: string, node: HTMLElement | null) => void
  mobile: boolean
}) {
  // Global card index for staggered entrance across all groups
  let cardIndex = 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {groups.map(group => {
        const allAgents = [...group.active, ...group.done]
        return (
          <div key={group.id}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--semibold)', color: 'var(--text-ink)' }}>
                {group.name}
              </span>
              <span style={{ margin: '0 7px', color: 'var(--text-mid)', fontSize: 'var(--text-sm)' }}>·</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-mid)' }}>{group.time}</span>
            </div>

            {/* All agents in a single grid — active first, done after */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
                alignItems: 'start',
                gap: 10,
              }}
            >
              {allAgents.map(agent => {
                const delay = `${(cardIndex++ * 0.055).toFixed(2)}s`
                const isActive = group.active.includes(agent)
                return (
                  <div
                    key={agent.id}
                    style={{ animation: `card-in 0.38s cubic-bezier(0.4,0,0.2,1) ${delay} both` }}
                  >
                    <SidebarAgentCard
                      agent={agent}
                      selected={agent.id === selectedId}
                      onClick={() => onSelect(agent.id)}
                      onTogglePause={isActive ? () => onTogglePause?.(agent.id) : undefined}
                      buttonRef={node => registerCardRef?.(agent.id, node)}
                      variant="browser"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Stat pill ───────────────────────────────────────────────────────────────

function AgentCount({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-mid)' }}>
        {value} {label}
      </span>
    </div>
  )
}
