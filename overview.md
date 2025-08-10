### Quick Overview

**ClearPathh** is an AI-powered web application that creates personalized learning plans tailored to users' goals, skills, and interests. The app guides users through a simple onboarding process to assess their current knowledge level, preferred learning style, and desired topics or technologies to learn. Using AI, it synthesizes this input into a curated, step-by-step roadmap with recommended resources, exercises, and milestones that users can refine via natural language.

The primary goal of ClearPath is to provide a lightweight, easy-to-use platform that motivates users to learn effectively and track their progress without overwhelming them with features. The MVP ships with AI-powered plan generation and resource curation alongside onboarding and basic progress tracking, laying the foundation for future improvements like social features and integrations with learning platforms.

---

### Key Features in MVP

1. **User Onboarding & Profile Setup**

   * Collect user data: current skills, learning goals, preferred topics, time availability.
   * Optional preferences: preferred learning style (video, reading, hands-on, etc.).

2. **AI-Powered Plan Generation & Resource Curation**

   * Translate onboarding data into a structured curriculum (modules, subtopics, milestones) using AI.
   * Recommend resources (articles, videos, tutorials) with short rationales; support regenerating sections with constraints (difficulty, time, format).
   * Allow natural-language refinements to tweak scope, pacing, or focus areas and regenerate affected parts.

3. **Progress Tracking**

   * Users can mark modules as complete.
   * Visual progress bar or checklist.
   * Basic stats on time spent or modules completed.

4. **Simple UI/UX**

   * Clean, minimal interface focusing on clarity.
   * Responsive design for desktop and mobile.

5. **Backend API**

   * Handle user profiles, learning plans, and progress data.
   * RESTful API for frontend consumption.

---

### Target Users

* Beginners or intermediate learners who want structured guidance.
* People who want to improve or learn new skills efficiently.
* Users overwhelmed by scattered resources and looking for a clear roadmap.

---

### Technical Scope & Stack Suggestion (MVP)

* **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Shadcn UI
* **Data fetching and state management:** React Query
* **Database:** PostgreSQL with Drizzle ORM to store user profiles and plans.
* **Authentication & Authorization:** Better Auth
* **Data validation:** Zod
* **AI:** OpenAI API (server-side) for plan generation and resource suggestions; structured JSON outputs validated with Zod; prompt templates and minimal guardrails (rate limiting and content filtering).
* **Error Tracking and Logging:** Sentry

---

### Future Possibilities (Post-MVP)

* Advanced adaptive learning: continuous AI-driven replanning based on progress, quizzes, and time constraints; spaced repetition.
* Integration with external platforms like Coursera, YouTube, Udemy APIs.
* Community features (sharing plans, forums).
* Gamification (badges, leaderboards).
* Rich analytics and personalized reminders.
