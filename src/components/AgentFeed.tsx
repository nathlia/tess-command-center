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
    <section aria-label="Active agents">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
          >
            <AgentCard
              agent={agent}
              selected={agent.id === selectedId}
              onSelect={() => onSelect(agent.id)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
