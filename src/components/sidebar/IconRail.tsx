import tessLogo from '../../assets/tess-light.svg'
import { RailButton } from './RailButton'

const PRIMARY_ITEMS = [
  { label: 'New chat', icon: <PlusIcon /> },
  { label: 'Team Board', icon: <GridIcon /> },
  { label: 'AI University', icon: <LibraryIcon /> },
  { label: 'Agent Studio', icon: <StudioIcon /> },
  { label: 'Image Generator', icon: <ImageIcon /> },
  { label: 'Video Generator', icon: <VideoIcon /> },
  { label: 'AI Voiceover', icon: <MicIcon /> },
]

export function IconRail() {
  return (
    <aside
      aria-label="Primary navigation"
      style={{
        width: 56,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '14px 0 12px',
        borderRight: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
      }}
    >
      <img src={tessLogo} alt="tess" style={{ width: 28, height: 'auto' }} />

      <div style={{ width: 24, height: 1, backgroundColor: 'var(--border-default)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        {PRIMARY_ITEMS.map(item => (
          <RailButton key={item.label} label={item.label} icon={item.icon} />
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <RailButton label="Command Center" icon={<CompassIcon />} active />
        <RailButton label="More" icon={<MoreIcon />} />

        <div
          aria-label="Current workspace"
          title="Current workspace"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-teal)',
            color: 'var(--text-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--bold)',
          }}
        >
          T
        </div>
      </div>
    </aside>
  )
}

function PlusIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  )
}

function LibraryIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M4 6.5 12 3l8 3.5-8 3.5L4 6.5Z" strokeLinejoin="round" />
      <path d="M7 9.5v6.5M12 10v7M17 9.5v6.5" strokeLinecap="round" />
    </svg>
  )
}

function StudioIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m7 16 3.5-3.5L13 15l2.5-2.5L19 16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="6" width="13" height="12" rx="3" />
      <path d="m16 10 5-3v10l-5-3" strokeLinejoin="round" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4" strokeLinecap="round" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="8" />
      <path d="m10 10 5-2-2 5-5 2 2-5Z" strokeLinejoin="round" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M5 12h.01M12 12h.01M19 12h.01" strokeLinecap="round" />
    </svg>
  )
}
