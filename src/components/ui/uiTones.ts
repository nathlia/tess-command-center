export type UiTone = 'neutral' | 'teal' | 'purple' | 'amber' | 'emerald'

export interface UiToneStyle {
  backgroundColor: string
  borderColor: string
  color: string
}

export const UI_TONES: Record<UiTone, UiToneStyle> = {
  neutral: {
    backgroundColor: 'var(--bg-subtle)',
    borderColor: 'var(--border-default)',
    color: 'var(--text-mid)',
  },
  teal: {
    backgroundColor: 'var(--bg-teal-12)',
    borderColor: 'var(--border-teal-15)',
    color: 'var(--text-teal)',
  },
  purple: {
    backgroundColor: 'var(--bg-purple-tint)',
    borderColor: 'var(--bg-purple-20)',
    color: 'var(--text-purple)',
  },
  amber: {
    backgroundColor: 'var(--bg-warm)',
    borderColor: 'var(--border-tan-20)',
    color: 'var(--text-amber)',
  },
  emerald: {
    backgroundColor: 'var(--bg-emerald-tint)',
    borderColor: 'var(--border-default)',
    color: 'var(--text-emerald)',
  },
}
