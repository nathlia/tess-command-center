import { useState } from 'react'
import type { Agent } from '../../types/agent'
import { FeedHeader } from './FeedHeader'
import { ModelBar } from './ModelBar'
import { CtxAlert } from './CtxAlert'
import { FeedTabs } from './FeedTabs'
import { ActivityFeed } from './ActivityFeed'
import { OutputTab } from './OutputTab'
import { MemoryTab } from './MemoryTab'
import { FilesTab } from './FilesTab'
import { InputBar } from './InputBar'

type Tab = 'activity' | 'output' | 'memory' | 'files'

interface Props {
  agent: Agent
  onPause: () => void
  onSplit: () => void
  splitId: string | null
  showSplit?: boolean
  onSend: (agentId: string, msg: string) => void
}

export function FeedColumn({ agent, onPause, onSplit, splitId, showSplit = true, onSend }: Props) {
  const [tab, setTab] = useState<Tab>('activity')
  const [ctxDismissed, setCtxDismissed] = useState(false)

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-white)',
      overflow: 'hidden',
    }}>
      <FeedHeader
        agent={agent}
        onPause={onPause}
        onSplit={onSplit}
        splitActive={!!splitId}
        showSplit={showSplit}
      />
      <ModelBar agent={agent} />

      {agent.ctx >= 60 && !ctxDismissed && (
        <CtxAlert ctx={agent.ctx} onDismiss={() => setCtxDismissed(true)} />
      )}

      <FeedTabs active={tab} onChange={(t) => setTab(t as Tab)} />

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {tab === 'activity' && <ActivityFeed agent={agent} />}
        {tab === 'output'   && <OutputTab agent={agent} />}
        {tab === 'memory'   && <MemoryTab agentId={agent.id} />}
        {tab === 'files'    && <FilesTab agentId={agent.id} />}
      </div>

      <InputBar agentId={agent.id} onSend={onSend} />
    </div>
  )
}
