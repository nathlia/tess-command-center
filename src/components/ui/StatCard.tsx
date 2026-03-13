import type { CSSProperties } from 'react'
import { SectionLabel } from './SectionLabel'

interface Props {
  label: string
  value: string
  style?: CSSProperties
}

export function StatCard({ label, value, style }: Props) {
  return (
    <div
      style={{
        minWidth: 92,
        padding: '10px 12px',
        borderRadius: 10,
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
        ...style,
      }}
    >
      <SectionLabel>{label}</SectionLabel>
      <div
        style={{
          marginTop: 3,
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--bold)',
          color: 'var(--text-ink)',
          lineHeight: 1.15,
        }}
      >
        {value}
      </div>
    </div>
  )
}
