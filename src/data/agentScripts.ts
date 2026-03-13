import type { Modality, ScriptStep } from '../types/agent'

export interface AgentScriptDef {
  task: string
  archetype: string
  modalities: Modality[]
  generatingModality: Modality | null
  steps: ScriptStep[]
}

export const agentScripts: Record<string, AgentScriptDef> = {
  'agent-1': {
    task: 'Analyzing market trends for Q1 2026 competitive landscape',
    archetype: 'Researcher',
    modalities: ['T', 'I'],
    generatingModality: 'T',
    steps: [
      {
        delay: 600,
        type: 'think',
        text: 'Planning retrieval strategy...',
        progress: 5,
        thought: 'I need to identify primary market sources, then cross-reference with recent funding data and GTM announcements. Starting with Gartner and CB Insights for baseline.',
      },
      { delay: 1800, type: 'mcp', text: 'Tavily Search -> "Q1 2026 SaaS market report"', progress: 15 },
      { delay: 3200, type: 'result', text: '12 sources found - filtering by relevance', progress: 28 },
      { delay: 4800, type: 'tool', text: 'tool:read_doc -> processing top 5 sources', progress: 45 },
      {
        delay: 6500,
        type: 'think',
        text: 'Synthesizing competitive landscape...',
        progress: 65,
        thought: 'Three clear incumbents dominate with ~60% share. Two challengers are gaining GTM traction via PLG. Pricing compression visible in SMB tier.',
      },
      {
        delay: 8000,
        type: 'write',
        text: 'Drafting market analysis report...',
        progress: 82,
        output: 'Market is led by 3 incumbents with ~60% share. Two challengers gaining ground via product-led growth. Pricing compression emerging in SMB tier - avg ACV down 12% YoY.',
      },
      { delay: 9200, type: 'result', text: 'Analysis complete - 4 key findings extracted', progress: 100 },
    ],
  },
  'agent-2': {
    task: 'Evaluating pipeline anomalies across staging environment',
    archetype: 'Analyst',
    modalities: ['T'],
    generatingModality: null,
    steps: [
      {
        delay: 500,
        type: 'think',
        text: 'Scanning pipeline event logs...',
        progress: 8,
        thought: 'Looking at the last 24h window. Need to check throughput spikes, timeout patterns, and retry storms before making any causal claims.',
      },
      { delay: 1600, type: 'mcp', text: 'Datadog MCP -> staging.pipeline.errors', progress: 18 },
      { delay: 2900, type: 'result', text: '3 anomaly clusters detected - classifying by severity', progress: 32 },
      { delay: 4200, type: 'tool', text: 'tool:read_trace -> anomaly_id:7f3a9c', progress: 50 },
      {
        delay: 5700,
        type: 'think',
        text: 'Correlating with last 7-day baseline...',
        progress: 65,
        thought: 'The throughput spike at 03:17 UTC aligns with the batch job schedule. This is almost certainly an overlap issue, not a capacity failure.',
      },
      {
        delay: 7100,
        type: 'write',
        text: 'Drafting incident summary...',
        progress: 82,
        output: 'Root cause: throughput spike at 03:17 UTC - likely batch job overlap with primary ingest pipeline. Recommend staggering batch start times by +/-15 min.',
      },
      { delay: 8300, type: 'skill', text: 'alert-writer -> paging on-call with summary', progress: 92 },
      { delay: 9000, type: 'result', text: 'Incident ticket #4471 created - ops team notified', progress: 100 },
    ],
  },
  'agent-3': {
    task: 'Optimizing slow queries on users table (idx_created_at)',
    archetype: 'Engineer',
    modalities: ['T'],
    generatingModality: null,
    steps: [
      {
        delay: 400,
        type: 'think',
        text: 'Loading query execution plan...',
        progress: 6,
        thought: 'The query is a full table ORDER BY without a covering index. With 2.3M rows this will always seq scan. Index on created_at should fix it entirely.',
      },
      { delay: 1400, type: 'tool', text: 'tool:explain_query -> SELECT * FROM users ORDER BY created_at', progress: 18 },
      { delay: 2600, type: 'result', text: 'Seq scan on 2.3M rows - missing index on created_at', progress: 30 },
      { delay: 3800, type: 'tool', text: 'tool:run_sql -> CREATE INDEX idx_created_at ON users(created_at)', progress: 52 },
      { delay: 5400, type: 'think', text: 'Verifying index build and query re-plan...', progress: 70 },
      { delay: 7000, type: 'tool', text: 'tool:explain_query -> re-run with index hint', progress: 85 },
      {
        delay: 8200,
        type: 'write',
        text: 'Logging migration to schema changelog...',
        progress: 95,
        output: 'Query time: 2340ms -> 18ms - 99.2% improvement. Index deployed: idx_created_at ON users(created_at). Migration logged in schema_changelog v4.7.',
      },
      { delay: 9000, type: 'result', text: 'Index deployed - migration logged in schema changelog', progress: 100 },
    ],
  },
  'agent-4': {
    task: 'Classified 47 support tickets - 3 P1 escalations',
    archetype: 'Classifier',
    modalities: ['T'],
    generatingModality: null,
    steps: [
      {
        delay: 500,
        type: 'think',
        text: 'Loading 47 open support tickets...',
        progress: 8,
        thought: "I'll run the classifier first then layer sentiment scoring on top - high-urgency language often surfaces P0/P1 candidates the priority model misses.",
      },
      { delay: 1700, type: 'skill', text: 'ticket-classifier -> batch of 47', progress: 22 },
      { delay: 3100, type: 'result', text: '44 classified - 3 require manual review', progress: 40 },
      { delay: 4400, type: 'skill', text: 'sentiment-scorer -> flagging urgent tone', progress: 58 },
      { delay: 5900, type: 'think', text: 'Escalating P1 tickets - drafting summaries...', progress: 72 },
      {
        delay: 7200,
        type: 'write',
        text: 'Writing P1 escalation summaries...',
        progress: 88,
        output: '3 P1 escalations:\n- TKT-881: Billing dispute - $12k overcharge\n- TKT-902: Data loss - export job missing records\n- TKT-917: Auth outage - SSO token expiry bug',
      },
      { delay: 8400, type: 'result', text: 'Triage complete - escalations routed to oncall team', progress: 100 },
    ],
  },
  'agent-5': {
    task: 'Drafting weekly ops report from 5 agent outputs',
    archetype: 'Writer',
    modalities: ['T', 'I'],
    generatingModality: null,
    steps: [
      {
        delay: 600,
        type: 'think',
        text: 'Collecting outputs from 5 upstream agents...',
        progress: 7,
        thought: 'Cross-agent themes: latency issues (agent-2+3), data quality concerns (agent-6), customer impact (agent-4). These should be the three sections of the exec summary.',
      },
      { delay: 1900, type: 'tool', text: 'tool:read_doc -> agent-1 research summary', progress: 20 },
      { delay: 3300, type: 'tool', text: 'tool:read_doc -> agent-2 ops incident report', progress: 35 },
      { delay: 4700, type: 'think', text: 'Identifying cross-agent themes and conflicts...', progress: 50 },
      { delay: 6100, type: 'skill', text: 'report-writer -> drafting weekly ops report', progress: 68 },
      {
        delay: 7600,
        type: 'write',
        text: 'Finalizing report draft...',
        progress: 85,
        output: 'Weekly Ops Report - W10 2026\n\nExecutive Summary: Pipeline anomaly resolved (P1). SQL performance up 99%. 47 tickets triaged, 3 P1s escalated. Market analysis complete.\n\n847 words | 3 sections | exec summary included',
      },
      { delay: 8800, type: 'mcp', text: 'Gmail MCP -> distributing to stakeholders', progress: 94 },
      { delay: 9500, type: 'result', text: 'Weekly ops report delivered - 6 recipients', progress: 100 },
    ],
  },
  'agent-6': {
    task: 'Enriching 47 company profiles with firmographic and CRM data',
    archetype: 'Enricher',
    modalities: ['T'],
    generatingModality: null,
    steps: [
      { delay: 500, type: 'think', text: 'Waiting for upstream dependency (Research Agent)...', progress: 5 },
      { delay: 2000, type: 'result', text: 'Dependency resolved - starting enrichment pipeline', progress: 15 },
      { delay: 3400, type: 'mcp', text: 'Clearbit MCP -> 47 company profiles', progress: 32 },
      { delay: 4900, type: 'mcp', text: 'HubSpot MCP -> matching internal records', progress: 50 },
      {
        delay: 6200,
        type: 'think',
        text: 'Running deduplication pass...',
        progress: 65,
        thought: 'Found 12 duplicates. 9 are safe merges (same domain). 3 have conflicting firmographic data - flagging for manual review.',
      },
      { delay: 7500, type: 'result', text: 'Deduplication: 12 duplicate entries merged', progress: 80 },
      {
        delay: 8700,
        type: 'write',
        text: 'Writing enriched dataset...',
        progress: 95,
        output: 'Enrichment complete - 47 profiles updated, 12 merged.\n3 profiles flagged: conflicting revenue/headcount data across Clearbit + HubSpot sources.',
      },
      { delay: 9400, type: 'result', text: 'Dataset committed - downstream agents notified', progress: 100 },
    ],
  },
}
