import { motion } from 'framer-motion'
import type { Agent } from '../types/agent'
import { AgentCard } from './AgentCard'

interface Props {
  agents: Agent[]
  selectedId: string
  onSelect: (id: string) => void
}

export function AgentFeed({ agents, selectedId, onSelect }: Props) {
  return (
    <section className="flex flex-col gap-3 overflow-y-auto">
      <motion.div
        className="flex items-baseline gap-2 px-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-ink)' }}>
          Active Agents
        </h2>
        <span
          className="text-xs font-medium px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: 'var(--bg-teal-20)', color: 'var(--bg-teal)' }}
        >
          {agents.length}
        </span>
      </motion.div>

      <div className="flex flex-col gap-2">
        {agents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            selected={agent.id === selectedId}
            onSelect={() => onSelect(agent.id)}
          />
        ))}
      </div>
    </section>
  )
}
