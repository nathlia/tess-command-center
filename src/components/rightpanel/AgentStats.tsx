import type { Agent } from '../../types/agent'
import { formatElapsed, formatTokens, getStepSummary } from '../../utils/agentHelpers'
import { PanelMetricCard } from './PanelMetricCard'

interface Props {
  agent: Agent
}

export function AgentStats({ agent }: Props) {
  const steps = getStepSummary(agent.steps)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <PanelMetricCard label="Elapsed" value={formatElapsed(agent.elapsed)} mono />
      <PanelMetricCard label="Tokens" value={formatTokens(agent.tokens)} mono />
      <PanelMetricCard label="Est. cost" value={`$${(agent.tokens * 0.000015).toFixed(4)}`} mono />
      <PanelMetricCard label="Steps" value={`${steps.current}/${steps.total}`} mono />
    </div>
  )
}
