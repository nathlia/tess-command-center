export type FileType = 'md' | 'csv' | 'json' | 'txt' | 'img'
export type FileStatus = 'done' | 'writing' | 'generating'

export interface FileEntry {
  name: string
  size: string
  type: FileType
  status: FileStatus
  updated: string
}

export const filesData: Record<string, FileEntry[]> = {
  'agent-1': [
    { name: 'market-analysis-q1.md',    size: '18.4 KB', type: 'md',   status: 'writing',    updated: '1m ago' },
    { name: 'competitor-matrix.csv',    size: '4.2 KB',  type: 'csv',  status: 'done',       updated: '3m ago' },
    { name: 'sources.json',             size: '1.1 KB',  type: 'json', status: 'done',       updated: '5m ago' },
    { name: 'exec-summary.md',          size: '2.8 KB',  type: 'md',   status: 'generating', updated: 'now'    },
  ],
  'agent-2': [
    { name: 'anomaly-report.md',        size: '6.1 KB',  type: 'md',   status: 'done',       updated: '2m ago' },
    { name: 'pipeline-traces.json',     size: '22.3 KB', type: 'json', status: 'done',       updated: '4m ago' },
    { name: 'incident-4471-brief.txt',  size: '0.9 KB',  type: 'txt',  status: 'done',       updated: '1m ago' },
  ],
  'agent-3': [
    { name: 'query-plan-before.txt',    size: '1.4 KB',  type: 'txt',  status: 'done',       updated: '5m ago' },
    { name: 'query-plan-after.txt',     size: '1.3 KB',  type: 'txt',  status: 'done',       updated: '2m ago' },
    { name: 'migration-changelog.md',   size: '3.2 KB',  type: 'md',   status: 'done',       updated: '2m ago' },
  ],
  'agent-4': [
    { name: 'triage-results.csv',       size: '8.7 KB',  type: 'csv',  status: 'done',       updated: '1m ago' },
    { name: 'p1-escalations.md',        size: '2.1 KB',  type: 'md',   status: 'done',       updated: '1m ago' },
    { name: 'sentiment-scores.json',    size: '5.5 KB',  type: 'json', status: 'done',       updated: '3m ago' },
  ],
  'agent-5': [
    { name: 'weekly-ops-report.md',     size: '11.2 KB', type: 'md',   status: 'done',       updated: '1m ago' },
    { name: 'agent-outputs-raw.json',   size: '34.8 KB', type: 'json', status: 'done',       updated: '6m ago' },
    { name: 'report-preview.img',       size: '42.1 KB', type: 'img',  status: 'done',       updated: '1m ago' },
  ],
  'agent-6': [
    { name: 'enriched-profiles.csv',    size: '28.4 KB', type: 'csv',  status: 'done',       updated: '2m ago' },
    { name: 'crm-sync-log.json',        size: '6.9 KB',  type: 'json', status: 'done',       updated: '2m ago' },
    { name: 'dedup-report.md',          size: '3.3 KB',  type: 'md',   status: 'done',       updated: '3m ago' },
  ],
}
