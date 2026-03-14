interface Props {
  title: string
  subtitle?: string
  side: 'left' | 'right'
  onClick: () => void
  ariaLabel: string
}

export function PanelStub({ title, subtitle, side, onClick, ariaLabel }: Props) {
  const leftSide = side === 'left'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 36,
        flexShrink: 0,
        border: 'none',
        borderLeft: leftSide ? 'none' : '1px solid var(--border-default)',
        borderRight: leftSide ? '1px solid var(--border-default)' : 'none',
        background:
          'linear-gradient(180deg, var(--bg-subtle) 0%, var(--bg-white) 45%, var(--bg-subtle) 100%)',
        color: 'var(--text-mid)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        cursor: 'pointer',
        transition: 'background-color 120ms, color 120ms',
      }}
      className="panel-stub"
      title={subtitle ? `${title}: ${subtitle}` : title}
    >
      <span
        aria-hidden="true"
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          border: '1px solid var(--border-default)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-ink)',
          backgroundColor: 'var(--bg-white)',
          flexShrink: 0,
        }}
      >
        {leftSide ? <RightChevron /> : <LeftChevron />}
      </span>

      <span
        style={{
          writingMode: 'vertical-rl',
          transform: leftSide ? 'rotate(180deg)' : undefined,
          fontSize: '10px',
          fontWeight: 'var(--semibold)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted-400)',
        }}
      >
        {title}
      </span>

      <span
        style={{
          writingMode: 'vertical-rl',
          transform: leftSide ? 'rotate(180deg)' : undefined,
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--medium)',
          color: 'var(--text-ink)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxHeight: 110,
        }}
      >
        {subtitle ?? ''}
      </span>

      <style>{`
        .panel-stub:hover,
        .panel-stub:focus-visible {
          background: linear-gradient(180deg, var(--bg-teal-12) 0%, var(--bg-white) 45%, var(--bg-teal-12) 100%);
          color: var(--text-ink);
          outline: none;
        }
      `}</style>
    </button>
  )
}

function LeftChevron() {
  return (
    <svg width={10} height={10} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7.5 2.5 4 6l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RightChevron() {
  return (
    <svg width={10} height={10} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 2.5 8 6l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
