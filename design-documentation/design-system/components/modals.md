---
title: Modal & Dialog Specifications
description: Overlays for confirmations, previews, and edits.
feature:
last-updated: 2025-08-10
version: 0.1.0
related-files:
  - ../../tokens/animations.md
dependencies:
  - packages/ui Dialog/Drawer
status: draft
---

# Modals & Dialogs

- Overlay: `fixed inset-0 bg-black/40 backdrop-blur-sm`
- Panel: `bg-white rounded-xl shadow-xl p-6 max-w-lg w-full`
- Motion: `duration-200 ease-out` scale/opacity
- Accessibility: focus trap, `aria-labelledby`, `aria-describedby`
