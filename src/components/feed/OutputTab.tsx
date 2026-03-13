import type { Agent } from '../../types/agent'
import { EmptyState } from '../ui/EmptyState'
import { SectionLabel } from '../ui/SectionLabel'
import { SurfaceCard } from '../ui/SurfaceCard'

interface Props {
  agent: Agent
}

export function OutputTab({ agent }: Props) {
  const outputs = agent.logs.filter(log => log.output)

  if (outputs.length === 0) {
    return <EmptyState>No output yet.</EmptyState>
  }

  return (
    <div style={{ padding: '12px 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {outputs.map(output => (
        <SurfaceCard
          key={output.id}
          style={{
            padding: '12px 14px',
          }}
        >
          <SectionLabel style={{ display: 'block', marginBottom: 6 }}>
            {output.type} / {new Date(output.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </SectionLabel>

          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-ink)',
              whiteSpace: 'pre-wrap',
              lineHeight: 'var(--lh-base)',
            }}
          >
            {output.output}
          </div>
        </SurfaceCard>
      ))}
    </div>
  )
}
