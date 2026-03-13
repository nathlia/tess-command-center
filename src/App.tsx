import { AppShell } from './components/layout/AppShell'
import { useAgentSimulation } from './hooks/useAgentSimulation'

function App() {
  const { agents, sendPrompt, pauseAgent, resumeAgent } = useAgentSimulation()

  return (
    <AppShell
      agents={agents}
      onSendPrompt={sendPrompt}
      onPauseAgent={pauseAgent}
      onResumeAgent={resumeAgent}
    />
  )
}

export default App
