import { ControlButton } from '../ui/ControlButton'
import { ProgressBar } from '../ui/ProgressBar'
import { SurfaceCard } from '../ui/SurfaceCard'
import { ToneTile } from '../ui/ToneTile'

interface Props {
  ctx: number
  onDismiss: () => void
}

export function CtxAlert({ ctx, onDismiss }: Props) {
  const level = ctx > 75 ? 'High context pressure' : 'Context filling up'

  return (
    <SurfaceCard
      tone="warm"
      padding="12px 14px"
      radius={12}
      style={{
        margin: '12px 18px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <ToneTile tone="amber" size="sm" variant="inset">
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M7 2 12 11H2L7 2Z" strokeLinejoin="round" />
          <path d="M7 5.25v2.75M7 9.7v.1" strokeLinecap="round" />
        </svg>
      </ToneTile>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--semibold)', color: 'var(--text-ink)' }}>
          {level}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-mid)', marginTop: 2 }}>
          {Math.round(ctx)}% of active context budget is currently in use.
        </div>
        <ProgressBar
          value={ctx}
          tone="amber"
          trackColor="var(--bg-white)"
          borderColor="var(--border-tan-20)"
          style={{ marginTop: 8 }}
        />
      </div>

      <ControlButton
        icon={
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l6 6M9 3 3 9" strokeLinecap="round" />
          </svg>
        }
        onClick={onDismiss}
        aria-label="Dismiss"
        size="sm"
        style={{ border: '1px solid var(--border-tan-20)' }}
      />
    </SurfaceCard>
  )
}
