export type AgentStatus = 'thinking' | 'executing' | 'done'

export type AgentIcon = 'microscope' | 'bar-chart' | 'bolt' | 'target' | 'pencil' | 'link'

export interface LogEntry {
  id: string
  timestamp: string
  message: string
}

export interface Agent {
  id: string
  name: string
  icon: AgentIcon
  model: string
  status: AgentStatus
  progress: number
  currentTask: string
  tokens: number
  logs: LogEntry[]
}
