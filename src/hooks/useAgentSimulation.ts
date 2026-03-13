import { useState, useEffect, useRef, useCallback } from 'react'
import { initialAgents } from '../data/mockAgents'
import type { Agent, AgentStatus } from '../types/agent'

const LOG_POOL = [
  'Parsing request context',
  'Selecting retrieval strategy',
  'Calling external knowledge tool',
  'Synthesizing answer draft',
  'Cross-referencing data sources',
  'Validating output schema',
  'Generating structured response',
]

const TICK_MS = 1800

function uid() {
  return Math.random().toString(36).slice(2)
}

function timestamp() {
  return new Date().toISOString()
}

function randomLog() {
  return LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)]
}

export function useAgentSimulation() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const doneTicksRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev =>
        prev.map(agent => {
          // Done agents wait a few ticks then reset
          if (agent.status === 'done') {
            const ticks = (doneTicksRef.current[agent.id] ?? 0) + 1
            doneTicksRef.current[agent.id] = ticks
            const resetAfter = 4 + Math.floor(Math.random() * 3) // 4–6 ticks
            if (ticks >= resetAfter) {
              doneTicksRef.current[agent.id] = 0
              return {
                ...agent,
                status: 'thinking' as AgentStatus,
                progress: 0,
                currentTask: 'Awaiting next instruction',
                logs: [{ id: uid(), timestamp: timestamp(), message: 'Parsing request context' }],
              }
            }
            return agent
          }

          const increment = 4 + Math.floor(Math.random() * 9) // 4–12%
          const newProgress = Math.min(agent.progress + increment, 100)

          let newStatus: AgentStatus = agent.status
          if (newProgress >= 100) {
            newStatus = 'done'
          } else if (newProgress >= 30 && agent.status === 'thinking') {
            newStatus = 'executing'
          }

          const newLog =
            newProgress >= 100
              ? { id: uid(), timestamp: timestamp(), message: 'Execution completed' }
              : { id: uid(), timestamp: timestamp(), message: randomLog() }

          const newLogs = [...agent.logs, newLog].slice(-20)

          let currentTask = agent.currentTask
          if (newStatus === 'executing' && agent.status === 'thinking') {
            currentTask = 'Processing active workflow'
          } else if (newStatus === 'done') {
            currentTask = 'Task completed successfully'
          }

          return { ...agent, progress: newProgress, status: newStatus, currentTask, logs: newLogs }
        })
      )
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [])

  const sendPrompt = useCallback((agentId: string, prompt: string) => {
    doneTicksRef.current[agentId] = 0
    setAgents(prev =>
      prev.map(agent => {
        if (agent.id !== agentId) return agent
        return {
          ...agent,
          status: 'thinking' as AgentStatus,
          progress: 0,
          currentTask: prompt,
          logs: [
            ...agent.logs,
            { id: uid(), timestamp: timestamp(), message: `New instruction: "${prompt}"` },
            { id: uid(), timestamp: timestamp(), message: 'Parsing request context' },
          ].slice(-20),
        }
      })
    )
  }, [])

  return { agents, sendPrompt }
}
