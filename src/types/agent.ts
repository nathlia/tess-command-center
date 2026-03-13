export type AgentStatus = 'thinking' | 'executing' | 'done'

export type AgentIcon = 'microscope' | 'bar-chart' | 'bolt' | 'target' | 'pencil' | 'link'

export type Modality = 'T' | 'I' | 'V' | 'A' | 'O'

export type LogEventType =
  | 'task' | 'think' | 'search' | 'result' | 'write'
  | 'mcp'  | 'skill' | 'warn'   | 'msg'    | 'info'
  | 'tool' | 'output'

export interface AgentStep {
  label: string
  status: 'done' | 'active' | 'pending'
  time: string
}

export interface Provider {
  group: string
  color: string
  bg: string
}

export interface ModelOption extends Provider {
  label: string
}

export interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: LogEventType
  thought?: string
  output?: string
}

export interface ScriptStep {
  delay: number
  type: LogEventType
  text: string
  progress: number
  thought?: string
  output?: string
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
  archetype: string
  elapsed: number
  paused: boolean
  steps: AgentStep[]
  modalities: Modality[]
  generatingModality: Modality | null
  ctx: number
  provider: Provider
}
