import { SectionLabel } from '../ui/SectionLabel'

interface Props {
  label: string
  value: string
  mono?: boolean
}

export function PanelMetricCard({ label, value, mono = false }: Props) {
  return (
    <div
      style={{
        padding: '6px 8px',
        borderRadius: 10,
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-subtle)',
      }}
    >
      <SectionLabel style={{ display: 'block', marginBottom: 2, fontSize: '10px', letterSpacing: '0.06em' }}>
        {label}
      </SectionLabel>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--semibold)',
          color: 'var(--text-ink)',
          fontFamily: mono ? 'ui-monospace, SFMono-Regular, monospace' : 'var(--font)',
        }}
      >
        {value}
      </div>
    </div>
  )
}
