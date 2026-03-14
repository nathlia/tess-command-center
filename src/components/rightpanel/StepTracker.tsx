import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { AgentStep } from '../../types/agent'
import { getStepSummary } from '../../utils/agentHelpers'
import { SectionLabel } from '../ui/SectionLabel'

interface Props {
  steps: AgentStep[]
}

const DEFAULT_VISIBLE_STEPS = 3

export function StepTracker({ steps }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const summary = getStepSummary(steps)
  const visibleSteps = useMemo(() => {
    if (showAll) return steps
    const activeIndex = steps.findIndex(s => s.status === 'active')
    const anchorIndex = activeIndex !== -1 ? activeIndex : steps.findLastIndex(s => s.status === 'done')
    const start = anchorIndex !== -1
      ? Math.max(0, anchorIndex - 1)
      : Math.max(0, steps.length - DEFAULT_VISIBLE_STEPS)
    return steps.slice(start, start + DEFAULT_VISIBLE_STEPS)
  }, [showAll, steps])

  const hasHiddenSteps = steps.length > DEFAULT_VISIBLE_STEPS
  const hiddenCount = Math.max(0, steps.length - DEFAULT_VISIBLE_STEPS)

  return (
    <section
      style={{
        padding: '4px 2px 10px',
      }}
    >
      <button
        type="button"
        onClick={() => setCollapsed(value => !value)}
        aria-expanded={!collapsed}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <SectionLabel
          style={{
            display: 'block',
            fontSize: '10px',
            letterSpacing: '0.06em',
            color: 'var(--text-dark-600)',
            fontWeight: 'var(--medium)',
          }}
        >
          Steps
        </SectionLabel>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--text-mid)' }}>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--medium)',
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-slate)',
            }}
          >
            {summary.current}/{summary.total}
          </span>
          <motion.svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            animate={{ rotate: collapsed ? -90 : 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            <path d="M3 4.5 6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="steps-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ marginTop: 10 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {visibleSteps.map((step, index) => (
                <StepRow
                  key={`${step.label}-${index}`}
                  step={step}
                  isLast={index === visibleSteps.length - 1}
                />
              ))}
            </div>

            {hasHiddenSteps && (
              <button
                type="button"
                onClick={() => setShowAll(value => !value)}
                style={{
                  marginTop: 8,
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  color: 'var(--text-teal)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--medium)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <motion.svg
                  width={10}
                  height={10}
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  animate={{ rotate: showAll ? 180 : 0 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <path d="M3 4.5 6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
                {showAll ? 'Show fewer steps' : `Show ${hiddenCount} earlier ${hiddenCount === 1 ? 'step' : 'steps'}`}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function StepRow({ step, isLast }: { step: AgentStep; isLast: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '16px minmax(0, 1fr) 44px auto',
        columnGap: 10,
        alignItems: 'center',
        minHeight: 34,
        padding: `6px 0 ${isLast ? 6 : 10}px`,
      }}
    >
      {!isLast && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 7.5,
            top: 20,
            bottom: 0,
            width: 1,
            backgroundColor: 'var(--border-default)',
          }}
        />
      )}

      <StepMarker status={step.status} />

      <span
        style={{
          minWidth: 0,
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--medium)',
          lineHeight: 1.2,
          color: 'var(--text-ink)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {step.label}
      </span>

      <span
        style={{
          fontSize: '10px',
          lineHeight: 1,
          color: 'var(--text-muted-500)',
          fontVariantNumeric: 'tabular-nums',
          textAlign: 'right',
        }}
      >
        {displayStepTime(step.time)}
      </span>

      <span style={badgeStyle(step.status)}>
        {statusLabel(step.status)}
      </span>
    </div>
  )
}

function StepMarker({ status }: { status: AgentStep['status'] }) {
  if (status === 'done') {
    return (
      <span
        aria-hidden
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: 'var(--text-emerald)',
          color: 'var(--text-white)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <svg width={8} height={8} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2.5 6 5 8.5 9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    )
  }

  if (status === 'active') {
    return (
      <span
        aria-hidden
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '2px solid var(--bg-teal)',
          backgroundColor: 'var(--bg-white)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 0 0 3px var(--bg-teal-12)',
        }}
      >
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-teal)',
          }}
        />
      </span>
    )
  }

  return (
    <span
      aria-hidden
      style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-white)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: 'var(--text-muted-400)',
        }}
      />
    </span>
  )
}

function badgeStyle(status: AgentStep['status']) {
  if (status === 'done') {
    return {
      ...baseBadgeStyle,
      border: '1px solid transparent',
      backgroundColor: 'var(--bg-emerald-tint)',
      color: 'var(--text-emerald)',
    }
  }

  if (status === 'active') {
    return {
      ...baseBadgeStyle,
      border: '1px solid transparent',
      backgroundColor: 'var(--bg-teal-12)',
      color: 'var(--text-teal)',
    }
  }

  return {
    ...baseBadgeStyle,
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--bg-white)',
    color: 'var(--text-mid)',
  }
}

function statusLabel(status: AgentStep['status']) {
  if (status === 'done') return 'Done'
  if (status === 'active') return 'Running'
  return 'Pending'
}

function displayStepTime(time: string) {
  return time === '--' || !time.trim() ? '\u2014' : time
}

const baseBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 70,
  height: 26,
  padding: '0 10px',
  borderRadius: 999,
  fontSize: '10px',
  fontWeight: 'var(--medium)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  flexShrink: 0,
} as const
