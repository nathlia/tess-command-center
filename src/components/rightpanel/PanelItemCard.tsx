import type { CSSProperties, ReactNode } from 'react'
import { UI_TONES, type UiTone } from '../ui/uiTones'

type PanelItemVariant = 'default' | 'tinted' | 'dim'

interface Props {
  children: ReactNode
  tone?: UiTone
  variant?: PanelItemVariant
  style?: CSSProperties
}

export function PanelItemCard({
  children,
  tone = 'neutral',
  variant = 'default',
  style,
}: Props) {
  const toneStyle = UI_TONES[tone]

  const palette =
    variant === 'tinted'
      ? {
          backgroundColor: toneStyle.backgroundColor,
          borderColor: toneStyle.borderColor,
          opacity: 1,
        }
      : variant === 'dim'
        ? {
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-default)',
            opacity: 1,
          }
        : {
            backgroundColor: 'var(--bg-white)',
            borderColor: 'var(--border-default)',
            opacity: 1,
          }

  return (
    <div
      style={{
        padding: '10px 11px',
        borderRadius: 12,
        border: `1px solid ${palette.borderColor}`,
        backgroundColor: palette.backgroundColor,
        opacity: palette.opacity,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
