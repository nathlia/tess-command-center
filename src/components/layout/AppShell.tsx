import { useEffect, useState } from 'react'
import type { Agent } from '../../types/agent'
import { FeedColumn } from '../feed/FeedColumn'
import { RightPanel } from '../rightpanel/RightPanel'
import { AgentsPanel } from '../sidebar/AgentsPanel'
import { IconRail } from '../sidebar/IconRail'
import { ResizeHandle } from '../ui/ResizeHandle'
import { useResizablePanel } from '../../hooks/useResizablePanel'

interface Props {
  agents: Agent[]
  onSendPrompt: (agentId: string, prompt: string) => void
  onPauseAgent: (agentId: string) => void
  onResumeAgent: (agentId: string) => void
}

function readCollapsedState(storageKey: string, legacyKey?: string) {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) return stored === 'true'

    if (legacyKey) {
      const legacyStored = localStorage.getItem(legacyKey)
      if (legacyStored !== null) return legacyStored === 'true'
    }
  } catch {
    // ignore storage failures
  }

  return false
}

export function AppShell({ agents, onSendPrompt, onPauseAgent, onResumeAgent }: Props) {
  const [selectedId, setSelectedId] = useState(() => agents[0]?.id ?? '')
  const { width: agentsWidth, onPointerDown: onAgentsResize } = useResizablePanel(
    'tcc.agents.width',
    320,
    280,
    400,
    { legacyStorageKey: 'tcc.sidebar.width' },
  )
  const { width: rightPanelWidth, onPointerDown: onRightPanelResize } = useResizablePanel('tcc.rightpanel.width', 320, 288, 420)
  const [agentsCollapsed, setAgentsCollapsed] = useState(() => readCollapsedState('tcc.agents.collapsed', 'tcc.sidebar.collapsed'))
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(() => readCollapsedState('tcc.rightpanel.collapsed'))

  useEffect(() => {
    try {
      localStorage.setItem('tcc.agents.collapsed', String(agentsCollapsed))
    } catch {
      // ignore persistence failures
    }
  }, [agentsCollapsed])

  useEffect(() => {
    try {
      localStorage.setItem('tcc.rightpanel.collapsed', String(rightPanelCollapsed))
    } catch {
      // ignore persistence failures
    }
  }, [rightPanelCollapsed])

  const selectedAgent = agents.find(agent => agent.id === selectedId) ?? agents[0]

  if (!selectedAgent) return null

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-white)',
      }}
    >
      <IconRail />

      {!agentsCollapsed && (
        <AgentsPanel
          agents={agents}
          selectedId={selectedAgent.id}
          onSelect={setSelectedId}
          width={agentsWidth}
        />
      )}

      <ResizeHandle
        onPointerDown={agentsCollapsed ? () => {} : onAgentsResize}
        onCollapse={() => setAgentsCollapsed(value => !value)}
        collapsed={agentsCollapsed}
        side="left"
      />

      <FeedColumn
        agent={selectedAgent}
        onPause={() => {
          if (selectedAgent.paused) {
            onResumeAgent(selectedAgent.id)
            return
          }

          onPauseAgent(selectedAgent.id)
        }}
        onSplit={() => {}}
        splitId={null}
        showSplit={false}
        onSend={onSendPrompt}
      />

      <ResizeHandle
        onPointerDown={rightPanelCollapsed ? () => {} : onRightPanelResize}
        onCollapse={() => setRightPanelCollapsed(value => !value)}
        collapsed={rightPanelCollapsed}
        side="right"
      />

      <RightPanel
        agent={selectedAgent}
        collapsed={rightPanelCollapsed}
        width={rightPanelWidth}
        onToggle={() => setRightPanelCollapsed(value => !value)}
      />
    </div>
  )
}
