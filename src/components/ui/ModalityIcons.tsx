import type { ReactNode } from 'react'
import type { Modality } from '../../types/agent'

interface Props {
  active: Modality[]
  generating: Modality | null
}

const MODALITIES: Array<{ id: Modality; label: string; icon: ReactNode }> = [
  {
    id: 'T',
    label: 'Text',
    icon: (
      <svg width={11} height={11} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M3 3.2h8M7 3.2v7.6M4.8 10.8h4.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'I',
    label: 'Image',
    icon: (
      <svg width={11} height={11} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="2" y="2.5" width="10" height="9" rx="2" />
        <circle cx="5" cy="5.2" r="1" />
        <path d="m4 9 2-2 1.4 1.4L9 6.8 11 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'V',
    label: 'Video',
    icon: (
      <svg width={11} height={11} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="2" y="3" width="7.5" height="8" rx="2" />
        <path d="m9.5 5.4 2.5-1.6v6.4L9.5 8.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'A',
    label: 'Audio',
    icon: (
      <svg width={11} height={11} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="4.7" y="1.7" width="4.6" height="6.3" rx="2.3" />
        <path d="M3 7.1a4 4 0 0 0 8 0M7 11.1V12.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'O',
    label: 'Other',
    icon: (
      <svg width={11} height={11} viewBox="0 0 14 14" fill="currentColor">
        <circle cx="3.2" cy="7" r="1.1" />
        <circle cx="7" cy="7" r="1.1" />
        <circle cx="10.8" cy="7" r="1.1" />
      </svg>
    ),
  },
]

export function ModalityIcons({ active, generating }: Props) {
  const currentModality = generating ?? active[0] ?? 'O'
  const current = MODALITIES.find(modality => modality.id === currentModality)

  if (!current) return null

  return (
    <div
      title={current.label}
      aria-label={current.label}
      style={{
        width: 20,
        height: 20,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: generating ? 'var(--bg-teal-12)' : 'var(--bg-subtle)',
        border: `1px solid ${generating ? 'var(--border-teal-15)' : 'var(--border-default)'}`,
        color: generating ? 'var(--text-teal)' : 'var(--text-ink)',
        flexShrink: 0,
      }}
    >
      {current.icon}
    </div>
  )
}
