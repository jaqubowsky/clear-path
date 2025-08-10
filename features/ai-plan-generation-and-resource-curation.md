# Feature: AI Plan Generation & Resource Curation

## 1. Overview
Generates a structured learning plan (modules, subtopics, tasks, milestones) tailored to a user’s onboarding inputs. Curates reputable resources with short rationales, validates output against a domain-agnostic schema, and gracefully falls back to a generic blueprint when coverage is limited.

## 2. User Stories
- **As a user**, I want the app to generate a structured plan with recommended resources and short rationales so that I can follow a clear roadmap.
- **As a user**, I want the plan to respect my inputs (skills, goals, time) so that it matches my constraints.
- **As a user**, I want errors to be handled gracefully with retry/regenerate so that I can still proceed.

## 3. Functional Requirements
- The system must accept a normalized onboarding payload and produce a plan with modules → subtopics → tasks and optional milestones.
- The system must validate output with Zod and reject malformed plans.
- The system must include curated resource links per task where possible, each with a 1–2 sentence rationale.
- The system must switch to a fallback blueprint when coverage is weak and flag limited curation in the summary.
- The system must support regenerate with idempotent updates.

## 4. Technical Implementation Plan

### Frontend:
- **Components:**
  - `apps/web/src/features/planner/components/generate-plan-button.tsx`
  - `apps/web/src/features/planner/components/plan-summary.tsx`
  - `apps/web/src/features/planner/components/regenerate-plan-dialog.tsx`
- **State Management:**
- React Query for `generatePlan`, `regeneratePlan`, and plan persistence calls.
- **API Interactions:**
  - `plannerActions.generatePlan(onboardingPayload)` — requests generation and persists the plan.
  - `plannerActions.regeneratePlan(planId, scope?)` — replaces or updates sections.

### Backend:
- **Server Actions:** (No API routes or serverless functions)
  - `generatePlanAction(payload: PlanRequestDto): Promise<PlanResponseDto>` — generates a new plan from onboarding payload; persists and returns validated plan.
  - `validatePlanAction(plan: PlanResponseDto): Promise<PlanResponseDto>` — optionally validate client-side edits against schema.
- **Service Layer:**
  - `PlanService` (server): prompt templates, OpenAI call with function-calling/JSON mode, Zod validation, fallback blueprint logic, and rationale generation rules.
- **Data Transfer Objects (DTOs):**
  - `PlanRequestDto` — `{ goal: string; weeklyHours: number; level: string; focus?: string[]; targetDateDays?: number; preferredFormat?: "reading"|"hands_on"|"hybrid" }`
  - `PlanResponseDto` — `{ planId: string; modules: ModuleDto[]; summary: string; flags?: { limitedCuration?: boolean } }`
  - `ModuleDto` — `{ id?: string; title: string; description?: string; order: number; dueDate?: string; isMilestone?: boolean; completedAt?: string|null; subtopics?: SubtopicDto[]; tasks?: TaskDto[] }`
  - `SubtopicDto` — `{ title: string; description?: string; order: number }`
  - `TaskDto` — `{ title: string; description?: string; order: number; estimatedMinutes?: number; resourceUrls?: string[]; rationale?: string; dueDate?: string; completedAt?: string|null }`

### Database:
- **Schema / Model:**
  - `plans`: `id (uuid, pk)`, `user_id (uuid)`, `goal (text)`, `target_date (date, nullable)`, `summary (text)`, `status (text: active|archived)`, `created_at`, `updated_at`.
  - `modules`: `id (uuid, pk)`, `plan_id (uuid, fk plans)`, `title (text)`, `description (text)`, `order (int)`, `due_date (date, nullable)`, `is_milestone (bool)`, `completed_at (timestamptz, nullable)`.
  - `subtopics`: `id (uuid, pk)`, `module_id (uuid, fk modules)`, `title (text)`, `description (text)`, `order (int)`.
  - `tasks`: `id (uuid, pk)`, `module_id (uuid, fk modules)`, `subtopic_id (uuid, fk subtopics, nullable)`, `title (text)`, `description (text)`, `order (int)`, `estimated_minutes (int, nullable)`, `resource_urls (text[] , nullable)`, `rationale (text, nullable)`, `due_date (date, nullable)`, `completed_at (timestamptz, nullable)`.
  - RLS: owner-only access on all tables by `user_id` via joins.
- **Critical Queries:**
  - Insert plan with modules/subtopics/tasks in a single transaction.
  - Fetch active plan for current user with nested relations.
  - Archive existing active plan when generating a new one.

## 5. Acceptance Criteria
- **Scenario:** Valid plan generation
  - **GIVEN** a confirmed onboarding payload
  - **WHEN** plan generation is requested
  - **THEN** a schema-valid plan is created, persisted, and a summary is shown.
- **Scenario:** Fallback blueprint
  - **GIVEN** domain coverage is weak
  - **WHEN** generation runs
  - **THEN** a generic blueprint is produced and the UI flags limited curation.
- **Scenario:** Regenerate
  - **GIVEN** a user requests regenerate
  - **WHEN** the action completes
  - **THEN** the existing active plan is replaced (or scoped sections updated) and archived accordingly.
