# MVP Definition: ClearPath

1. Problem Statement

ClearPath addresses the pain of learners who are overwhelmed by scattered resources and lack a clear, personalized path to reach their goals. Users struggle to translate their goals, time constraints, and preferences into an actionable roadmap. They want a lightweight, easy-to-use tool that generates a tailored plan, curates high-quality resources with brief rationales, and enables simple progress tracking without unnecessary complexity.

2. Target Audience & Early Adopters

- Beginners or intermediate learners seeking structured guidance in tech topics
- Self-directed learners who prefer curated paths over browsing large course catalogs
- Busy professionals with limited time who need a focused, step-by-step plan

3. Value Proposition

- Personalized, AI-generated learning roadmaps based on goals, skills, interests, and time availability
- Curated resources with short rationales, plus the ability to regenerate parts with constraints (difficulty, time, format)
- Lightweight, minimal UI to avoid overwhelm and keep users progressing
- Natural-language refinements to tweak scope, pacing, or focus areas (initially basic)

Differentiation:
- Unlike generic course platforms, ClearPath produces a tailored, stepwise curriculum rather than a catalog
- Unlike to-do/checklist apps, it creates the plan and curates resources for users automatically
- Unlike content aggregators, it emphasizes coherence, progression, and personalization

4. Core Features (The "Minimum" in MVP)

Must-haves (P0):
- Authentication & Sessions (Supabase): Email/password sign-up, sign-in, secure session management
- Onboarding & Profile: Capture current skills, goals, preferred topics, time availability
- AI Plan Generation & Resource Curation (OpenAI): Create a structured plan (modules, subtopics, milestones) with recommended resources and short rationales
- Plan View & Progress Tracking: Mark modules complete; show simple progress indicator
- Plan Persistence (Supabase): Save and load plans tied to the user profile

Nice-to-haves for v1.1 (P1):
- Natural-language refinements to selectively regenerate sections (scope, pacing, focus)
- Constraint-based regeneration (difficulty, time, format)
- Simple resource link previews

5. "Measure" - Key Metrics for Success

Primary north stars:
- Onboarding completion rate (started → completed)
- Post-plan usefulness score (1–5)
- Time-to-first-value: time from sign-up to first plan generated

Secondary metrics:
- Plan generation success rate (AI returns valid plan)
- Activation: users who complete at least one module within 48 hours
- 7-day retention (users returning with any plan interaction)

6. "Learn" - Feedback and Iteration Plan

Primary feedback loop:
- In-app "Give feedback" button visible on the plan page and key touchpoints
- Modal with:
  - 1–5 rating for overall usefulness/experience
  - Short free-text comment field
  - Optional toggle: "Create a public GitHub issue" that, when enabled, opens a prefilled issue in the repo with user-provided context (title, steps, screenshots link if provided)
- Confirmation toast with a link to the created issue when applicable

Supplemental discovery:
- 5–7 structured user interviews in the first two weeks (screened from users who leave detailed feedback)
- Weekly review of feedback and GitHub issues; prioritize items impacting activation and early retention

7. Assumptions & Risks

Critical assumptions to validate first:
- Cost of AI inference will be manageable for expected usage and pricing
- Users will prefer a lightweight planner over browsing large catalogs
- AI can reliably produce structured, high-quality plans and resource suggestions

Additional assumptions:
- Supabase (auth, storage, RLS) is sufficient for early needs; no custom backend required
- Basic progress tracking is enough to keep users engaged initially

Risks:
- AI output quality may vary; poor curation could hurt trust
- Content freshness and licensing for recommended resources
- Cost of AI inference vs. pricing and usage patterns
- Market acceptance: users may prefer known learning platforms
- Scope creep if refinements/regeneration become complex early

8. Future Vision (Post-MVP)

Priorities:
- Gamification (badges, streaks, leaderboards)
- Community features (sharing plans, light social)
- Adaptive learning: continuous AI-driven replanning based on progress and time constraints; spaced repetition

Later possibilities:
- Integrations with platforms (e.g., YouTube, Coursera, Udemy) for richer resource pools
- Rich analytics and personalized reminders
