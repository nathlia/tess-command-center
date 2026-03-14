import { TabButton } from '../ui/TabButton'

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
        gap: 20,
        padding: '0 18px',
        borderBottom: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
        overflowX: 'auto',
        flexShrink: 0,
      }}
    >
      {TABS.map(tab => (
        <TabButton
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          active={active === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </TabButton>
      ))}
    </div>
  )
}
