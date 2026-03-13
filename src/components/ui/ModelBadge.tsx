const modelStyle = (model: string): { bg: string; text: string } => {
  if (model.toLowerCase().includes('claude'))  return { bg: 'var(--bg-purple-tint)', text: 'var(--text-purple)' }
  if (model.toLowerCase().includes('gpt'))     return { bg: 'var(--bg-teal-12)',    text: 'var(--bg-teal)' }
  if (model.toLowerCase().includes('gemini'))  return { bg: 'var(--bg-amber-tint)', text: 'var(--text-amber)' }
  return { bg: 'var(--bg-light)', text: 'var(--text-mid)' }
}

export function ModelBadge({ model }: { model: string }) {
  const { bg, text } = modelStyle(model)
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {model}
    </span>
  )
}
