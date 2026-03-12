# TESS Command Center — CLAUDE.md

## Project Overview

A React-based real-time dashboard for monitoring multiple AI agents simultaneously, built as a technical challenge for the TESS platform (tess.im). Deadline: 36 hours from start.

TESS is a corporate AI agent platform connecting to 270+ LLMs. This interface addresses the gap of real-time agent visibility.

## Stack

- **Framework**: React (Vite preferred)
- **Styling**: Tailwind CSS + custom CSS tokens from `tokens.css`
- **Animation**: Framer Motion
- **Components**: shadcn/ui (optional)
- **Data**: All mocked — no backend, no auth required

## Required Features

1. **Active Agent Feed** — cards per agent with: name, status (`thinking` / `executing` / `done`), visual progress indicator
2. **Real-time Activity Log** — elegant terminal style, showing live agent actions (mock with `setTimeout`/`setInterval`)
3. **Quick Prompt Input** — send new instructions to a specific agent
4. **LLM Model Indicator** — which model is behind each agent (GPT-4, Claude, Gemini, etc.)
5. **At least 1 surprising micro-interaction** — animation/transition/visual feedback that shows above-average aesthetic sensibility

## Design System

Font: `Plus Jakarta Sans`

Brand colors (from `tokens.css`):
- **Teal** (primary brand): `#0f4c5c` (`--bg-teal`)
- **Purple** (brand accent): `#3f2d6f` (`--bg-purple`)
- **Dark bg**: `#111827` (`--bg-ink`)
- **Deepest dark**: `#0a0a0a` (`--bg-black`)
- **Success/green**: `#059669` (`--text-emerald`)
- **Warning/amber**: `#d97706` (`--text-amber`)

Use the full `tokens.css` as the CSS variable source. Dark theme is preferred for the Command Center (matches terminal/ops aesthetic and aligns with TESS's dark sections).

## Evaluation Criteria

| Criterion | Weight |
|-----------|--------|
| Aesthetic sense — beautiful, cohesive, sophisticated UI | High |
| Speed with AI — functional delivery in 36h | High |
| UX decisions — choices make sense for the product context | High |
| Creativity — something surprising | Medium |
| Deliverability — runs locally without friction | Required |

## Deliverables

1. Working React app (runs with `npm install && npm run dev`)
2. Short document (README or Notion) covering:
   - Which AI tools were used and how
   - One UX decision and its rationale
   - What would be done differently with more time

## Rules

- AI usage is mandatory (Claude, Cursor, v0, Copilot, etc.)
- All data can be mocked
- No real backend needed
- No authentication needed
- React libraries are allowed freely

## File Structure (suggested)

```
tess-command-center/
├── CLAUDE.md
├── tokens.css          # TESS design tokens (source of truth for colors)
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── components/
    │   ├── AgentCard.tsx       # Individual agent card with status + progress
    │   ├── AgentFeed.tsx       # Grid/list of active agents
    │   ├── ActivityLog.tsx     # Terminal-style real-time log
    │   ├── QuickPrompt.tsx     # Input to send instructions to agents
    │   └── ModelBadge.tsx      # LLM indicator badge
    ├── hooks/
    │   └── useAgentSimulation.ts  # Mock data + simulation logic
    ├── data/
    │   └── mockAgents.ts       # Initial mock agent data
    └── types/
        └── agent.ts            # TypeScript types for Agent, LogEntry, etc.
```

## Key UX Notes

- The interface targets power users monitoring live AI workflows — density and clarity matter over simplicity
- Terminal log should auto-scroll to bottom but allow manual scroll-up without fighting the user
- Agent status transitions (thinking → executing → done) should be visually distinct and satisfying
- The "surprising micro-interaction" idea: typewriter effect on log entries, glowing pulse on active agents, or a particle trail when an agent completes a task
