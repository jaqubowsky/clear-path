# Feature: Natural-Language Plan Refinements (P1)

## 1. Overview
Allows users to request scoped tweaks to their plan using natural language (e.g., adjust pacing, swap resource formats). Produces a diff preview prior to applying changes and retains previous versions for rollback.

## 2. User Stories
- **As a user**, I want to ask for tweaks (scope, pacing, focus, resource format) so that the plan better fits my needs.
- **As a user**, I want a diff preview before applying changes so that I can confirm the update.

## 3. Functional Requirements
- The system must support limited refinement intents in v1: scope, pacing, focus, resource format.
- The system must show a diff preview before applying changes.
- The system must retain the previous version after applying changes.
- The system must be gated behind active trial or subscription when paywall is enabled.

## 4. Technical Implementation Plan

### Frontend:
- **Components:**
  - `apps/web/src/features/planner/components/refinement-input.tsx`
  - `apps/web/src/features/planner/components/refinement-diff-dialog.tsx`
- **State Management:**
  - React Query for `refinePlan` and `applyRefinement` mutations; local state for draft input.
- **API Interactions:**
  - `plannerActions.refinePlan(planId, instruction)` — requests a proposed diff.
  - `plannerActions.applyRefinement(planId, diff)` — applies accepted diff and creates a new version.

### Backend:
- **Server Actions:** (No API routes or serverless functions)
  - `refinePlanAction(planId: string, instruction: string): Promise<RefinementDiffDto>` — returns a proposed diff without applying it.
  - `applyRefinementAction(planId: string, diff: RefinementDiffDto): Promise<void>` — applies diff, persists new version, and archives previous snapshot.
- **Service Layer:**
  - `RefinementService` (server): classify intent, prompt for constrained regeneration of affected sections only, and compute structured diffs.
- **Data Transfer Objects (DTOs):**
  - `RefinementRequestDto` — `{ planId: string; instruction: string }`
  - `RefinementDiffDto` — `{ modulesAdded?: ModuleDto[]; modulesUpdated?: ModuleDto[]; modulesRemovedIds?: string[] }`

### Database:
- **Schema / Model:**
  - `plan_versions`: `id (uuid, pk)`, `plan_id (uuid)`, `version (int)`, `snapshot (jsonb)`, `created_at`.
  - `refinement_requests`: `id (uuid, pk)`, `plan_id (uuid)`, `instruction (text)`, `diff (jsonb)`, `created_at`.
  - Plans tables from core feature remain the source of truth for the active version.
- **Critical Queries:**
- Create new version row transactionally with applied diff; archive previous snapshot.

## 5. Acceptance Criteria
- **Scenario:** Request refinement
  - **GIVEN** a user enters a valid refinement instruction
  - **WHEN** the system processes it
  - **THEN** a diff preview is shown without modifying the active plan.
- **Scenario:** Apply refinement
  - **GIVEN** a user confirms the diff
  - **WHEN** the apply action completes
  - **THEN** the plan updates accordingly and the previous version is retained.
- **Scenario:** Paywall gating
  - **GIVEN** a user without trial/subscription
  - **WHEN** they attempt a refinement
  - **THEN** the action is blocked and a subscribe CTA is shown.
