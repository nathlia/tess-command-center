import type { ChangeEvent } from 'react'
import type { Agent } from '../../types/agent'
import { getPrimaryStep } from '../../utils/agentHelpers'
import { SidebarAgentCard } from './SidebarAgentCard'

export type AgentPanelFilter = 'all' | 'running' | 'paused' | 'done'

interface Props {
  agents: Agent[]
  selectedId: string
  onSelect: (id: string) => void
  onTogglePause?: (id: string) => void
  width: number | string
  mobile?: boolean
  mode?: 'browser' | 'sidebar'
  filter?: AgentPanelFilter
  onFilterChange?: (filter: AgentPanelFilter) => void
  searchQuery?: string
  onSearchQueryChange?: (value: string) => void
  registerCardRef?: (agentId: string, node: HTMLElement | null) => void
}

interface ChatGroup {
  id: string
  name: string
  time: string
  agents: Agent[]
}

interface FilterCounts {
  all: number
  running: number
  paused: number
  done: number
}

const FILTER_TABS: { id: AgentPanelFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'running', label: 'Running' },
  { id: 'paused', label: 'Paused' },
  { id: 'done', label: 'Done' },
]

function matchesAgentFilter(agent: Agent, filter: AgentPanelFilter) {
  if (filter === 'all') return true
  if (filter === 'paused') return agent.paused
  if (filter === 'done') return agent.status === 'done'
  return !agent.paused && (agent.status === 'thinking' || agent.status === 'executing')
}

function matchesAgentSearch(agent: Agent, query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const primaryStep = getPrimaryStep(agent.steps)
  const latestLog = agent.logs[agent.logs.length - 1]
  const searchableText = [
    agent.name,
    agent.currentTask,
    agent.model,
    agent.archetype,
    agent.chat.name,
    agent.provider.group,
    primaryStep?.label,
    latestLog?.thought,
    latestLog?.message,
    latestLog?.output,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return searchableText.includes(normalized)
}

function groupByChat(agents: Agent[], visibleIds?: Set<string>) {
  const map = new Map<string, ChatGroup>()

  for (const agent of agents) {
    if (visibleIds && !visibleIds.has(agent.id)) continue

    const { id, name, time } = agent.chat

    if (!map.has(id)) {
      map.set(id, { id, name, time, agents: [] })
    }

    map.get(id)?.agents.push(agent)
  }

  return Array.from(map.values())
}

function getFilterCounts(agents: Agent[]): FilterCounts {
  return agents.reduce<FilterCounts>((counts, agent) => {
    counts.all += 1

    if (agent.paused) {
      counts.paused += 1
    } else if (agent.status === 'done') {
      counts.done += 1
    } else if (agent.status === 'thinking' || agent.status === 'executing') {
      counts.running += 1
    }

    return counts
  }, {
    all: 0,
    running: 0,
    paused: 0,
    done: 0,
  })
}

function createBrowserVisibleGroups(agents: Agent[], filter: AgentPanelFilter, searchQuery: string) {
  const visibleIds = new Set(
    agents
      .filter(agent => matchesAgentFilter(agent, filter) && matchesAgentSearch(agent, searchQuery))
      .map(agent => agent.id),
  )

  return groupByChat(agents, visibleIds)
}

function createSidebarVisibleGroups(agents: Agent[], filter: AgentPanelFilter, selectedId: string) {
  if (filter === 'all') {
    return groupByChat(agents)
  }

  const visibleIds = new Set(
    agents
      .filter(agent => matchesAgentFilter(agent, filter))
      .map(agent => agent.id),
  )

  if (selectedId) {
    visibleIds.add(selectedId)
  }

  return groupByChat(agents, visibleIds)
}

export function AgentsPanel({
  agents,
  selectedId,
  onSelect,
  onTogglePause,
  width,
  mobile = false,
  mode = 'sidebar',
  filter = 'all',
  onFilterChange,
  searchQuery = '',
  onSearchQueryChange,
  registerCardRef,
}: Props) {
  const browser = mode === 'browser'
  const filterCounts = getFilterCounts(agents)
  const visibleGroups = browser
    ? createBrowserVisibleGroups(agents, filter, searchQuery)
    : createSidebarVisibleGroups(agents, filter, selectedId)

  return (
    <aside
      aria-label="Agents"
      style={{
        flexGrow: browser ? 1 : 0,
        flexBasis: browser ? 0 : 'auto',
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
          padding: mobile ? '20px 16px 12px' : browser ? '22px 22px 14px' : '24px 18px 14px',
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

        {browser ? (
          <BrowserFilterBar
            active={filter}
            counts={filterCounts}
            searchQuery={searchQuery}
            onChange={onFilterChange}
            onSearchChange={onSearchQueryChange}
            mobile={mobile}
          />
        ) : (
          <SidebarFilterTabs active={filter} counts={filterCounts} onChange={onFilterChange} />
        )}
      </div>

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
            groups={visibleGroups}
            selectedId={selectedId}
            onSelect={onSelect}
            onTogglePause={onTogglePause}
            registerCardRef={registerCardRef}
            mobile={mobile}
            emptyState={searchQuery.trim() ? 'No agents match this search.' : 'No agents match this filter.'}
          />
        ) : (
          <SidebarGroups
            groups={visibleGroups}
            selectedId={selectedId}
            onSelect={onSelect}
            registerCardRef={registerCardRef}
          />
        )}
      </div>
    </aside>
  )
}

function BrowserGroups({
  groups,
  selectedId,
  onSelect,
  onTogglePause,
  registerCardRef,
  mobile,
  emptyState,
}: {
  groups: ChatGroup[]
  selectedId: string
  onSelect: (id: string) => void
  onTogglePause?: (id: string) => void
  registerCardRef?: (agentId: string, node: HTMLElement | null) => void
  mobile: boolean
  emptyState: string
}) {
  if (!groups.length) {
    return <EmptyGroupsState label={emptyState} />
  }

  let cardIndex = 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {groups.map(group => (
        <div key={group.id}>
          <GroupHeader name={group.name} time={group.time} compact={false} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
              alignItems: 'start',
              gap: 10,
            }}
          >
            {group.agents.map(agent => {
              const delay = `${(cardIndex++ * 0.055).toFixed(2)}s`

              return (
                <div
                  key={agent.id}
                  style={{ animation: `card-in 0.38s cubic-bezier(0.4,0,0.2,1) ${delay} both` }}
                >
                  <SidebarAgentCard
                    agent={agent}
                    selected={agent.id === selectedId}
                    onClick={() => onSelect(agent.id)}
                    onTogglePause={agent.status === 'done' ? undefined : () => onTogglePause?.(agent.id)}
                    buttonRef={node => registerCardRef?.(agent.id, node)}
                    variant="browser"
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function SidebarGroups({
  groups,
  selectedId,
  onSelect,
  registerCardRef,
}: {
  groups: ChatGroup[]
  selectedId: string
  onSelect: (id: string) => void
  registerCardRef?: (agentId: string, node: HTMLElement | null) => void
}) {
  if (!groups.length) {
    return <EmptyGroupsState label="No agents match this filter." />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {groups.map(group => (
        <div key={group.id}>
          <GroupHeader name={group.name} time={group.time} compact />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {group.agents.map(agent => (
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
        </div>
      ))}
    </div>
  )
}

function BrowserFilterBar({
  active,
  counts,
  searchQuery,
  onChange,
  onSearchChange,
  mobile,
}: {
  active: AgentPanelFilter
  counts: FilterCounts
  searchQuery: string
  onChange?: (filter: AgentPanelFilter) => void
  onSearchChange?: (value: string) => void
  mobile: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
        marginTop: 14,
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1, minWidth: mobile ? '100%' : 0 }}>
        {FILTER_TABS.map(tab => {
          const activeStyle = filterTone(tab.id, active === tab.id)

          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={active === tab.id}
              onClick={() => onChange?.(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                minHeight: 34,
                padding: '0 12px',
                borderRadius: 999,
                border: `1px solid ${activeStyle.borderColor}`,
                backgroundColor: activeStyle.backgroundColor,
                color: activeStyle.color,
                fontSize: 'var(--text-xs)',
                fontWeight: active === tab.id ? 'var(--semibold)' : 'var(--medium)',
                cursor: 'pointer',
                transition: 'background-color 180ms, border-color 180ms, color 180ms',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: '10px',
                  opacity: active === tab.id ? 1 : 0.72,
                }}
              >
                {counts[tab.id]}
              </span>
            </button>
          )
        })}
      </div>

      <label
        style={{
          flex: mobile ? '1 1 100%' : '0 0 220px',
          minWidth: mobile ? '100%' : 200,
          position: 'relative',
          display: 'block',
        }}
      >
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted-400)', pointerEvents: 'none' }}>
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6.25" cy="6.25" r="4.5" />
            <path d="M9.75 9.75 12.25 12.25" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange?.(event.target.value)}
          placeholder="Search name or task"
          style={{
            width: '100%',
            height: 36,
            padding: '0 12px 0 34px',
            borderRadius: 10,
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-ink)',
            fontFamily: 'var(--font)',
            fontSize: 'var(--text-sm)',
            outline: 'none',
          }}
        />
      </label>
    </div>
  )
}

function GroupHeader({ name, time, compact }: { name: string; time: string; compact: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: compact ? 8 : 12 }}>
      <span
        style={{
          fontSize: compact ? '10px' : 'var(--text-sm)',
          fontWeight: 'var(--semibold)',
          color: compact ? 'var(--text-mid)' : 'var(--text-ink)',
          letterSpacing: compact ? '0.08em' : 'normal',
          textTransform: compact ? 'uppercase' : 'none',
        }}
      >
        {name}
      </span>
      <span style={{ color: 'var(--text-mid)', fontSize: compact ? '10px' : 'var(--text-sm)' }}>&middot;</span>
      <span style={{ fontSize: compact ? '10px' : 'var(--text-xs)', color: 'var(--text-mid)' }}>{time}</span>
    </div>
  )
}

function SidebarFilterTabs({
  active,
  counts,
  onChange,
}: {
  active: AgentPanelFilter
  counts: FilterCounts
  onChange?: (filter: AgentPanelFilter) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
      {FILTER_TABS.map(tab => {
        const activeStyle = filterTone(tab.id, active === tab.id)

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active === tab.id}
            onClick={() => onChange?.(tab.id)}
            style={{
              flex: '1 1 calc(50% - 4px)',
              minWidth: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 10,
              border: `1px solid ${activeStyle.borderColor}`,
              backgroundColor: activeStyle.backgroundColor,
              color: activeStyle.color,
              fontSize: 'var(--text-xs)',
              fontWeight: active === tab.id ? 'var(--semibold)' : 'var(--medium)',
              cursor: 'pointer',
              transition: 'background-color 180ms, border-color 180ms, color 180ms',
            }}
          >
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {tab.label}
            </span>
            <span
              style={{
                minWidth: 18,
                textAlign: 'right',
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: '10px',
                opacity: active === tab.id ? 1 : 0.75,
              }}
            >
              {counts[tab.id]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function filterTone(filter: AgentPanelFilter, active: boolean) {
  if (!active) {
    return {
      backgroundColor: 'var(--bg-white)',
      borderColor: 'var(--border-default)',
      color: 'var(--text-mid)',
    }
  }

  if (filter === 'running') {
    return {
      backgroundColor: 'var(--bg-teal-12)',
      borderColor: 'var(--border-teal-15)',
      color: 'var(--text-teal)',
    }
  }

  if (filter === 'paused') {
    return {
      backgroundColor: 'var(--bg-amber-tint)',
      borderColor: 'var(--border-default)',
      color: 'var(--text-amber)',
    }
  }

  if (filter === 'done') {
    return {
      backgroundColor: 'var(--bg-emerald-tint)',
      borderColor: 'var(--border-default)',
      color: 'var(--text-emerald)',
    }
  }

  return {
    backgroundColor: 'var(--bg-subtle)',
    borderColor: 'var(--border-ink-10)',
    color: 'var(--text-ink)',
  }
}

function EmptyGroupsState({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '20px 12px',
        borderRadius: 12,
        border: '1px dashed var(--border-default)',
        backgroundColor: 'var(--bg-subtle)',
        color: 'var(--text-mid)',
        fontSize: 'var(--text-sm)',
        textAlign: 'center',
      }}
    >
      {label}
    </div>
  )
}
