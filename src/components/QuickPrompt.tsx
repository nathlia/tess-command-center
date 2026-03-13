import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Agent } from '../types/agent'
import { AgentIcon } from './ui/AgentIcon'

interface Props {
  selectedAgent: Agent
  onSend: (agentId: string, prompt: string) => void
}

export function QuickPrompt({ selectedAgent, onSend }: Props) {
  const [value, setValue] = useState('')
  const [dispatched, setDispatched] = useState(false)
  const [focused, setFocused] = useState(false)
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
      className="shrink-0 px-4 border-t"
      style={{
        height: 60,
        backgroundColor: 'var(--bg-ink)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-2 h-full pt-1">
        {/* Agent icon */}
        <AgentIcon icon={selectedAgent.icon} size={14} className="opacity-40" />

        {/* Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={dispatched}
            placeholder={`Instruct ${selectedAgent.name}…`}
            aria-label={`Send instruction to ${selectedAgent.name}`}
            className="w-full text-xs px-3 py-2.5 rounded-[10px] outline-none transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: `0.667px solid ${focused ? 'var(--bg-teal)' : 'rgba(255,255,255,0.06)'}`,
              boxShadow: focused ? '0 0 0 2px var(--bg-teal-20)' : 'none',
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
                className="absolute inset-0 flex items-center px-3 rounded-[10px]"
                style={{ backgroundColor: 'var(--bg-teal-12)' }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-medium"
                  style={{ color: 'var(--bg-teal)' }}
                >
                  Dispatched
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
          className="shrink-0 flex items-center justify-center rounded-[10px] transition-opacity cursor-pointer"
          style={{
            width: 32,
            height: 32,
            backgroundColor: 'rgba(255,255,255,0.04)',
            opacity: value.trim() && !dispatched ? 1 : 0.2,
          }}
          aria-label="Send instruction"
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--text-white-70)' }}
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}
