import type { Agent } from '../types/agent'

const now = () => new Date().toISOString()

export const initialAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Research Agent',
    model: 'Claude 3.5',
    status: 'executing',
    progress: 42,
    currentTask: 'Scanning knowledge base for relevant sources',
    logs: [
      { id: 'l1-1', timestamp: now(), message: 'Parsing request context' },
      { id: 'l1-2', timestamp: now(), message: 'Selecting retrieval strategy' },
      { id: 'l1-3', timestamp: now(), message: 'Calling external knowledge tool' },
    ],
  },
  {
    id: 'agent-2',
    name: 'Ops Analyst',
    model: 'GPT-4',
    status: 'thinking',
    progress: 18,
    currentTask: 'Evaluating pipeline anomalies',
    logs: [
      { id: 'l2-1', timestamp: now(), message: 'Parsing request context' },
      { id: 'l2-2', timestamp: now(), message: 'Selecting retrieval strategy' },
    ],
  },
  {
    id: 'agent-3',
    name: 'SQL Runner',
    model: 'Gemini Pro',
    status: 'done',
    progress: 100,
    currentTask: 'Query execution complete',
    logs: [
      { id: 'l3-1', timestamp: now(), message: 'Parsing request context' },
      { id: 'l3-2', timestamp: now(), message: 'Calling external knowledge tool' },
      { id: 'l3-3', timestamp: now(), message: 'Synthesizing answer draft' },
      { id: 'l3-4', timestamp: now(), message: 'Execution completed' },
    ],
  },
  {
    id: 'agent-4',
    name: 'Support Triage',
    model: 'Claude 3.5',
    status: 'thinking',
    progress: 7,
    currentTask: 'Classifying incoming support tickets',
    logs: [
      { id: 'l4-1', timestamp: now(), message: 'Parsing request context' },
    ],
  },
  {
    id: 'agent-5',
    name: 'Content Synthesizer',
    model: 'GPT-4',
    status: 'executing',
    progress: 65,
    currentTask: 'Drafting structured summary from sources',
    logs: [
      { id: 'l5-1', timestamp: now(), message: 'Parsing request context' },
      { id: 'l5-2', timestamp: now(), message: 'Selecting retrieval strategy' },
      { id: 'l5-3', timestamp: now(), message: 'Calling external knowledge tool' },
      { id: 'l5-4', timestamp: now(), message: 'Synthesizing answer draft' },
    ],
  },
]
