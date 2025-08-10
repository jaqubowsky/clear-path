# Feature: Plan View & Progress Tracking

## 1. Overview
Displays the user’s learning plan with clear hierarchy (modules → subtopics → tasks), allows marking tasks complete, auto-completes modules when all tasks are done, and visualizes overall progress. Highlights due dates and overdue work; persists state between sessions.

## 2. User Stories
- **As a user**, I want to view my plan and mark modules/tasks complete so that I can see my progress.
- **As a user**, I want to see progress bars and due dates so that I can manage pacing and priorities.

## 3. Functional Requirements
- The system must render modules with nested subtopics and tasks.
- The system must allow toggling task completion; modules auto-complete when all tasks are complete (manual toggle allowed).
- The system must display a progress bar (% modules complete; optionally tasks complete).
- The system must show due dates and highlight overdue items.
- The system must persist completion state across sessions.

## 4. Technical Implementation Plan

### Frontend:
- **Components:**
  - `apps/web/src/features/planner/components/plan-view.tsx`
  - `apps/web/src/features/planner/components/module-card.tsx`
  - `apps/web/src/features/planner/components/task-item.tsx`
  - `apps/web/src/features/planner/components/progress-bar.tsx`
- **State Management:**
  - React Query queries: `useActivePlan`, mutations: `useToggleTask`, `useToggleModule`.
  - Local UI state for expand/collapse.
- **API Interactions:**
  - `plannerActions.getActivePlan()` — fetch nested plan.
  - `plannerActions.toggleTask(taskId, completed)` — updates completion timestamp.
  - `plannerActions.toggleModule(moduleId, completed)` — manual override.

### Backend:
- **API Endpoints:**
  - N/A (direct Supabase CRUD via RLS-protected tables from the browser client).
- **Service Layer:**
  - `PlannerReadService` (client) for typed selects; `PlannerWriteService` (client) for updates with optimistic UI.
- **Data Transfer Objects (DTOs):**
  - `ToggleCompletionRequestDto` — `{ id: string; completed: boolean }` for tasks/modules.

### Database:
- **Schema / Model:**
  - Uses `plans`, `modules`, `subtopics`, `tasks` from plan generation feature.
  - Completion is represented by `completed_at` timestamps.
- **Critical Queries:**
  - Compute `% modules complete` and, optionally, `% tasks complete` efficiently (derive client-side from fetched data or SQL view if needed).

## 5. Acceptance Criteria
- **Scenario:** Toggle task completion
  - **GIVEN** a task is incomplete
  - **WHEN** the user toggles it complete
  - **THEN** the task shows as completed and persists on reload.
- **Scenario:** Auto-complete module
  - **GIVEN** all tasks in a module are complete
  - **WHEN** the last task is marked complete
  - **THEN** the module auto-completes (timestamp set) while still allowing manual override.
- **Scenario:** Overdue highlight
  - **GIVEN** a module/task due date is past
  - **WHEN** the plan is displayed
  - **THEN** the item is highlighted as overdue.
