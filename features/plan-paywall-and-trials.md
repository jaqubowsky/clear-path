# Feature: Paywall & Trials (within Billing)

## 1. Overview
Implements the in-app paywall that clearly delineates free versus paid access. During the 7-day trial or with an active subscription, users unlock Modules 2+ and advanced features; without it, only Module 1 is fully accessible.

## 2. User Stories
- **As a user**, I want clear messaging about what’s free versus paid so that I understand how to unlock content.
- **As a user**, I want Module 1 fully unlocked while other modules are locked unless I start a trial or subscribe.

## 3. Functional Requirements
- The system must fully unlock Module 1 (all tasks/resources) for all users.
- The system must lock Modules 2+ and advanced features (e.g., refinements) for users without trial/subscription.
- The system must show resource rationales for Module 1 and titles-only with lock indicators for locked modules.
- The system must update lock state immediately when entitlement status changes.

## 4. Technical Implementation Plan

### Frontend:
- **Components:**
  - `apps/web/src/features/billing/components/paywall.tsx` (shared with billing feature)
  - `apps/web/src/features/planner/components/module-lock-overlay.tsx`
- **State Management:**
  - React Query `useEntitlements` to drive gating and conditional rendering.
- **API Interactions:**
  - Read-only `billingActions.getEntitlements()` to determine gating.

### Backend:
- **Server Actions:**
  - Reuse `getEntitlementsAction()` from the billing feature to drive gating.
- **Service Layer:**
  - Rely on `BillingService` and `EntitlementsResponseDto`.
- **Data Transfer Objects (DTOs):**
  - `EntitlementsResponseDto` reused.

### Database:
- **Schema / Model:**
  - Uses `user_billing` table to determine access state.
- **Critical Queries:**
  - None beyond entitlement read.

## 5. Acceptance Criteria
- **Scenario:** Locked content when not entitled
  - **GIVEN** a user without trial/subscription
  - **WHEN** they view Modules 2+
  - **THEN** modules are locked with clear copy and CTA.
- **Scenario:** Unlock on trial/subscription
  - **GIVEN** a user starts a trial or subscribes
  - **WHEN** entitlement reconciliation runs on return from checkout or on app load
  - **THEN** Modules 2+ unlock without requiring a manual refresh.
