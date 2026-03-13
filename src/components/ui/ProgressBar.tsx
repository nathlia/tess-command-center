import type { CSSProperties } from 'react'

type ProgressTone = 'neutral' | 'teal' | 'purple' | 'amber' | 'emerald'

const FILL_COLORS: Record<ProgressTone, string> = {
  neutral: 'var(--text-mid)',
  teal: 'var(--bg-teal)',
  purple: 'var(--text-purple)',
  amber: 'var(--text-amber)',
  emerald: 'var(--text-emerald)',
}

interface Props {
  value: number
  tone?: ProgressTone
  height?: number
  trackColor?: string
  borderColor?: string
  style?: CSSProperties
}

export function ProgressBar({
  value,
  tone = 'teal',
  height = 4,
  trackColor = 'var(--bg-light)',
  borderColor,
  style,
}: Props) {
  const width = Math.max(0, Math.min(100, value))

  return (
    <div
      style={{
        height,
        borderRadius: 999,
        overflow: 'hidden',
        backgroundColor: trackColor,
        border: borderColor ? `1px solid ${borderColor}` : 'none',
        ...style,
      }}
    >
      <div
        style={{
          width: `${width}%`,
          height: '100%',
          borderRadius: 999,
          backgroundColor: FILL_COLORS[tone],
          transition: 'width 500ms ease',
        }}
      />
    </div>
  )
}
