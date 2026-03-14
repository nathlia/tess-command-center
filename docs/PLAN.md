# TESS Command Center - Live Plan

## Doc Map

- `docs/PRODUCT.md` - overall product story, V1 to V2, target experience
- `docs/PROGRESS.md` - implementation history, milestones, and key decisions
- `docs/PLAN.md` - current execution state and next actions
- `docs/brief.md` - original challenge brief

---

## V3 - Feed Polish and Status System

Reference: `docs/refs/agent-dashboard-v5.html`

### Current direction

Keep the current shell, grouping model, and simulated data flow. Continue polishing the agents surface toward the v5 reference without forcing a large type-system rewrite before the UI is ready.

### What is done in repo

- [x] Browser-mode agent cards use one stable DOM structure across active, paused, and done states.
- [x] Browser-mode card snippet is locked to one line with ellipsis to avoid height jumps.
- [x] Open-activity sidebar cards support compact filtering with `all / running / paused / done`.
- [x] Selected agent stays visible in the sidebar even when the active filter would normally hide it.
- [x] Agents are grouped by chat in both browser mode and open-activity sidebar mode.
- [x] Browser-mode agents screen has a full filter bar with shared counts and search by name or task.
- [x] Browser-mode right-side activity stub was removed; selecting an agent opens the actual activity panel instead.
- [x] Feed header now carries model and current-task context so all feed tabs inherit the same summary line.
- [x] Open-activity sidebar cards show richer compact detail, including task and model context.
- [x] Resize handles have cleaner tooltip copy and no longer fight the collapse button as aggressively.
- [x] Right-panel footer is lighter: tighter metric cards, calmer steps list, last 3 steps by default, and reduced motion.

### What is intentionally not done yet

- [ ] 7-status domain model expansion is not implemented.
- [ ] Mock data and simulation still use the current 3-status model plus `paused`.
- [ ] Browser-mode completed agents are not split into a separate compact done row yet.
- [ ] Main filter system still uses `all / running / paused / done`, not the future expanded state set.

---

## Things To Do

### 1. Status system expansion

- Expand `AgentStatus` beyond `thinking | executing | done`.
- Introduce the future states needed by the v5 direction:
  - `live`
  - `stalled`
  - `needs-input`
  - `error`
  - `paused`
  - `done`
  - `cancelled`
- Update badges, card tone, snippet label, and footer actions for each state.

### 2. Mock data and simulation refresh

- Update `Agent` mock data so status variety matches the expanded state model.
- Keep chat grouping, but add clearer examples for attention states like stalled, error, and needs-input.
- Refresh `useAgentSimulation` so transitions reflect the new states instead of the current 3-status flow.

### 3. Browser-mode completed row treatment

- Once the status system is expanded, split completed work into a compact row below the active grid.
- Keep the current stable ordering rules so cards do not jump unexpectedly during active work.

### 4. Filter evolution

- Replace the current 4-state filter set with the final attention-driven filter bar.
- Add the future counts and labels for:
  - running
  - needs input
  - stalled
  - error
  - paused
  - completed
- Keep search and grouped rendering behavior from the current implementation.

### 5. Final visual QA

- Run a final pass against the TESS references for spacing, typography weight, and motion consistency.
- Manually verify resize/collapse behavior on tablet and desktop.
- Recheck footer density and side-panel hierarchy after the larger status work lands.

---

## Non-V3 Follow-ups

- README is still incomplete.
- Voice-input unsupported-browser behavior still needs manual browser verification.
- A final full visual alignment pass is still needed after the status-system work is complete.

---

## Build / Lint Expectations

- `npm run build` should pass after V3 polish changes.
- `npm run lint` should pass once the remaining pre-existing hook/ref issues outside this slice are resolved.
