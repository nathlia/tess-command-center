import { useCallback, useEffect, useRef, useState } from 'react'
import { agentScripts } from '../data/agentScripts'
import { initialAgents } from '../data/mockAgents'
import { ALL_MODELS, providerFor } from '../data/providers'
import type { Agent, AgentStatus, AgentStep, LogEntry, LogEventType, ScriptStep } from '../types/agent'

const MAX_TOKENS: Record<string, number> = {
  'agent-1': 8000,
  'agent-2': 7500,
  'agent-3': 6000,
  'agent-4': 7000,
  'agent-5': 9000,
  'agent-6': 7200,
}

const INITIAL_DELAYS: Record<string, number> = {
  'agent-1': 0,
  'agent-2': 800,
  'agent-3': 3000,
  'agent-4': 5000,
  'agent-5': 4200,
  'agent-6': 6500,
}

function uid() {
  return Math.random().toString(36).slice(2)
}

function timestamp() {
  return new Date().toISOString()
}

function jitter(base: number) {
  return Math.max(0, base + Math.floor(Math.random() * 400) - 200)
}

function statusFromProgress(progress: number): AgentStatus {
  if (progress >= 100) return 'done'
  if (progress >= 25) return 'executing'
  return 'thinking'
}

function initSteps(): AgentStep[] {
  return [
    { label: 'Initialize context', status: 'done', time: '--' },
    { label: 'Load task', status: 'done', time: '--' },
    { label: 'Plan execution', status: 'active', time: '--' },
    { label: 'Execute', status: 'pending', time: '--' },
    { label: 'Finalize', status: 'pending', time: '--' },
  ]
}

function generateResponseScript(prompt: string): ScriptStep[] {
  const label = prompt.length > 45 ? `${prompt.slice(0, 45)}...` : prompt

  return [
    {
      delay: 400,
      type: 'think',
      text: `Parsing instruction: "${label}"`,
      progress: 10,
      thought: `Processing user prompt: "${prompt}". Planning execution strategy.`,
    },
    { delay: 1600, type: 'mcp', text: 'context_fetch -> retrieving relevant history', progress: 30 },
    { delay: 3000, type: 'think', text: 'Formulating response strategy...', progress: 55 },
    {
      delay: 5000,
      type: 'write',
      text: 'Generating response...',
      progress: 80,
      output: prompt.length > 60 ? `${prompt.slice(0, 60)}...` : prompt,
    },
    { delay: 7000, type: 'result', text: 'Response generated - task queued for execution', progress: 100 },
  ]
}

export function useAgentSimulation() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>[]>>(new Map())
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const runScriptRef = useRef<((agentId: string, steps: ScriptStep[]) => void) | null>(null)

  const clearAgentTimeouts = useCallback((agentId: string) => {
    const ids = timeoutsRef.current.get(agentId) ?? []
    ids.forEach(id => clearTimeout(id))
    timeoutsRef.current.set(agentId, [])
  }, [])

  const runScript = useCallback((agentId: string, steps: ScriptStep[]) => {
    clearAgentTimeouts(agentId)
    const ids: ReturnType<typeof setTimeout>[] = []

    steps.forEach((step, index) => {
      const id = setTimeout(() => {
        setAgents(previous =>
          previous.map(agent => {
            if (agent.id !== agentId || agent.paused) return agent

            const logEntry: LogEntry = {
              id: uid(),
              timestamp: timestamp(),
              message: step.text,
              type: step.type,
              thought: step.thought,
              output: step.output,
            }

            const nextLogs = [...agent.logs, logEntry].slice(-50)
            const maxTokens = MAX_TOKENS[agentId] ?? 6000

            return {
              ...agent,
              progress: step.progress,
              status: statusFromProgress(step.progress),
              tokens: Math.round((step.progress / 100) * maxTokens),
              logs: nextLogs,
            }
          }),
        )

        if (index === steps.length - 1) {
          const restartDelay = 4000 + Math.floor(Math.random() * 2000)
          const script = agentScripts[agentId]
          if (!script) return

          const restartId = setTimeout(() => {
            setAgents(previous =>
              previous.map(agent => {
                if (agent.id !== agentId) return agent
                return {
                  ...agent,
                  status: 'thinking',
                  progress: 0,
                  tokens: 0,
                  currentTask: script.task,
                  archetype: script.archetype,
                  modalities: script.modalities,
                  generatingModality: script.generatingModality,
                  logs: [],
                }
              }),
            )
            runScriptRef.current?.(agentId, script.steps)
          }, restartDelay)

          const existing = timeoutsRef.current.get(agentId)
          if (existing) existing.push(restartId)
        }
      }, jitter(step.delay))

      ids.push(id)
    })

    timeoutsRef.current.set(agentId, ids)
  }, [clearAgentTimeouts])

  runScriptRef.current = runScript

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setAgents(previous =>
        previous.map(agent => {
          if (agent.paused || agent.status === 'done') return agent
          return {
            ...agent,
            elapsed: agent.elapsed + 1,
            ctx: Math.min(90, agent.ctx + 0.025),
          }
        }),
      )
    }, 1000)

    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [])

  useEffect(() => {
    Object.entries(agentScripts).forEach(([agentId, script]) => {
      const startDelay = INITIAL_DELAYS[agentId] ?? 0

      const startId = setTimeout(() => {
        setAgents(previous =>
          previous.map(agent => {
            if (agent.id !== agentId) return agent
            return {
              ...agent,
              status: 'thinking',
              progress: 0,
              tokens: 0,
              currentTask: script.task,
              archetype: script.archetype,
              modalities: script.modalities,
              generatingModality: script.generatingModality,
              logs: [],
            }
          }),
        )
        runScript(agentId, script.steps)
      }, startDelay)

      timeoutsRef.current.set(agentId, [startId])
    })

    const timeouts = timeoutsRef.current
    return () => {
      timeouts.forEach(ids => ids.forEach(id => clearTimeout(id)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendPrompt = useCallback((agentId: string, prompt: string) => {
    clearAgentTimeouts(agentId)

    const logEntry: LogEntry = {
      id: uid(),
      timestamp: timestamp(),
      message: `Received: "${prompt.length > 50 ? `${prompt.slice(0, 50)}...` : prompt}"`,
      type: 'msg' as LogEventType,
    }

    setAgents(previous =>
      previous.map(agent => {
        if (agent.id !== agentId) return agent
        return {
          ...agent,
          status: 'thinking',
          progress: 0,
          tokens: 0,
          currentTask: prompt,
          paused: false,
          logs: [...agent.logs, logEntry].slice(-50),
        }
      }),
    )

    runScript(agentId, generateResponseScript(prompt))
  }, [clearAgentTimeouts, runScript])

  const pauseAgent = useCallback((agentId: string) => {
    setAgents(previous =>
      previous.map(agent => {
        if (agent.id !== agentId) return agent
        const logEntry: LogEntry = {
          id: uid(),
          timestamp: timestamp(),
          message: 'Agent paused by user',
          type: 'warn',
        }
        return {
          ...agent,
          paused: true,
          logs: [...agent.logs, logEntry].slice(-50),
        }
      }),
    )
  }, [])

  const resumeAgent = useCallback((agentId: string) => {
    setAgents(previous =>
      previous.map(agent => {
        if (agent.id !== agentId) return agent
        const logEntry: LogEntry = {
          id: uid(),
          timestamp: timestamp(),
          message: 'Agent resumed',
          type: 'info',
        }
        return {
          ...agent,
          paused: false,
          logs: [...agent.logs, logEntry].slice(-50),
        }
      }),
    )
  }, [])

  const spawnAgent = useCallback((params: { name: string; task: string; model: string }) => {
    const newId = `agent-${Date.now()}`
    const provider = providerFor(params.model)
    const modelOption = ALL_MODELS.find(model => model.label === params.model)

    const newAgent: Agent = {
      id: newId,
      name: params.name,
      icon: 'bolt',
      model: params.model,
      status: 'thinking',
      progress: 0,
      tokens: 0,
      currentTask: params.task,
      archetype: 'Agent',
      elapsed: 0,
      paused: false,
      modalities: ['T'],
      generatingModality: 'T',
      ctx: 0,
      provider: modelOption ?? provider,
      steps: initSteps(),
      logs: [],
    }

    setAgents(previous => [...previous, newAgent])
    setTimeout(() => {
      runScript(newId, generateResponseScript(params.task))
    }, 200)
  }, [runScript])

  return { agents, sendPrompt, pauseAgent, resumeAgent, spawnAgent }
}
