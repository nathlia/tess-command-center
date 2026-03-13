import { useState } from 'react'
import { useAgentSimulation } from './hooks/useAgentSimulation'
import { AgentFeed } from './components/AgentFeed'
import { ActivityLog } from './components/ActivityLog'
import { QuickPrompt } from './components/QuickPrompt'

function App() {
  const { agents, sendPrompt } = useAgentSimulation()
  const [selectedId, setSelectedId] = useState(agents[0].id)

  const selectedAgent = agents.find(a => a.id === selectedId) ?? agents[0]

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg-white)' }}
    >
      {/* Left column — Agent Feed */}
      <aside
        className="flex flex-col w-80 shrink-0 border-r p-4 overflow-y-auto"
        style={{ borderColor: 'var(--border-default)' }}
      >
        {/* Logo / header */}
        <div className="mb-6 px-1">
          <span className="text-base font-bold tracking-tight" style={{ color: 'var(--text-ink)' }}>
            TESS
          </span>
          <span className="text-base font-bold tracking-tight ml-1" style={{ color: 'var(--bg-teal)' }}>
            Command Center
          </span>
        </div>

        <AgentFeed
          agents={agents}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </aside>

      {/* Right column — Activity Log + Quick Prompt */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <ActivityLog
            logs={selectedAgent.logs}
            agentName={selectedAgent.name}
          />
        </div>
        <QuickPrompt
          selectedAgent={selectedAgent}
          onSend={sendPrompt}
        />
      </main>
    </div>
  )
}

export default App
