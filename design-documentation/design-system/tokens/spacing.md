---
title: Spacing & Layout Tokens
description: Spacing scale, radii, containers, and layout guidance via Tailwind utilities.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - ../../assets/design-tokens.json
  - ../style-guide.md
dependencies:
  - Tailwind spacing, container, radius
status: draft
---

# Spacing & Layout Tokens

## Base Unit
- 4px (Tailwind `1` = 0.25rem)

## Scale
- xs: 1 (0.25rem)
- sm: 2 (0.5rem)
- md: 4 (1rem)
- lg: 6 (1.5rem)
- xl: 8 (2rem)
- 2xl: 12 (3rem)
- 3xl: 16 (4rem)

## Radius
- sm: `rounded`
- md: `rounded-md`
- lg: `rounded-lg`
- xl: `rounded-xl`
- full: `rounded-full`

## Shadow
- sm/md/lg via Tailwind `shadow-*`; elevation maps to component hierarchy.

## Grid & Containers
- 12-col desktop heuristic; Tailwind `container mx-auto px-4 md:px-6 lg:px-8`.
