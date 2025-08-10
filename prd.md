# Product Requirements Document: ClearPath

### Version: 1.0
### Status: Draft

## 1. Introduction & Goal

**This section summarizes the product's purpose, aligning the MVP's problem statement with strategic business and user goals.**
- **Problem:** Learners are overwhelmed by scattered resources and lack a clear, personalized path to reach their goals. They struggle to translate goals, time constraints, and preferences into an actionable roadmap. They want a lightweight tool that generates a tailored plan, curates high‑quality resources with brief rationales, and enables simple progress tracking.
- **Value Proposition:** Personalized, AI‑generated learning roadmaps based on goals, skills, interests, and time availability; conversational onboarding that asks targeted questions in natural language; curated resources with short rationales; a lightweight, minimal UI that keeps users progressing; basic natural‑language refinements for scope, pacing, and focus.
- **Business & User Goals:**
  - **Business (next 3 months):**
    - Acquire ≥300 beta signups with ≥40% activation (first plan generated).
    - Achieve ≥10% trial‑to‑paid conversion within 14 days of sign‑up.
    - Maintain plan‑generation COGS ≤ $0.15/plan and P95 generation time ≤ 10s.
  - **User:**
    - Generate first plan in < 5 minutes from sign‑up.
    - Post‑plan usefulness score ≥ 4/5.
    - Smooth onboarding: onboarding completion rate ≥ 75%.

## 2. User Personas & Scenarios

**This section expands the MVP's target audience into detailed personas and describes specific situations where they use the product.**
- **Persona 1 (Priority): Junior Frontend Dev Candidate (Interview Prep)**
  - **Description:** Recent bootcamp grad or self‑taught learner (0–2 years experience) targeting junior frontend roles. Prepping for interviews at startups/SMBs. Has 7–10 hrs/week, prefers structured prep across JavaScript/TypeScript, React, CSS, accessibility, and coding challenges. Seeks outcome‑oriented plan with clear milestones.
  - **Scenario:** After sign‑up, selects goal "Land a junior frontend role in 90 days" and enters time availability (e.g., 1h/day weekdays + 2h on weekends). ClearPath generates modules like Core JS, React Fundamentals, CSS Layout, Accessibility, Build Tools, Coding Challenges, Portfolio Polish, and Mock Interviews—each with curated resources and brief rationales. The user follows daily tasks, marks modules complete, and monitors progress toward interview readiness.
- **Persona 2 (Secondary): Busy Professional Upskiller**
  - **Description:** Mid‑career professional transitioning into or upskilling within tech; limited time (5–7 hrs/week); needs focused, step‑by‑step plan optimized for short sessions.
  - **Scenario:** Uses ClearPath after work to generate a plan for "frontend fundamentals" optimized for 30‑minute sessions; tracks weekly module completion and revisits saved plan on mobile.

Additional personas for later consideration: Self‑Directed Learner; Beginner Technologist.

## 3. Features & User Stories

**This section breaks down the MVP's high-level features into detailed user stories with clear acceptance criteria.**

- **Feature 1: Authentication & Sessions (Supabase OAuth)**
  - **User Story 1.1:** As a new user, I want to sign in with Google or GitHub so that I can create an account and save my plans without managing passwords.
    - **Acceptance Criteria:**
      - OAuth providers: Google and GitHub only (email/password disabled in v1).
      - One‑click sign‑in/up via provider buttons; errors are surfaced clearly.
      - Sessions persist across refresh with secure management.
      - Sign‑out clears session and redirects to landing/auth page.
      - No password reset or email verification flows required in v1.
      - All app routes except marketing require an authenticated session (protected layouts/guards).
      - Unauthenticated users are redirected to the landing/auth page; deep links return to original route post‑auth.

- **Feature 2: Conversational Onboarding & Profile**
  - **User Story 2.1 (Chat-style intake):** As a user, I want a natural‑language conversation that asks me focused questions so that my inputs are captured without a long form.
    - **Acceptance Criteria:**
      - Requires authenticated session; unauthenticated users cannot start the conversation.
      - Chat UI with assistant prompts and user replies; quick‑reply chips for common answers; typing indicator and error states.
      - In ≤ 6 turns (P95), system elicits: goal, time availability, current skills/experience level, preferred topics/focus, target date (optional), preferred learning format (optional; allowed values: Reading, Hands‑on, Hybrid).
      - Final confirmation step presents a structured summary for user approval/edit.
      - If extraction confidence is low or user requests, offer a minimal form fallback.
      - Conversation state persists on refresh until completion; resume is supported.
    - **Core Question Set (v1):**
      - Q1. Goal (required): "What’s your goal right now?"
        - Quick replies: [Get a junior frontend job; Learn data analysis basics; Improve Spanish speaking; Design portfolio in 60 days]
      - Q2. Time availability (required): "How much time can you commit weekly?"
        - Quick replies: [3; 5; 7; 10+ hours]
      - Q3. Current level (required): "What’s your current level?"
        - Quick replies: [Beginner; Intermediate; Advanced]
      - Q4. Focus areas or constraints (optional): "Any focus areas or constraints?"
        - Quick replies: [Accessibility; Testing; Prefer videos; Budget‑friendly]
      - Q5. Target date (optional): "Do you have a target date?"
        - Quick replies: [30; 60; 90 days]
      - Q6. Preferred learning format (optional): "Preferred learning format?"
        - Quick replies (validated): [Reading; Hands‑on; Hybrid]
  - **User Story 2.2 (Domain‑agnostic goals):** As a user, I can state goals beyond programming (e.g., data analysis, language learning, design) and still receive an appropriate plan.
    - **Acceptance Criteria:**
      - Goal parser is domain‑agnostic; plan schema is generic (modules, subtopics, milestones, resources) with domain‑specific labeling.
      - Resource curation supports multiple domains (seed list TBD) and provides rationales.
      - Open‑domain: Users can state virtually any learning goal; if coverage is weak, system still produces a generic structured plan and includes a "resource discovery" step with reputable sources and search strategies.
  - **User Story 2.3 (Graceful fallback):** As a user, if my goal is uncommon, I still get a useful blueprint.
    - **Acceptance Criteria:**
      - Fallback plan includes: orientation, fundamentals, practice drills, project(s), assessment/milestones, and resource discovery guidance.
      - Clear notice when curated resources are limited; avoids hallucinated paywalled or unavailable links.

- **Feature 3: AI Plan Generation & Resource Curation (OpenAI)**
  - **User Story 3.1:** As a user, I want the app to generate a structured plan (modules, subtopics, milestones) with recommended resources and short rationales so that I can follow a clear roadmap.
    - **Acceptance Criteria:**
      - Generated plan contains modules with subtopics and tasks; milestones are supported at module or cross‑module level.
      - Each task includes: title, short description, optional resource link(s), optional estimated time, and completion flag; due dates are supported at module and/or task level (optional).
      - Curated resources each include a 1–2 sentence rationale.
      - Plan respects user inputs (skills, goals, time availability).
      - Errors are handled gracefully with retry/regenerate.
      - Output validated against a domain‑agnostic schema (Zod); user sees a summary before saving.
      - When domain coverage is low, plan generation automatically switches to fallback blueprint and flags limited curation in the summary.

- **Feature 4: Plan View & Progress Tracking**
  - **User Story 4.1:** As a user, I want to view my plan and mark modules complete so that I can see my progress.
    - **Acceptance Criteria:**
      - Plan is displayed as modules → subtopics → tasks with clear hierarchy.
      - Users can mark tasks complete/incomplete; module auto‑completes when all tasks within it are complete (can be manually toggled if needed).
      - Visible progress bar showing % modules complete; optional secondary indicator for tasks completed.
      - Due dates and milestones are visible; overdue modules/tasks are highlighted.
      - State persists between sessions.

- **Feature 5: Plan Persistence (Supabase)**
  - **User Story 5.1:** As a user, I want my plan to be saved and reloadable so that I can pick up where I left off.
    - **Acceptance Criteria:**
      - Plans are saved to and retrieved from Supabase per authenticated user.
      - v1 assumption: Single active plan per user (archive/replace on regeneration); P1: multiple plans per user.
      - Data model notes (v1):
        - Plan: id, userId, goal/title, targetDate (optional), createdAt, updatedAt, status (active|archived), summary.
        - Module: id, planId, title, description, order, dueDate (optional), isMilestone (optional), completedAt (nullable).
        - Subtopic: id, moduleId, title, description, order.
        - Task: id, moduleId (or subtopicId if nested), title, description, order, estimatedMinutes (optional), resourceUrl(s) (optional), completedAt (nullable), dueDate (optional).
      - RLS enforced by userId; updates allowed only by owner; completion updates are granular (task/module level).

- **Feature 6 (P1): Natural‑Language Plan Refinements**
  - **User Story 6.1:** As a user, I want to ask for tweaks (e.g., “make week 2 lighter” or “swap videos for articles”) and regenerate affected sections.
    - **Acceptance Criteria (P1 scope):**
      - Limited set of refinement intents: scope, pacing, focus, resource format.
      - Diff preview before applying; previous version retained.

- **Feature 7: Billing & Subscriptions (Stripe)**
  - **User Story 7.1 (Subscribe):** As a user, I want to purchase a subscription (monthly or yearly) so that I can access premium features beyond the paywall.
    - **Acceptance Criteria:**
      - Single paid tier only (one product) with two billing intervals: monthly and yearly (prices TBD).
      - Stripe Checkout or Payment Element configured with the single product and two prices (MONTHLY_PRICE_ID, YEARLY_PRICE_ID).
      - Successful payment grants entitlements immediately; status reflected in UI without refresh.
      - Receipt emailed by Stripe; invoices accessible via Stripe Customer Portal.
  - **User Story 7.2 (Manage subscription):** As a user, I can update payment method, switch plan, or cancel.
    - **Acceptance Criteria:**
      - Stripe Customer Portal enabled and linked from settings; proration handled by Stripe.
      - Switching is limited to monthly ↔ yearly within the single tier; no add‑ons or coupon codes in v1.
      - Cancellation sets access through current period end; UI shows renewal date and status.
  - **User Story 7.3 (Paywall & Trials):** As a user, I see exactly what’s free vs paid and when I hit the paywall.
    - **Acceptance Criteria:**
      - Clear paywall copy; gated actions disabled with CTA to subscribe; 7‑day free trial included for new users.
      - Graceful handling of payment failures/dunning; access downgraded on final failure.
      - Paywall mechanics (v1):
        - After first plan generation, users can view the full plan outline.
        - Module 1 is fully unlocked (all tasks/resources). Modules 2+ are locked behind subscription or active trial.
        - Resource rationales are fully visible for Module 1; for locked modules, show titles only with lock indicators.
        - Natural‑language refinements and multi‑plan management (if enabled later) require active trial or subscription.
  - **Webhooks & Reliability:**
    - Process `checkout.session.completed`, `customer.subscription.updated`, `invoice.payment_succeeded/failed` to maintain entitlements.
    - Webhook signature verification, idempotency keys, and retries supported; audit log of entitlement changes.

- Post‑v1 (P1) candidates noted for awareness:
  - Natural‑language refinements to selectively regenerate sections (scope, pacing, focus).
  - Constraint‑based regeneration (difficulty, time, format).
  - Simple resource link previews.

## 4. Design & UX Requirements

**This section specifies the visual and interaction design guidelines for the product.**
- **Core UX Principles:** Simple, efficient, minimal cognitive load; clear progression; accessible.
- **Wireframes/Mockups:** TBD (link to Figma or sketches).
- **Style & Branding:** Clean, minimal; Tailwind + shadcn/ui; branding palette and typography TBD.
- **Accessibility:** Target WCAG 2.1 AA; keyboard navigation; sufficient contrast; semantic HTML.
  - Chat: ARIA roles for messages, focus management, screen‑reader friendly transcripts, color‑safe quick‑reply chips.

- **Chat UX (MVP specifics):**
  - Conversational sequence of 4–6 questions with progress indicator.
  - Quick‑reply chips plus free‑text; ability to skip a question.
  - Summary confirmation step; edit inline prior to plan generation.
  - Clear boundaries: no medical/financial/legal advice; redirect as needed.
  - Preferred learning format quick‑replies: Reading, Hands‑on, Hybrid (validation enforced).

## 5. Technical Specifications & Constraints

**This section outlines the non-functional requirements and technical guardrails for the engineering team.**
- **Tech Stack:**
  - Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui.
  - State/Networking: React Query for server state; Zustand for UI state only.
  - Backend/Data: Supabase (PostgreSQL, Auth, Storage, RLS). No custom backend initially.
  - AI: OpenAI API, server‑only (Next.js Server Actions or Supabase Edge Functions) with structured JSON outputs validated (e.g., Zod).
  - Monorepo: Turborepo; shared packages `@repo/ui`, `@repo/supabase`, `@repo/tailwind-config`, `@repo/typescript-config`.
  - Validation: Zod schemas including `preferredLearningFormat` enum: `"reading" | "hands_on" | "hybrid"`.
- **Performance Requirements:**
  - Initial page interactive under TBD target (suggested: < 2.0s on mid‑tier devices; P95 plan generation < 10s).
  - Lazy load non‑critical components; cache and paginate as needed.
- **Security Requirements:**
  - Supabase Auth with secure session handling; HTTPS only.
  - RLS enforced on all tables; least privilege access.
  - Secrets never exposed client‑side; AI calls from server boundary only.
  - Stripe: Never store card data on our servers; use Stripe Elements/Checkout; verify webhook signatures; restrict API keys.
- **Data Privacy:**
  - Collect minimal personal data; provide account deletion/export.
  - Data encrypted at rest and in transit; GDPR‑ready (TBD DPA, sub‑processors).
- **Constraints & Dependencies:**
  - Dependent on Supabase availability and OpenAI API quotas/costs.
  - No Next.js API routes; actions call Supabase/AI directly via SDKs and server actions.
  - Stripe dependency for payments; network/webhook reliability required for entitlement sync.

- **Conversational Intake (Engineering details):**
  - LLM prompt templates to elicit and extract fields; use function‑calling/JSON schema with Zod validation and confidence scoring.
  - Maintain a domain‑agnostic plan schema; map user text to normalized skills/topics using a lightweight taxonomy.
  - Rate limiting and token budgeting; redact PII in logs; content policy filters to avoid disallowed topics.
  - Telemetry: event stream of conversation steps, extractions, confirmation, generation start/end, errors.
  - Billing data model (v1): userId, stripeCustomerId, stripeSubscriptionId, productId, priceId, interval (monthly|yearly), status (active|trialing|past_due|canceled|incomplete), currentPeriodEnd, trialEnd (nullable), updatedAt.

- **Supported Domains & Content Policy:**
  - Scope: Open‑domain learning goals; system attempts to support virtually any topic where learning a skill or body of knowledge is appropriate.
  - Disallowed categories: medical, legal, and financial advice; adult/explicit content; dangerous/illegal activities; hate/harassment; extremist content; child‑directed sensitive content.
  - Safe completion: When goals fall into disallowed or risky areas, system responds with a safe alternative and guidance to seek appropriate professional resources; no plans are generated for prohibited categories.
  - Redirection behavior: Display a safety notice plus a generic study‑skills blueprint (goal setting, reputable sources, practice cadence) and link to official/professional resources where applicable.
  - Resource sourcing: Link only to public, reputable sources; attribute clearly; avoid scraping or gated/paywalled content unless user provides access; respect licensing.

## 6. Success Metrics & Analytics

**This section refines the MVP's learning goals into specific, measurable KPIs for product performance.**
- **KPI 1: Onboarding completion rate**
  - **Measurement:** Percentage of users who complete onboarding after start; instrument start/complete events.
- **KPI 2: Time‑to‑first‑value**
  - **Measurement:** Median time from sign‑up to first plan generated.
- **KPI 3: Post‑plan usefulness score (1–5)**
  - **Measurement:** In‑app rating after plan creation.
- **KPI 4: Plan generation success rate**
  - **Measurement:** Percentage of AI requests returning a valid plan (passes schema validation).
- **KPI 5: Activation within 48 hours**
  - **Measurement:** Users who complete ≥1 module within 48 hours of first plan.
- **KPI 6: 7‑day retention**
  - **Measurement:** Users returning with any plan interaction within 7 days.
- Analytics stack/tooling TBD (e.g., PostHog); define event taxonomy and dashboards.

- **Conversation-specific KPIs:**
  - Conversation completion rate (from first prompt to confirmation) ≥ 75%.
  - Average turns to confirmation ≤ 6 (P95).
  - Extraction success without manual correction ≥ 80%.
  - Open‑domain success rate ≥ 80% (share of non‑seed domains that produce valid plans without manual correction).

## 7. Launch & Go-to-Market Plan

**This section outlines the strategy for releasing the product to users.**
- **Rollout Strategy:** TBD (e.g., private beta with early adopters → staged rollout).
- **Launch Dependencies:** TBD (marketing site, analytics, feedback loop, support docs).
- **Onboarding:** Guided multi‑step onboarding culminating in first plan generation.
- **Pricing & Subscription (v1):**
  - Single paid tier with monthly and yearly subscriptions via Stripe (prices TBD) and a 7‑day free trial.
  - Simple, transparent pricing; taxes/VAT may apply based on locale; no hidden fees.
  - Paywall: Full plan outline visible; only Module 1 unlocked during trial; subscription required to unlock Modules 2+ and advanced features.
  - Webhooks configured; Customer Portal enabled; paywall copy finalized pre‑launch.

## 8. Risks & Mitigation

**This section provides a detailed look at potential risks and actionable plans to address them.**

| Risk Category | Description | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation Plan |
| :--- | :--- | :--- | :--- | :--- |
| Technical (AI quality) | AI output quality may vary; poor curation could hurt trust | M | H | Use structured prompts and schemas; add regenerate/edit; implement lightweight evaluations; human‑centered copy and guardrails |
| Technical (Costs) | Cost of AI inference vs. pricing and usage patterns | M | H | Model selection; token limits; caching; batch requests; rate limiting |
| Technical/Operational (Platform) | Supabase sufficiency for early needs | L/M | M | Enforce RLS; design schemas for scale; plan migration path if custom backend needed |
| Technical (Billing) | Webhook failure or entitlement drift | M | H | Webhook retries, idempotency, signature verification, periodic reconciliation job |
| Legal/Content | Content freshness and licensing for recommended resources | M | M | Prefer authoritative sources; include source attribution; allow user‑submitted corrections |
| Market | Users may prefer known learning platforms | M | H | Emphasize clear differentiation and time‑to‑value; early‑adopter beta and testimonials |
| Operational | Scope creep if refinements/regeneration become complex early | M | M | Keep advanced refinements as P1; timebox experiments; maintain strict acceptance criteria |

## 9. Future Roadmap (Post-V1)

**This section provides a high-level view of what comes after this version, based on the MVP's long-term vision.**
- **Next Theme/Epic 1:** Gamification (badges, streaks, leaderboards)
- **Next Theme/Epic 2:** Community features (sharing plans, light social)
- **Next Theme/Epic 3:** Adaptive learning (continuous AI‑driven replanning; spaced repetition)
- **Next Theme/Epic 4:** Third‑party integrations (YouTube, Coursera, Udemy)
- **Next Theme/Epic 5:** Rich analytics and personalized reminders
