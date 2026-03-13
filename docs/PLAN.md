# TESS Command Center - Live Plan

## Doc Map

- `docs/PRODUCT.md` - overall product story, V1 to V2, target experience
- `docs/PROGRESS.md` - implementation history, milestones, and key decisions
- `docs/PLAN.md` - current execution state and next actions
- `docs/brief.md` - original challenge brief

## Snapshot

- Last updated: 2026-03-13
- Product direction: TESS-native desktop command center with icon rail, Agents column, central feed, and right context panel
- Repo health: `npm run build` passes and `npm run lint` passes
- Current status: main shell is mounted and aligned; split pane is out of scope; spawn flow, README, and final polish remain

## Execution Steps

1. Stabilize the core shell and mount the V2 workspace. Status: done
2. Realign the UI to the TESS-native four-region structure. Status: done
3. Build `SpawnModal.tsx` and wire it to `spawnAgent`. Status: next
4. Remove or keep hidden any remaining split-related mounted UI paths. Status: next
5. Finish `README.md` with process notes and delivery notes. Status: pending
6. Do final visual polish and manual browser verification. Status: pending

## Step Checklist

- [x] Phase 1 proof of concept shipped
- [x] Phase 2 shell mounted as the main app entry
- [x] Right context panel mounted and wired
- [x] Shell realigned to icon rail + Agents column + feed + right context panel
- [ ] Spawn modal implemented
- [ ] Remaining split-pane UI path removed or hidden
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
- Interrupt action is removed from the mounted UI
- Split pane is intentionally not part of the deliverable anymore

## Next Up

1. Build `SpawnModal.tsx` and wire it to `spawnAgent`.
2. Remove or keep hidden any remaining split-related code paths in the mounted UI so the product surface matches scope.
3. Finish `README.md` with:
   - AI tools used
   - one UX decision and why
   - what would change with more time
4. Do final visual polish and a manual browser pass.

## Open Work

- Spawn flow still does not exist in the mounted app
- README is still incomplete
- Voice-input unsupported-browser behavior should still be manually verified in browser
- Final visual alignment against the TESS refs still needs a last pass

## Done Criteria

- `npm run build` passes
- `npm run lint` passes
- `npm run dev` loads the Phase 2 shell
- Desktop shell remains aligned to the current TESS-inspired structure
- Sidebar and right panel resize/collapse persist across refresh
- Spawn modal can create a mock agent and focus it in the shell
- Voice input fails gracefully on unsupported browsers
- README is complete
