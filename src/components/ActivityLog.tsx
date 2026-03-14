import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { AgentIcon as IconType, LogEntry, LogEventType } from '../types/agent'
import { AgentIcon } from './ui/AgentIcon'
import tessLogo from '../assets/logos/tess-light.svg'

interface Props {
  logs: LogEntry[]
  agentName: string
  agentIcon: IconType
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function TypewriterText({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 1
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return <>{displayed}</>
}

const PREFIX: Partial<Record<LogEventType, string>> = {
  think: '>',
  tool: '*',
  result: '+',
  output: '>',
  mcp: '*',
  skill: '*',
  warn: '!',
  msg: '>',
}

const PREFIX_COLOR: Partial<Record<LogEventType, string>> = {
  think: 'rgba(255,255,255,0.25)',
  tool: 'rgba(103,232,249,0.6)',
  result: 'rgba(52,211,153,0.8)',
  output: 'rgba(52,211,153,0.95)',
  mcp: 'rgba(103,232,249,0.6)',
  skill: 'rgba(192,132,252,0.8)',
  warn: 'rgba(252,165,165,0.9)',
  msg: 'rgba(255,255,255,0.5)',
}

function EntryText({ entry, isLatestOutput }: { entry: LogEntry; isLatestOutput: boolean }) {
  const type = entry.type ?? 'info'

  if (type === 'think') {
    return <span style={{ color: 'rgba(255,255,255,0.4)' }}>{entry.message}</span>
  }

  if (type === 'tool') {
    const idx = entry.message.indexOf(' -> ')
    if (idx !== -1) {
      const toolName = entry.message.slice(0, idx)
      const rest = entry.message.slice(idx)
      return (
        <>
          <span style={{ color: 'rgba(103,232,249,0.7)' }}>{toolName}</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{rest}</span>
        </>
      )
    }
    return <span style={{ color: 'rgba(255,255,255,0.5)' }}>{entry.message}</span>
  }

  if (type === 'result') {
    return <span style={{ color: 'rgba(255,255,255,0.6)' }}>{entry.message}</span>
  }

  if (type === 'output') {
    return (
      <span style={{ color: 'rgba(255,255,255,0.85)' }}>
        {isLatestOutput ? <TypewriterText key={entry.id} text={entry.message} speed={18} /> : entry.message}
      </span>
    )
  }

  return <span style={{ color: 'rgba(255,255,255,0.4)' }}>{entry.message}</span>
}

export function ActivityLog({ logs, agentName, agentIcon }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48
    setAutoScroll(atBottom)
  }

  const latestOutputId = [...logs].reverse().find(entry => entry.type === 'output')?.id ?? null

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: 'var(--bg-ink)' }}
      role="log"
      aria-label={`Activity log for ${agentName}`}
      aria-live="polite"
    >
      <div
        className="flex items-center justify-between px-5 shrink-0 border-b"
        style={{ height: 50, borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#34d399', opacity: 0.85 }}
            animate={{ opacity: [0.85, 0.3, 0.85] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            Activity
          </span>
        </div>

        <div
          className="flex items-center gap-2 px-2.5 py-1 rounded"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '0.667px solid rgba(255,255,255,0.04)',
          }}
        >
          <AgentIcon icon={agentIcon} size={12} className="opacity-50" />
          <span
            className="text-[11px] font-mono"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {agentName}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col dark-scroll"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border-white-10) transparent' }}
      >
        <AnimatePresence initial={false}>
          {logs.map(entry => {
            const type = entry.type ?? 'info'
            const prefix = PREFIX[type] ?? ''
            const prefixColor = PREFIX_COLOR[type] ?? 'transparent'
            const isLatestOutput = entry.id === latestOutputId

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-start gap-3 pt-[3px]"
                style={{ minHeight: 24 }}
              >
                <span
                  className="text-[10px] font-mono tabular-nums shrink-0 mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.45)', width: 48 }}
                >
                  {formatTime(entry.timestamp)}
                </span>

                <span
                  className="text-[11px] font-mono shrink-0 mt-0.5"
                  style={{ color: prefixColor, width: 14, textAlign: 'center' }}
                  aria-hidden="true"
                >
                  {prefix}
                </span>

                <span className="text-[11.5px] font-mono leading-[18px] min-w-0">
                  <EntryText entry={entry} isLatestOutput={isLatestOutput} />
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />

        <motion.img
          src={tessLogo}
          alt=""
          aria-hidden="true"
          animate={{ opacity: [0.015, 0.035, 0.015] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-4 right-4 w-24 pointer-events-none select-none"
          style={{ filter: 'invert(1)' }}
        />
      </div>

      <AnimatePresence>
        {!autoScroll && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex justify-center pb-2 shrink-0"
          >
            <button
              onClick={() => {
                setAutoScroll(true)
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-xs px-4 py-1.5 rounded-full cursor-pointer transition-colors"
              style={{
                color: 'var(--text-white-70)',
                backgroundColor: 'var(--bg-white-0f)',
                border: '1px solid var(--border-teal-15)',
              }}
            >
              down to latest
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
