# Development Tasks for Feature: Authentication & Sessions (Supabase OAuth)

## Backend Tasks

### Task: Implement Supabase browser client and env validation (`@repo/supabase/browser`)
- **Description:** Create the browser-safe Supabase client factory and environment validation in the shared `@repo/supabase` package as specified. Add Zod-based env checks for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and export a `supabaseBrowser()` function that returns a configured client. Ensure the package compiles and is consumable by `apps/web`.
- **Acceptance Criteria:**
  - [ ] `packages/supabase` exports `browser` entry with `supabaseBrowser()` as per spec.
  - [ ] Zod env validation throws on missing/invalid public env vars.
  - [ ] Client is initialized with URL and anon key; no server-only APIs used.
  - [ ] App (`apps/web`) can import and use `@repo/supabase/browser` without build errors.
- **Dependencies:** None
- **Estimated Effort:** M

---

### Task: Implement Supabase server client factory (`@repo/supabase/server`)
- **Description:** Create a server-side Supabase client factory that accepts cookie/header adapters (framework-agnostic), matching the spec. Provide a factory function that can be wired by `apps/web` Server Actions later. Do not import `next/headers` directly in the package.
- **Acceptance Criteria:**
  - [ ] `packages/supabase` exports `server` entry with a factory accepting adapters for auth/session.
  - [ ] No framework-specific imports in the package.
  - [ ] Example usage documented in JSDoc for how an app provides adapters.
  - [ ] Package builds and types check pass.
- **Dependencies:** "Backend: Implement Supabase browser client and env validation (`@repo/supabase/browser`)"
- **Estimated Effort:** M

---

### Task: Implement auth session helpers (`apps/web/src/shared/auth/session.ts`)
- **Description:** Implement helper functions to read the current session and user using `@repo/supabase/browser`, including typed return values and normalized error handling. Include functions like `getSession()`, `getCurrentUser()`, and a guard utility tailored for client flows.
- **Acceptance Criteria:**
  - [ ] `getSession()` returns `{ session, error }` with consistent types.
  - [ ] `getCurrentUser()` returns user or `null`; errors surfaced in a typed shape `{ code; message }`.
  - [ ] No direct API routes; all via Supabase SDK in browser.
  - [ ] Unit-level smoke tests or story usage prove basic behavior.
- **Dependencies:** "Backend: Implement Supabase browser client and env validation (`@repo/supabase/browser`)"
- **Estimated Effort:** S

---

## Frontend Tasks

### Task: Build Provider Sign-In buttons component (`provider-sign-in.tsx`)
- **Description:** Create `apps/web/src/features/authentication/components/provider-sign-in.tsx` with buttons for Google and GitHub. Wire each to `supabase.auth.signInWithOAuth({ provider })`. Include loading states and disabled states while redirecting.
- **Acceptance Criteria:**
  - [ ] Component renders two provider buttons (Google, GitHub).
  - [ ] Clicking a button triggers the respective OAuth flow.
  - [ ] Buttons show loading state and are disabled during initiation.
  - [ ] Errors are surfaced via a passed-in handler or local banner.
- **Dependencies:** "Backend: Implement Supabase browser client and env validation (`@repo/supabase/browser`)"
- **Estimated Effort:** S

---

### Task: Build Sign-Out button component (`sign-out-button.tsx`)
- **Description:** Create `apps/web/src/features/authentication/components/sign-out-button.tsx` that calls `supabase.auth.signOut()`, handles success and error states, and triggers a redirect to the auth/landing page on success.
- **Acceptance Criteria:**
  - [ ] Component calls `supabase.auth.signOut()` and handles errors.
  - [ ] On success, user is redirected to `/auth/sign-in` (or landing).
  - [ ] Button shows loading/disabled state during sign-out.
- **Dependencies:** "Backend: Implement Supabase browser client and env validation (`@repo/supabase/browser`)"
- **Estimated Effort:** S

---

### Task: Implement session hook (`use-session.ts`)
- **Description:** Create `apps/web/src/shared/auth/use-session.ts` that subscribes to `supabase.auth.onAuthStateChange`, exposes `{ session, user, status, error }`, and persists session across refreshes leveraging Supabase’s client session handling.
- **Acceptance Criteria:**
  - [ ] Hook provides `status: "loading" | "authenticated" | "unauthenticated"`.
  - [ ] Hook updates on auth state changes and cleans up subscriptions.
  - [ ] Errors surfaced with a typed `{ code; message }` shape.
  - [ ] Consumers can render based on `status` without flicker.
- **Dependencies:**
  - "Backend: Implement Supabase browser client and env validation (`@repo/supabase/browser`)"
  - "Backend: Implement auth session helpers (`apps/web/src/shared/auth/session.ts`)"
- **Estimated Effort:** M

---

### Task: Implement Auth Guard component (`auth-guard.tsx`)
- **Description:** Create `apps/web/src/features/authentication/components/auth-guard.tsx` that protects children content. If unauthenticated, redirect to `/auth/sign-in` and preserve deep link. If authenticated, render children. Handle loading state gracefully.
- **Acceptance Criteria:**
  - [ ] Unauthenticated users are redirected to `/auth/sign-in` with return URL preserved.
  - [ ] Authenticated users see protected content with no unnecessary flashes.
  - [ ] Loading states are handled to avoid layout shift.
- **Dependencies:** "Frontend: Implement session hook (`use-session.ts`)"
- **Estimated Effort:** M

---

### Task: Build Sign-In page route (`/auth/sign-in`)
- **Description:** Implement `apps/web/app/auth/sign-in/page.tsx` that composes `ProviderSignIn` and displays an error banner area. If a `returnUrl` query param exists, ensure it is passed through the OAuth initiation for post-login redirect.
- **Acceptance Criteria:**
  - [ ] Page renders provider buttons and an error area.
  - [ ] `returnUrl` is read from query and passed/persisted for post-login redirect.
  - [ ] Page is responsive and accessible (labels, focus handling).
- **Dependencies:**
  - "Frontend: Build Provider Sign-In buttons component (`provider-sign-in.tsx`)"
  - "Frontend: Implement deep link persistence and post-auth redirect"
- **Estimated Effort:** M

---

### Task: Implement deep link persistence and post-auth redirect
- **Description:** Persist the originally requested protected route (deep link) and restore it after successful OAuth. Use a `returnUrl` query parameter and/or `sessionStorage` as fallback. Ensure compatibility with Supabase OAuth redirect handling.
- **Acceptance Criteria:**
  - [ ] When redirected to `/auth/sign-in` from a protected route, the target path is captured.
  - [ ] After auth completes, user lands on the originally requested route.
  - [ ] Fallback behavior if `returnUrl` is invalid or external (default to app home).
- **Dependencies:**
  - "Frontend: Implement Auth Guard component (`auth-guard.tsx`)"
  - "Frontend: Build Sign-In page route (`/auth/sign-in`)"
- **Estimated Effort:** M

---

### Task: Integrate global React Query provider
- **Description:** Add a shared `QueryClientProviderRoot` in `apps/web/src/shared/providers/query-client-provider.tsx` and wrap the app in `apps/web/app/layout.tsx` to enable React Query usage for future features.
- **Acceptance Criteria:**
  - [ ] Provider implemented and imported in root `layout.tsx`.
  - [ ] Development build runs without hydration or provider errors.
  - [ ] Example component can use React Query successfully.
- **Dependencies:** None
- **Estimated Effort:** S

---

### Task: Apply route protection to protected segments/pages
- **Description:** Identify protected routes (e.g., dashboard areas) and wrap their content/layouts with `AuthGuard`. Marketing pages remain public. Ensure consistent redirect behavior across protected areas.
- **Acceptance Criteria:**
  - [ ] All non-marketing routes are protected by `AuthGuard`.
  - [ ] Public/marketing pages are reachable without authentication.
  - [ ] Redirect behavior is consistent and respects deep links.
- **Dependencies:** "Frontend: Implement Auth Guard component (`auth-guard.tsx`)"
- **Estimated Effort:** M

---

### Task: Implement auth error banner component
- **Description:** Create a small banner/toast component for auth errors to be used on the sign-in page and potentially reusable elsewhere. Supports dismiss and a11y roles.
- **Acceptance Criteria:**
  - [ ] Component displays error message text with ARIA `role="alert"`.
  - [ ] Dismiss action hides the banner.
  - [ ] Integrated into `/auth/sign-in` and wired to provider errors.
- **Dependencies:** "Frontend: Build Sign-In page route (`/auth/sign-in`)"
- **Estimated Effort:** S

---

## DevOps/Testing Tasks

### Task: Configure Supabase OAuth providers (Google, GitHub)
- **Description:** In the Supabase project, enable Google and GitHub providers. Set callback/redirect URLs for local and production (e.g., `http://localhost:3000/` and deployed URL). Document the values and required client IDs/secrets.
- **Acceptance Criteria:**
  - [ ] Google and GitHub providers are enabled with valid credentials.
  - [ ] Redirect URLs configured for local and production.
  - [ ] Configuration documented in the repo `README` or `apps/web/README`.
- **Dependencies:** None
- **Estimated Effort:** S

---

### Task: Provision environment variables and secrets
- **Description:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to local `.env.local` and deployment environment. Verify they align with Supabase project settings. Ensure no secrets are committed; update gitignore as needed.
- **Acceptance Criteria:**
  - [ ] `.env.local` template documented and ignored.
  - [ ] Deployment environment has the required env vars set.
  - [ ] Local dev can authenticate successfully with configured envs.
- **Dependencies:** "DevOps/Testing: Configure Supabase OAuth providers (Google, GitHub)"
- **Estimated Effort:** S

---

### Task: Add E2E tests for auth flows (sign-in, deep link, sign-out)
- **Description:** Add Playwright (or preferred e2e tool) and write tests covering: initiating OAuth (mock provider), post-auth session presence, deep-link redirect back to protected page, and sign-out clearing session and redirecting to `/auth/sign-in`.
- **Acceptance Criteria:**
  - [ ] Test suite includes scenarios: successful sign-in, deep-link redirect, sign-out.
  - [ ] Tests run headless in CI and locally.
  - [ ] Provider flows are mocked or bypassed reliably for CI.
- **Dependencies:**
  - "Frontend: Build Sign-In page route (`/auth/sign-in`)"
  - "Frontend: Implement deep link persistence and post-auth redirect"
  - "Frontend: Build Sign-Out button component (`sign-out-button.tsx`)"
- **Estimated Effort:** L

---

### Task: Add manual test plan for auth edge cases
- **Description:** Create a concise manual QA checklist covering: provider failure surfaces error, invalid `returnUrl` handling, session persistence across refresh, route protection on direct deep links, and sign-out reliability.
- **Acceptance Criteria:**
  - [ ] Checklist added to `/features/authentication-and-sessions.md` or `/docs/testing`.
  - [ ] Each scenario has clear steps and expected outcomes.
  - [ ] Used by the team to validate before merging to main.
- **Dependencies:** None
- **Estimated Effort:** S
