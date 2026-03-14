import { contextPanelData, emptyContextPanelData } from '../../data/contextPanelData'
import type { Agent } from '../../types/agent'
import { ControlButton } from '../ui/ControlButton'
import { TabButton } from '../ui/TabButton'
import { Tooltip } from '../ui/Tooltip'
import { AgentStats } from './AgentStats'
import { ContextTab } from './ContextTab'
import { IntegrationsTab } from './IntegrationsTab'
import { McpTab } from './McpTab'
import { SkillsTab } from './SkillsTab'
import { StepTracker } from './StepTracker'

export type RightPanelTab = 'skills' | 'mcp' | 'integrations' | 'context'

interface Props {
  agent: Agent
  width?: number
  onClose: () => void
  activeTab: RightPanelTab
  onTabChange: (tab: RightPanelTab) => void
  mobile?: boolean
}

const PANEL_TABS: Array<{ id: RightPanelTab; label: string }> = [
  { id: 'skills', label: 'Skills' },
  { id: 'mcp', label: 'MCP' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'context', label: 'Context' },
]

export function RightPanel({
  agent,
  width = 320,
  onClose,
  activeTab,
  onTabChange,
  mobile = false,
}: Props) {
  const data = contextPanelData[agent.id] ?? emptyContextPanelData

  return (
    <aside
      id="agent-details-panel"
      aria-label="Agent details"
      style={{
        width: mobile ? '100%' : width,
        flexShrink: 0,
        backgroundColor: 'var(--bg-white)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderLeft: mobile ? 'none' : '1px solid var(--border-default)',
      }}
    >
      <div
        style={{
          padding: '14px 14px 0',
          borderBottom: '1px solid var(--border-default)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            paddingBottom: 10,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 'var(--semibold)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted-400)',
              }}
            >
              Agent details
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: mobile ? 'var(--text-lg)' : 'var(--text-md)',
                fontWeight: 'var(--bold)',
                color: 'var(--text-ink)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {agent.name}
            </div>
          </div>

          <Tooltip content={mobile ? 'Back' : 'Hide details'} side="bottom" delay={500}>
            <ControlButton
              icon={
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 3 3 9M3 3l6 6" strokeLinecap="round" />
                </svg>
              }
              onClick={onClose}
              variant="ghost"
              size="sm"
              aria-label={mobile ? 'Back to agent activity' : 'Hide details'}
            />
          </Tooltip>
        </div>

        <div
          role="tablist"
          aria-label="Detail sections"
          style={{
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            gap: 14,
            flexShrink: 0,
            overflowX: 'auto',
          }}
        >
          {PANEL_TABS.map(item => (
            <TabButton
              key={item.id}
              role="tab"
              aria-selected={activeTab === item.id}
              active={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
              style={{ minHeight: 42 }}
            >
              {item.label}
            </TabButton>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14 }}>
        {activeTab === 'skills' && <SkillsTab data={data} />}
        {activeTab === 'mcp' && <McpTab data={data} />}
        {activeTab === 'integrations' && <IntegrationsTab data={data} />}
        {activeTab === 'context' && <ContextTab data={data} />}
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
