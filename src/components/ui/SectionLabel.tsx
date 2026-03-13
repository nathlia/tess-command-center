import type { CSSProperties, ReactNode } from 'react'

type LabelTone = 'muted' | 'teal'

const LABEL_COLORS: Record<LabelTone, string> = {
  muted: 'var(--text-muted-400)',
  teal: 'var(--text-teal)',
}

interface Props {
  children: ReactNode
  tone?: LabelTone
  style?: CSSProperties
}

export function SectionLabel({ children, tone = 'muted', style }: Props) {
  return (
    <span
      style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--semibold)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: LABEL_COLORS[tone],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
