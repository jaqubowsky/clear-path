---
title: Motion & Animation Tokens
description: Durations, easings, and motion guidance mapped to Tailwind utilities.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - ../../assets/design-tokens.json
  - ../style-guide.md
dependencies:
  - Tailwind transition tokens
status: draft
---

# Motion & Animation Tokens

## Durations
- micro: 150ms
- short: 200–300ms
- medium: 400–500ms
- long: 600–800ms

## Easing
- ease-out: cubic-bezier(0, 0, 0.2, 1)
- ease-in-out: cubic-bezier(0.4, 0, 0.6, 1)

## Usage
- Use Tailwind `transition`, `duration-200/300/500`, `ease-out/ease-in-out`.
- Respect `prefers-reduced-motion`.
