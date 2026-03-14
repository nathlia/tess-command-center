import type { ContextPanelData, ContextTone, McpItem } from '../../data/contextPanelData'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { ProgressBar } from '../ui/ProgressBar'
import { ToneTile } from '../ui/ToneTile'
import { PanelItemCard } from './PanelItemCard'
import { panelIcons } from './panelIconsIndex'
import { PanelSection } from './PanelSection'

interface Props {
  data: ContextPanelData
}

export function McpTab({ data }: Props) {
  if (data.mcps.length === 0) {
    return <EmptyState>No connected MCPs.</EmptyState>
  }

  return (
    <PanelSection title={`Connected MCPs / ${data.mcps.length}`}>
      {data.mcps.map(item => (
        <McpCard key={item.name} item={item} />
      ))}
    </PanelSection>
  )
}

function McpCard({ item }: { item: McpItem }) {
  const isCalling = item.badge === 'calling'
  const progressTone = toProgressTone(item.tone)

  return (
    <PanelItemCard tone={item.tone} variant={isCalling ? 'tinted' : 'default'}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <ToneTile tone={item.tone} size="sm">
          <panelIcons.McpIcon />
        </ToneTile>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--medium)',
                color: 'var(--text-ink)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.name}
            </span>

            <Badge tone={isCalling ? 'teal' : 'neutral'} size="sm">
              {isCalling ? 'Calling' : 'Idle'}
            </Badge>
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 'var(--text-xs)',
              color: 'var(--text-dark-600)',
              lineHeight: 1.55,
            }}
          >
            {item.desc}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              marginTop: 8,
              fontSize: 'var(--text-xs)',
              color: 'var(--text-slate)',
              fontWeight: 'var(--medium)',
            }}
          >
            <span>{item.calls} calls</span>
            <span>Ctx {item.ctx}</span>
          </div>

          <ProgressBar value={item.ctxPct} tone={progressTone} height={5} style={{ marginTop: 6 }} />
        </div>
      </div>
    </PanelItemCard>
  )
}

function toProgressTone(tone: ContextTone) {
  if (tone === 'purple') return 'purple'
  if (tone === 'teal') return 'teal'
  if (tone === 'amber') return 'amber'
  if (tone === 'emerald') return 'emerald'
  return 'neutral'
}
