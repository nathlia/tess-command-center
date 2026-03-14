import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: ReactNode
}

export function TabButton({ active = false, children, style, ...buttonProps }: Props) {
  return (
    <button
      type="button"
      style={{
        padding: '0 2px',
        minHeight: 44,
        border: 'none',
        borderBottom: `2px solid ${active ? 'var(--text-ink)' : 'transparent'}`,
        background: 'none',
        color: active ? 'var(--text-ink)' : 'var(--text-mid)',
        fontSize: 'var(--text-sm)',
        fontWeight: active ? 'var(--semibold)' : 'var(--medium)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'color 120ms, border-color 120ms',
        ...style,
      }}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
