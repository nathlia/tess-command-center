import { panelIcons } from './panelIconsIndex'

export function InterruptButton() {
  return (
    <div>
      <button
        type="button"
        aria-disabled="true"
        title="Visual only in this slice"
        onClick={event => event.preventDefault()}
        style={{
          width: '100%',
          minHeight: 38,
          padding: '0 12px',
          borderRadius: 10,
          border: '1px solid var(--border-tan-20)',
          backgroundColor: 'var(--bg-warm)',
          color: 'var(--text-amber)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--semibold)',
          cursor: 'not-allowed',
        }}
      >
        <panelIcons.InterruptIcon />
        Interrupt agent
      </button>

      <div style={{ marginTop: 4, fontSize: 'var(--text-xs)', color: 'var(--text-mid)', textAlign: 'center' }}>
        Visual only in this slice.
      </div>
    </div>
  )
}
