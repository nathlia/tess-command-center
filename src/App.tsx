import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAgentSimulation } from './hooks/useAgentSimulation'
import { AgentFeed } from './components/AgentFeed'
import { ActivityLog } from './components/ActivityLog'
import { QuickPrompt } from './components/QuickPrompt'
import tessLogo from './assets/tess-light.svg'

function App() {
  const { agents, sendPrompt } = useAgentSimulation()
  const [selectedId, setSelectedId] = useState(agents[0].id)
  const [mobilePanel, setMobilePanel] = useState<'agents' | 'log'>('agents')

  const selectedAgent = agents.find(a => a.id === selectedId) ?? agents[0]

  const runningCount = agents.filter(a => a.status !== 'done').length
  const doneCount = agents.filter(a => a.status === 'done').length
  const totalTokens = agents.reduce((sum, a) => sum + a.tokens, 0)
  const uniqueModels = new Set(agents.map(a => a.model)).size
  const [latency] = useState(811)

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-warm)' }}>
      {/* Icon sidebar */}
      <nav
        className="hidden md:flex flex-col items-center shrink-0 border-r"
        style={{
          width: 56,
          backgroundColor: 'var(--bg-white)',
          borderColor: 'rgba(229,231,235,0.7)',
        }}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-center h-14 w-full">
          <img src={tessLogo} alt="TESS" className="w-5 h-5 object-contain" />
        </div>

        <div className="flex-1 flex flex-col items-center gap-1 pt-1 w-full px-2">
          {[
            sidebarIcon('M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'Dashboard'),
            sidebarIcon('M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', 'Messages'),
            sidebarIcon('M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2||M23 21v-2a4 4 0 00-3-3.87||M16 3.13a4 4 0 010 7.75', 'Team'),
            sidebarIcon('M18 20V10||M12 20V4||M6 20v-6', 'Analytics'),
          ].map((item, i) => (
            <SidebarButton key={i} {...item} />
          ))}

          <div className="w-7 mx-auto my-1" style={{ height: 1, backgroundColor: 'rgba(229,231,235,0.6)' }} />

          {[
            sidebarIcon('M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9||M13.73 21a2 2 0 01-3.46 0', 'Notifications'),
            sidebarIcon('M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z||M14 2v6h6||M16 13H8||M16 17H8||M10 9H8', 'Documents'),
            sidebarIcon('M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z||M12 8a4 4 0 100 8 4 4 0 000-8z', 'Settings'),
            { paths: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Security', active: false },
            { paths: 'M12 8V4l8 4-8 4||M12 16v4||M20 12v4a8 8 0 01-16 0v-4', label: 'Agents', active: true },
          ].map((item, i) => (
            <SidebarButton key={`s2-${i}`} {...item} />
          ))}
        </div>

        <div className="pb-3 px-2 border-t pt-3 w-full flex justify-center" style={{ borderColor: 'rgba(229,231,235,0.5)' }}>
          <div
            className="flex items-center justify-center rounded-full text-white text-[10px] font-semibold"
            style={{ width: 28, height: 28, backgroundColor: 'var(--bg-teal)' }}
            role="img"
            aria-label="User profile"
          >
            T
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex items-center justify-between shrink-0 px-5 md:px-7 border-b"
          style={{
            height: 72,
            backgroundColor: 'var(--bg-white)',
            borderColor: 'rgba(229,231,235,0.6)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-[10px] shrink-0"
              style={{ width: 32, height: 32, backgroundColor: 'var(--bg-teal-12)' }}
            >
              <img src={tessLogo} alt="" className="w-4 h-4 object-contain" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <h1
                className="text-[17px] font-bold leading-tight tracking-tight"
                style={{ color: 'var(--text-ink)' }}
              >
                Command Center
              </h1>
              <p
                className="text-[11px] font-medium hidden sm:block"
                style={{ color: 'var(--text-mid)' }}
              >
                Monitor and instruct your AI agents in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--text-emerald)', opacity: 0.93 }}
              />
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted-500)' }}>
                {runningCount} running
              </span>
            </div>

            {/* Mobile panel toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobilePanel('agents')}
                className="text-xs px-3 py-1.5 rounded-l-lg font-medium transition-colors"
                style={{
                  backgroundColor: mobilePanel === 'agents' ? 'var(--bg-teal-12)' : 'var(--bg-off-white)',
                  color: mobilePanel === 'agents' ? 'var(--bg-teal)' : 'var(--text-mid)',
                  border: '1px solid var(--border-default)',
                }}
                aria-pressed={mobilePanel === 'agents'}
              >
                Agents
              </button>
              <button
                onClick={() => setMobilePanel('log')}
                className="text-xs px-3 py-1.5 rounded-r-lg font-medium transition-colors"
                style={{
                  backgroundColor: mobilePanel === 'log' ? 'var(--bg-teal-12)' : 'var(--bg-off-white)',
                  color: mobilePanel === 'log' ? 'var(--bg-teal)' : 'var(--text-mid)',
                  border: '1px solid var(--border-default)',
                  borderLeft: 'none',
                }}
                aria-pressed={mobilePanel === 'log'}
              >
                Activity
              </button>
            </div>
          </div>
        </motion.header>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="hidden sm:flex items-center gap-4 px-5 md:px-7 shrink-0 border-b overflow-x-auto"
          style={{
            height: 33,
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'rgba(229,231,235,0.5)',
          }}
          role="status"
          aria-label="Agent statistics"
        >
          <div className="flex items-center gap-4">
            <StatPill dotColor="var(--bg-teal)" label={`${runningCount} Running`} />
            <StatPill dotColor="var(--text-emerald)" label={`${doneCount} Done`} />
            <StatPill dotColor="var(--text-muted-500)" label="0 Idle" />
          </div>

          <div className="w-px h-3.5 shrink-0" style={{ backgroundColor: 'var(--border-default)' }} />

          <div className="flex items-center gap-5">
            <MetricPill label="Tokens" value={formatTokens(totalTokens)} />
            <MetricPill label="Latency" value={`${latency}ms`} />
            <MetricPill label="Models" value={String(uniqueModels)} />
          </div>
        </motion.div>

        {/* Main panels */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Agent cards panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className={`flex-1 min-w-0 overflow-y-auto p-5 ${mobilePanel !== 'agents' ? 'hidden md:block' : ''}`}
            style={{ backgroundColor: 'var(--bg-warm)' }}
          >
            <AgentFeed
              agents={agents}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id)
                if (window.innerWidth < 768) setMobilePanel('log')
              }}
            />
          </motion.div>

          {/* Resize handle visual */}
          <div
            className="hidden md:flex items-center justify-center shrink-0 relative"
            style={{ width: 12 }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-0"
              style={{ left: 5.5, width: 1, backgroundColor: 'rgba(229,231,235,0.6)' }}
            />
            <div className="flex flex-col gap-[3px]">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{ width: 2, height: 2, backgroundColor: 'var(--border-default)' }}
                />
              ))}
            </div>
          </div>

          {/* Activity log panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className={`flex flex-col min-w-0 overflow-hidden md:max-w-[54%] ${mobilePanel !== 'log' ? 'hidden md:flex md:flex-[0_0_54%]' : 'flex flex-1 md:flex-[0_0_54%]'}`}
            style={{ backgroundColor: 'var(--bg-ink)' }}
          >
            <div className="flex-1 overflow-hidden">
              <ActivityLog
                logs={selectedAgent.logs}
                agentName={selectedAgent.name}
                agentIcon={selectedAgent.icon}
              />
            </div>
            <QuickPrompt
              selectedAgent={selectedAgent}
              onSend={sendPrompt}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* --- Small helper components --- */

function SidebarButton({ paths, label, active = false }: { paths: string; label: string; active?: boolean }) {
  return (
    <button
      className="flex items-center justify-center rounded-[10px] transition-colors"
      style={{
        width: 39,
        height: 29,
        backgroundColor: active ? 'var(--bg-teal-12)' : 'transparent',
      }}
      aria-label={label}
      title={label}
    >
      <svg
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: active ? 'var(--bg-teal)' : 'var(--text-mid)' }}
        aria-hidden="true"
      >
        {paths.split('||').map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </button>
  )
}

function sidebarIcon(paths: string, label: string): { paths: string; label: string; active: boolean } {
  return { paths, label, active: false }
}

function StatPill({ dotColor, label }: { dotColor: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="rounded-full shrink-0" style={{ width: 5, height: 5, backgroundColor: dotColor }} />
      <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: 'var(--text-mid)' }}>
        {label}
      </span>
    </span>
  )
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="text-[10px] font-medium uppercase tracking-wide whitespace-nowrap"
        style={{ color: 'var(--text-mid)' }}
      >
        {label}
      </span>
      <span
        className="text-[11px] font-medium font-mono whitespace-nowrap"
        style={{ color: 'var(--text-slate)' }}
      >
        {value}
      </span>
    </span>
  )
}

function formatTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default App
