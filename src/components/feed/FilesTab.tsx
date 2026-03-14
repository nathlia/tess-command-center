import { useEffect, useState } from 'react'
import { filesData } from '../../data/filesData'
import type { FileEntry, FileType } from '../../data/filesData'
import { ControlButton } from '../ui/ControlButton'
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

interface Props {
  agentId: string
}

export function FilesTab({ agentId }: Props) {
  const files = filesData[agentId] ?? []
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null)

  useEffect(() => {
    if (!selectedFile) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedFile(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedFile])

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
              <div style={{ marginTop: 3, fontSize: 'var(--text-xs)', color: 'var(--text-dark-600)' }}>
                {file.size} / {file.updated}
              </div>
            </div>

            <ControlButton
              icon={<DownloadIcon />}
              onClick={() => setSelectedFile(file)}
              size="sm"
              variant="soft"
              aria-label={`Download ${file.name}`}
            >
              Download
            </ControlButton>
          </SurfaceCard>
        )
      })}

      {selectedFile && <DownloadModal file={selectedFile} onClose={() => setSelectedFile(null)} />}
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
        fontWeight: 'var(--medium)',
        color: tone === 'neutral' ? 'var(--text-ink)' : undefined,
      }}
    >
      {label}
    </ToneTile>
  )
}

function DownloadModal({ file, onClose }: { file: FileEntry; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fake-download-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        backgroundColor: 'var(--bg-black-55)',
      }}
      onClick={onClose}
    >
      <div style={{ width: 'min(420px, 100%)' }} onClick={event => event.stopPropagation()}>
        <SurfaceCard
          padding="16px"
          radius={16}
          style={{
            boxShadow: '0 20px 40px rgba(17, 24, 39, 0.18)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div
                id="fake-download-title"
                style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--medium)', color: 'var(--text-ink)' }}
              >
                Fake download
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-dark-600)',
                  lineHeight: 1.6,
                }}
              >
                Downloads are mocked in this prototype. This action just previews the behavior for now.
              </div>
            </div>

            <ControlButton
              icon={
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3l6 6M9 3 3 9" strokeLinecap="round" />
                </svg>
              }
              onClick={onClose}
              variant="ghost"
              size="sm"
              aria-label="Close download preview"
            />
          </div>

          <div
            style={{
              marginTop: 12,
              padding: '12px',
              borderRadius: 12,
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
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
            <div style={{ marginTop: 4, fontSize: 'var(--text-xs)', color: 'var(--text-dark-600)' }}>
              {file.size} / updated {file.updated}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
            <ControlButton onClick={onClose} variant="ghost" size="sm">
              Close
            </ControlButton>
            <ControlButton icon={<DownloadIcon />} onClick={onClose} variant="primary" size="sm">
              Download
            </ControlButton>
          </div>
        </SurfaceCard>
      </div>
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2.25v5.25M3.75 5.75 6 8l2.25-2.25M2.5 9.75h7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
