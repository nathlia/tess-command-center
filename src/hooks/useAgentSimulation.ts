import { useCallback, useEffect, useRef, useState } from 'react'
import { agentScripts, type AgentScriptDef } from '../data/agentScripts'
import { initialAgents } from '../data/mockAgents'
import type { Agent, AgentStatus, LogEntry, LogEventType, ScriptStep } from '../types/agent'
import { advanceAgentSteps, createAgentSteps } from '../utils/agentHelpers'

const INITIAL_DELAYS: Record<string, number> = {
  'agent-1': 0,
  'agent-2': 800,
  'agent-3': 3000,
  'agent-4': 5000,
  'agent-5': 4200,
  'agent-6': 6500,
  'agent-7': 1400,
  'agent-8': 2600,
}

const SCRIPT_PACE_MULTIPLIER = 3.6
const RESTART_DELAY_MIN = 10000
const RESTART_DELAY_VARIANCE = 4000

interface AgentRuntime {
  action: () => void
  delayMs: number
  nextIndex: number
  script: AgentScriptDef
  startedAt: number
  timeoutId: ReturnType<typeof setTimeout> | null
}

function uid() {
  return Math.random().toString(36).slice(2)
}

function timestamp() {
  return new Date().toISOString()
}

function jitter(base: number) {
  const variance = Math.min(320, Math.max(120, Math.round(base * 0.07)))
  return Math.max(0, base + Math.floor(Math.random() * (variance * 2)) - variance)
}

function statusFromProgress(progress: number): AgentStatus {
  if (progress >= 100) return 'done'
  if (progress >= 25) return 'executing'
  return 'thinking'
}

function stepDelay(steps: ScriptStep[], index: number) {
  const current = steps[index]?.delay ?? 0
  const previous = index === 0 ? 0 : steps[index - 1]?.delay ?? 0
  return Math.max(0, current - previous)
}

function generateResponseScript(agent: Agent, prompt: string): AgentScriptDef {
  const label = prompt.length > 45 ? `${prompt.slice(0, 45)}...` : prompt
  const modalities: Agent['modalities'] = agent.modalities.includes('T')
    ? [...agent.modalities]
    : ['T', ...agent.modalities]

  return {
    task: prompt,
    archetype: agent.archetype,
    modalities,
    generatingModality: 'T',
    stepLabels: ['Parse prompt', 'Fetch context', 'Plan response', 'Generate output', 'Queue result'],
    steps: [
      {
        delay: 400,
        stepIndex: 0,
        type: 'think',
        text: `Parsing instruction: "${label}"`,
        progress: 10,
        thought: `Processing user prompt: "${prompt}". Planning execution strategy.`,
      },
      { delay: 1600, stepIndex: 1, type: 'mcp', text: 'context_fetch -> retrieving relevant history', progress: 30 },
      { delay: 3000, stepIndex: 2, type: 'think', text: 'Formulating response strategy...', progress: 55 },
      {
        delay: 5000,
        stepIndex: 3,
        type: 'write',
        text: 'Generating response...',
        progress: 80,
        output: prompt.length > 60 ? `${prompt.slice(0, 60)}...` : prompt,
      },
      { delay: 7000, stepIndex: 4, type: 'result', text: 'Response generated - task queued for execution', progress: 100 },
    ],
  }
}

export function useAgentSimulation() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const runtimesRef = useRef<Map<string, AgentRuntime>>(new Map())
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scheduleStepRef = useRef<((agentId: string, script: AgentScriptDef, index: number) => void) | null>(null)
  const startScriptRef = useRef<((agentId: string, script: AgentScriptDef, seedLogs?: LogEntry[]) => void) | null>(null)

  const clearScheduledAction = useCallback((agentId: string) => {
    const runtime = runtimesRef.current.get(agentId)

    if (runtime?.timeoutId) {
      clearTimeout(runtime.timeoutId)
      runtimesRef.current.set(agentId, {
        ...runtime,
        timeoutId: null,
      })
    }
  }, [])

  const removeRuntime = useCallback((agentId: string) => {
    clearScheduledAction(agentId)
    runtimesRef.current.delete(agentId)
  }, [clearScheduledAction])

  const scheduleAgentAction = useCallback((
    agentId: string,
    script: AgentScriptDef,
    nextIndex: number,
    delayMs: number,
    action: () => void,
  ) => {
    clearScheduledAction(agentId)

    const timeoutId = setTimeout(action, delayMs)

    runtimesRef.current.set(agentId, {
      action,
      delayMs,
      nextIndex,
      script,
      startedAt: Date.now(),
      timeoutId,
    })
  }, [clearScheduledAction])

  const startScript = useCallback((agentId: string, script: AgentScriptDef, seedLogs: LogEntry[] = []) => {
    setAgents(previous =>
      previous.map(agent => {
        if (agent.id !== agentId) return agent

        return {
          ...agent,
          status: 'thinking',
          progress: 0,
          currentTask: script.task,
          tokens: 0,
          logs: seedLogs,
          archetype: script.archetype,
          elapsed: 0,
          paused: false,
          steps: createAgentSteps(script.stepLabels),
          modalities: script.modalities,
          generatingModality: script.generatingModality,
        }
      }),
    )

    scheduleStepRef.current?.(agentId, script, 0)
  }, [])

  const scheduleStep = useCallback((agentId: string, script: AgentScriptDef, index: number) => {
    const step = script.steps[index]
    if (!step) return

    const delayMs = jitter(Math.round(stepDelay(script.steps, index) * SCRIPT_PACE_MULTIPLIER))

    scheduleAgentAction(agentId, script, index, delayMs, () => {
      setAgents(previous =>
        previous.map(agent => {
          if (agent.id !== agentId) return agent

          const logEntry: LogEntry = {
            id: uid(),
            timestamp: timestamp(),
            message: step.text,
            type: step.type,
            thought: step.thought,
            output: step.output,
          }

          const isFinalStep = index === script.steps.length - 1 || step.progress >= 100

          return {
            ...agent,
            progress: step.progress,
            status: statusFromProgress(step.progress),
            tokens: Math.round((step.progress / 100) * agent.tokenBudget),
            logs: [...agent.logs, logEntry].slice(-50),
            steps: advanceAgentSteps(agent.steps, step.stepIndex, agent.elapsed, isFinalStep),
          }
        }),
      )

      if (index === script.steps.length - 1) {
        const restartDelay = RESTART_DELAY_MIN + Math.floor(Math.random() * RESTART_DELAY_VARIANCE)

        scheduleAgentAction(agentId, script, 0, restartDelay, () => {
          startScriptRef.current?.(agentId, script)
        })

        return
      }

      scheduleStepRef.current?.(agentId, script, index + 1)
    })
  }, [scheduleAgentAction])

  useEffect(() => {
    startScriptRef.current = startScript
    scheduleStepRef.current = scheduleStep
  }, [scheduleStep, startScript])

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
    const runtimes = runtimesRef.current

    Object.entries(agentScripts).forEach(([agentId, script]) => {
      scheduleAgentAction(agentId, script, 0, INITIAL_DELAYS[agentId] ?? 0, () => {
        startScriptRef.current?.(agentId, script)
      })
    })

    return () => {
      runtimes.forEach(runtime => {
        if (runtime.timeoutId) clearTimeout(runtime.timeoutId)
      })

      runtimes.clear()
    }
  }, [scheduleAgentAction])

  const sendPrompt = useCallback((agentId: string, prompt: string) => {
    const targetAgent = agents.find(agent => agent.id === agentId)
    if (!targetAgent) return

    removeRuntime(agentId)

    const logEntry: LogEntry = {
      id: uid(),
      timestamp: timestamp(),
      message: `Received: "${prompt.length > 50 ? `${prompt.slice(0, 50)}...` : prompt}"`,
      type: 'msg' as LogEventType,
    }

    startScript(agentId, generateResponseScript(targetAgent, prompt), [logEntry])
  }, [agents, removeRuntime, startScript])

  const pauseAgent = useCallback((agentId: string) => {
    const runtime = runtimesRef.current.get(agentId)

    if (runtime?.timeoutId) {
      clearTimeout(runtime.timeoutId)

      runtimesRef.current.set(agentId, {
        ...runtime,
        delayMs: Math.max(0, runtime.delayMs - (Date.now() - runtime.startedAt)),
        timeoutId: null,
      })
    }

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
    const runtime = runtimesRef.current.get(agentId)

    if (runtime && !runtime.timeoutId) {
      const timeoutId = setTimeout(runtime.action, runtime.delayMs)

      runtimesRef.current.set(agentId, {
        ...runtime,
        startedAt: Date.now(),
        timeoutId,
      })
    }

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

  return { agents, sendPrompt, pauseAgent, resumeAgent }
}
