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

## V2

### Structural pivot

V2 introduced the TESS-native shell:

- fixed icon rail
- dedicated Agents column
- central feed
- right context panel

The central feed stays focused on the selected agent. The right panel gives supporting context without taking over the main workflow. The left side makes it easier to scan and switch across agents.

### What V2 established

- the shell moved away from the earlier two-column prototype
- the app gained a real workspace hierarchy
- inspection surfaces such as skills, MCP, integrations, and context became first-class parts of the experience
- the layout direction became much closer to the TESS product language

## V3

### Current shipped version

V3 is the current delivered version of TESS Command Center. It keeps the V2 shell structure and turns it into a more stable, more readable, and more polished operator workspace.

### Interaction model

The current interaction model is progressive:

- default desktop state shows agent cards across the workspace
- selecting an agent opens the middle activity panel
- opening details reveals the right context panel
- collapsed panels stay recoverable through visible edge stubs or handles
- mobile uses one pane at a time instead of compressing the desktop shell

### Current workspace behavior

The implemented experience includes:

- browser-mode agent browsing across the full workspace
- agent cards grouped by chat for easier scanning
- browser filter bar with shared counts and search by name or task
- compact sidebar mode while the feed is open
- stable card treatment across running, paused, and done agents
- feed header with model and current-task context
- feed tabs for Activity, Output, Memory, and Files
- right-panel tabs for Skills, MCP, Integrations, and Context
- right-panel footer with agent stats and a compact step tracker
- left and right panel resize and collapse behavior on larger viewports

### Why V3 works

- It matches the product language from TESS references more closely.
- It creates clearer information hierarchy.
- It gives the main activity stream room to breathe.
- It supports richer inspection surfaces such as skills, MCP, integrations, and context.
- It feels more like a real operator workspace than a demo layout.
- It degrades cleanly from wide desktop to tablet to mobile without hiding the user in dead-end states.

## Current Scope

### In scope

- mock multi-agent simulation
- agent selection
- live feed and event stream
- model and provider visibility
- grouped agent browsing
- filter and search in browser mode
- feed tabs: Activity, Output, Memory, Files
- right-panel tabs: Skills, MCP, Integrations, Context
- left and right panel resize/collapse
- responsive 3/2/1 behavior with visible recovery stubs
- progressive 1/2/3-panel detail flow

### Product boundaries

This prototype intentionally does not include:

- real backend
- authentication
- production data persistence
- real tool integrations
- stop-agent execution controls

## Target Experience

The finished product should feel like an active TESS workspace where the user can monitor a team of agents, inspect one agent deeply, and issue new instructions without losing context.

At product level, done means:

- the shell structure is stable and visually coherent
- the layout works cleanly on desktop and mobile
- the simulation feels believable
- the user can inspect a selected agent in detail
- the delivery docs describe the shipped experience clearly
