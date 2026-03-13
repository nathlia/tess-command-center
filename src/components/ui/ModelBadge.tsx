const modelStyle = (model: string): { bg: string; text: string } => {
  const lower = model.toLowerCase()
  if (lower.includes('claude') || lower.includes('opus'))
    return { bg: 'var(--bg-teal-12)', text: 'var(--bg-teal)' }
  if (lower.includes('gpt'))
    return { bg: 'var(--bg-purple-tint)', text: 'var(--text-purple)' }
  if (lower.includes('gemini'))
    return { bg: 'var(--bg-amber-tint)', text: 'var(--text-amber)' }
  return { bg: 'var(--bg-light)', text: 'var(--text-mid)' }
}

export function ModelBadge({ model }: { model: string }) {
  const { bg, text } = modelStyle(model)
  return (
    <span
      className="inline-flex items-center px-1.5 py-px rounded text-[8.5px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: bg, color: text }}
    >
      {model}
    </span>
  )
}
