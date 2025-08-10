### Tech Stack, Project Structure, and Conventions

This document defines the tech stack choices, folder structure, and naming conventions for the ClearPath monorepo. It reflects the current repository and sets guardrails for ongoing work.

---

### Tech Stack

- **Monorepo & Orchestration**: Turborepo
  - Pipelines defined in `turbo.json` with tasks for `build`, `dev` (persistent), and `check-types`.
  - Workspace layout via root `package.json` workspaces: `apps/*` and `packages/*`.
  - Package manager: Bun (`packageManager: bun@1.x`), Node >= 18.

- **Frontend App**: Next.js 15 + React 19 + TypeScript
  - App Router (`apps/web/app`), Turbopack in development.
  - Transpiles shared packages (see `apps/web/next.config.js`).

- **Styling**: Tailwind CSS v4
  - PostCSS plugin from `@tailwindcss/postcss` via shared config `@repo/tailwind-config/postcss.config.mjs`.
  - Global CSS imported in the app; UI package exposes its own globals.

- **Design System / UI Kit**: `@repo/ui`
  - Shadcn UI, Tailwind CSS, Lucide icons
  - Installing new components: `bunx --bun shadcn@latest add <component-name>`

- **Database & Auth**: Supabase (PostgreSQL)
  - Auth, Storage, Row Level Security (RLS) enforced from the start.
  - Client SDK: centralized in a shared package `@repo/supabase` with separate entry points:
    - `@repo/supabase/browser` — browser-safe client using public keys (RLS enforced).
    - `@repo/supabase/server` — factory for server-side usage; accepts cookie/header adapters (no direct `next/headers` import to keep it framework-agnostic).
  - Optionally pair with Drizzle later for typed SQL if we add a dedicated backend.

- **TypeScript Configs**: `@repo/typescript-config`
  - `apps/web` extends `nextjs.json`; libraries extend `react-library.json`.

- **Linting & Formatting**: Biome
  - Use root scripts: `format-and-lint` and `format-and-lint:fix`.

- **Data Fetching & State**
  - Server state: React Query (queries and mutations, normalized cache, retries, stale-time, invalidation).
  - Client/UI state: Zustand (lightweight stores; do not duplicate server state).
  - We do not use Next.js API routes in this app. Actions call Supabase or external services directly from the client (RLS-protected) using SDKs.
  - Sensitive operations (e.g., OpenAI) must not run on the client. Use Next.js Server Actions or Supabase Edge Functions for a server boundary.

---

### Monorepo Folder Structure

At a high level:

```
clear-path/
  apps/
    web/                   # Next.js application (App Router)
      app/                 # Routes and layouts
      public/              # (optional) static assets
      styles/              # (optional) app-level styles
      ...
  packages/
    ui/                    # Shared UI kit (components, lib, styles)
    supabase/              # Shared Supabase clients and helpers
    tailwind-config/       # Shared Tailwind/PostCSS config
    typescript-config/     # Shared tsconfig presets
  turbo.json
  package.json
  tech-stack-pref.md
  overview.md
```

---

### Feature-based Organization (Next.js App)

We follow a feature-based approach and adopt the folder structure from day one to avoid migrations later. Routes under `app/` are thin composition layers; all domain logic lives in feature folders. Each feature owns its UI, actions, queries (React Query hooks), schemas, and utilities.

Core principles:
- Keep React components dumb; move data fetching and business logic to feature `actions` and `queries`.
- Use React Query for all server state; never store server data in Zustand.
- Use Zustand only for client/UI state (toggles, filters, ephemeral selections).
- All network or expensive actions are expressed as plain functions in `actions/` and consumed by React Query hooks in `queries/`.
- No Next.js API routes. The client talks to external services or a backend directly using typed actions; validate responses with Zod schemas.

Preferred layout:

```
apps/web/
  app/
    (marketing)/
      page.tsx
      layout.tsx
    (dashboard)/
      page.tsx
      layout.tsx
  src/                      # Feature code (imported by routes)
    features/
      onboarding/
        components/
        actions/         # Plain async functions (fetch/SDK); no React here
        queries/            # useQuery/useMutation wrappers around actions
        schemas/
        utils/
      planner/
        components/
        actions/
        queries/
        schemas/
        utils/
    shared/                 # Cross-feature shared pieces (avoid dumping ground)
      components/
      lib/
      providers/
      queries/              # React Query config, query client, helpers, global keys
      clients/              # SDK clients (e.g., Supabase browser/server clients)
      auth/                 # Auth helpers (session hooks, guards)
      env/                  # Runtime env validation (Zod)
      schemas/
      utils/
```

Notes:
    - Routes in `app/` should be thin, delegating logic to `src/features/*`.
    - Put global React Query client/provider in `src/shared/providers` and query helpers/keys in `src/shared/queries`.
    - Initialize Supabase clients in `src/shared/clients` (browser and server variants).
    - Shared components that are app-specific live in `src/shared/components`. Reusable, cross-app components should be promoted to `@repo/ui`.

Feature directory template:

```
src/features/<feature-name>/
  components/
  actions/
    get-<entity>.ts
    create-<entity>.ts
    update-<entity>.ts
  queries/
    use-<entities>.ts      # wraps get operation with useQuery
    use-create-<entity>.ts # wraps create operation with useMutation
  schemas/
    <entity>-schema.ts     # Zod input/output schemas
  utils/
  index.ts
```

---

### Shared UI Package (`@repo/ui`) Structure

```
packages/ui/
  src/
    components/            # Reusable UI components (exported)
    lib/                   # UI utilities (e.g., `cn`)
    styles/                # UI-level global styles
  package.json             # Exports for components, lib, and globals.css
  tsconfig.json
```

Usage in the app:

```ts
// Components
import { Button } from "@repo/ui/components/button";
```

---

### Naming Conventions

- General rule: use kebab-case for file and directory names across the repo.
  - Examples: `user-profile.ts`, `learning-plan-card.tsx`, `feature-flags.ts`.
  - Route segment folders in Next.js are kebab-case: `app/(dashboard)/learning-plans/page.tsx`.

- React components:
  - File name: kebab-case, e.g., `learning-plan-card.tsx`.
  - Exported symbol: PascalCase, e.g., `export function LearningPlanCard() { ... }`.

- Tests (when added):
  - Co-locate with the unit under test: `learning-plan-card.test.tsx` or `learning-plan-card.spec.ts`.

- API routes:
  - We do not use Next.js API routes in this app.

- Config files: follow ecosystem norms, e.g., `next.config.js`, `postcss.config.mjs`, `turbo.json`.

---

### Import & Path Conventions

- Prefer absolute imports for packages: `@repo/ui`, `@repo/tailwind-config`, `@repo/typescript-config`.
- Within `apps/web`, use an app-level alias (recommended): `@/` → `apps/web/src` for feature code. Add to `tsconfig.json` when introducing `src/`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

### Scripts & Quality Gates

- Development: `bun run dev` (or `bunx turbo run dev`) from the repo root.
- Build: `bun run build` at the root builds all packages/apps in the correct order.
- Type checks: `bun run check-types`.
- Lint/format: `bun run format-and-lint` (CI) and `bun run format-and-lint:fix` (local autofix).

---

### Notes & Next Steps

- As we add features (e.g., onboarding, planner), create `src/features/<feature-name>` with kebab-case and co-locate UI, hooks, services, and schemas.

---

### React Query + Actions Pattern (Example)

Small example showing the separation of concerns inside a feature using Supabase:

```ts
// src/features/planner/actions/get-learning-plan.ts
import { learningPlanSchema } from "../schemas/learning-plan-schema";
import { supabaseBrowser } from "@repo/supabase/browser";

export async function getLearningPlan(params: { goalId: string }) {
  const client = supabaseBrowser();
  const { data, error } = await client
    .from("learning_plans")
    .select("*")
    .eq("goal_id", params.goalId)
    .single();
  if (error) throw new Error(error.message);
  return learningPlanSchema.parse(data);
}
```

```ts
// src/features/planner/queries/use-learning-plan.ts
import { useQuery } from "@tanstack/react-query";
import { getLearningPlan } from "../actions/get-learning-plan";

export function useLearningPlan(goalId: string) {
  return useQuery({
    queryKey: ["learning-plan", goalId],
    queryFn: () => getLearningPlan({ goalId }),
    staleTime: 5 * 60 * 1000,
  });
}
```

```ts
// src/shared/providers/query-client-provider.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export function QueryClientProviderRoot({ children }: PropsWithChildren) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

Zustand is used for purely client-side state, e.g., UI filters:

```ts
// src/shared/stores/filters-store.ts
import { create } from "zustand";

type FiltersState = {
  search: string;
  setSearch: (value: string) => void;
};

export const useFiltersStore = create<FiltersState>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
}));
```

Supabase client bootstrap (adopted from day one):

```ts
// packages/supabase/env.ts
import { z } from "zod";

const envVariables = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
```

```ts
// packages/supabase/browser.ts
import { createClient } from "@supabase/supabase-js";

export function supabaseBrowser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase browser env vars");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
```
