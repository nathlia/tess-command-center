import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { Agent } from '../types/agent'
import { StatusDot } from './ui/StatusDot'
import { ProgressRing } from './ui/ProgressRing'
import { ModelBadge } from './ui/ModelBadge'

interface Props {
  agent: Agent
  selected: boolean
  onSelect: () => void
}

export function AgentCard({ agent, selected, onSelect }: Props) {
  const prevStatus = useRef(agent.status)
  const didTransition = agent.status !== prevStatus.current

  useEffect(() => {
    prevStatus.current = agent.status
  })

  return (
    <motion.div
      layout
      onClick={onSelect}
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: didTransition ? [1, 1.015, 1] : 1,
      }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative flex flex-col gap-3 p-4 rounded-xl cursor-pointer select-none"
      style={{
        backgroundColor: selected ? 'var(--bg-off-white)' : 'var(--bg-white)',
        border: `1.5px solid ${selected ? 'var(--bg-teal)' : 'var(--border-default)'}`,
        boxShadow: selected
          ? '0 4px 16px var(--bg-teal-20)'
          : '0 1px 4px var(--border-ink-10)',
      }}
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
            className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full origin-top"
            style={{ backgroundColor: 'var(--bg-teal)' }}
          />
        )}
      </AnimatePresence>

      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span
            className="text-sm font-semibold leading-tight truncate"
            style={{ color: 'var(--text-ink)' }}
          >
            {agent.name}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <ModelBadge model={agent.model} />
            <StatusDot status={agent.status} />
          </div>
        </div>
        <ProgressRing progress={agent.progress} status={agent.status} />
      </div>

      {/* Current task */}
      <p
        className="text-xs leading-relaxed line-clamp-2"
        style={{ color: 'var(--text-mid)' }}
      >
        {agent.currentTask}
      </p>
    </motion.div>
  )
}
