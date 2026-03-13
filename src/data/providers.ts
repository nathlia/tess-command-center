import type { Provider, ModelOption } from '../types/agent'

interface ProviderDef extends Provider {
  models: string[]
}

export const PROVIDERS: ProviderDef[] = [
  { group: 'Anthropic', color: '#c07a4a', bg: '#f5ede6', models: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5'] },
  { group: 'OpenAI',    color: '#10a37f', bg: '#e6f7f2', models: ['gpt-4o', 'gpt-4o-mini', 'o1', 'o3-mini'] },
  { group: 'Google',    color: '#4285f4', bg: '#e8f0fe', models: ['gemini-2.0-flash', 'gemini-1.5-pro'] },
  { group: 'Meta',      color: '#0668e1', bg: '#e6f0fb', models: ['llama-3.3-70b', 'llama-3.1-405b'] },
  { group: 'Mistral',   color: '#ff7000', bg: '#fff3e6', models: ['mistral-large-2', 'mistral-7b'] },
  { group: 'xAI',       color: '#374151', bg: '#f3f4f6', models: ['grok-2', 'grok-beta'] },
  { group: 'Cohere',    color: '#39594d', bg: '#edf3f0', models: ['command-r-plus', 'command-r'] },
  { group: 'DeepSeek',  color: '#6366f1', bg: '#eef2ff', models: ['deepseek-r1', 'deepseek-v3'] },
]

export const ALL_MODELS: ModelOption[] = PROVIDERS.flatMap(p =>
  p.models.map(m => ({ group: p.group, color: p.color, bg: p.bg, label: m }))
)

export function providerFor(model: string): Provider {
  for (const p of PROVIDERS) {
    if (p.models.some(m => m.toLowerCase() === model.toLowerCase())) {
      return { group: p.group, color: p.color, bg: p.bg }
    }
  }
  return { group: 'Unknown', color: '#9ca3af', bg: '#f9fafb' }
}
