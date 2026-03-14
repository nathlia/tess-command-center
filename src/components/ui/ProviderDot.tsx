import type { Provider } from '../../types/agent'
import { PROVIDER_ICONS } from '../../assets/providers'

interface Props {
  provider: Provider
  size?: number
}

export function ProviderDot({ provider, size = 12 }: Props) {
  const iconSrc = PROVIDER_ICONS[provider.group]

  return (
    <div
      title={provider.group}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {iconSrc ? (
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          style={{
            width: size * 0.74,
            height: size * 0.74,
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: '50%',
            backgroundColor: provider.color || 'var(--bg-ink)',
          }}
        />
      )}
    </div>
  )
}
