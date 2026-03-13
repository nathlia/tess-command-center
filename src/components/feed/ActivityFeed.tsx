import { useEffect, useRef } from 'react'
import type { Agent } from '../../types/agent'
import { SectionLabel } from '../ui/SectionLabel'
import { EventRow } from './EventRow'
import { TypingRow } from './TypingRow'

interface Props {
  agent: Agent
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}m${String(remainder).padStart(2, '0')}s`
}

export function ActivityFeed({ agent }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [agent.logs.length])

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 0 12px',
        backgroundColor: 'var(--bg-white)',
      }}
    >
      <Divider label={`Started ${formatElapsed(agent.elapsed)} ago`} />

      {agent.logs.map((log, index) => (
        <EventRow
          key={log.id}
          event={log}
          isNew={index === agent.logs.length - 1}
        />
      ))}

      {agent.logs.length > 0 && <Divider label="Now" />}

      {!agent.paused && agent.status !== 'done' && <TypingRow />}

      {agent.paused && (
        <div
          style={{
            padding: '10px 18px',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-mid)',
            fontStyle: 'italic',
          }}
        >
          Agent paused by operator.
        </div>
      )}

      {agent.status === 'done' && (
        <div
          style={{
            padding: '10px 18px',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-emerald)',
            fontWeight: 'var(--medium)',
          }}
        >
          Task complete.
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 18px 10px',
      }}
    >
      <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-default)' }} />
      <SectionLabel>{label}</SectionLabel>
      <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-default)' }} />
    </div>
  )
}
