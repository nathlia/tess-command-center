export type ContextTone = 'neutral' | 'teal' | 'purple' | 'amber' | 'emerald'

export interface SkillItem {
  name: string
  desc: string
  status: 'called' | 'idle' | 'unused'
  calls: string
  ctx: string
  active: boolean
}

export interface McpItem {
  name: string
  desc: string
  badge: 'calling' | 'idle'
  calls: number
  ctx: string
  ctxPct: number
  tone: ContextTone
  active: boolean
}

export interface IntegrationItem {
  name: string
  status: 'connected' | 'error' | 'idle'
  tone: ContextTone
}

export interface CtxBreakdown {
  total: number
  reasoning: number
  mcp: number
  skills: number
  task: number
}

export interface ContextPanelData {
  skills: SkillItem[]
  mcps: McpItem[]
  integrations: IntegrationItem[]
  ctx: CtxBreakdown
}

export const emptyContextPanelData: ContextPanelData = {
  skills: [],
  mcps: [],
  integrations: [],
  ctx: { total: 128, reasoning: 0, mcp: 0, skills: 0, task: 0 },
}

export const contextPanelData: Record<string, ContextPanelData> = {
  'agent-1': {
    skills: [
      { name: 'web-researcher', desc: 'Deep search + source synthesis', status: 'called', calls: '4x', ctx: '2.1k', active: true },
      { name: 'report-writer', desc: 'Structured document generation', status: 'called', calls: '2x', ctx: '1.4k', active: true },
      { name: 'fact-checker', desc: 'Verifies claims against sources', status: 'idle', calls: '-', ctx: '600', active: false },
      { name: 'sentiment-scorer', desc: 'Emotion scoring on text', status: 'unused', calls: '-', ctx: '-', active: false },
    ],
    mcps: [
      { name: 'Tavily Search', desc: 'Live web search API', badge: 'calling', calls: 9, ctx: '4.2k', ctxPct: 60, tone: 'teal', active: true },
      { name: 'Notion MCP', desc: 'Internal KB + docs', badge: 'idle', calls: 2, ctx: '1.8k', ctxPct: 26, tone: 'purple', active: false },
      { name: 'GitHub MCP', desc: 'Repo context + PRs', badge: 'idle', calls: 0, ctx: '0', ctxPct: 0, tone: 'neutral', active: false },
    ],
    integrations: [
      { name: 'Notion', status: 'connected', tone: 'purple' },
      { name: 'Slack', status: 'connected', tone: 'amber' },
      { name: 'HubSpot', status: 'error', tone: 'amber' },
      { name: 'Intercom', status: 'idle', tone: 'neutral' },
    ],
    ctx: { total: 128, reasoning: 31, mcp: 28, skills: 11, task: 4 },
  },
  'agent-2': {
    skills: [
      { name: 'log-analyzer', desc: 'Pattern detection in log streams', status: 'called', calls: '6x', ctx: '3.2k', active: true },
      { name: 'alert-writer', desc: 'Generates on-call summaries', status: 'called', calls: '1x', ctx: '0.8k', active: true },
      { name: 'root-cause', desc: 'Causal chain analysis', status: 'idle', calls: '-', ctx: '500', active: false },
    ],
    mcps: [
      { name: 'Datadog MCP', desc: 'Metrics + traces', badge: 'calling', calls: 12, ctx: '5.1k', ctxPct: 70, tone: 'purple', active: true },
      { name: 'PagerDuty', desc: 'Incident routing', badge: 'idle', calls: 1, ctx: '0.4k', ctxPct: 6, tone: 'emerald', active: false },
    ],
    integrations: [
      { name: 'Datadog', status: 'connected', tone: 'purple' },
      { name: 'Slack', status: 'connected', tone: 'amber' },
      { name: 'Jira', status: 'idle', tone: 'neutral' },
    ],
    ctx: { total: 128, reasoning: 28, mcp: 35, skills: 8, task: 3 },
  },
  'agent-3': {
    skills: [
      { name: 'sql-optimizer', desc: 'Query plan analysis + index advice', status: 'called', calls: '3x', ctx: '1.6k', active: true },
      { name: 'schema-reader', desc: 'Parses table definitions', status: 'called', calls: '2x', ctx: '0.9k', active: true },
    ],
    mcps: [
      { name: 'Postgres MCP', desc: 'Direct DB query executor', badge: 'idle', calls: 5, ctx: '2.4k', ctxPct: 40, tone: 'teal', active: false },
    ],
    integrations: [
      { name: 'PostgreSQL', status: 'connected', tone: 'teal' },
      { name: 'PlanetScale', status: 'idle', tone: 'neutral' },
    ],
    ctx: { total: 128, reasoning: 22, mcp: 18, skills: 12, task: 5 },
  },
  'agent-4': {
    skills: [
      { name: 'ticket-classifier', desc: 'Priority + category tagging', status: 'called', calls: '8x', ctx: '4.0k', active: true },
      { name: 'sentiment-scorer', desc: 'Emotion scoring on text', status: 'called', calls: '4x', ctx: '1.8k', active: true },
      { name: 'escalation-drafter', desc: 'Writes P1 escalation summaries', status: 'called', calls: '3x', ctx: '1.2k', active: true },
    ],
    mcps: [
      { name: 'Zendesk MCP', desc: 'Ticket read/write', badge: 'idle', calls: 7, ctx: '3.1k', ctxPct: 45, tone: 'teal', active: false },
      { name: 'Slack MCP', desc: 'Alert delivery', badge: 'idle', calls: 3, ctx: '0.6k', ctxPct: 9, tone: 'purple', active: false },
    ],
    integrations: [
      { name: 'Zendesk', status: 'connected', tone: 'teal' },
      { name: 'Slack', status: 'connected', tone: 'amber' },
      { name: 'Linear', status: 'idle', tone: 'neutral' },
    ],
    ctx: { total: 128, reasoning: 35, mcp: 22, skills: 18, task: 6 },
  },
  'agent-5': {
    skills: [
      { name: 'report-writer', desc: 'Structured document generation', status: 'called', calls: '2x', ctx: '1.4k', active: true },
      { name: 'summarizer', desc: 'Condenses multi-source content', status: 'called', calls: '5x', ctx: '2.8k', active: true },
      { name: 'email-formatter', desc: 'HTML email composition', status: 'idle', calls: '-', ctx: '600', active: false },
    ],
    mcps: [
      { name: 'Notion MCP', desc: 'Internal KB + docs', badge: 'idle', calls: 4, ctx: '2.0k', ctxPct: 30, tone: 'purple', active: false },
      { name: 'Gmail MCP', desc: 'Email delivery', badge: 'idle', calls: 1, ctx: '0.3k', ctxPct: 4, tone: 'amber', active: false },
    ],
    integrations: [
      { name: 'Notion', status: 'connected', tone: 'purple' },
      { name: 'Gmail', status: 'connected', tone: 'amber' },
      { name: 'Slack', status: 'idle', tone: 'neutral' },
    ],
    ctx: { total: 128, reasoning: 25, mcp: 16, skills: 22, task: 7 },
  },
  'agent-6': {
    skills: [
      { name: 'crm-enricher', desc: 'Firmographic data lookup', status: 'called', calls: '5x', ctx: '3.5k', active: true },
      { name: 'deduplicator', desc: 'Record merge + dedup logic', status: 'called', calls: '2x', ctx: '1.1k', active: true },
      { name: 'profile-writer', desc: 'Formats company profiles', status: 'idle', calls: '-', ctx: '500', active: false },
    ],
    mcps: [
      { name: 'Clearbit MCP', desc: 'Company + contact data', badge: 'idle', calls: 6, ctx: '2.7k', ctxPct: 38, tone: 'teal', active: false },
      { name: 'HubSpot MCP', desc: 'CRM record sync', badge: 'idle', calls: 4, ctx: '1.5k', ctxPct: 21, tone: 'amber', active: false },
    ],
    integrations: [
      { name: 'HubSpot', status: 'connected', tone: 'amber' },
      { name: 'Clearbit', status: 'connected', tone: 'teal' },
      { name: 'Salesforce', status: 'idle', tone: 'neutral' },
    ],
    ctx: { total: 128, reasoning: 20, mcp: 24, skills: 14, task: 5 },
  },
}
