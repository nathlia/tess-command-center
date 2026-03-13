import type { ReactNode } from 'react'
import type { LogEntry, LogEventType } from '../../types/agent'
import { SectionLabel } from '../ui/SectionLabel'
import { SurfaceCard } from '../ui/SurfaceCard'
import { ToneTile } from '../ui/ToneTile'
import type { UiTone } from '../ui/uiTones'

interface EventConfig {
  label: string
  tone: UiTone
  icon: ReactNode
}

const EVENT_CONFIG: Record<LogEventType, EventConfig> = {
  task: {
    label: 'Task',
    tone: 'neutral',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="2" y="2" width="10" height="10" rx="2.5" />
        <path d="M4.5 5.2h5M4.5 7h5M4.5 8.8H8" strokeLinecap="round" />
      </svg>
    ),
  },
  think: {
    label: 'Thinking',
    tone: 'amber',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="7" cy="7" r="5.3" />
        <path d="M5.7 5.6c0-.9 1.3-1.4 1.8 0 .4 1.3-.4 1.4-.4 2M7.1 10v.3" strokeLinecap="round" />
      </svg>
    ),
  },
  search: {
    label: 'Search',
    tone: 'amber',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="6" cy="6" r="3.5" />
        <path d="m8.7 8.7 2.5 2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  result: {
    label: 'Result',
    tone: 'emerald',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="7" cy="7" r="5.3" />
        <path d="m4.8 7.1 1.5 1.5 3-3.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  write: {
    label: 'Writing',
    tone: 'neutral',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M2.5 10.5V12h1.5l5.2-5.2-1.5-1.5-5.2 5.2Z" strokeLinejoin="round" />
        <path d="m8.7 4.3 1.5 1.5 1-1a1.1 1.1 0 0 0-1.5-1.5l-1 1Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  mcp: {
    label: 'MCP',
    tone: 'teal',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="2" y="3" width="10" height="8" rx="2" />
        <path d="M4.2 5.6h5.4M4.2 7.7h3.6" strokeLinecap="round" />
      </svg>
    ),
  },
  skill: {
    label: 'Skill',
    tone: 'purple',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M2.5 10.5V12h1.5l5.2-5.2-1.5-1.5-5.2 5.2Z" strokeLinejoin="round" />
        <path d="m8.7 4.3 1.5 1.5 1-1a1.1 1.1 0 0 0-1.5-1.5l-1 1Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  warn: {
    label: 'Alert',
    tone: 'amber',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M7 2 12 11H2L7 2Z" strokeLinejoin="round" />
        <path d="M7 5.25V8M7 9.7v.1" strokeLinecap="round" />
      </svg>
    ),
  },
  msg: {
    label: 'Instruction',
    tone: 'teal',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M2.5 3.2h9a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H7.8L5.6 12V10.2H2.5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  info: {
    label: 'Info',
    tone: 'neutral',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="7" cy="7" r="5.3" />
        <path d="M7 6v3M7 4.2v.2" strokeLinecap="round" />
      </svg>
    ),
  },
  tool: {
    label: 'Tool',
    tone: 'neutral',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M8.7 2.5a2.7 2.7 0 0 0 2.8 2.8l-1.9 1.9L6.8 4.4l1.9-1.9Z" strokeLinejoin="round" />
        <path d="m6.2 5-3.7 3.7a1.3 1.3 0 1 0 1.8 1.8L8 6.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  output: {
    label: 'Output',
    tone: 'emerald',
    icon: (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M3 3.2h8a1 1 0 0 1 1 1v5.6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.2a1 1 0 0 1 1-1Z" />
        <path d="M4.2 6.2h5.6M4.2 8.1h3.7" strokeLinecap="round" />
      </svg>
    ),
  },
}

interface Props {
  event: LogEntry
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function StandardEventRow({ event }: Props) {
  const config = EVENT_CONFIG[event.type] ?? EVENT_CONFIG.info

  return (
    <div style={{ padding: '6px 18px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <ToneTile tone={config.tone}>
          {config.icon}
        </ToneTile>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <SectionLabel>{config.label}</SectionLabel>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted-400)', flexShrink: 0 }}>
              {formatTime(event.timestamp)}
            </div>
          </div>

          <div
            style={{
              marginTop: 3,
              fontSize: 'var(--text-sm)',
              color: 'var(--text-ink)',
              lineHeight: 'var(--lh-tight)',
              wordBreak: 'break-word',
            }}
          >
            {event.message}
          </div>

          {event.output && (
            <SurfaceCard
              tone="subtle"
              padding="10px 12px"
              radius={12}
              style={{
                marginTop: 8,
                fontSize: 'var(--text-sm)',
                color: 'var(--text-ink)',
                lineHeight: 'var(--lh-base)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {event.output}
            </SurfaceCard>
          )}
        </div>
      </div>
    </div>
  )
}
