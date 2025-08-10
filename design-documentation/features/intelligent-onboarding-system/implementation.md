---
title: Onboarding Implementation Notes
description: Developer guidance for building onboarding with shadcn + Tailwind.
feature: Intelligent Onboarding System
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - ../../design-system/style-guide.md
  - ../../design-system/tokens/README.md
dependencies:
  - packages/ui (form inputs, button, progress)
status: draft
---

# Implementation Notes

- Use `packages/ui` components: Button, Input, Select, Textarea, Progress, Card, Alert.
- Multi-step form state via URL param or client state; preserve entries when navigating back.
- Validation with Zod; real-time error display below fields.
- Submit triggers plan generation action; show skeleton while waiting.
