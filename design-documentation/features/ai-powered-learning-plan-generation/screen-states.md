---
title: Plan Generation Screen States
description: Loading, success, and error treatments using Tailwind utilities.
feature: AI-Powered Learning Plan Generation
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - README.md
  - implementation.md
dependencies:
  - packages/ui components
status: draft
---

# Screen States

## Loading
- Skeleton for module cards; progress bar with estimated time

## Success (Preview)
- Module Card: `bg-white rounded-lg border p-4 flex flex-col gap-3`
- Chips: `inline-flex items-center rounded-full px-2 py-1 text-xs`

## Error
- Retry CTA; show debug info lightly for advanced users
