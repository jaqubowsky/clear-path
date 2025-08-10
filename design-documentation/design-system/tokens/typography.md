---
title: Typography Tokens
description: Font families, sizes, weights, and Tailwind mappings.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - ../../assets/design-tokens.json
  - ../style-guide.md
dependencies:
  - Tailwind font configuration
status: draft
---

# Typography Tokens

## Font Families
- primary: Inter, ui-sans-serif, system-ui, Segoe UI, sans-serif
- mono: JetBrains Mono, Consolas, ui-monospace, monospace

## Scale (Tailwind)
- h1: text-4xl md:text-5xl font-semibold
- h2: text-3xl md:text-4xl font-semibold
- h3: text-2xl md:text-3xl font-semibold
- h4: text-xl md:text-2xl font-semibold
- h5: text-lg font-medium
- body-large: text-base md:text-lg leading-7
- body: text-base leading-7
- body-small: text-sm leading-6
- caption: text-xs leading-5 text-gray-600
- label: text-xs font-semibold uppercase tracking-wide
- code: text-sm font-mono

## Responsive Guidance
- Prefer `clamp()` via Tailwind responsive modifiers.
