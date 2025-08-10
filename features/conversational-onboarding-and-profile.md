# Feature: Conversational Onboarding & Profile

## 1. Overview
Guides authenticated users through a short chat-style intake to capture goal, time availability, current level, focus areas/constraints, target date, and preferred learning format. Provides quick-reply chips, free text, progress persistence, summary confirmation, and a minimal form fallback when extraction confidence is low.

## 2. User Stories
- **As an authenticated user**, I want a natural-language conversation that captures my inputs without a long form so that onboarding is fast and engaging.
- **As a user**, I want domain-agnostic goal handling so that I can state any learning goal and still receive a useful plan.
- **As a user**, I want a graceful fallback when extraction confidence is low so that I can still proceed via a minimal form.

## 3. Functional Requirements
- The system must require an authenticated session to start onboarding.
- The system must ask up to 4–6 questions with quick-reply chips and free text.
- The system must elicit: goal (required), weekly time (required), current level (required), optional focus/constraints, optional target date, optional preferred learning format.
- The system must validate preferred learning format as one of: Reading, Hands-on, Hybrid.
- The system must persist conversation state and support resume on refresh.
- The system must provide a summary confirmation step prior to plan generation and allow inline edits.
- The system must surface a minimal form fallback when extraction confidence is low or upon user request.

## 4. Technical Implementation Plan

### Frontend:
- **Components:**
  - `apps/web/src/features/onboarding/components/chat-intake.tsx`
  - `apps/web/src/features/onboarding/components/message-list.tsx`
  - `apps/web/src/features/onboarding/components/quick-replies.tsx`
  - `apps/web/src/features/onboarding/components/summary-confirmation.tsx`
  - `apps/web/src/features/onboarding/components/minimal-form-fallback.tsx`
- **State Management:**
  - Zustand store for UI conversation state (messages, typing indicator, selected quick replies).
  - React Query for server interactions (step evaluate, save state, confirm).
  - Auth guard via `auth-guard` component; block unauthenticated access.
- **API Interactions:**
  - `onboardingActions.evaluateStep(userInput)` — calls server boundary to extract/update state and produce next prompt.
  - `onboardingActions.saveDraft(state)` — persists state for resume.
  - `onboardingActions.confirm(state)` — finalizes, returning a normalized payload for plan generation.

### Backend:
- **Server Actions:** (No API routes or serverless functions)
  - `onboardingStepAction(input: OnboardingStepRequestDto): Promise<OnboardingStepResponseDto>` — evaluate one user turn; returns updated state, next prompt, and confidence.
  - `onboardingSaveDraftAction(state: OnboardingStateDto): Promise<void>` — upsert draft onboarding session state.
  - `onboardingConfirmAction(state: OnboardingStateDto): Promise<OnboardingStateDto>` — finalize and lock the onboarding payload.
- **Service Layer:**
  - `OnboardingService` (server): prompt templates, OpenAI call with JSON schema, confidence scoring, and normalization.
  - Input validation with Zod, mapping preferred format to enum: `"reading" | "hands_on" | "hybrid"`.
- **Data Transfer Objects (DTOs):**
  - `OnboardingStateDto` — `{ goal: string; weeklyHours: number; level: "beginner"|"intermediate"|"advanced"; focus?: string[]; targetDateDays?: number; preferredFormat?: "reading"|"hands_on"|"hybrid"; confidence: number; }`
  - `OnboardingStepRequestDto` — `{ message: string; state?: OnboardingStateDto }`
  - `OnboardingStepResponseDto` — `{ state: OnboardingStateDto; nextPrompt: string; quickReplies: string[] }`

### Database:
- **Schema / Model:**
  - `onboarding_sessions`: `id (uuid, pk)`, `user_id (uuid, fk auth.users)`, `state (jsonb)`, `status (text: draft|confirmed)`, `progress (int)`, `last_message_at (timestamptz)`, `created_at`, `updated_at`.
  - RLS: owner-only read/write by `user_id`.
- **Critical Queries:**
  - Upsert latest draft by `user_id`.
  - Fetch latest `status='confirmed'` payload to seed plan generation.

## 5. Acceptance Criteria
- **Scenario:** Auth-required onboarding
  - **GIVEN** an unauthenticated user opens onboarding
  - **WHEN** access is attempted
  - **THEN** they are redirected to sign-in.
- **Scenario:** Chat intake completion
  - **GIVEN** a user proceeds through the chat
  - **WHEN** required fields are captured in ≤ 6 turns (P95)
  - **THEN** a summary confirmation is shown with edit capability.
- **Scenario:** Low-confidence fallback
  - **GIVEN** extraction confidence is low
  - **WHEN** the system detects low confidence
  - **THEN** the minimal form fallback is presented and submission is accepted.
- **Scenario:** Resume on refresh
  - **GIVEN** a user refreshes mid-conversation
  - **WHEN** the app reloads
  - **THEN** the conversation state is restored from the last draft.
