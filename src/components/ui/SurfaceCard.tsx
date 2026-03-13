import type { CSSProperties, ReactNode } from 'react'

type SurfaceTone = 'default' | 'subtle' | 'warm'

const SURFACE_STYLES: Record<SurfaceTone, { backgroundColor: string; borderColor: string }> = {
  default: {
    backgroundColor: 'var(--bg-white)',
    borderColor: 'var(--border-default)',
  },
  subtle: {
    backgroundColor: 'var(--bg-subtle)',
    borderColor: 'var(--border-default)',
  },
  warm: {
    backgroundColor: 'var(--bg-warm)',
    borderColor: 'var(--border-tan-20)',
  },
}

interface Props {
  children: ReactNode
  tone?: SurfaceTone
  padding?: string
  radius?: number
  style?: CSSProperties
}

export function SurfaceCard({
  children,
  tone = 'default',
  padding = '12px 14px',
  radius = 14,
  style,
}: Props) {
  const surface = SURFACE_STYLES[tone]

  return (
    <div
      style={{
        padding,
        borderRadius: radius,
        border: `1px solid ${surface.borderColor}`,
        backgroundColor: surface.backgroundColor,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
