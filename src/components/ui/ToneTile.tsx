import type { CSSProperties, ReactNode } from 'react'
import { UI_TONES, type UiTone } from './uiTones'

type TileSize = 'sm' | 'md' | 'lg'
type TileVariant = 'soft' | 'inset'

const TILE_SIZES: Record<TileSize, { size: number; radius: number }> = {
  sm: { size: 28, radius: 9 },
  md: { size: 32, radius: 10 },
  lg: { size: 34, radius: 10 },
}

interface Props {
  children: ReactNode
  tone?: UiTone
  size?: TileSize
  variant?: TileVariant
  style?: CSSProperties
}

export function ToneTile({
  children,
  tone = 'neutral',
  size = 'md',
  variant = 'soft',
  style,
}: Props) {
  const toneStyle = UI_TONES[tone]
  const sizeStyle = TILE_SIZES[size]

  return (
    <div
      style={{
        width: sizeStyle.size,
        height: sizeStyle.size,
        borderRadius: sizeStyle.radius,
        border: `1px solid ${toneStyle.borderColor}`,
        backgroundColor: variant === 'inset' ? 'var(--bg-white)' : toneStyle.backgroundColor,
        color: toneStyle.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
