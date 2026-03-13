import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Agent } from '../types/agent'

interface Props {
  selectedAgent: Agent
  onSend: (agentId: string, prompt: string) => void
}

export function QuickPrompt({ selectedAgent, onSend }: Props) {
  const [value, setValue] = useState('')
  const [dispatched, setDispatched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || dispatched) return

    onSend(selectedAgent.id, trimmed)
    setValue('')
    setDispatched(true)
    setTimeout(() => {
      setDispatched(false)
      inputRef.current?.focus()
    }, 1400)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className="shrink-0 px-5 py-4 border-t"
      style={{
        backgroundColor: 'var(--bg-black)',
        borderColor: 'var(--border-white-10)',
      }}
    >
      {/* Target label */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[10px]" style={{ color: 'var(--text-white-40)' }}>
          Sending to
        </span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
          style={{
            color: 'var(--bg-teal)',
            backgroundColor: 'var(--bg-teal-20)',
          }}
        >
          {selectedAgent.name}
        </span>
      </div>

      {/* Input row */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={dispatched}
            placeholder={`New instruction…`}
            className="w-full text-xs px-3 py-2.5 rounded-lg outline-none transition-all"
            style={{
              backgroundColor: 'var(--bg-white-0a)',
              border: '1px solid var(--border-white-10)',
              color: 'var(--text-white-85)',
              caretColor: 'var(--bg-teal)',
            }}
          />

          {/* Dispatched flash overlay */}
          <AnimatePresence>
            {dispatched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center px-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg-teal-12)' }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-medium"
                  style={{ color: 'var(--bg-teal)' }}
                >
                  ✓ Dispatched
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Send button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!value.trim() || dispatched}
          whileTap={{ scale: 0.94 }}
          className="shrink-0 px-3 py-2.5 rounded-lg text-xs font-semibold transition-opacity cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-teal)',
            color: 'var(--text-white)',
            opacity: value.trim() && !dispatched ? 1 : 0.35,
          }}
        >
          Send
        </motion.button>
      </div>
    </div>
  )
}
