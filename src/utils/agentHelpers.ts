import type { AgentStep } from '../types/agent'

export function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}m${String(remainder).padStart(2, '0')}s`
}

export function formatTokens(tokens: number, suffix = '') {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k${suffix}`
  return `${tokens}${suffix}`
}

export function getTokenUsagePercent(tokens: number, tokenBudget: number) {
  if (tokenBudget <= 0) return 0
  return Math.max(0, Math.min(100, (tokens / tokenBudget) * 100))
}

export function createAgentSteps(stepLabels: string[]): AgentStep[] {
  return stepLabels.map((label, index) => ({
    label,
    status: index === 0 ? 'active' : 'pending',
    time: '--',
  }))
}

export function advanceAgentSteps(
  steps: AgentStep[],
  stepIndex: number,
  elapsed: number,
  completeCurrent: boolean,
): AgentStep[] {
  const completedAt = formatElapsed(elapsed)

  return steps.map((step, index) => {
    if (index < stepIndex) {
      return {
        ...step,
        status: 'done',
        time: step.status === 'done' && step.time !== '--' ? step.time : completedAt,
      }
    }

    if (index === stepIndex) {
      if (completeCurrent) {
        return {
          ...step,
          status: 'done',
          time: step.status === 'done' && step.time !== '--' ? step.time : completedAt,
        }
      }

      return {
        ...step,
        status: 'active',
        time: step.status === 'done' ? step.time : '--',
      }
    }

    return {
      ...step,
      status: 'pending',
      time: '--',
    }
  })
}

export function getStepSummary(steps: AgentStep[]) {
  const total = steps.length
  const doneCount = steps.filter(step => step.status === 'done').length
  const activeIndex = steps.findIndex(step => step.status === 'active')
  const firstPendingIndex = steps.findIndex(step => step.status === 'pending')

  const current = activeIndex >= 0
    ? activeIndex + 1
    : doneCount === total
      ? total
      : firstPendingIndex >= 0
        ? firstPendingIndex + 1
        : 0

  return {
    total,
    doneCount,
    activeIndex,
    current,
  }
}

export function getPrimaryStep(steps: AgentStep[]) {
  const active = steps.find(step => step.status === 'active')
  if (active) return active

  const done = [...steps].reverse().find(step => step.status === 'done')
  if (done) return done

  return steps[0] ?? null
}
