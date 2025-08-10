# Feature: Billing & Subscriptions (Stripe)

## 1. Overview
Implements a single paid tier with monthly and yearly billing via Stripe, including a 7-day free trial. Provides checkout, customer portal, entitlement sync via Server Actions (post-checkout reconciliation and periodic refresh), and a clear paywall that unlocks Modules 2+ and advanced features upon trial/subscription.

## 2. User Stories
- **As a user**, I want to purchase a subscription (monthly or yearly) so that I can access premium features beyond the paywall.
- **As a user**, I want to update my payment method, switch plans, or cancel via the Stripe Customer Portal.
- **As a user**, I want to clearly see which content is locked and how to unlock it.

## 3. Functional Requirements
- The system must present a single product with two prices: monthly and yearly.
- The system must support a 7-day free trial for new users.
- The system must create checkout sessions and handle return URLs.
- The system must enable self-serve management via the Stripe Customer Portal.
- The system must reconcile entitlements after checkout and on app load via Server Actions (no webhooks).
- The system must downgrade access if Stripe indicates a final payment failure during reconciliation.
- The system must gate Modules 2+ and advanced features (e.g., refinements) behind active trial/subscription.

## 4. Technical Implementation Plan

### Frontend:
- **Components:**
  - `apps/web/src/features/billing/components/subscribe-cta.tsx`
  - `apps/web/src/features/billing/components/manage-subscription-button.tsx`
  - `apps/web/src/features/billing/components/paywall.tsx` (locks Modules 2+ with copy and CTA)
  - `apps/web/src/features/billing/components/entitlement-badge.tsx`
- **State Management:**
  - React Query `useEntitlements` (stale-while-revalidate) and mutations for checkout/portal session creation.
- **API Interactions:**
  - `billingActions.createCheckoutSession({ priceId, successUrl, cancelUrl })`
  - `billingActions.createPortalSession({ returnUrl })`
  - `billingActions.getEntitlements()`

### Backend:
- **Server Actions:** (No API routes or serverless functions)
  - `createCheckoutSessionAction({ priceId, successUrl, cancelUrl }: CheckoutSessionRequestDto): Promise<{ url: string }>`
  - `createPortalSessionAction({ returnUrl }: PortalSessionRequestDto): Promise<{ url: string }>`
  - `getEntitlementsAction(): Promise<EntitlementsResponseDto>`
  - `reconcileEntitlementsAction(params?: { checkoutSessionId?: string }): Promise<EntitlementsResponseDto>` — called on success return and periodically on app load.
- **Service Layer:**
  - `BillingService` (server): checkout/portal session creation and entitlement updates via Stripe SDK; implement post-checkout reconciliation and periodic on-load refresh to fetch latest subscription state (no webhooks).
- **Data Transfer Objects (DTOs):**
  - `CheckoutSessionRequestDto` — `{ priceId: string; successUrl: string; cancelUrl: string }`
  - `PortalSessionRequestDto` — `{ returnUrl: string }`
  - `EntitlementsResponseDto` — `{ status: "active"|"trialing"|"past_due"|"canceled"|"incomplete"|"none"; currentPeriodEnd?: string; trialEnd?: string }`

### Database:
- **Schema / Model:**
  - `user_billing`: `user_id (uuid, pk)`, `stripe_customer_id (text)`, `stripe_subscription_id (text)`, `product_id (text)`, `price_id (text)`, `interval (text: monthly|yearly)`, `status (text: active|trialing|past_due|canceled|incomplete)`, `current_period_end (timestamptz)`, `trial_end (timestamptz, nullable)`, `updated_at`.
  - RLS: owner-only read; updates performed by authenticated owner via Server Actions.
- **Critical Queries:**
  - Upsert entitlement row on reconciliation (post-checkout and on-load), keyed by Stripe customer/user mapping.
  - Read entitlements by `user_id` to gate UI and actions.

## 5. Acceptance Criteria
- **Scenario:** Subscribe successfully
  - **GIVEN** a user clicks “Subscribe” and selects monthly/yearly
  - **WHEN** they return to the app via the success URL and reconciliation runs
  - **THEN** entitlements show active/trialing without manual refresh.
- **Scenario:** Manage subscription
  - **GIVEN** a user clicks “Manage Subscription”
  - **WHEN** the portal session is created
  - **THEN** the user can update payment method, switch interval, or cancel.
- **Scenario:** Paywall gating
  - **GIVEN** a user without active trial/subscription
  - **WHEN** they view Modules 2+
  - **THEN** content is locked with a clear CTA to subscribe.
- **Scenario:** Payment failure
  - **GIVEN** Stripe marks a subscription past_due/canceled
  - **WHEN** reconciliation runs on app load
  - **THEN** access downgrades and the UI reflects the new status.
