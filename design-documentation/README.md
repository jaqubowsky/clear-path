---
title: ClearPath Design Documentation
description: Centralized UX/UI design system, tokens, and feature specifications for ClearPath.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - design-system/style-guide.md
  - design-system/tokens/README.md
  - accessibility/guidelines.md
dependencies:
  - ../packages/ui
status: draft
---

# ClearPath Design Documentation

## Overview
This repository documents the ClearPath design system and feature UX specifications. It is authored using the `ux-ui-designer` process and grounded in the product manager requirements. Styling is implemented with Tailwind CSS utility classes (no custom CSS class names). Shared UI components and the design system live in the monorepo `packages/ui` (shadcn-based).

## Table of Contents
- [Design System](design-system/style-guide.md)
- [Design Tokens](design-system/tokens/README.md)
- [Accessibility Guidelines](accessibility/guidelines.md)
- Features
  - [Intelligent Onboarding System](features/intelligent-onboarding-system/README.md)
  - [AI-Powered Learning Plan Generation](features/ai-powered-learning-plan-generation/README.md)
  - [Natural Language Plan Refinement](features/natural-language-plan-refinement/README.md)
  - [Progress Tracking and Motivation](features/progress-tracking-and-motivation/README.md)
  - [Resource Curation and Management](features/resource-curation-and-management/README.md)

## Implementation Notes
- Tailwind is the single source of truth for styling. Tokens map to Tailwind config theme values and are exported in `assets/design-tokens.json` for use across `apps/*` and `packages/*`.
- All shared components should be implemented and exported from `packages/ui`, leveraging shadcn primitives and Tailwind utilities.
- Use relative links to cross-reference between features and design system sections.

## Last Updated
Initial scaffolding created based on PM document and Tailwind + shadcn constraints.
