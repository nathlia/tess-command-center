import { filesData } from '../../data/filesData'
import type { FileStatus, FileType } from '../../data/filesData'
import { EmptyState } from '../ui/EmptyState'
import { SurfaceCard } from '../ui/SurfaceCard'
import { ToneTile } from '../ui/ToneTile'
import type { UiTone } from '../ui/uiTones'

const FILE_TYPE_META: Record<FileType, { label: string; tone: UiTone }> = {
  md: { label: 'MD', tone: 'neutral' },
  csv: { label: 'CSV', tone: 'emerald' },
  json: { label: 'JSON', tone: 'amber' },
  txt: { label: 'TXT', tone: 'neutral' },
  img: { label: 'IMG', tone: 'teal' },
}

const STATUS_TONE: Record<FileStatus, string> = {
  done: 'var(--text-emerald)',
  writing: 'var(--text-amber)',
  generating: 'var(--bg-teal)',
}

interface Props {
  agentId: string
}

export function FilesTab({ agentId }: Props) {
  const files = filesData[agentId] ?? []

  if (files.length === 0) {
    return <EmptyState>No files yet.</EmptyState>
  }

  return (
    <div style={{ padding: '12px 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {files.map(file => {
        const type = FILE_TYPE_META[file.type]

        return (
          <SurfaceCard
            key={file.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
            }}
          >
            <FileTypeTile label={type.label} tone={type.tone} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--medium)',
                  color: 'var(--text-ink)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {file.name}
              </div>
              <div style={{ marginTop: 3, fontSize: 'var(--text-xs)', color: 'var(--text-mid)' }}>
                {file.size} / {file.updated}
              </div>
            </div>

            <FileStatusDot status={file.status} />
          </SurfaceCard>
        )
      })}

      <style>{`
        @keyframes filePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  )
}

function FileTypeTile({ label, tone }: { label: string; tone: UiTone }) {
  return (
    <ToneTile
      tone={tone}
      size="lg"
      style={{
        fontSize: '10px',
        fontWeight: 'var(--semibold)',
        color: tone === 'neutral' ? 'var(--text-ink)' : undefined,
      }}
    >
      {label}
    </ToneTile>
  )
}

function FileStatusDot({ status }: { status: FileStatus }) {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: STATUS_TONE[status],
        flexShrink: 0,
        animation: status === 'done' ? undefined : 'filePulse 1.2s ease-in-out infinite',
      }}
    />
  )
}
