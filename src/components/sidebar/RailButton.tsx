import type { ReactNode } from 'react'
import { Tooltip } from '../ui/Tooltip'

interface Props {
  label: string
  icon: ReactNode
  active?: boolean
}

export function RailButton({ label, icon, active = false }: Props) {
  return (
    <Tooltip content={label} side="right" delay={300}>
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      style={{
        width: 32,
        height: 32,
        border: 'none',
        background: 'transparent',
        borderRadius: 10,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'var(--text-ink)' : 'var(--text-mid)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 120ms, color 120ms, transform 120ms',
      }}
      className="rail-button"
      data-active={active ? 'true' : 'false'}
    >
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -8,
            width: 3,
            height: 18,
            borderRadius: 999,
            backgroundColor: 'var(--bg-teal)',
          }}
        />
      )}
      {icon}

      <style>{`
        .rail-button:hover {
          background-color: var(--bg-subtle);
          color: var(--text-ink);
          transform: translateY(-1px);
        }
      `}</style>
    </button>
    </Tooltip>
  )
}
