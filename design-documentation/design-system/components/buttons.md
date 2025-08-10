---
title: Button Specifications
description: Variants, sizes, and states for buttons using Tailwind + shadcn.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - ../../tokens/colors.md
  - ../../tokens/typography.md
dependencies:
  - packages/ui Button
status: draft
---

# Button Specifications

## Variants
- Primary: `bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-600`
- Secondary: `bg-indigo-50 text-indigo-700 hover:bg-indigo-100`
- Ghost: `bg-transparent hover:bg-gray-50`
- Destructive: `bg-rose-600 text-white hover:bg-rose-700`

## Sizes
- Sm: `h-9 px-3 text-sm`
- Md: `h-10 px-4 text-sm`
- Lg: `h-11 px-5 text-base`

## States
- Disabled: `opacity-50 pointer-events-none`
- Loading: left spinner + `aria-busy="true"`
- Focus: `ring-2 ring-offset-2`

## Usage
- One primary per view; prefer concise labels; include icons when helpful.
