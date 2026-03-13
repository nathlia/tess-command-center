# TESS Command Center — Plan

## What We're Building

A real-time dashboard where users can see multiple AI agents working simultaneously. The goal is to make agent activity visible and interactive — something the TESS platform currently lacks.

It should feel like an operational control room, not a generic analytics dashboard.

## Required Features

- [x] **Agent feed** — grid of cards, each showing: name, status, progress, model in use
- [x] **Activity log** — terminal-style panel, live-updating, feels alive on load
- [x] **Quick prompt** — input to send a new instruction to a selected agent
- [x] **LLM indicator** — which model powers each agent (GPT-4, Claude, Gemini, etc.)
- [x] **Micro-interactions** — intentional, memorable, connected to the product

## Layout Decision

**Two-column split:**

```
┌─────────────────────┬──────────────────────┐
│                     │                      │
│   Agent Feed        │   Activity Log       │
│   (left, white)     │   (right, dark panel)│
│                     │                      │
│   [ Card ]          │  > Parsing context   │
│   [ Card ]          │  > Calling tool...   │
│   [ Card ]          │  > Synthesizing...   │
│   [ Card ]          │                      │
│                     │  ──────────────────  │
│                     │  [ Quick Prompt    ] │
└─────────────────────┴──────────────────────┘
```

- Left: agent cards on white/off-white background
- Right: dark panel for the terminal log — mirrors how TESS uses dark sections for high-density content
- Quick prompt anchored to the bottom of the right panel, clearly tied to the log context
- Selected agent card highlights and syncs the log to its activity

## Visual Direction

Based on tess.im:
- White base, never uniformly dark
- Dark panel is a deliberate contrast block — not the default surface
- Typography-forward: bold names, clean hierarchy, minimal decoration
- Cards are minimal — soft shadow or barely-there border, no heavy chrome
- Teal (`--bg-teal`) and purple (`--bg-purple`) used as accents only, never dominant
- Generous but purposeful spacing — not cramped, not airy

## Agents (mock data)

| Name | Model |
|------|-------|
| Research Agent | Claude 3.5 |
| Ops Analyst | GPT-4 |
| SQL Runner | Gemini Pro |
| Support Triage | Claude 3.5 |
| Content Synthesizer | GPT-4 |

## Status Semantics

| Status | Meaning | Color |
|--------|---------|-------|
| `thinking` | Inference in progress | Amber — `--text-amber` |
| `executing` | Active tool use / live work | Teal — `--bg-teal` |
| `done` | Completed | Emerald — `--text-emerald` |

## Micro-Interaction Ideas

Multiple interactions are fine — just make each one intentional:

- **Card selection** — selected agent card elevates and syncs the log panel to its activity
- **Progress ring** — animates smoothly on state transitions
- **Log lines** — stagger in with a subtle glow on the dark panel
- **Prompt dispatch** — brief "reroute / wake-up" animation on the target agent card
- **Status change** — card pulses once when transitioning between states

## Implementation Order

1. [x] Scaffold Vite + Tailwind + tokens setup
2. [x] Types and mock data
3. [x] `useAgentSimulation` hook
4. [x] `AgentCard` + `AgentFeed` (left column)
5. [x] `ActivityLog` (right dark panel)
6. [x] `QuickPrompt` (bottom of right panel)
7. [x] Agent selection — sync log to selected agent
8. [x] Micro-interactions
9. [ ] Polish — hover states, empty states, transitions

## Deliverable Checklist

- [x] Runs with `npm install && npm run dev`
- [x] All 5 features present
- [x] Simulation feels believable and dynamic
- [x] Micro-interactions feel intentional and polished
- [x] UI is visually aligned with TESS (white base, dark log panel, Plus Jakarta Sans, brand tokens)
- [ ] README covers: AI tools used, one UX decision, what would be improved
