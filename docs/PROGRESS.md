# TESS Command Center - Progress

## Snapshot

- Last updated: 2026-03-13
- Repo health: build and lint are green
- Current app state: V2 shell is mounted, responsive, panel-driven, and using recoverable panel stubs; README and final polish are still open

## Milestones

### 1. V1 concept

The project started as a fast proof of concept based on the original brief:

- agent feed
- live activity log
- quick prompt
- model indicator
- micro-interactions

This validated the core idea of making agent work visible in real time.

### 2. Pivot to V2

After reviewing TESS references and the style guide, the project moved away from the two-column dark-log layout and toward a more TESS-native workspace.

Main change:

- from: feed + dark terminal panel
- to: icon rail + Agents column + central feed + right context panel

### 3. Repo hardening

The app was stabilized so the Phase 2 shell could become the real entrypoint:

- build blockers removed
- lint blockers removed
- voice-input typing made build-safe
- panel resize logic hardened

### 4. Right context panel

The right panel was added as a real mounted surface with:

- Skills
- MCP
- Integrations
- Context
- agent stats
- step tracker

This turned the app from a single-feed prototype into a richer operator workspace.

### 5. Shell realignment

The desktop shell was reworked to match the current target structure:

- fixed icon rail
- dedicated Agents column
- central feed
- right context panel

The feed header was also simplified so it reads more like the TESS references and less like a prototype breadcrumb layout.

### 6. Responsive panel system

The shell was then reworked around a clearer interaction model:

- default view: agent cards
- click an agent card: open the middle activity panel
- click `See details`: open the right detail panel
- drag panels small enough: collapse them
- mobile: switch to a one-pane flow instead of squeezing desktop columns onto a phone

This pass also improved the resize-handle visuals and cleaned up the rail buttons so they feel less generic.

### 7. Workspace interaction rebuild

The panel model was rebuilt after the first responsive pass exposed dead ends and hidden-state bugs.

Main changes:

- default desktop view now uses full-width agent cards instead of an empty placeholder
- the agent list switches between browser mode and compact sidebar mode
- collapsed agents, activity, and details surfaces now stay recoverable through visible edge stubs
- feed and right-panel tabs are controlled so they do not reset on close/reopen
- resize handles now drag from the grip, show collapse feedback, and keep collapse as a separate action
- mobile uses an explicit screen stack with back navigation instead of hidden multi-column leftovers

## Key Decisions

### TESS over prototype

The project no longer optimizes for the original V1 layout. It now optimizes for a TESS-native shell and clearer workspace hierarchy.

### Component-based UI

Repeated UI structures were moved toward shared components and reusable primitives instead of repeated inline markup.

### Restrained color system

The UI moved away from hardcoded colorful surfaces and toward the design-token palette already defined in the repo.

### Interrupt removed

The interrupt action was removed from the mounted UI because it implied behavior that was not actually supported.

### Modality display simplified

The modality display no longer shows every possible modality at once. It now shows only the active/generated modality to reduce noise.

### Progressive disclosure over always-open panels

The app no longer assumes the middle and right panels must always be visible. The current model opens more detail only when the user asks for it, which makes the layout easier to understand on both desktop and mobile.

### Accessibility and cleanup pass

The mounted shell received a focused cleanup pass:

- better labels on controls
- tab semantics for feed and detail sections
- clearer closable panel behavior
- a correction to panel-resize direction logic

That cleanup also removed leftover paths that no longer matched product scope: `useSplitPane`, the old `Sidebar`, `InterruptButton`, and the unused `spawnAgent` branch in `useAgentSimulation`.

## Current Open Items

- README completion
- final visual polish
- manual browser verification of unsupported voice-input behavior
- manual browser QA across real desktop, tablet, and mobile viewport sizes
