# Feature: Plan Persistence (Supabase)

## 1. Overview
Stores and retrieves each user’s plan in Supabase with strict Row Level Security. Ensures a single active plan per user in v1 and supports archiving/replacement on regeneration. Enables granular updates at the task/module level.

## 2. User Stories
- **As a user**, I want my plan to be saved and reloadable so that I can pick up where I left off.
- **As a user**, I want only my account to access my plan so that my data stays private.

## 3. Functional Requirements
- The system must save generated plans and allow retrieval by the authenticated owner.
- The system must enforce a single active plan per user (archive previous on regenerate).
- The system must allow granular updates (task/module completion) by the owner.
- The system must enforce RLS to prevent cross-user access.

## 4. Technical Implementation Plan

### Frontend:
- **Components:**
  - Reuse planner components; no additional UI surfaces beyond actions/queries.
- **State Management:**
  - React Query to fetch active plan and mutate updates; cache invalidation on write.
- **API Interactions:**
  - `plannerActions.savePlan(plan)` — transactional insert.
  - `plannerActions.getActivePlan()` — select with nested relations.
  - `plannerActions.archivePlan(planId)` — set `status='archived'`.

### Backend:
- **API Endpoints:**
  - N/A (use Supabase client RLS-protected CRUD from the browser; generation uses server boundary separately).
- **Service Layer:**
  - `PlansRepository` (client): typed CRUD helpers.
- **Data Transfer Objects (DTOs):**
  - `PlanDbDto`, `ModuleDbDto`, `SubtopicDbDto`, `TaskDbDto` matching DB columns.

### Database:
- **Schema / Model:**
  - `plans (id, user_id, goal, target_date, summary, status, created_at, updated_at)`
  - `modules (id, plan_id, title, description, order, due_date, is_milestone, completed_at)`
  - `subtopics (id, module_id, title, description, order)`
  - `tasks (id, module_id, subtopic_id, title, description, order, estimated_minutes, resource_urls, rationale, due_date, completed_at)`
  - RLS policies: owner-only by `user_id`. Foreign key cascades for cleanup.
- **Critical Queries:**
  - Upsert plan and children in a single transaction; fetch nested active plan by `user_id`.

## 5. Acceptance Criteria
- **Scenario:** Save and load active plan
  - **GIVEN** a user generates a plan
  - **WHEN** the app persists it
  - **THEN** the user can reload the app and see the same plan.
- **Scenario:** Archive on regenerate
  - **GIVEN** a user regenerates a plan
  - **WHEN** persistence completes
  - **THEN** the previous active plan is archived and the new plan is set to active.
- **Scenario:** RLS enforcement
  - **GIVEN** a different user
  - **WHEN** they try to access another user’s plan
  - **THEN** access is denied by RLS.
