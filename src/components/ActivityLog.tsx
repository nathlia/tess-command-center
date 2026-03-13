import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LogEntry, AgentIcon as IconType } from '../types/agent'
import { AgentIcon } from './ui/AgentIcon'
import tessLogo from '../assets/tess-light.svg'

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

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: 'var(--bg-ink)' }}
      role="log"
      aria-label={`Activity log for ${agentName}`}
      aria-live="polite"
    >
      {/* Header */}
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

      {/* Log entries */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col dark-scroll"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border-white-10) transparent' }}
      >
        <AnimatePresence initial={false}>
          {logs.map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex items-start gap-4 pt-[3px]"
              style={{ minHeight: 24 }}
            >
              <span
                className="text-[10px] font-mono tabular-nums shrink-0 mt-0.5"
                style={{ color: 'rgba(255,255,255,0.45)', width: 48 }}
              >
                {formatTime(entry.timestamp)}
              </span>
              <span
                className="text-[11.5px] font-mono leading-[18px]"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {entry.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />

        {/* Breathing TESS watermark */}
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
              className="text-xs px-4 py-1.5 rounded-full cursor-pointer transition-colors"
              style={{
                color: 'var(--text-white-70)',
                backgroundColor: 'var(--bg-white-0f)',
                border: '1px solid var(--border-teal-15)',
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
