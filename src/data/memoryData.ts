export type MemoryType = 'str' | 'list' | 'obj' | 'num' | 'note' | 'warn'

export interface MemoryEntry {
  key: string
  val: string
  type: MemoryType
  updated: string
}

export const memoryData: Record<string, MemoryEntry[]> = {
  'agent-1': [
    { key: 'focus_market', val: 'SaaS - North America, Q1 2026', type: 'str', updated: '2m ago' },
    { key: 'sources_loaded', val: '["TechCrunch","Gartner","CB Insights"]', type: 'list', updated: '4m ago' },
    { key: 'competitor_count', val: '14', type: 'num', updated: '6m ago' },
    { key: 'report_format', val: '{"sections":3,"words":1200,"exec":true}', type: 'obj', updated: '8m ago' },
    { key: 'user_note', val: 'Prioritise pricing + GTM angles', type: 'note', updated: '12m ago' },
    { key: 'rate_limit_warn', val: 'Tavily Search hit 80% quota', type: 'warn', updated: '1m ago' },
  ],
  'agent-2': [
    { key: 'env_target', val: 'staging-us-east-1', type: 'str', updated: '1m ago' },
    { key: 'anomaly_ids', val: '["7f3a9c","b12e44","c93f01"]', type: 'list', updated: '3m ago' },
    { key: 'baseline_days', val: '7', type: 'num', updated: '5m ago' },
    { key: 'incident_meta', val: '{"ticket":"#4471","oncall":"@raja"}', type: 'obj', updated: '2m ago' },
    { key: 'alert_sent', val: 'Ops team paged via PagerDuty', type: 'note', updated: '1m ago' },
  ],
  'agent-3': [
    { key: 'table', val: 'users', type: 'str', updated: '3m ago' },
    { key: 'slow_queries', val: '["SELECT * ORDER BY created_at"]', type: 'list', updated: '5m ago' },
    { key: 'row_count', val: '2300000', type: 'num', updated: '4m ago' },
    { key: 'index_created', val: '{"name":"idx_created_at","col":"created_at"}', type: 'obj', updated: '2m ago' },
    { key: 'improvement', val: 'Query time dropped 99.2% (2340ms -> 18ms)', type: 'note', updated: '2m ago' },
  ],
  'agent-4': [
    { key: 'ticket_batch', val: '47', type: 'num', updated: '4m ago' },
    { key: 'p1_ids', val: '["TKT-881","TKT-902","TKT-917"]', type: 'list', updated: '2m ago' },
    { key: 'p1_types', val: '["billing","data_loss","auth_outage"]', type: 'list', updated: '2m ago' },
    { key: 'escalation_meta', val: '{"routed_to":"oncall","channel":"#p1"}', type: 'obj', updated: '1m ago' },
    { key: 'sentiment_flags', val: 'High urgency detected in 8 tickets', type: 'warn', updated: '3m ago' },
  ],
  'agent-5': [
    { key: 'report_title', val: 'Weekly Ops Report - W10 2026', type: 'str', updated: '2m ago' },
    { key: 'source_agents', val: '["agent-1","agent-2","agent-3","agent-4","agent-6"]', type: 'list', updated: '6m ago' },
    { key: 'word_count', val: '847', type: 'num', updated: '1m ago' },
    { key: 'recipients', val: '{"count":6,"group":"stakeholders"}', type: 'obj', updated: '1m ago' },
    { key: 'cross_theme', val: 'Latency + data quality surfaced in 3/5 agents', type: 'note', updated: '3m ago' },
  ],
  'agent-6': [
    { key: 'profile_count', val: '47', type: 'num', updated: '3m ago' },
    { key: 'merged_count', val: '12', type: 'num', updated: '2m ago' },
    { key: 'data_sources', val: '["Clearbit","HubSpot","internal_CRM"]', type: 'list', updated: '4m ago' },
    { key: 'enrichment_cfg', val: '{"fields":["revenue","headcount","geo"]}', type: 'obj', updated: '5m ago' },
    { key: 'dedup_warn', val: '3 profiles had conflicting firmographic data', type: 'warn', updated: '2m ago' },
  ],
}
