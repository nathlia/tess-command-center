import type { ContextPanelData } from '../../data/contextPanelData'
import { SurfaceCard } from '../ui/SurfaceCard'
import { PanelSection } from './PanelSection'

interface Props {
  data: ContextPanelData
  livePct?: number
}

export function ContextTab({ data, livePct }: Props) {
  const staticTotal = data.ctx.reasoning + data.ctx.mcp + data.ctx.skills + data.ctx.task
  // Use live agent.ctx if provided; scale breakdown proportionally to keep ratios intact
  const totalPct = livePct !== undefined ? Math.round(livePct) : staticTotal
  const scale = staticTotal > 0 ? totalPct / staticTotal : 0

  const scaled = {
    reasoning: data.ctx.reasoning * scale,
    mcp: data.ctx.mcp * scale,
    skills: data.ctx.skills * scale,
    task: data.ctx.task * scale,
  }

  const totalUsed = formatWindowValue((totalPct / 100) * data.ctx.total)

  const segments = [
    { key: 'reasoning', label: 'Agent reasoning', value: scaled.reasoning, color: 'var(--text-purple)', used: formatWindowValue((scaled.reasoning / 100) * data.ctx.total) },
    { key: 'mcp', label: 'MCP results', value: scaled.mcp, color: 'var(--text-teal)', used: formatWindowValue((scaled.mcp / 100) * data.ctx.total) },
    { key: 'skills', label: 'Skills injected', value: scaled.skills, color: 'var(--text-emerald)', used: formatWindowValue((scaled.skills / 100) * data.ctx.total) },
    { key: 'task', label: 'Task + history', value: scaled.task, color: 'var(--text-amber)', used: formatWindowValue((scaled.task / 100) * data.ctx.total) },
    { key: 'available', label: 'Available', value: Math.max(0, 100 - totalPct), color: 'var(--border-default)', used: formatWindowValue((Math.max(0, 100 - totalPct) / 100) * data.ctx.total) },
  ]

  return (
    <PanelSection title="Window breakdown">
      <SurfaceCard tone="subtle" padding="12px" radius={12}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--medium)', color: 'var(--text-ink)' }}>
            {data.ctx.total}k context window
          </span>
          <span
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--medium)',
              color: totalPct > 70 ? 'var(--text-amber)' : 'var(--text-ink)',
            }}
          >
            {totalPct}% used
          </span>
        </div>

        <div
          style={{
            height: 8,
            borderRadius: 999,
            backgroundColor: 'var(--bg-light)',
            overflow: 'hidden',
            display: 'flex',
            margin: '8px 0 10px',
          }}
        >
          {segments.map(segment => (
            <div
              key={segment.key}
              style={{
                width: `${segment.value}%`,
                backgroundColor: segment.color,
                height: '100%',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {segments.map(segment => (
            <div
              key={segment.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: segment.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dark-600)' }}>{segment.label}</span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--medium)', color: 'var(--text-dark-900)' }}>
                {segment.used}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-dark-600)' }}>Total used</span>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--medium)', color: 'var(--text-ink)' }}>
            {totalUsed} / {data.ctx.total}k
          </span>
        </div>
      </SurfaceCard>

      {totalPct > 65 && (
        <SurfaceCard tone="purple" padding="12px" radius={12}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--medium)', color: 'var(--text-purple)' }}>
            Recommendation
          </div>
          <div style={{ marginTop: 4, fontSize: 'var(--text-xs)', color: 'var(--text-dark-600)', lineHeight: 1.6 }}>
            Consider summarizing earlier MCP results or moving the agent to a larger context model if usage keeps climbing.
          </div>
        </SurfaceCard>
      )}
    </PanelSection>
  )
}

function formatWindowValue(value: number) {
  return `${Math.round(value * 10) / 10}k`
}
