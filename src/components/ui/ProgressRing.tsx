import { motion } from 'framer-motion'
import type { AgentStatus } from '../../types/agent'

const strokeColor: Record<AgentStatus, string> = {
  thinking: 'var(--text-amber)',
  executing: 'var(--bg-teal)',
  done:      'var(--text-emerald)',
}

const SIZE = 52
const STROKE = 4
const R = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * R

export function ProgressRing({ progress, status }: { progress: number; status: AgentStatus }) {
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={strokeColor[status]}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </svg>
      <span
        className="absolute text-[11px] font-semibold tabular-nums"
        style={{ color: strokeColor[status] }}
      >
        {progress}%
      </span>
    </div>
  )
}
