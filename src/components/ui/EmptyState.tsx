import type { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  style?: CSSProperties
}

export function EmptyState({ children, style }: Props) {
  return (
    <div
      style={{
        padding: '28px 18px',
        textAlign: 'center',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-mid)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
