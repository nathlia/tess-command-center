import { useState } from 'react'
import type { Agent } from '../types/agent'

export function useSplitPane(agents: Agent[], selectedId: string) {
  const [splitId, setSplitId] = useState<string | null>(null)

  function toggle() {
    setSplitId(id => {
      if (id) return null
      return agents.find(a => a.id !== selectedId)?.id ?? null
    })
  }

  return { splitId, setSplitId, toggle }
}
