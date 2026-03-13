export type AgentStatus = 'thinking' | 'executing' | 'done'

export interface LogEntry {
  id: string
  timestamp: string
  message: string
}

export interface Agent {
  id: string
  name: string
  model: string
  status: AgentStatus
  progress: number
  currentTask: string
  logs: LogEntry[]
}
