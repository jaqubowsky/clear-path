---
title: Refinement Screen States
description: Input, processing, diff preview, and error states.
feature: Natural Language Plan Refinement
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - README.md
  - implementation.md
dependencies:
  - packages/ui diff components
status: draft
---

# Screen States

## Input
- Chat input: `rounded-lg border p-3` with examples dropdown

## Processing
- Inline skeleton where changes will appear

## Diff Preview
- Added: green accent; Removed: red accent; Modified: yellow accent

## Error
- Prompt to clarify or retry
