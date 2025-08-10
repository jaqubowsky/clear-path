---
title: Intelligent Onboarding System
description: UX specs for guided onboarding assessment and profile capture.
feature: Intelligent Onboarding System
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - ../../design-system/style-guide.md
  - ../../design-system/tokens/README.md
  - user-journey.md
  - screen-states.md
  - implementation.md
dependencies:
  - Supabase Auth, profiles schema
status: draft
---

# Intelligent Onboarding System

## Overview
Five-step onboarding capturing background, goals, skills, preferences, and availability. Max five steps; mobile-first.

## Acceptance Criteria
- Progress indicator, back navigation, optional skips
- Submit returns first plan within 30s (see Plan Generation feature)

## Primary Actions
- Continue, Back, Skip (where applicable), Submit

## Accessibility
- Keyboard-friendly, clear labels, error text; focus management between steps

## Related
- [User Journey](user-journey.md)
- [Screen States](screen-states.md)
- [Implementation](implementation.md)
