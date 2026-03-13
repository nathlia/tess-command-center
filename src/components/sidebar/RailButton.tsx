import type { ReactNode } from 'react'
import { ControlButton } from '../ui/ControlButton'

interface Props {
  label: string
  icon: ReactNode
  active?: boolean
}

export function RailButton({ label, icon, active = false }: Props) {
  return (
    <ControlButton
      icon={icon}
      aria-label={label}
      title={label}
      active={active}
      tone={active ? 'teal' : 'neutral'}
      variant={active ? 'soft' : 'ghost'}
      size="sm"
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
      }}
    />
  )
}
