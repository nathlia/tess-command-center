import type { ContextPanelData, IntegrationItem } from '../../data/contextPanelData'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { ToneTile } from '../ui/ToneTile'
import { PanelItemCard } from './PanelItemCard'
import { panelIcons } from './panelIconsIndex'
import { PanelSection } from './PanelSection'

interface Props {
  data: ContextPanelData
}

export function IntegrationsTab({ data }: Props) {
  const connected = data.integrations.filter(item => item.status === 'connected')
  const inactive = data.integrations.filter(item => item.status !== 'connected')

  if (data.integrations.length === 0) {
    return <EmptyState>No integrations available.</EmptyState>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {connected.length > 0 && (
        <PanelSection title={`Connected / ${connected.length}`}>
          {connected.map(item => (
            <IntegrationCard key={item.name} item={item} />
          ))}
        </PanelSection>
      )}

      {inactive.length > 0 && (
        <PanelSection title="Not connected / needs attention">
          {inactive.map(item => (
            <IntegrationCard key={item.name} item={item} />
          ))}
        </PanelSection>
      )}
    </div>
  )
}

function IntegrationCard({ item }: { item: IntegrationItem }) {
  const statusTone = item.status === 'connected' ? 'emerald' : item.status === 'error' ? 'amber' : 'neutral'
  const variant = item.status === 'idle' ? 'dim' : 'default'

  return (
    <PanelItemCard tone={item.tone} variant={variant}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <ToneTile tone={item.tone} size="sm">
          <panelIcons.IntegrationIcon />
        </ToneTile>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--semibold)',
                color: 'var(--text-ink)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.name}
            </span>

            <Badge tone={statusTone} size="sm">
              {labelForStatus(item.status)}
            </Badge>
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 'var(--text-xs)',
              color: 'var(--text-mid)',
              lineHeight: 1.5,
            }}
          >
            {descriptionForStatus(item.status)}
          </div>
        </div>
      </div>
    </PanelItemCard>
  )
}

function labelForStatus(status: IntegrationItem['status']) {
  if (status === 'connected') return 'Connected'
  if (status === 'error') return 'Attention'
  return 'Idle'
}

function descriptionForStatus(status: IntegrationItem['status']) {
  if (status === 'connected') return 'Ready for agent use in this workspace.'
  if (status === 'error') return 'Connection needs review before it can be used.'
  return 'Available but not loaded into the current workflow.'
}
