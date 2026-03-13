import type { AgentStep } from '../../types/agent'
import { Badge } from '../ui/Badge'
import { SectionLabel } from '../ui/SectionLabel'
import { SurfaceCard } from '../ui/SurfaceCard'

interface Props {
  steps: AgentStep[]
}

export function StepTracker({ steps }: Props) {
  return (
    <SurfaceCard tone="subtle" padding="10px 11px" radius={10}>
      <SectionLabel style={{ display: 'block', marginBottom: 10, fontSize: '10px', letterSpacing: '0.06em' }}>
        Steps
      </SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {steps.map(step => {
          const tone = step.status === 'done' ? 'emerald' : step.status === 'active' ? 'teal' : 'neutral'

          return (
            <div key={step.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  marginTop: 5,
                  borderRadius: '50%',
                  backgroundColor:
                    step.status === 'done'
                      ? 'var(--text-emerald)'
                      : step.status === 'active'
                        ? 'var(--bg-teal)'
                        : 'var(--text-muted-400)',
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--medium)',
                      color: 'var(--text-ink)',
                    }}
                  >
                    {step.label}
                  </span>

                  <Badge tone={tone} size="sm">
                    {statusLabel(step.status)}
                  </Badge>
                </div>

                <div style={{ marginTop: 3, fontSize: 'var(--text-xs)', color: 'var(--text-mid)' }}>{step.time}</div>
              </div>
            </div>
          )
        })}
      </div>
    </SurfaceCard>
  )
}

function statusLabel(status: AgentStep['status']) {
  if (status === 'done') return 'Done'
  if (status === 'active') return 'Running'
  return 'Pending'
}
