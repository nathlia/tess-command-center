import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonTone = 'neutral' | 'teal' | 'amber'
type ButtonVariant = 'outline' | 'soft' | 'primary' | 'ghost'
type ButtonSize = 'sm' | 'md'
type ButtonAlign = 'center' | 'start'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: ReactNode
  icon?: ReactNode
  active?: boolean
  tone?: ButtonTone
  variant?: ButtonVariant
  size?: ButtonSize
  align?: ButtonAlign
  fullWidth?: boolean
}

const ACTIVE_STYLES: Record<ButtonTone, { borderColor: string; backgroundColor: string; color: string }> = {
  neutral: {
    borderColor: 'var(--border-ink)',
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-ink)',
  },
  teal: {
    borderColor: 'var(--border-teal-15)',
    backgroundColor: 'var(--bg-teal-12)',
    color: 'var(--text-teal)',
  },
  amber: {
    borderColor: 'var(--border-tan-20)',
    backgroundColor: 'var(--bg-warm)',
    color: 'var(--text-amber)',
  },
}

const BUTTON_SIZES: Record<ButtonSize, { square: number; minHeight: number; padding: string; radius: number }> = {
  sm: {
    square: 28,
    minHeight: 32,
    padding: '0 10px',
    radius: 8,
  },
  md: {
    square: 34,
    minHeight: 34,
    padding: '0 12px',
    radius: 10,
  },
}

function getPalette(
  variant: ButtonVariant,
  tone: ButtonTone,
  active: boolean,
  disabled: boolean,
) {
  if (variant === 'primary') {
    return disabled
      ? {
          border: 'none',
          backgroundColor: 'var(--bg-light)',
          color: 'var(--text-muted-400)',
        }
      : {
          border: 'none',
          backgroundColor: 'var(--bg-ink)',
          color: 'var(--text-white)',
        }
  }

  if (variant === 'ghost') {
    if (active) {
      const activeStyle = ACTIVE_STYLES[tone]
      return {
        border: `1px solid ${activeStyle.borderColor}`,
        backgroundColor: activeStyle.backgroundColor,
        color: activeStyle.color,
      }
    }

    return {
      border: '1px solid transparent',
      backgroundColor: 'transparent',
      color: 'var(--text-mid)',
    }
  }

  if (active) {
    const activeStyle = ACTIVE_STYLES[tone]
    return {
      border: `1px solid ${activeStyle.borderColor}`,
      backgroundColor: activeStyle.backgroundColor,
      color: activeStyle.color,
    }
  }

  if (variant === 'soft') {
    return {
      border: '1px solid var(--border-default)',
      backgroundColor: 'var(--bg-subtle)',
      color: 'var(--text-mid)',
    }
  }

  return {
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--bg-white)',
    color: 'var(--text-mid)',
  }
}

export function ControlButton({
  children,
  icon,
  active = false,
  tone = 'neutral',
  variant = 'outline',
  size = 'md',
  align = 'center',
  fullWidth = false,
  disabled = false,
  type = 'button',
  style,
  ...buttonProps
}: Props) {
  const sizeStyle = BUTTON_SIZES[size]
  const palette = getPalette(variant, tone, active, disabled)
  const hasLabel = children !== undefined && children !== null

  return (
    <button
      type={type}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : hasLabel ? undefined : sizeStyle.square,
        height: hasLabel ? undefined : sizeStyle.square,
        minHeight: hasLabel ? sizeStyle.minHeight : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: align === 'start' ? 'flex-start' : 'center',
        gap: icon && hasLabel ? 6 : 0,
        padding: hasLabel ? sizeStyle.padding : 0,
        borderRadius: sizeStyle.radius,
        border: palette.border,
        backgroundColor: palette.backgroundColor,
        color: palette.color,
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 'var(--text-sm)',
        fontWeight: variant === 'primary' ? 'var(--semibold)' : 'var(--medium)',
        textAlign: align === 'start' ? 'left' : 'center',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background-color 120ms, border-color 120ms, color 120ms',
        ...style,
      }}
      {...buttonProps}
    >
      {icon}
      {children}
    </button>
  )
}
