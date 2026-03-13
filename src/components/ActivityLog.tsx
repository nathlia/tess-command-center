import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LogEntry } from '../types/agent'

interface Props {
  logs: LogEntry[]
  agentName: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function ActivityLog({ logs, agentName }: Props) {
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

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-black)' }}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3 shrink-0 border-b"
        style={{ borderColor: 'var(--border-white-10)' }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: 'var(--text-emerald)' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-xs font-semibold" style={{ color: 'var(--text-white-85)' }}>
          {agentName}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-white-40)' }}>
          · activity log
        </span>
      </div>

      {/* Log entries */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2"
        style={{
          fontFamily: 'ui-monospace, Consolas, monospace',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border-white-10) transparent',
        }}
      >
        <AnimatePresence initial={false}>
          {logs.map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 5, filter: 'brightness(2.5)' }}
              animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex items-start gap-3"
            >
              <span
                className="text-[10px] tabular-nums shrink-0 mt-px"
                style={{ color: 'var(--text-white-40)' }}
              >
                {formatTime(entry.timestamp)}
              </span>
              <span className="text-[11px] leading-relaxed" style={{ color: 'var(--text-white-85)' }}>
                <span className="mr-2" style={{ color: 'var(--bg-teal)' }}>›</span>
                {entry.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Jump-to-latest nudge */}
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
              className="text-[10px] px-3 py-1 rounded-full cursor-pointer"
              style={{
                color: 'var(--text-white-70)',
                backgroundColor: 'var(--bg-white-0f)',
                border: '1px solid var(--border-white-10)',
              }}
            >
              ↓ jump to latest
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
