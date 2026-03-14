import type { CSSProperties, ReactNode } from 'react'
import { SectionLabel } from '../ui/SectionLabel'

interface Props {
  title: string
  children: ReactNode
  style?: CSSProperties
}

export function PanelSection({ title, children, style }: Props) {
  return (
    <section style={style}>
      <SectionLabel
        style={{
          display: 'block',
          marginBottom: 8,
          color: 'var(--text-dark-600)',
          fontWeight: 'var(--medium)',
          letterSpacing: '0.07em',
        }}
      >
        {title}
      </SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </section>
  )
}
