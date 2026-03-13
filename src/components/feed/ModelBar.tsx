import type { Agent } from '../../types/agent'
import { ModalityIcons } from '../ui/ModalityIcons'
import { ProgressBar } from '../ui/ProgressBar'
import { ProviderDot } from '../ui/ProviderDot'

interface Props {
  agent: Agent
}

export function ModelBar({ agent }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-subtle)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 0,
          padding: '6px 10px',
          borderRadius: 999,
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-white)',
        }}
      >
        <ProviderDot provider={agent.provider} size={12} />
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--semibold)', color: 'var(--text-ink)' }}>
          {agent.provider.group}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-mid)' }}>{agent.model}</span>
      </div>

      <ModalityIcons active={agent.modalities} generating={agent.generatingModality} />

      <div
        style={{
          minWidth: 0,
          flex: 1,
          fontSize: 'var(--text-sm)',
          color: 'var(--text-mid)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {agent.currentTask}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <ProgressBar
          value={agent.progress}
          tone={agent.status === 'done' ? 'emerald' : 'teal'}
          style={{ width: 84 }}
        />
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--semibold)', color: 'var(--text-ink)' }}>
          {Math.round(agent.progress)}%
        </span>
      </div>
    </div>
  )
}
