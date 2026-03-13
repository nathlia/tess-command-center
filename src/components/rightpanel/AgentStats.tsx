import type { Agent } from '../../types/agent'
import { PanelMetricCard } from './PanelMetricCard'

interface Props {
  agent: Agent
}

export function AgentStats({ agent }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
      <PanelMetricCard label="Elapsed" value={formatElapsed(agent.elapsed)} mono />
      <PanelMetricCard label="Tokens" value={formatTokens(agent.tokens)} mono />
      <PanelMetricCard label="Est. cost" value={`$${(agent.tokens * 0.000015).toFixed(4)}`} mono />
      <PanelMetricCard label="Progress" value={`${Math.round(agent.progress)}%`} mono />
    </div>
  )
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}m${String(remainder).padStart(2, '0')}s`
}

function formatTokens(tokens: number) {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`
  return String(tokens)
}
