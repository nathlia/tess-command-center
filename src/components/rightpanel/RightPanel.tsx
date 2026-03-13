import { useState, type ReactNode } from 'react'
import { contextPanelData, emptyContextPanelData } from '../../data/contextPanelData'
import type { Agent } from '../../types/agent'
import { ControlButton } from '../ui/ControlButton'
import { AgentStats } from './AgentStats'
import { ContextTab } from './ContextTab'
import { IntegrationsTab } from './IntegrationsTab'
import { McpTab } from './McpTab'
import { panelIcons } from './panelIconsIndex'
import { SkillsTab } from './SkillsTab'
import { StepTracker } from './StepTracker'

type RightPanelTab = 'skills' | 'mcp' | 'integrations' | 'context'

interface Props {
  agent: Agent
  collapsed: boolean
  width: number
  onToggle: () => void
}

const PANEL_TABS: Array<{ id: RightPanelTab; label: string; short: string; icon: ReactNode }> = [
  { id: 'skills', label: 'Skills', short: 'S', icon: <panelIcons.SkillIcon /> },
  { id: 'mcp', label: 'MCP', short: 'M', icon: <panelIcons.McpIcon /> },
  { id: 'integrations', label: 'Integrations', short: 'I', icon: <panelIcons.IntegrationIcon /> },
  { id: 'context', label: 'Context', short: 'C', icon: <panelIcons.ContextIcon /> },
]

export function RightPanel({ agent, collapsed, width, onToggle }: Props) {
  const [tab, setTab] = useState<RightPanelTab>('skills')
  const data = contextPanelData[agent.id] ?? emptyContextPanelData

  if (collapsed) {
    return (
      <aside
        style={{
          width: 56,
          flexShrink: 0,
          backgroundColor: 'var(--bg-white)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '14px 0 12px',
          gap: 10,
        }}
      >
        {PANEL_TABS.map(item => (
          <ControlButton
            key={item.id}
            icon={item.icon}
            onClick={() => {
              setTab(item.id)
              onToggle()
            }}
            active={tab === item.id}
            tone={tab === item.id ? 'teal' : 'neutral'}
            variant={tab === item.id ? 'soft' : 'ghost'}
            size="sm"
            aria-label={`Open ${item.label}`}
            title={item.label}
          />
        ))}

        <div
          style={{
            marginTop: 'auto',
            width: 28,
            height: 28,
            borderRadius: 10,
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-mid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--semibold)',
          }}
        >
          {PANEL_TABS.find(item => item.id === tab)?.short}
        </div>
      </aside>
    )
  }

  return (
    <aside
      style={{
        width,
        flexShrink: 0,
        backgroundColor: 'var(--bg-white)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid var(--border-default)',
          padding: '0 14px',
          display: 'flex',
          gap: 14,
          flexShrink: 0,
        }}
      >
        {PANEL_TABS.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            style={{
              minHeight: 42,
              padding: '0',
              border: 'none',
              borderBottom: `2px solid ${tab === item.id ? 'var(--text-ink)' : 'transparent'}`,
              background: 'none',
              color: tab === item.id ? 'var(--text-ink)' : 'var(--text-mid)',
              fontSize: 'var(--text-sm)',
              fontWeight: tab === item.id ? 'var(--semibold)' : 'var(--medium)',
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14 }}>
        {tab === 'skills' && <SkillsTab data={data} />}
        {tab === 'mcp' && <McpTab data={data} />}
        {tab === 'integrations' && <IntegrationsTab data={data} />}
        {tab === 'context' && <ContextTab data={data} />}
      </div>

      <div
        style={{
          padding: '10px 12px 14px',
          borderTop: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-white)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <AgentStats agent={agent} />
        <StepTracker steps={agent.steps} />
      </div>
    </aside>
  )
}
