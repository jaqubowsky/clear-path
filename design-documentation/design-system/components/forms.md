---
title: Form Components Specifications
description: Inputs, selects, textareas, validation and error patterns.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - ../../tokens/spacing.md
  - ../../tokens/typography.md
dependencies:
  - packages/ui Input, Select, Textarea, Checkbox, Radio
status: draft
---

# Form Components

## Inputs
- Base: `block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600`
- Error: `border-rose-300 text-rose-700` with helper text `text-rose-700`

## Selects
- Match input sizing; include chevron icon area `pr-8`

## Labels
- `text-sm font-medium text-gray-900` with `htmlFor`

## Help & Error Text
- `mt-1 text-xs text-gray-600` / `text-rose-700`
