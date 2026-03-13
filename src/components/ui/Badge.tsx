import type { CSSProperties, ReactNode } from 'react'
import { UI_TONES, type UiTone } from './uiTones'

type BadgeSize = 'sm' | 'md'

const SIZE_STYLES: Record<BadgeSize, { fontSize: string; padding: string }> = {
  sm: {
    fontSize: '10px',
    padding: '3px 8px',
  },
  md: {
    fontSize: 'var(--text-xs)',
    padding: '4px 10px',
  },
}

interface Props {
  children: ReactNode
  tone?: UiTone
  size?: BadgeSize
  dot?: boolean
  uppercase?: boolean
  style?: CSSProperties
}

export function Badge({
  children,
  tone = 'neutral',
  size = 'md',
  dot = false,
  uppercase = false,
  style,
}: Props) {
  const toneStyle = UI_TONES[tone]
  const sizeStyle = SIZE_STYLES[size]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: sizeStyle.padding,
        borderRadius: 999,
        border: `1px solid ${toneStyle.borderColor}`,
        backgroundColor: toneStyle.backgroundColor,
        color: toneStyle.color,
        fontSize: sizeStyle.fontSize,
        fontWeight: 'var(--semibold)',
        letterSpacing: uppercase ? '0.08em' : 'normal',
        textTransform: uppercase ? 'uppercase' : 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: toneStyle.color,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  )
}
