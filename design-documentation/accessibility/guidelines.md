---
title: Accessibility Guidelines
description: Accessibility standards and requirements (WCAG 2.1 AA) for ClearPath.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - ../design-system/style-guide.md
  - ../design-system/tokens/colors.md
dependencies:
  - WCAG 2.1 AA
status: draft
---

# Accessibility Guidelines

## Standards
- WCAG 2.1 AA minimum
- Keyboard operability, focus visible, logical tab order
- Screen reader support with semantic HTML and ARIA where needed

## Color & Contrast
- 4.5:1 normal text, 3:1 large
- Use Tailwind `ring-*` focus indicators by default

## Motion
- Honor `prefers-reduced-motion`

## Forms
- Associate labels, helpful error text, clear validation messages

## Testing
- Use axe, Lighthouse, and keyboard-only tests per feature
