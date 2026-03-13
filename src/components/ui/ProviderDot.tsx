import type { Provider } from '../../types/agent'

interface Props {
  provider: Provider
  size?: number
}

export function ProviderDot({ provider, size = 12 }: Props) {
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
      }}
    >
      <div
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: '50%',
          backgroundColor: 'var(--bg-ink)',
        }}
      />
    </div>
  )
}
