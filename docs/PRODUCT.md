# TESS Command Center - Product

## Overview

TESS Command Center is a real-time operational workspace for monitoring AI agents while they work. The product goal is not to show static analytics. It is to make agent activity visible, understandable, and controllable in a way that feels native to TESS.

## Overall Goal

Users should be able to:

- see multiple agents working at once
- understand what a selected agent is doing right now
- inspect output, memory, files, and context around that work
- send a quick instruction to a selected agent
- understand which provider and model are being used

## Product Principles

- Show live work, not just final output.
- Feel like an operator workspace, not a generic dashboard.
- Stay visually aligned with TESS:
  - light surfaces
  - restrained accents
  - strong typography
  - subtle borders over heavy chrome
- Keep the UI component-based and reusable.
- Prefer believable simulation and interaction over placeholder screens.

## V1

### Original concept

V1 was a two-column control room:

- left column: agent feed
- right column: dark activity log
- quick prompt anchored under the log

The point of V1 was to prove the core idea quickly:

- multiple active agents
- live activity updates
- agent selection
- quick operator prompt
- visible model indicator

### What V1 proved

- The core workflow was valid.
- The simulation could feel alive with mock data.
- The app already satisfied the original challenge requirements at a basic level.

### Why V1 was not enough

- It looked too much like a prototype and not enough like TESS.
- The dark log panel became the visual identity of the screen even though TESS is mostly light.
- It did not create a real workspace structure for context, memory, and side tools.
- It was good as a proof of concept, but not as the final product direction.

## V2

### Current direction

V2 is the TESS-native shell:

- fixed icon rail
- dedicated Agents column
- central feed
- right context panel

The central feed stays focused on the selected agent. The right panel gives supporting context without taking over the main workflow. The left side makes it easier to scan and switch across agents.

The current interaction model is progressive:

- default state shows the agent cards across the full workspace
- selecting an agent opens the middle activity panel
- `See details` opens the right context panel
- collapsed panels stay recoverable through visible edge stubs
- mobile uses one pane at a time instead of trying to preserve the desktop layout

### Why V2 is better

- It matches the product language from TESS references more closely.
- It creates clearer information hierarchy.
- It gives the main activity stream room to breathe.
- It supports richer inspection surfaces such as skills, MCP, integrations, and context.
- It feels more like a real operator workspace than a demo layout.
- It degrades more cleanly from wide desktop to tablet to mobile without hiding the user in dead-end states.

## Current Scope

### In scope

- mock multi-agent simulation
- agent selection
- live feed and event stream
- model and provider visibility
- feed tabs: Activity, Output, Memory, Files
- right-panel tabs: Skills, MCP, Integrations, Context
- left and right panel resize/collapse
- responsive 3/2/1 behavior with visible recovery stubs
- progressive 1/2/3-panel detail flow

### Out of scope

- real backend
- authentication
- production data persistence
- real tool integrations
- interrupt / stop-agent control

## Target Experience

The finished product should feel like an active TESS workspace where the user can monitor a team of agents, inspect one agent deeply, and issue new instructions without losing context.

At product level, "done" means:

- the shell structure is stable and visually coherent
- the layout works cleanly on desktop and mobile
- the simulation feels believable
- the user can inspect a selected agent in detail
- the final delivery docs explain the process and design decisions clearly
