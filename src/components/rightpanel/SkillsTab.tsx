import type { ContextPanelData, SkillItem } from '../../data/contextPanelData'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { ToneTile } from '../ui/ToneTile'
import { PanelItemCard } from './PanelItemCard'
import { panelIcons } from './panelIconsIndex'
import { PanelSection } from './PanelSection'

interface Props {
  data: ContextPanelData
}

export function SkillsTab({ data }: Props) {
  const active = data.skills.filter(skill => skill.status !== 'unused')
  const available = data.skills.filter(skill => skill.status === 'unused')

  if (data.skills.length === 0) {
    return <EmptyState>No skills available.</EmptyState>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {active.length > 0 && (
        <PanelSection title={`Active skills / ${active.length} of ${data.skills.length}`}>
          {active.map(skill => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </PanelSection>
      )}

      {available.length > 0 && (
        <PanelSection title="Available / not loaded">
          {available.map(skill => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </PanelSection>
      )}
    </div>
  )
}

function SkillCard({ skill }: { skill: SkillItem }) {
  const isCalled = skill.status === 'called'
  const isUnused = skill.status === 'unused'

  return (
    <PanelItemCard tone="purple" variant={isCalled ? 'tinted' : isUnused ? 'dim' : 'default'}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <ToneTile tone={isCalled ? 'purple' : 'neutral'} size="sm">
          <panelIcons.SkillIcon />
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
              {skill.name}
            </span>

            <Badge tone={isCalled ? 'purple' : 'neutral'} size="sm">
              {isCalled ? 'Called' : isUnused ? 'Not loaded' : 'Idle'}
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
            {skill.desc}
          </div>

          {!isUnused && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginTop: 6,
                fontSize: 'var(--text-xs)',
                color: 'var(--text-slate)',
                fontWeight: 'var(--medium)',
              }}
            >
              <span>Calls {skill.calls}</span>
              <span>Ctx {skill.ctx}</span>
            </div>
          )}
        </div>
      </div>
    </PanelItemCard>
  )
}
