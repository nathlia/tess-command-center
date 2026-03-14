import type { CSSProperties, RefObject } from 'react'
import { useState } from 'react'
import type { Agent } from '../../types/agent'
import { FeedHeader } from './FeedHeader'
import { CtxAlert } from './CtxAlert'
import { FeedTabs } from './FeedTabs'
import { ActivityFeed } from './ActivityFeed'
import { OutputTab } from './OutputTab'
import { MemoryTab } from './MemoryTab'
import { FilesTab } from './FilesTab'
import { InputBar } from './InputBar'

export type FeedTab = 'activity' | 'output' | 'memory' | 'files'

interface Props {
  agent: Agent
  onPause: () => void
  onClose: () => void
  onOpenDetails: () => void
  detailsOpen: boolean
  onSend: (agentId: string, msg: string) => void
  activeTab: FeedTab
  onTabChange: (tab: FeedTab) => void
  detailsButtonRef?: RefObject<HTMLButtonElement | null>
  mobile?: boolean
  style?: CSSProperties
}

export function FeedColumn({
  agent,
  onPause,
  onClose,
  onOpenDetails,
  detailsOpen,
  onSend,
  activeTab,
  onTabChange,
  detailsButtonRef,
  mobile = false,
  style,
}: Props) {
  const [ctxDismissed, setCtxDismissed] = useState(false)

  return (
    <div style={{
      flex: mobile ? undefined : 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-white)',
      overflow: 'hidden',
      ...style,
    }}>
      <FeedHeader
        agent={agent}
        onPause={onPause}
        onClose={onClose}
        onOpenDetails={onOpenDetails}
        detailsOpen={detailsOpen}
        detailsButtonRef={detailsButtonRef}
        mobile={mobile}
      />

      {agent.ctx >= 60 && !ctxDismissed && (
        <CtxAlert ctx={agent.ctx} onDismiss={() => setCtxDismissed(true)} />
      )}

      <FeedTabs active={activeTab} onChange={(t) => onTabChange(t as FeedTab)} />

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'activity' && <ActivityFeed agent={agent} />}
        {activeTab === 'output'   && <OutputTab agent={agent} />}
        {activeTab === 'memory'   && <MemoryTab agentId={agent.id} />}
        {activeTab === 'files'    && <FilesTab agentId={agent.id} />}
      </div>

      <InputBar agentId={agent.id} agentLabel={agent.name} onSend={onSend} />
    </div>
  )
}
