import type { LogEntry } from '../../types/agent'
import { ThinkBlock } from './ThinkBlock'
import { StandardEventRow } from './StandardEventRow'

interface Props {
  event: LogEntry
  isNew?: boolean
}

export function EventRow({ event, isNew }: Props) {
  if (event.type === 'think') {
    return <ThinkBlock event={event} isNew={isNew} />
  }
  return <StandardEventRow event={event} />
}
