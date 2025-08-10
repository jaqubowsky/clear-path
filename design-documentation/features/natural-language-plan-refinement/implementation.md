---
title: Refinement Implementation Notes
description: Developer guidance for NL refinement and diffing.
feature: Natural Language Plan Refinement
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - README.md
  - screen-states.md
dependencies:
  - OpenAI API, plan versioning store
status: draft
---

# Implementation Notes

- Maintain last 5 versions; compute diffs at module/section level.
- Ask clarifying questions if intent score low; show before executing.
- Use `packages/ui` Diff, Badge, Button, Dialog components.
