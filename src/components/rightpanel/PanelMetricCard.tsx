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
        padding: '10px 12px',
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
      }}
    >
      <SectionLabel
        style={{
          display: 'block',
          marginBottom: 5,
          fontSize: '10px',
          letterSpacing: '0.06em',
          color: 'var(--text-dark-600)',
          fontWeight: 'var(--medium)',
        }}
      >
        {label}
      </SectionLabel>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--medium)',
          lineHeight: 1.15,
          color: 'var(--text-ink)',
          fontFamily: mono ? '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace' : 'var(--font)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: mono ? '-0.02em' : 'normal',
        }}
      >
        {value}
      </div>
    </div>
  )
}
