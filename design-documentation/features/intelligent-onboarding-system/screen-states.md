---
title: Onboarding Screen States
description: Default, loading, error, and success states with Tailwind recipes.
feature: Intelligent Onboarding System
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

## Default
- Container: `container mx-auto px-4 md:px-6 lg:px-8`
- Card: `bg-white rounded-lg shadow p-6 md:p-8`
- Progress: `h-2 bg-gray-100 rounded` with inner `bg-violet-600`

## Loading
- `animate-pulse` on skeleton lines; avoid spinner alone

## Error
- Alert: `bg-rose-50 text-rose-700 border border-rose-200 rounded-md p-4`

## Success
- Transition to plan preview with `duration-300 ease-out`
