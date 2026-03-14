# TESS Command Center - Live Plan

## Doc Map

- `docs/PRODUCT.md` - overall product story, V1 to V2, target experience
- `docs/PROGRESS.md` - implementation history, milestones, and key decisions
- `docs/PLAN.md` - current execution state and next actions
- `docs/brief.md` - original challenge brief

---

## V3 — Feed Polish & Status System

Reference: `docs/refs/agent-dashboard-v5.html`

### Goal

Improve the card layout and visual polish, add real status logic (7 statuses), group agents by chat, and add filter tabs with counts. Keep the existing shell, drag/resize panels, and right panel untouched.

### Out of scope

- Inline question block for needs-input agents
- Right panel detail view redesign
- Rail navigation changes
- Any backend / real data

---

## V3 Step Checklist

Ordered easiest → hardest.

### Step 1 — Card layout & design `[card]`
**What:** Rebuild `SidebarAgentCard` to match the v5 card layout.
- Header row: icon (34×34 rounded) + name + model badge + status badge (right)
- Context bar: label "CONTEXT" + 3px progress track (colored by status) + percentage
- Meta row: archetype/role (left) + elapsed + token count (right, monospace)
- Snippet section: status label (THINKING / EXECUTING / STALLED / WAITING / ERROR / PAUSED) + 2-line text with animated cursor for live/thinking
- Footer: "View details →" link (left) + status action button (right)
- Done card: compact horizontal row — icon + name + task + status badge + elapsed + tokens. No snippet, no context bar.
- Card border-radius 14px, hover lift, staggered entrance animation

**Files:** `src/components/sidebar/SidebarAgentCard.tsx`

**Status:** pending

---

### Step 2 — Status expansion `[types]`
**What:** Expand `AgentStatus` from 3 to 7 values and update all status-dependent styling.
- New type: `'live' | 'stalled' | 'needs-input' | 'error' | 'paused' | 'done' | 'cancelled'`
- Map old `thinking → live`, `executing → live`, keep `done`
- Per-status card treatment: pulsing teal bg (live), amber pulse (stalled), purple pulse (needs-input), red border (error), opacity 0.72 (paused), opacity 0.5 (cancelled)
- Per-status badge color and icon
- Per-status snippet label
- Per-status footer action: pause (live/stalled), resume (paused), retry (error), cancel (active)

**Files:** `src/types/agent.ts`, `src/components/sidebar/SidebarAgentCard.tsx`, `src/index.css` (pulse keyframes)

**Status:** pending

---

### Step 3 — Mock data update `[data]`
**What:** Add `chat` field to agents and distribute across named chats with varied statuses.
- Add `chat: { id: string; name: string; time: string }` to `Agent` interface
- Add `snippet?: string` field (current activity text shown in card body)
- Distribute 6+ agents across 2–3 chats (e.g. "Q1 Market Analysis", "Product Roadmap", "Support Backlog")
- Give each agent a distinct status — include at least one each of: live, stalled, needs-input, error, paused, done
- Update `useAgentSimulation` status transitions to use new 7-value enum

**Files:** `src/types/agent.ts`, `src/data/mockAgents.ts`, `src/hooks/useAgentSimulation.ts`

**Status:** pending

---

### Step 4 — Filter bar with counts `[filter]`
**What:** Replace `FeedTabs` with a new `AgentFilterBar` component matching v5's filter bar.
- Tabs: All · Running · Needs Input · Stalled · Error · Paused · Completed
- Count badge on each tab, only render tab if count > 0
- Active tab: solid background + bold text; Needs Input → purple, Stalled → amber, Error → red
- Search input on the right (live filter by name or currentTask)
- "Completed" tab counts both `done` and `cancelled`

**Files:** `src/components/feed/AgentFilterBar.tsx` (new), update `AgentsPanel` to wire state

**Status:** pending

---

### Step 5 — Chat grouping in feed `[grouping]`
**What:** Group agents by chat in the agents panel grid.
- Section header per chat: name + "·" + time
- Active agents in a responsive grid (`repeat(auto-fill, minmax(340px, 1fr))`)
- Done/cancelled agents in a compact done-row below the grid
- Grouping respects current filter — if filter = "Running", show only running agents still grouped by chat (hide empty groups)
- Header stats pills: "N Running · M Need attention · Z Done · W Paused" (only show non-zero)

**Files:** `src/components/sidebar/AgentsPanel.tsx`, `src/components/feed/FeedHeader.tsx`

**Status:** pending

---

## Previous Milestones (V1–V2)

- [x] Phase 1 proof of concept shipped
- [x] Phase 2 shell mounted as the main app entry
- [x] Right context panel mounted and wired
- [x] Shell realigned to icon rail + Agents column + feed + right context panel
- [x] Responsive one-pane / two-pane / three-pane behavior implemented
- [x] Middle and right detail panels are closable
- [x] Resize handles are visually refined and collapse on drag threshold
- [x] Collapsed panels remain recoverable through visible edge stubs
- [x] Feed and detail tab state stay controlled across close/reopen
- [x] Accessibility pass completed for the mounted shell

## Open (non-V3)

- README still incomplete
- Voice-input unsupported-browser behavior needs manual browser verification
- Final visual alignment against TESS refs needs a last pass

## Done Criteria (V3)

- Cards match v5 visual layout: header / context bar / meta / snippet / footer
- 7 statuses render with correct colors, badges, pulse animations
- Agents are grouped by chat in the panel
- Filter bar tabs show live counts and filter the grid
- Search input filters by name/task
- Done cards render as compact rows
- `npm run build` and `npm run lint` still pass
