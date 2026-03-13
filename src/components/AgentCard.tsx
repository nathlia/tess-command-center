import { motion, AnimatePresence } from 'framer-motion'
import type { Agent } from '../types/agent'
import { AgentIcon } from './ui/AgentIcon'
import { ModelBadge } from './ui/ModelBadge'

interface Props {
  agent: Agent
  selected: boolean
  onSelect: () => void
}

const statusConfig = {
  thinking: { color: 'var(--text-amber)', label: 'THINKING' },
  executing: { color: 'var(--bg-teal)', label: 'RUNNING' },
  done: { color: 'var(--text-emerald)', label: 'COMPLETED' },
} as const

function formatTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k tok`
  return `${n} tok`
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1m ago'
  return `${mins}m ago`
}

export function AgentCard({ agent, selected, onSelect }: Props) {
  const { color, label } = statusConfig[agent.status]
  const firstLog = agent.logs[0]
  const isActive = agent.status !== 'done'

  return (
    <button
      onClick={onSelect}
      className="relative w-full text-left rounded-[10px] p-3.5 transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        backgroundColor: selected ? 'var(--bg-white)' : 'rgba(255,255,255,0.8)',
        border: `0.667px solid ${selected ? 'var(--bg-teal)' : 'rgba(229,231,235,0.6)'}`,
        boxShadow: selected
          ? '0 0 0 0 rgba(15,76,92,0.15), 0 1px 8px rgba(0,0,0,0.06)'
          : 'none',
        outlineColor: 'var(--bg-teal)',
      }}
      aria-pressed={selected}
      aria-label={`${agent.name} — ${label.toLowerCase()}`}
    >
      {/* Selected indicator bar */}
      <AnimatePresence>
        {selected && (
          <motion.span
            key="bar"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full origin-top"
            style={{ background: 'linear-gradient(to bottom, var(--bg-teal), var(--bg-purple))' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Row 1: icon + name + status */}
      <div className="flex items-center gap-2 mb-1.5">
        <AgentIcon icon={agent.icon} size={14} />
        <span
          className="text-[12.5px] font-semibold leading-tight truncate flex-1 min-w-0"
          style={{ color: 'var(--text-ink)' }}
        >
          {agent.name}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: color, opacity: agent.status === 'thinking' ? 0.39 : 1 }}
          />
          <span
            className="text-[9px] font-semibold uppercase tracking-wide"
            style={{ color }}
          >
            {label}
          </span>
        </span>
      </div>

      {/* Row 2: task description */}
      <p
        className="text-[10.5px] leading-snug truncate mb-1.5"
        style={{ color: 'var(--text-mid)' }}
      >
        {agent.currentTask}
      </p>

      {/* Mini progress bar (only for active agents) */}
      {isActive && (
        <div
          className="relative h-0.75 rounded-full overflow-hidden mb-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
          role="progressbar"
          aria-valuenow={agent.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${agent.name} progress`}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ width: `${agent.progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: color, opacity: 0.3 }}
            animate={{ width: `${Math.min(agent.progress + 13, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Row 3: model badge + tokens + time */}
      <div className="flex items-center gap-1.5">
        <ModelBadge model={agent.model} />
        <span
          className="text-[9px] font-mono"
          style={{ color: 'var(--text-mid)' }}
        >
          {formatTokens(agent.tokens)}
        </span>
        <span className="flex-1" />
        {firstLog && (
          <span
            className="text-[9px] shrink-0"
            style={{ color: 'var(--text-mid)' }}
          >
            {timeAgo(firstLog.timestamp)}
          </span>
        )}
      </div>
    </button>
  )
}
