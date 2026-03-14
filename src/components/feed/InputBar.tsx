import { useState } from 'react'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { ControlButton } from '../ui/ControlButton'

interface Props {
  agentId: string
  agentLabel: string
  onSend: (agentId: string, msg: string) => void
  done?: boolean
}

export function InputBar({ agentId, agentLabel, onSend, done = false }: Props) {
  const [value, setValue] = useState('')
  const { listening, toggle } = useVoiceInput(text => setValue(current => (current ? `${current} ${text}` : text)))

  function submit() {
    const message = value.trim()
    if (!message) return
    onSend(agentId, message)
    setValue('')
  }

  return (
    <div
      style={{
        padding: '14px 18px 18px',
        borderTop: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 54,
          padding: '10px',
          borderRadius: 16,
          border: '1px solid var(--border-default)',
          backgroundColor: done ? 'var(--bg-off-white)' : 'var(--bg-white)',
          opacity: done ? 0.6 : 1,
          transition: 'opacity 300ms, background-color 300ms',
        }}
      >
        <ControlButton
          icon={
            <svg width={15} height={15} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
              <rect x="4.5" y="1" width="5" height="7.5" rx="2.5" />
              <path d="M2 7a5 5 0 0 0 10 0" strokeLinecap="round" />
              <path d="M7 12v1.5" strokeLinecap="round" />
            </svg>
          }
          onClick={toggle}
          active={listening}
          tone="teal"
          variant="soft"
          aria-label={listening ? 'Stop voice input' : 'Start voice input'}
        />

        <input
          value={value}
          onChange={event => setValue(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
          aria-label={done ? `Send a follow-up to ${agentLabel}` : `Send an instruction to ${agentLabel}`}
          placeholder={done ? `Send a follow-up to ${agentLabel}` : `Send an instruction to ${agentLabel}`}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            backgroundColor: 'transparent',
            outline: 'none',
            fontFamily: 'var(--font)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-ink)',
          }}
        />

        <ControlButton
          icon={
            <svg width={13} height={13} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 7 12 2l-5 10V7H2Z" strokeLinejoin="round" />
            </svg>
          }
          onClick={submit}
          disabled={!value.trim()}
          variant="primary"
          style={{ minWidth: 98, padding: '0 14px' }}
        >
          Send
        </ControlButton>
      </div>
    </div>
  )
}
