# TESS Command Center - Live Plan

## Doc Map

- `docs/PRODUCT.md` - overall product story, V1 to V2, target experience
- `docs/PROGRESS.md` - implementation history, milestones, and key decisions
- `docs/PLAN.md` - current execution state and next actions
- `docs/brief.md` - original challenge brief

## Snapshot

- Last updated: 2026-03-13
- Product direction: TESS-native command center with cards-first default, recoverable panel stubs, and responsive 3/2/1 panel behavior
- Repo health: `npm run build` passes and `npm run lint` passes
- Current status: main shell is mounted, responsive, and using the rebuilt cards -> activity -> details flow; README and final polish remain

## Execution Steps

1. Stabilize the core shell and mount the V2 workspace. Status: done
2. Realign the UI to the TESS-native four-region structure. Status: done
3. Add the responsive panel behavior, closable detail flow, improved resize handles, and accessibility pass. Status: done
4. Finish `README.md` with process notes and delivery notes. Status: next
5. Do final visual polish and manual browser verification. Status: pending

## Step Checklist

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
- [ ] README completed
- [ ] Final polish and manual QA completed

## Done

- Vite + React + TypeScript scaffold is stable
- Design tokens are in place and mounted UI is using the TESS-style surfaces
- `App.tsx` is a thin wrapper around `useAgentSimulation`
- Desktop shell is realigned to four regions:
  - icon rail
  - Agents column
  - central feed
  - right context panel
- Interaction model now works as:
  - default: agent cards
  - card click: open middle activity panel
  - `See details`: open right detail panel
- Closed panels remain recoverable through visible edge stubs
- Feed supports:
  - Activity
  - Output
  - Memory
  - Files
- Right panel supports:
  - Skills
  - MCP
  - Integrations
  - Context
- Left and right panels support resize and collapse persistence
- Panels collapse when dragged past the collapse threshold
- Mobile uses a one-pane stack instead of desktop columns
- Feed and details tabs are controlled and restore per selected agent during the session
- Split, spawn, interrupt, and other dropped legacy paths are removed from the mounted code path

## Next Up

1. Finish `README.md` with:
   - AI tools used
   - one UX decision and why
   - what would change with more time
2. Do final visual polish and a manual browser pass.

## Open Work

- README is still incomplete
- Voice-input unsupported-browser behavior should still be manually verified in browser
- Final visual alignment against the TESS refs still needs a last pass
- Responsive behavior still needs a manual browser pass across real viewport sizes

## Done Criteria

- `npm run build` passes
- `npm run lint` passes
- `npm run dev` loads the Phase 2 shell
- Desktop shell remains aligned to the current TESS-inspired structure
- Sidebar and right panel resize/collapse persist across refresh
- Middle and right panels can be opened and closed cleanly
- Collapsed panels stay recoverable and do not disappear completely
- Mobile layout remains usable without forced multi-column compression
- Voice input fails gracefully on unsupported browsers
- README is complete
