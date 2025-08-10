---
title: ClearPath Style Guide
description: Comprehensive design system specs aligned to Tailwind CSS and shadcn components.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - tokens/README.md
  - ../accessibility/guidelines.md
  - ../../packages/ui
dependencies:
  - Tailwind CSS config in apps/* and packages/ui
status: draft
---

# ClearPath Style Guide

## Overview
Design system for ClearPath using Tailwind utilities and shadcn primitives. Tokens are mirrored in Tailwind theme and exported as JSON.

## Table of Contents
1. Color System
2. Typography System
3. Spacing & Layout System
4. Component Specifications
5. Motion & Animation System
6. Platform Adaptations (Web)

## 1. Color System
Primary brand uses violet/indigo spectrum for a learning-forward feel. All colors meet WCAG AA.

- Primary: violet-600 (#7C3AED)
- Primary Dark: violet-700 (#6D28D9)
- Primary Light: violet-100 (#EDE9FE)
- Secondary: indigo-600 (#4F46E5)
- Secondary Light: indigo-100 (#E0E7FF)
- Secondary Pale: indigo-50 (#EEF2FF)
- Success: emerald-600 (#059669)
- Warning: amber-600 (#D97706)
- Error: rose-600 (#E11D48)
- Info: sky-600 (#0284C7)
- Neutral 50–900: Tailwind gray scale

Refer to [tokens/colors.md](tokens/colors.md) for full palette.

## 2. Typography System
- Primary: Inter, system-ui, Segoe UI, sans-serif
- Monospace: JetBrains Mono, Consolas, monospace
- Weights: 300, 400, 500, 600, 700
- Type scale maps to Tailwind: `text-xs` → `text-7xl`. See [tokens/typography.md](tokens/typography.md).

## 3. Spacing & Layout System
Base unit: 4px. Tailwind spacing scale used (`p-*`, `m-*`, `gap-*`). Grid: 12-col desktop, responsive containers.
See [tokens/spacing.md](tokens/spacing.md).

## 4. Component Specifications
Components live in `packages/ui` using shadcn patterns. Start with buttons, forms, navigation, cards, modals. Each component documents variants, states, sizes, accessibility, and Tailwind class recipes.

## 5. Motion & Animation System
Use Tailwind `transition-*`, `animate-*`, and CSS variables for easing/duration; respect `prefers-reduced-motion`. See [tokens/animations.md](tokens/animations.md).

## 6. Platform Adaptations (Web)
- Progressive enhancement first
- Responsive from 320px to 4K
- Keyboard accessibility and semantic structure

## Implementation Notes
- Align tokens to Tailwind config in `packages/ui/tailwind.config` and app-level configs.
- Export tokens at `design-documentation/assets/design-tokens.json` and keep in sync.

## Last Updated
Initial draft.
