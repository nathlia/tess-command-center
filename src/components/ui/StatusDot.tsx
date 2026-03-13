import { motion } from 'framer-motion'
import type { AgentStatus } from '../../types/agent'

const config: Record<AgentStatus, { color: string; label: string; pulse: boolean }> = {
  thinking: { color: 'var(--text-amber)', label: 'thinking', pulse: true },
  executing: { color: 'var(--bg-teal)', label: 'executing', pulse: true },
  done:      { color: 'var(--text-emerald)', label: 'done', pulse: false },
}

export function StatusDot({ status }: { status: AgentStatus }) {
  const { color, label, pulse } = config[status]

  return (
    <span className="flex items-center gap-1.5">
      <span className="relative flex items-center justify-center w-2 h-2">
        {pulse && (
          <motion.span
            className="absolute inline-flex rounded-full opacity-60"
            style={{ width: 8, height: 8, backgroundColor: color }}
            animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <span
          className="relative inline-flex rounded-full w-2 h-2"
          style={{ backgroundColor: color }}
        />
      </span>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </span>
  )
}
