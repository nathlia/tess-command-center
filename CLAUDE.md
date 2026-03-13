# CLAUDE.md

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Stack

- React + TypeScript + Vite
- Tailwind CSS (configured with TESS tokens)
- Framer Motion
- shadcn/ui — only when it genuinely helps, not by default
- All data mocked — no backend, no auth

## Project Structure

```
tess-command-center/
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css                  # Tailwind directives + imports design-tokens.css
    ├── assets/
    │   └── design-tokens.css      # TESS design tokens — single source of truth
    ├── components/
    │   ├── ui/                    # Primitive shared components
    │   │   ├── StatusDot.tsx
    │   │   ├── ProgressRing.tsx
    │   │   ├── ModelBadge.tsx
    │   │   └── Badge.tsx
    │   ├── AgentCard.tsx
    │   ├── AgentFeed.tsx
    │   ├── ActivityLog.tsx
    │   └── QuickPrompt.tsx
    ├── hooks/
    │   └── useAgentSimulation.ts
    ├── data/
    │   └── mockAgents.ts
    └── types/
        └── agent.ts
```

## Design System

**Theme:** White base — TESS uses white as its primary surface. The one exception is the `ActivityLog` panel, which uses a dark surface (`--bg-ink` / `--bg-black`) as a deliberate contrast block, mirroring how TESS itself uses dark sections for high-density content.

**Font:** `Plus Jakarta Sans` — always, no fallback to system fonts.

**Tokens:** All colors come from `src/assets/design-tokens.css` via CSS variables. Never hardcode hex values.

Key tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-white` | `#ffffff` | Primary background |
| `--bg-off-white` | `#fafafa` | Cards, panels |
| `--bg-warm` | `#f4f2ef` | Warm section backgrounds |
| `--bg-teal` | `#0f4c5c` | Brand primary — CTAs, active states |
| `--bg-purple` | `#3f2d6f` | Brand accent — badges, highlights |
| `--text-ink` | `#111827` | Primary text |
| `--text-mid` | `#6b7280` | Secondary/muted text |
| `--text-emerald` | `#059669` | `done` status |
| `--text-amber` | `#d97706` | `thinking` status |
| `--border-default` | `#e5e7eb` | Card borders on white |

## Component Rules

- `App.tsx` — layout and composition only, no logic
- Components are purely presentational — no simulation logic inside them
- Shared primitives go in `components/ui/`
- State and simulation logic belong in `hooks/`
- Colors via CSS variables, spacing via Tailwind
- Keep files focused — no giant components

## Types

```ts
type AgentStatus = 'thinking' | 'executing' | 'done'

interface Agent {
  id: string
  name: string
  model: string        // e.g. 'GPT-4', 'Claude 3.5', 'Gemini Pro'
  status: AgentStatus
  progress: number     // 0–100
  currentTask: string
  logs: LogEntry[]
}

interface LogEntry {
  id: string
  timestamp: string
  message: string
}
```

## Simulation Rules (`useAgentSimulation`)

- Advances agent states over time via `setInterval`
- Appends log lines incrementally
- Updates progress values
- Accepts a new prompt and injects it into the target agent's flow
- Keeps simulation logic fully decoupled from components

Believable log lines:
- `"Parsing request context"`
- `"Selecting retrieval strategy"`
- `"Calling external knowledge tool"`
- `"Synthesizing answer draft"`
- `"Execution completed"`
