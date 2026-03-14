import { useEffect, useRef, useState } from 'react'
import type { Agent } from '../../types/agent'
import { FeedColumn } from '../feed/FeedColumn'
import type { FeedTab } from '../feed/FeedColumn'
import { RightPanel } from '../rightpanel/RightPanel'
import type { RightPanelTab } from '../rightpanel/RightPanel'
import { AgentsPanel } from '../sidebar/AgentsPanel'
import { IconRail } from '../sidebar/IconRail'
import { PanelStub } from '../ui/PanelStub'
import { ResizeHandle } from '../ui/ResizeHandle'
import { useMediaQuery } from '../../hooks/useMediaQuery'
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
  const isMobile = useMediaQuery('(max-width: 959px)')
  const isWideDesktop = useMediaQuery('(min-width: 1280px)')
  const [selectedId, setSelectedId] = useState('')
  const [feedOpen, setFeedOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [agentsCollapsed, setAgentsCollapsed] = useState(() => readCollapsedState('tcc.agents.collapsed', 'tcc.sidebar.collapsed'))
  const [feedTabsByAgent, setFeedTabsByAgent] = useState<Record<string, FeedTab>>({})
  const [detailsTabsByAgent, setDetailsTabsByAgent] = useState<Record<string, RightPanelTab>>({})
  const detailsButtonRef = useRef<HTMLButtonElement | null>(null)
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})

  const {
    width: agentsWidth,
    onPointerDown: onAgentsResize,
    isDragging: agentsDragging,
    willCollapse: agentsWillCollapse,
  } = useResizablePanel(
    'tcc.agents.width',
    320,
    280,
    420,
    {
      legacyStorageKey: 'tcc.sidebar.width',
      collapseThreshold: 248,
      onCollapse: () => setAgentsCollapsed(true),
    },
  )

  const {
    width: rightPanelWidth,
    onPointerDown: onRightPanelResize,
    isDragging: detailsDragging,
    willCollapse: detailsWillCollapse,
  } = useResizablePanel(
    'tcc.rightpanel.width',
    320,
    288,
    460,
    {
      resizeFrom: 'left',
      collapseThreshold: 224,
      onCollapse: () => setDetailsOpen(false),
    },
  )

  useEffect(() => {
    try {
      localStorage.setItem('tcc.agents.collapsed', String(agentsCollapsed))
    } catch {
      // ignore persistence failures
    }
  }, [agentsCollapsed])

  const selectedAgent = agents.find(agent => agent.id === selectedId) ?? (selectedId ? agents[0] ?? null : null)
  const activeFeedTab = selectedAgent ? (feedTabsByAgent[selectedAgent.id] ?? 'activity') : 'activity'
  const activeDetailsTab = selectedAgent ? (detailsTabsByAgent[selectedAgent.id] ?? 'skills') : 'skills'
  const layout = isMobile ? 'mobile' : isWideDesktop ? 'desktop' : 'tablet'
  const browserMode = !feedOpen || !selectedAgent
  const agentsAutoHidden = layout === 'tablet' && detailsOpen
  const showAgentsSidebar = !browserMode && !agentsCollapsed && !agentsAutoHidden
  const showAgentsStub = !browserMode && (agentsCollapsed || agentsAutoHidden)
  const showDetailsPanel = !browserMode && detailsOpen && Boolean(selectedAgent)

  const detailTabLabel = activeDetailsTab === 'skills'
    ? 'Skills'
    : activeDetailsTab === 'mcp'
      ? 'MCP'
      : activeDetailsTab === 'integrations'
        ? 'Integrations'
        : 'Context'

  if (!agents.length) return null

  function restoreFocus(node: HTMLElement | null | undefined) {
    requestAnimationFrame(() => node?.focus())
  }

  function handleSelectAgent(agentId: string) {
    setSelectedId(agentId)
    setFeedOpen(true)
    if (!feedOpen) {
      setDetailsOpen(false)
    }
  }

  function closeFeed() {
    const selectedCard = selectedAgent ? cardRefs.current[selectedAgent.id] : null
    setFeedOpen(false)
    setDetailsOpen(false)
    restoreFocus(selectedCard)
  }

  function openDetails() {
    if (!selectedAgent) return
    setDetailsOpen(value => !value)
  }

  function closeDetails() {
    setDetailsOpen(false)
    restoreFocus(detailsButtonRef.current)
  }

  function reopenAgentsPanel() {
    setAgentsCollapsed(false)
    if (layout === 'tablet' && detailsOpen) {
      setDetailsOpen(false)
    }
  }

  function reopenFeed() {
    if (!selectedAgent) return
    setFeedOpen(true)
  }

  function togglePause(agent: Agent) {
    if (agent.paused) {
      onResumeAgent(agent.id)
      return
    }

    onPauseAgent(agent.id)
  }

  function registerCardRef(agentId: string, node: HTMLElement | null) {
    cardRefs.current[agentId] = node
  }

  if (isMobile) {
    if (selectedAgent && feedOpen && detailsOpen) {
      return (
        <div style={{ height: '100dvh', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-white)' }}>
          <RightPanel
            agent={selectedAgent}
            onClose={closeDetails}
            activeTab={activeDetailsTab}
            onTabChange={tab => setDetailsTabsByAgent(previous => ({ ...previous, [selectedAgent.id]: tab }))}
            mobile
          />
        </div>
      )
    }

    if (selectedAgent && feedOpen) {
      return (
        <div style={{ height: '100dvh', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-white)' }}>
          <FeedColumn
            agent={selectedAgent}
            onPause={() => togglePause(selectedAgent)}
            onClose={closeFeed}
            onOpenDetails={openDetails}
            detailsOpen={false}
            onSend={onSendPrompt}
            activeTab={activeFeedTab}
            onTabChange={tab => setFeedTabsByAgent(previous => ({ ...previous, [selectedAgent.id]: tab }))}
            detailsButtonRef={detailsButtonRef}
            mobile
            style={{ height: '100%' }}
          />
        </div>
      )
    }

    return (
      <div style={{ height: '100dvh', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-white)' }}>
        <AgentsPanel
          agents={agents}
          selectedId={selectedId}
          onSelect={handleSelectAgent}
          onTogglePause={agentId => {
            const agent = agents.find(item => item.id === agentId)
            if (!agent) return
            togglePause(agent)
          }}
          width="100%"
          mode="browser"
          registerCardRef={registerCardRef}
          mobile
        />
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100dvh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-white)',
      }}
    >
      <IconRail />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-white)',
        }}
      >
        {browserMode ? (
          <>
            <AgentsPanel
              agents={agents}
              selectedId={selectedId}
              onSelect={handleSelectAgent}
              onTogglePause={agentId => {
                const agent = agents.find(item => item.id === agentId)
                if (!agent) return
                togglePause(agent)
              }}
              width="100%"
              mode="browser"
              registerCardRef={registerCardRef}
            />

            {selectedAgent && (
              <PanelStub
                title="Activity"
                subtitle={selectedAgent.name}
                side="right"
                ariaLabel={`Reopen activity for ${selectedAgent.name}`}
                onClick={reopenFeed}
              />
            )}
          </>
        ) : selectedAgent ? (
          <>
            {showAgentsSidebar && (
              <>
                <AgentsPanel
                  agents={agents}
                  selectedId={selectedId}
                  onSelect={handleSelectAgent}
                  onTogglePause={agentId => {
                    const agent = agents.find(item => item.id === agentId)
                    if (!agent) return
                    togglePause(agent)
                  }}
                  width={agentsWidth}
                  mode="sidebar"
                  registerCardRef={registerCardRef}
                />

                <ResizeHandle
                  onPointerDown={onAgentsResize}
                  onCollapse={() => setAgentsCollapsed(true)}
                  collapsed={false}
                  side="left"
                  label="Resize agents panel"
                  dragging={agentsDragging}
                  willCollapse={agentsWillCollapse}
                />
              </>
            )}

            {showAgentsStub && (
              <PanelStub
                title="Agents"
                subtitle={`${agents.length} total`}
                side="left"
                ariaLabel="Reopen agents panel"
                onClick={reopenAgentsPanel}
              />
            )}

            <FeedColumn
              agent={selectedAgent}
              onPause={() => togglePause(selectedAgent)}
              onClose={closeFeed}
              onOpenDetails={openDetails}
              detailsOpen={detailsOpen}
              onSend={onSendPrompt}
              activeTab={activeFeedTab}
              onTabChange={tab => setFeedTabsByAgent(previous => ({ ...previous, [selectedAgent.id]: tab }))}
              detailsButtonRef={detailsButtonRef}
              style={{ minWidth: layout === 'desktop' ? 360 : 0 }}
            />

            {showDetailsPanel ? (
              <>
                <ResizeHandle
                  onPointerDown={onRightPanelResize}
                  onCollapse={closeDetails}
                  collapsed={false}
                  side="right"
                  label="Resize details panel"
                  dragging={detailsDragging}
                  willCollapse={detailsWillCollapse}
                />

                <RightPanel
                  agent={selectedAgent}
                  width={rightPanelWidth}
                  onClose={closeDetails}
                  activeTab={activeDetailsTab}
                  onTabChange={tab => setDetailsTabsByAgent(previous => ({ ...previous, [selectedAgent.id]: tab }))}
                />
              </>
            ) : (
              <PanelStub
                title="Details"
                subtitle={detailTabLabel}
                side="right"
                ariaLabel={`Open details panel on ${detailTabLabel}`}
                onClick={() => setDetailsOpen(true)}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
