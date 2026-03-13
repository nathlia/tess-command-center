import { useEffect, useState } from 'react'
import tessLogo from '../../assets/tess-light.svg'
import type { Agent } from '../../types/agent'
import { Badge } from '../ui/Badge'
import { ControlButton } from '../ui/ControlButton'
import { SectionLabel } from '../ui/SectionLabel'
import { StatCard } from '../ui/StatCard'
import { SidebarAgentCard } from './SidebarAgentCard'

interface Props {
  agents: Agent[]
  selectedId: string
  onSelect: (id: string) => void
  onSpawn: () => void
  showSpawn?: boolean
  collapsed: boolean
  onToggle: () => void
  width: number
}

function useClock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

const PRIMARY_NAV = [
  { label: 'My Main Agent', icon: 'M12 5v14M5 12h14' },
  { label: 'Team Board', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
  { label: 'AI University', icon: 'M22 10v6M2 10l10-5 10 5-10 5z||M6 12v5c3.33 2 7.67 2 11 0v-5' },
]

export function Sidebar({
  agents,
  selectedId,
  onSelect,
  onSpawn,
  showSpawn = true,
  collapsed,
  onToggle,
  width,
}: Props) {
  const time = useClock()
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  const active = agents.filter(agent => agent.status !== 'done').length
  const modelCount = new Set(agents.map(agent => agent.model)).size

  if (collapsed) {
    return (
      <aside
        style={{
          width: 56,
          flexShrink: 0,
          backgroundColor: 'var(--bg-white)',
          borderRight: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '14px 0 12px',
          gap: 12,
        }}
      >
        <ControlButton
          icon={<img src={tessLogo} alt="tess" style={{ width: 18, height: 'auto' }} />}
          onClick={onToggle}
          aria-label="Expand sidebar"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
          }}
        />

        <div style={{ width: 22, height: 1, backgroundColor: 'var(--border-default)' }} />

        {PRIMARY_NAV.map(item => (
          <SidebarNavButton
            key={item.label}
            label={item.label}
            paths={item.icon}
            variant="rail"
          />
        ))}

        <div style={{ width: 22, height: 1, backgroundColor: 'var(--border-default)' }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overflowY: 'auto',
            paddingBottom: 8,
          }}
        >
          {agents.map(agent => (
            <CollapsedAgentButton
              key={agent.id}
              agent={agent}
              selected={agent.id === selectedId}
              onClick={() => onSelect(agent.id)}
            />
          ))}
        </div>

        <div style={{ marginTop: 'auto', fontSize: '10px', color: 'var(--text-muted-400)' }}>{timeStr}</div>
      </aside>
    )
  }

  return (
    <aside
      style={{
        width,
        flexShrink: 0,
        backgroundColor: 'var(--bg-white)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '18px 16px 14px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <img src={tessLogo} alt="tess" style={{ height: 24, width: 'auto' }} />
          <ControlButton
            icon={
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 2.5 4 6l4 3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            onClick={onToggle}
            aria-label="Collapse sidebar"
            size="sm"
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <Badge tone="teal" uppercase>
            Command Center
          </Badge>
        </div>
      </div>

      <div style={{ padding: '10px 8px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {PRIMARY_NAV.map(item => (
          <SidebarNavButton
            key={item.label}
            label={item.label}
            paths={item.icon}
            variant="full"
          />
        ))}
      </div>

      <div style={{ margin: '12px 16px 10px', height: 1, backgroundColor: 'var(--border-default)' }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px 8px',
          gap: 8,
        }}
      >
        <SectionLabel>Agent Studio</SectionLabel>

        {showSpawn && (
          <ControlButton
            icon={
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2v8M2 6h8" strokeLinecap="round" />
              </svg>
            }
            onClick={onSpawn}
            aria-label="Spawn new agent"
            size="sm"
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
            }}
          />
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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

      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-subtle)',
        }}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <StatCard label="Active" value={String(active)} style={{ flex: 1, minWidth: 0, padding: '10px 10px 8px' }} />
          <StatCard label="Models" value={String(modelCount)} style={{ flex: 1, minWidth: 0, padding: '10px 10px 8px' }} />
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-mid)' }}>{timeStr}</div>
      </div>

      <style>{`
        .sidebar-nav-btn:hover {
          background-color: var(--bg-subtle) !important;
          color: var(--text-ink) !important;
        }
      `}</style>
    </aside>
  )
}

function NavIcon({ paths }: { paths: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {paths.split('||').map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  )
}

function SidebarNavButton({
  label,
  paths,
  variant,
}: {
  label: string
  paths: string
  variant: 'full' | 'rail'
}) {
  if (variant === 'rail') {
    return (
      <ControlButton
        icon={<NavIcon paths={paths} />}
        aria-label={label}
        title={label}
        size="sm"
      />
    )
  }

  return (
    <ControlButton
      icon={<NavIcon paths={paths} />}
      variant="ghost"
      align="start"
      fullWidth
      className="sidebar-nav-btn"
      style={{
        padding: '9px 10px',
        borderRadius: 10,
      }}
    >
      {label}
    </ControlButton>
  )
}

function CollapsedAgentButton({
  agent,
  selected,
  onClick,
}: {
  agent: Agent
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: 9,
        border: `1px solid ${selected ? 'var(--border-ink)' : 'var(--border-default)'}`,
        backgroundColor: selected ? 'var(--bg-subtle)' : 'var(--bg-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
      }}
      aria-label={agent.name}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor:
            agent.status === 'done'
              ? 'var(--text-emerald)'
              : agent.status === 'thinking'
                ? 'var(--text-amber)'
                : 'var(--bg-teal)',
        }}
      />
    </button>
  )
}
