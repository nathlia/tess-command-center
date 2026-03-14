import { ControlButton } from '../ui/ControlButton'

type Tab = 'activity' | 'output' | 'memory' | 'files'

interface Props {
  active: Tab
  onChange: (t: Tab) => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'activity', label: 'Activity' },
  { id: 'output', label: 'Output' },
  { id: 'memory', label: 'Memory' },
  { id: 'files', label: 'Files' },
]

export function FeedTabs({ active, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Feed sections"
      style={{
        display: 'flex',
        gap: 6,
        padding: '10px 18px',
        borderBottom: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
        overflowX: 'auto',
      }}
    >
      {TABS.map(tab => (
        <ControlButton
          key={tab.id}
          onClick={() => onChange(tab.id)}
          role="tab"
          aria-selected={active === tab.id}
          active={active === tab.id}
          variant="ghost"
          size="sm"
          style={{ padding: '0 12px', borderRadius: 10 }}
        >
          {tab.label}
        </ControlButton>
      ))}
    </div>
  )
}
