# Feature: Authentication & Sessions (Supabase OAuth)

## 1. Overview
Enables account creation and sign-in via Google and GitHub using Supabase Auth. Provides secure session persistence, sign-out, and route protection so only authenticated users can access the application beyond marketing pages. Ensures deep-link redirect after successful authentication and consistent session handling across refreshes.

## 2. User Stories
- **As a new user**, I want to sign in with Google or GitHub so that I can create an account and save my plans without managing passwords.
- **As a returning user**, I want my session to persist across refresh so that I don’t need to reauthenticate frequently.
- **As an unauthenticated visitor**, I want to be redirected to the sign-in page when I hit a protected route so that the app remains secure.
- **As an authenticated user**, I want sign-out to clear my session and redirect me to the auth/landing page so that I know I’m logged out.

## 3. Functional Requirements
- The system must provide one-click sign-in with Google and GitHub only (no email/password).
- The system must securely persist sessions across refreshes.
- The system must protect all app routes except marketing and redirect unauthenticated users to the sign-in page.
- The system must return users to their original deep link after successful auth.
- The system must display clear error messages for authentication failures.
- The system must support sign-out that clears session state and redirects to the landing/auth page.

## 4. Technical Implementation Plan

### Frontend:
- **Components:**
  - `apps/web/src/features/authentication/components/provider-sign-in.tsx` (buttons for Google/GitHub)
  - `apps/web/src/features/authentication/components/sign-out-button.tsx`
  - `apps/web/src/features/authentication/components/auth-guard.tsx` (route protection wrapper)
  - `apps/web/app/auth/sign-in/page.tsx` (thin route that uses the feature components)
- **State Management:**
  - Session is sourced from Supabase Auth client (`@repo/supabase/browser`).
  - Create `apps/web/src/shared/auth/use-session.ts` hook for session, loading, and error states.
  - Minimal UI state (e.g., button loading) in local component state or a tiny Zustand store if shared.
- **API Interactions:**
  - Use Supabase client: `supabase.auth.signInWithOAuth({ provider })`, `supabase.auth.onAuthStateChange`, `supabase.auth.signOut()`.

### Backend:
- **API Endpoints:**
  - N/A (Supabase Auth SDK is called directly from the browser; RLS protects data access.)
- **Service Layer:**
  - `apps/web/src/shared/auth/session.ts`: helpers to read session, get user, and guard protected client flows.
- **Data Transfer Objects (DTOs):**
  - `AuthErrorDto`: `{ code: string; message: string }` for surfaced errors.

### Database:
- **Schema / Model:**
  - Users and sessions managed by Supabase Auth. No custom tables required for authentication.
- **Critical Queries:**
  - None. Rely on Supabase Auth session APIs and RLS for downstream tables.

## 5. Acceptance Criteria
- **Scenario:** Successful OAuth sign-in
  - **GIVEN** a user clicks “Continue with Google/GitHub”
  - **WHEN** the provider flow completes successfully
  - **THEN** the user is redirected back to the app and the session is established.
- **Scenario:** Authentication error
  - **GIVEN** an OAuth attempt fails
  - **WHEN** the app receives an error
  - **THEN** an error banner appears and the user can retry.
- **Scenario:** Route protection and deep link
  - **GIVEN** an unauthenticated user opens a protected deep link
  - **WHEN** they complete sign-in
  - **THEN** they are redirected back to the originally requested route.
- **Scenario:** Sign-out
  - **GIVEN** an authenticated user clicks “Sign out”
  - **WHEN** the action completes
  - **THEN** the session is cleared and the user is redirected to the auth/landing page.
