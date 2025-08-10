---
title: Design Tokens Overview
description: Master reference for ClearPath design tokens and Tailwind mappings.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - colors.md
  - typography.md
  - spacing.md
  - animations.md
  - ../../assets/design-tokens.json
dependencies:
  - Tailwind CSS theme configuration
status: draft
---

# Design Tokens Overview

Tokens define the canonical design values and map 1:1 to Tailwind theme keys. Keep `assets/design-tokens.json` synchronized to Tailwind configs in `apps/*` and `packages/ui`.

## Token Categories
- Colors: Brand, semantic, neutral
- Typography: Fonts, sizes, weights, line-heights, letter-spacing
- Spacing: Scale, radii, shadows
- Motion: Durations, easings

## Tailwind Mapping
- Colors → `theme.colors`
- Typography → `theme.fontFamily`, `theme.fontSize`
- Spacing → `theme.spacing`, `theme.borderRadius`, `theme.boxShadow`
- Motion → `theme.transitionDuration`, `theme.transitionTimingFunction`

See detailed specs:
- [colors.md](colors.md)
- [typography.md](typography.md)
- [spacing.md](spacing.md)
- [animations.md](animations.md)
