# ClearPath Technical Architecture Blueprint
*AI-Powered Personalized Learning Platform - System Design Document*

---

## Executive Summary

### Project Overview
ClearPath is an AI-powered learning platform that generates personalized learning roadmaps through intelligent onboarding and natural language refinement. The system transforms user goals into structured, actionable learning plans with curated resources and comprehensive progress tracking.

### Key Architectural Decisions
- **Monorepo Architecture**: Turborepo with feature-based organization for scalability and maintainability
- **Full-Stack TypeScript**: End-to-end type safety with strict typing enforcement
- **AI-First Design**: OpenAI integration with structured outputs and cost optimization
- **Modern React Patterns**: Server Actions + React Query for optimal data flow
- **Database-as-a-Service**: Supabase with Row Level Security for user data protection

### Technology Stack Summary
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
 - **Backend**: Next.js Server Actions, Supabase PostgreSQL, Supabase Auth
- **State Management**: React Query (server state), Zustand (client state)
- **AI Integration**: OpenAI API with structured outputs
- **Development**: Turborepo, Biome (linting/formatting), Bun package manager

### System Component Overview
The architecture consists of five core feature modules with clear separation of concerns:
1. **Onboarding System** - User assessment and profile creation
2. **AI Plan Generator** - Learning roadmap creation and refinement
3. **Progress Tracker** - Completion monitoring and analytics
4. **Resource Curator** - Content recommendation and management
5. **User Management** - Authentication and profile management

---

## System Architecture and Infrastructure

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 App (apps/web)                                 │
│  ├── App Router Routes                                      │
│  ├── React 19 Components                                    │
│  ├── Tailwind CSS v4 Styling                              │
│  └── TypeScript Strict Mode                                │
├─────────────────────────────────────────────────────────────┤
│                    Feature Modules                          │
├─────────────────────────────────────────────────────────────┤
│  src/features/                                              │
│  ├── onboarding/     ├── planner/       ├── progress/      │
│  ├── resources/      └── user-management/                  │
│  │                                                         │
│  Each Feature Contains:                                     │
│  ├── components/     (UI components)                       │
│  ├── actions/        (Server actions)                      │
│  ├── queries/        (React Query hooks)                   │
│  ├── schemas/        (Zod validation)                      │
│  └── utils/          (Feature utilities)                   │
├─────────────────────────────────────────────────────────────┤
│                    Shared Packages                          │
├─────────────────────────────────────────────────────────────┤
│  packages/                                                  │
│  ├── ui/               (Shadcn UI components)              │
│  ├── supabase/         (Database + auth helpers)           │
│  ├── tailwind-config/  (Styling configuration)             │
│  └── typescript-config/ (TS configurations)                │
├─────────────────────────────────────────────────────────────┤
│                    External Services                        │
├─────────────────────────────────────────────────────────────┤
│  ├── Supabase        (Database, Auth, Storage)            │
│  ├── OpenAI API      (Plan generation, NLP)               │
│  └── Vercel          (Hosting and deployment)             │
└─────────────────────────────────────────────────────────────┘
```

### Core Infrastructure Components

#### Frontend Architecture
**Framework**: Next.js 15 with App Router
- **Rationale**: Provides optimal developer experience with React Server Components, automatic code splitting, and excellent SEO capabilities essential for learning platform discoverability
- **Routing Strategy**: App Router with route groups for marketing and authenticated sections
- **State Management**: React Query for server state, Zustand for client-side UI state
- **Styling**: Tailwind CSS v4 with PostCSS for utility-first styling and design consistency

#### Backend Architecture
**Approach**: Serverless with Next.js Server Actions
- **Rationale**: Eliminates need for separate API layer while maintaining type safety between client and server
- **Authentication**: Supabase Auth for session management
- **Database**: Supabase PostgreSQL with Row Level Security
- **File Storage**: Supabase Storage for user-uploaded content and plan exports


#### AI Integration Architecture
**Primary Service**: OpenAI API with current GPT family
- **Rationale**: Best-in-class natural language understanding for plan generation and refinement
- **Structured Outputs**: JSON Schema via Responses API for consistent plan formatting and validation
- **Cost Optimization**: Aggressive caching, request deduplication, and usage monitoring
- **Fallback Strategy**: Template-based plans if AI service fails

---

## Data Architecture and Database Design

### Entity Relationship Diagram

```
Users (auth.users from Supabase)
├── user_profiles (1:1)
├── learning_goals (1:many)
    └── learning_plans (1:many)
        ├── plan_modules (1:many)
            ├── module_resources (1:many)
            └── user_progress (1:many)

```

### Core Data Models with TypeScript Interfaces

#### User Profile Schema

```typescript
// src/shared/schemas/user-schema.ts
import { z } from 'zod';

export const LearningStyleSchema = z.enum([
  'visual',
  'auditory',
  'reading',
  'kinesthetic',
  'mixed'
]);

export const SkillLevelSchema = z.enum([
  'beginner',
  'novice',
  'intermediate',
  'advanced',
  'expert'
]);

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(), // References auth.users.id
  email: z.string().email(),
  full_name: z.string().min(2).max(100),
  avatar_url: z.string().url().optional(),
  learning_style: LearningStyleSchema,
  time_availability_hours_per_week: z.number().min(1).max(168),
  preferred_session_duration_minutes: z.number().min(15).max(480),
  current_skills: z.array(z.object({
    domain: z.string().min(1).max(50),
    skill_name: z.string().min(1).max(100),
    level: SkillLevelSchema,
    years_experience: z.number().min(0).max(50).optional(),
  })),
  interests: z.array(z.string().min(1).max(50)).max(20),
  motivation_factors: z.array(z.enum([
    'career_advancement',
    'salary_increase',
    'personal_growth',
    'industry_change',
    'skill_gaps',
    'curiosity'
  ])),
  preferred_content_types: z.array(z.enum([
    'videos',
    'articles',
    'interactive_courses',
    'books',
    'podcasts',
    'hands_on_projects',
    'documentation'
  ])),
  timezone: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
```

#### Learning Goal Schema

```typescript
// src/shared/schemas/learning-goal-schema.ts
import { z } from 'zod';

export const GoalStatusSchema = z.enum([
  'active',
  'paused',
  'completed',
  'cancelled'
]);

export const LearningGoalSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  target_completion_date: z.string().datetime().optional(),
  priority_level: z.enum(['low', 'medium', 'high', 'critical']),
  status: GoalStatusSchema,
  category: z.string().min(1).max(50), // e.g., "programming", "design", "business"
  tags: z.array(z.string().min(1).max(30)).max(10),
  success_criteria: z.array(z.string().min(5).max(500)).min(1).max(10),
  motivation_statement: z.string().max(1000).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type LearningGoal = z.infer<typeof LearningGoalSchema>;
```

#### Learning Plan Schema

```typescript
// src/shared/schemas/learning-plan-schema.ts
import { z } from 'zod';

export const PlanStatusSchema = z.enum([
  'draft',
  'active',
  'paused',
  'completed',
  'archived'
]);

export const DifficultyLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
  'mixed'
]);

export const LearningPlanSchema = z.object({
  id: z.string().uuid(),
  goal_id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  status: PlanStatusSchema,
  difficulty_level: DifficultyLevelSchema,
  estimated_duration_weeks: z.number().min(1).max(104), // 1 week to 2 years
  estimated_hours_total: z.number().min(5).max(2000),
  version_number: z.number().min(1),
  is_current_version: z.boolean(),
  ai_generated: z.boolean(),
  generation_prompt: z.string().max(5000).optional(),
  learning_path_overview: z.string().min(50).max(5000),
  prerequisites: z.array(z.string().min(1).max(200)).max(10),
  learning_outcomes: z.array(z.string().min(10).max(500)).min(1).max(15),
  target_audience: z.string().max(500).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type LearningPlan = z.infer<typeof LearningPlanSchema>;
```

#### Plan Module Schema

```typescript
// src/shared/schemas/plan-module-schema.ts
import { z } from 'zod';

export const ModuleTypeSchema = z.enum([
  'foundation',
  'core_concept',
  'practical_application',
  'project',
  'assessment',
  'review'
]);

export const PlanModuleSchema = z.object({
  id: z.string().uuid(),
  plan_id: z.string().uuid(),
  order_index: z.number().min(0),
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  module_type: ModuleTypeSchema,
  estimated_duration_hours: z.number().min(0.5).max(200),
  difficulty_level: DifficultyLevelSchema,
  learning_objectives: z.array(z.string().min(10).max(500)).min(1).max(10),
  prerequisites: z.array(z.string().min(1).max(100)).max(5),
  key_concepts: z.array(z.string().min(1).max(100)).max(15),
  practical_exercises: z.array(z.string().min(10).max(1000)).max(10),
  assessment_criteria: z.array(z.string().min(10).max(500)).max(5),
  is_optional: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type PlanModule = z.infer<typeof PlanModuleSchema>;
```

#### Resource Schema

```typescript
// src/shared/schemas/resource-schema.ts
import { z } from 'zod';

export const ResourceTypeSchema = z.enum([
  'article',
  'video',
  'course',
  'book',
  'documentation',
  'tutorial',
  'podcast',
  'tool',
  'repository',
  'interactive'
]);

export const ResourceDifficultySchema = z.enum([
  'beginner',
  'intermediate',
  'advanced'
]);

export const ModuleResourceSchema = z.object({
  id: z.string().uuid(),
  module_id: z.string().uuid(),
  title: z.string().min(5).max(300),
  url: z.string().url(),
  resource_type: ResourceTypeSchema,
  difficulty_level: ResourceDifficultySchema,
  estimated_duration_minutes: z.number().min(1).max(36000), // 1 min to 600 hours
  description: z.string().min(10).max(1000),
  why_recommended: z.string().min(10).max(500), // AI explanation
  author_name: z.string().max(100).optional(),
  publication_date: z.string().datetime().optional(),
  rating: z.number().min(1).max(5).optional(),
  is_free: z.boolean(),
  price_usd: z.number().min(0).optional(),
  prerequisites: z.array(z.string().max(100)).max(5),
  key_takeaways: z.array(z.string().min(5).max(200)).max(10),
  tags: z.array(z.string().min(1).max(30)).max(15),
  order_index: z.number().min(0),
  is_primary: z.boolean().default(false), // Primary vs supplementary resource
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ModuleResource = z.infer<typeof ModuleResourceSchema>;
```

#### Progress Tracking Schema

```typescript
// src/shared/schemas/progress-schema.ts
import { z } from 'zod';

export const ProgressStatusSchema = z.enum([
  'not_started',
  'in_progress',
  'completed',
  'skipped',
  'blocked'
]);

export const UserProgressSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  module_id: z.string().uuid(),
  resource_id: z.string().uuid().optional(),
  status: ProgressStatusSchema,
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  time_spent_minutes: z.number().min(0).default(0),
  completion_percentage: z.number().min(0).max(100).default(0),
  user_rating: z.number().min(1).max(5).optional(),
  user_notes: z.string().max(2000).optional(),
  difficulty_experienced: z.enum(['too_easy', 'just_right', 'challenging', 'too_hard']).optional(),
  would_recommend: z.boolean().optional(),
  blockers: z.array(z.string().max(500)).max(3),
  streak_days: z.number().min(0).default(0),
  last_activity_date: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type UserProgress = z.infer<typeof UserProgressSchema>;
```

### Database Schema (SQL)

```sql
-- Enable Row Level Security

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    learning_style TEXT NOT NULL CHECK (learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic', 'mixed')),
    time_availability_hours_per_week INTEGER NOT NULL CHECK (time_availability_hours_per_week BETWEEN 1 AND 168),
    preferred_session_duration_minutes INTEGER NOT NULL CHECK (preferred_session_duration_minutes BETWEEN 15 AND 480),
    current_skills JSONB NOT NULL DEFAULT '[]',
    interests TEXT[] NOT NULL DEFAULT '{}',
    motivation_factors TEXT[] NOT NULL DEFAULT '{}',
    preferred_content_types TEXT[] NOT NULL DEFAULT '{}',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Learning Goals Table
CREATE TABLE learning_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_completion_date TIMESTAMP WITH TIME ZONE,
    priority_level TEXT NOT NULL CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    success_criteria TEXT[] NOT NULL,
    motivation_statement TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Learning Plans Table
CREATE TABLE learning_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES learning_goals(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'mixed')),
    estimated_duration_weeks INTEGER NOT NULL CHECK (estimated_duration_weeks BETWEEN 1 AND 104),
    estimated_hours_total INTEGER NOT NULL CHECK (estimated_hours_total BETWEEN 5 AND 2000),
    version_number INTEGER NOT NULL DEFAULT 1,
    is_current_version BOOLEAN NOT NULL DEFAULT true,
    ai_generated BOOLEAN NOT NULL DEFAULT false,
    generation_prompt TEXT,
    learning_path_overview TEXT NOT NULL,
    prerequisites TEXT[] DEFAULT '{}',
    learning_outcomes TEXT[] NOT NULL,
    target_audience TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    UNIQUE(goal_id, version_number)
);

-- Plan Modules Table
CREATE TABLE plan_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES learning_plans(id) ON DELETE CASCADE NOT NULL,
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    module_type TEXT NOT NULL CHECK (module_type IN ('foundation', 'core_concept', 'practical_application', 'project', 'assessment', 'review')),
    estimated_duration_hours DECIMAL(5,1) NOT NULL CHECK (estimated_duration_hours BETWEEN 0.5 AND 200),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'mixed')),
    learning_objectives TEXT[] NOT NULL,
    prerequisites TEXT[] DEFAULT '{}',
    key_concepts TEXT[] DEFAULT '{}',
    practical_exercises TEXT[] DEFAULT '{}',
    assessment_criteria TEXT[] DEFAULT '{}',
    is_optional BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    UNIQUE(plan_id, order_index)
);

-- Module Resources Table
CREATE TABLE module_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES plan_modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video', 'course', 'book', 'documentation', 'tutorial', 'podcast', 'tool', 'repository', 'interactive')),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_duration_minutes INTEGER NOT NULL CHECK (estimated_duration_minutes BETWEEN 1 AND 36000),
    description TEXT NOT NULL,
    why_recommended TEXT NOT NULL,
    author_name TEXT,
    publication_date TIMESTAMP WITH TIME ZONE,
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1 AND 5),
    is_free BOOLEAN NOT NULL DEFAULT true,
    price_usd DECIMAL(10,2) CHECK (price_usd >= 0),
    prerequisites TEXT[] DEFAULT '{}',
    key_takeaways TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    order_index INTEGER NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    UNIQUE(module_id, order_index)
);

-- User Progress Table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES learning_plans(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES plan_modules(id) ON DELETE CASCADE NOT NULL,
    resource_id UUID REFERENCES module_resources(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped', 'blocked')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_minutes INTEGER DEFAULT 0 CHECK (time_spent_minutes >= 0),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    user_notes TEXT,
    difficulty_experienced TEXT CHECK (difficulty_experienced IN ('too_easy', 'just_right', 'challenging', 'too_hard')),
    would_recommend BOOLEAN,
    blockers TEXT[] DEFAULT '{}',
    streak_days INTEGER DEFAULT 0 CHECK (streak_days >= 0),
    last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Ensure idempotent upserts for module-level progress when resource_id is NULL
-- Option A: treat NULL as a sentinel value for uniqueness
ALTER TABLE user_progress
  ALTER COLUMN resource_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;
UPDATE user_progress
  SET resource_id = '00000000-0000-0000-0000-000000000000'::uuid
  WHERE resource_id IS NULL;
ALTER TABLE user_progress
  ALTER COLUMN resource_id SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_progress ON user_progress(user_id, module_id, resource_id);

-- Indexes for Performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_learning_goals_user_id ON learning_goals(user_id);
CREATE INDEX idx_learning_goals_status ON learning_goals(status);
CREATE INDEX idx_learning_plans_goal_id ON learning_plans(goal_id);
CREATE INDEX idx_learning_plans_user_id ON learning_plans(user_id);
CREATE INDEX idx_learning_plans_current_version ON learning_plans(is_current_version) WHERE is_current_version = true;
CREATE INDEX idx_plan_modules_plan_id ON plan_modules(plan_id);
CREATE INDEX idx_plan_modules_order ON plan_modules(plan_id, order_index);
CREATE INDEX idx_module_resources_module_id ON module_resources(module_id);
CREATE INDEX idx_module_resources_order ON module_resources(module_id, order_index);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_plan_id ON user_progress(plan_id);
CREATE INDEX idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);
CREATE INDEX idx_user_progress_last_activity ON user_progress(last_activity_date);

-- updated_at triggers
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_updated_at_user_profiles'
  ) THEN
    CREATE TRIGGER trg_set_updated_at_user_profiles
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_updated_at_learning_goals'
  ) THEN
    CREATE TRIGGER trg_set_updated_at_learning_goals
    BEFORE UPDATE ON learning_goals
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_updated_at_learning_plans'
  ) THEN
    CREATE TRIGGER trg_set_updated_at_learning_plans
    BEFORE UPDATE ON learning_plans
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_updated_at_plan_modules'
  ) THEN
    CREATE TRIGGER trg_set_updated_at_plan_modules
    BEFORE UPDATE ON plan_modules
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_updated_at_module_resources'
  ) THEN
    CREATE TRIGGER trg_set_updated_at_module_resources
    BEFORE UPDATE ON module_resources
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_updated_at_user_progress'
  ) THEN
    CREATE TRIGGER trg_set_updated_at_user_progress
    BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- Use Supabase's built-in auth.uid() in policies

-- Profiles
CREATE POLICY IF NOT EXISTS "Users can select own profile" ON user_profiles
  FOR SELECT USING (current_user_id() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (current_user_id() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON user_profiles
  FOR UPDATE USING (current_user_id() = user_id)
  WITH CHECK (current_user_id() = user_id);

-- Goals
CREATE POLICY IF NOT EXISTS "Users can select own goals" ON learning_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage own goals" ON learning_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own goals" ON learning_goals
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Plans
CREATE POLICY IF NOT EXISTS "Users can select own plans" ON learning_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own plans" ON learning_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own plans" ON learning_plans
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Modules (read through ownership of parent plan)
CREATE POLICY IF NOT EXISTS "Users can select modules of own plans" ON plan_modules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM learning_plans
            WHERE learning_plans.id = plan_modules.plan_id
            AND learning_plans.user_id = auth.uid()
        )
    );

-- Resources (read through ownership of parent plan)
CREATE POLICY IF NOT EXISTS "Users can select resources of own modules" ON module_resources
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM plan_modules
            JOIN learning_plans ON plan_modules.plan_id = learning_plans.id
            WHERE module_resources.module_id = plan_modules.id
            AND learning_plans.user_id = auth.uid()
        )
    );

-- Progress
CREATE POLICY IF NOT EXISTS "Users can select own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can upsert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## API Design and Server Actions

### Server Actions Architecture

Following the tech stack preferences, ClearPath uses Next.js Server Actions instead of traditional API routes, providing end-to-end type safety and simplified client-server communication. Authentication is handled by Supabase Auth; database access is protected by RLS policies using auth.uid().

#### Authentication Actions (Supabase Auth)

```typescript
// src/features/user-management/actions/auth-actions.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerClient } from "@repo/supabase/server";
import { UserProfileSchema } from "@/shared/schemas/user-schema";

// Input validation schemas
const SignUpInputSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

const SignInInputSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpInput = z.infer<typeof SignUpInputSchema>;
export type SignInInput = z.infer<typeof SignInInputSchema>;

// Action result types
export type AuthResult =
  | { success: true; user: { id: string; email: string } }
  | { success: false; error: string };

export async function signUpUser(input: SignUpInput): Promise<AuthResult> {
  try {
    const validatedInput = SignUpInputSchema.parse(input);
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: validatedInput.email,
      password: validatedInput.password,
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("User creation failed");
      const profileResult = await createUserProfile({
        userId: data.user.id,
        email: validatedInput.email,
        fullName: validatedInput.fullName,
      });
    if (!profileResult.success) throw new Error("Failed to create user profile");
    return { success: true, user: { id: data.user.id, email: data.user.email! } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign up failed"
    };
  }
}

export async function signInUser(input: SignInInput): Promise<AuthResult> {
  try {
    const validatedInput = SignInInputSchema.parse(input);
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedInput.email,
      password: validatedInput.password,
    });
    if (error) throw new Error(error.message);
    return { success: true, user: { id: data.user.id, email: data.user.email! } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign in failed"
    };
  }
}

export async function signOutUser(): Promise<void> {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
```

#### User Profile Actions

```typescript
// src/features/user-management/actions/profile-actions.ts
"use server";

import { z } from "zod";
import { createServerClient } from "@repo/supabase/server";
import { UserProfileSchema } from "@/shared/schemas/user-schema";
import { getCurrentUser } from "@/shared/auth/session-helpers";

const CreateProfileInputSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(2).max(100),
});

const UpdateProfileInputSchema = UserProfileSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true
});

export type CreateProfileInput = z.infer<typeof CreateProfileInputSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

export type ProfileResult<T = UserProfile> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createUserProfile(
  input: CreateProfileInput
): Promise<ProfileResult<UserProfile>> {
  try {
    const validatedInput = CreateProfileInputSchema.parse(input);
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        user_id: validatedInput.userId,
        email: validatedInput.email,
        full_name: validatedInput.fullName,
        learning_style: "mixed", // Default value
        time_availability_hours_per_week: 10, // Default value
        preferred_session_duration_minutes: 60, // Default value
        current_skills: [],
        interests: [],
        motivation_factors: [],
        preferred_content_types: [],
        timezone: "UTC",
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const profile = UserProfileSchema.parse(data);
    return { success: true, data: profile };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Profile creation failed"
    };
  }
}

export async function getUserProfile(): Promise<ProfileResult<UserProfile>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const profile = UserProfileSchema.parse(data);
    return { success: true, data: profile };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get profile"
    };
  }
}

export async function updateUserProfile(
  input: UpdateProfileInput
): Promise<ProfileResult<UserProfile>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const validatedInput = UpdateProfileInputSchema.parse(input);
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        ...validatedInput,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const profile = UserProfileSchema.parse(data);
    return { success: true, data: profile };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Profile update failed"
    };
  }
}
```

#### Learning Plan Actions

```typescript
// src/features/planner/actions/plan-generation-actions.ts
"use server";

import OpenAI from "openai";
import { z } from "zod";
import { createServerClient } from "@repo/supabase/server";
import { getCurrentUser } from "@/shared/auth/session-helpers";
import { LearningPlanSchema, PlanModuleSchema } from "@/shared/schemas/learning-plan-schema";
import { ModuleResourceSchema } from "@/shared/schemas/resource-schema";

// Input validation schema
const GeneratePlanInputSchema = z.object({
  goalId: z.string().uuid(),
  goalDescription: z.string().min(10).max(2000),
  userPreferences: z.object({
    timeAvailableHours: z.number().min(1).max(40),
    learningStyle: z.enum(['visual', 'auditory', 'reading', 'kinesthetic', 'mixed']),
    preferredContentTypes: z.array(z.string()).min(1),
    currentSkillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
    targetTimeframe: z.number().min(1).max(52), // weeks
  }),
});

// OpenAI response schema for structured output
const AIGeneratedPlanSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedDurationWeeks: z.number(),
  estimatedHoursTotal: z.number(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']),
  learningPathOverview: z.string(),
  prerequisites: z.array(z.string()),
  learningOutcomes: z.array(z.string()),
  modules: z.array(z.object({
    title: z.string(),
    description: z.string(),
    moduleType: z.enum(['foundation', 'core_concept', 'practical_application', 'project', 'assessment', 'review']),
    estimatedDurationHours: z.number(),
    difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']),
    learningObjectives: z.array(z.string()),
    keyConceptsCovered: z.array(z.string()),
    practicalExercises: z.array(z.string()),
    resources: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
      resourceType: z.enum(['article', 'video', 'course', 'book', 'documentation', 'tutorial', 'podcast', 'tool', 'repository', 'interactive']),
      difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
      estimatedDurationMinutes: z.number(),
      description: z.string(),
      whyRecommended: z.string(),
      isPrimary: z.boolean(),
    })),
  })),
});

export type GeneratePlanInput = z.infer<typeof GeneratePlanInputSchema>;
export type PlanGenerationResult =
  | { success: true; data: { planId: string; plan: LearningPlan } }
  | { success: false; error: string };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to create OpenAI prompt (Responses API + JSON Schema)
function buildPlanGenerationPrompt(input: GeneratePlanInput): string {
  return `
Create a comprehensive learning plan for the following goal: "${input.goalDescription}"

User Preferences:
- Time available: ${input.userPreferences.timeAvailableHours} hours per week
- Learning style: ${input.userPreferences.learningStyle}
- Preferred content types: ${input.userPreferences.preferredContentTypes.join(', ')}
- Current skill level: ${input.userPreferences.currentSkillLevel}
- Target completion: ${input.userPreferences.targetTimeframe} weeks

Requirements:
1. Create a structured learning path with 4-8 modules
2. Include specific, actionable learning objectives for each module
3. Recommend 3-5 high-quality resources per module
4. Ensure progression from fundamentals to advanced topics
5. Include practical exercises and projects
6. Provide realistic time estimates
7. Explain why each resource is recommended for this specific goal

Focus on creating a plan that is:
- Achievable within the given timeframe
- Appropriate for the stated skill level
- Aligned with the user's learning preferences
- Includes diverse, high-quality resources
- Has clear milestones and assessment points
  `;
}

export async function generateLearningPlan(
  input: GeneratePlanInput
): Promise<PlanGenerationResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const validatedInput = GeneratePlanInputSchema.parse(input);

    // Generate plan using OpenAI
    const prompt = buildPlanGenerationPrompt(validatedInput);

    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: "You are an expert learning consultant. Create detailed, personalized learning plans with curated resources.",
        },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "AIGeneratedPlan",
          schema: AIGeneratedPlanSchema,
          strict: true,
        },
      },
      temperature: 0.7,
      max_output_tokens: 4000,
    });

    const aiResponse = completion.output_text;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const parsedPlan = AIGeneratedPlanSchema.parse(JSON.parse(aiResponse));

    // Save plan to database in a single transaction via RPC for atomicity
    const supabase = createServerClient();
    const { data: planData, error: txError } = await supabase.rpc(
      "create_plan_with_children",
      {
        p_goal_id: validatedInput.goalId,
        p_user_id: user.id,
        p_prompt: prompt,
        p_plan: parsedPlan,
      }
    );
    if (txError) throw new Error(txError.message);

    const plan = LearningPlanSchema.parse(planData);
    return { success: true, data: { planId: planData.id, plan } };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Plan generation failed"
    };
  }
}
```

#### Progress Tracking Actions

```typescript
// src/features/progress/actions/progress-actions.ts
"use server";

import { z } from "zod";
import { createServerClient } from "@repo/supabase/server";
import { getCurrentUser } from "@/shared/auth/session-helpers";
import { UserProgressSchema, ProgressStatusSchema } from "@/shared/schemas/progress-schema";

const UpdateProgressInputSchema = z.object({
  moduleId: z.string().uuid(),
  resourceId: z.string().uuid().optional(),
  status: ProgressStatusSchema,
  timeSpentMinutes: z.number().min(0).optional(),
  completionPercentage: z.number().min(0).max(100).optional(),
  userNotes: z.string().max(2000).optional(),
  userRating: z.number().min(1).max(5).optional(),
  difficultyExperienced: z.enum(['too_easy', 'just_right', 'challenging', 'too_hard']).optional(),
});

export type UpdateProgressInput = z.infer<typeof UpdateProgressInputSchema>;

export type ProgressResult<T = UserProgress> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateModuleProgress(
  input: UpdateProgressInput
): Promise<ProgressResult<UserProgress>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const validatedInput = UpdateProgressInputSchema.parse(input);
    const supabase = createServerClient();

    // Get the plan_id for this module
    const { data: moduleData, error: moduleError } = await supabase
      .from("plan_modules")
      .select("plan_id")
      .eq("id", validatedInput.moduleId)
      .single();

    if (moduleError) {
      throw new Error("Module not found");
    }

    const updateData = {
      user_id: user.id,
      plan_id: moduleData.plan_id,
      module_id: validatedInput.moduleId,
      resource_id: validatedInput.resourceId,
      status: validatedInput.status,
      time_spent_minutes: validatedInput.timeSpentMinutes || 0,
      completion_percentage: validatedInput.completionPercentage || 0,
      user_notes: validatedInput.userNotes,
      user_rating: validatedInput.userRating,
      difficulty_experienced: validatedInput.difficultyExperienced,
      last_activity_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Handle completion timestamps
    if (validatedInput.status === "completed" && !updateData.completed_at) {
      updateData.completed_at = new Date().toISOString();
    }

    if (validatedInput.status === "in_progress" && !updateData.started_at) {
      updateData.started_at = new Date().toISOString();
    }

    // Upsert progress record
    const { data, error } = await supabase
      .from("user_progress")
      .upsert(updateData, {
        onConflict: "user_id,module_id,resource_id",
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const progress = UserProgressSchema.parse(data);
    return { success: true, data: progress };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Progress update failed"
    };
  }
}

export async function getUserProgressForPlan(
  planId: string
): Promise<ProgressResult<UserProgress[]>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("plan_id", planId)
      .order("last_activity_date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const progress = z.array(UserProgressSchema).parse(data);
    return { success: true, data: progress };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get progress"
    };
  }
}
```

---

## Component Architecture and Feature Organization

### Feature-Based Architecture Principles

The ClearPath application follows a strict feature-based organization that promotes:
- **Single Responsibility**: Each feature owns its complete domain
- **Clear Boundaries**: Features communicate through well-defined interfaces
- **Testability**: Features can be tested in isolation
- **Scalability**: New features can be added without affecting existing ones

### Core Feature Modules

#### 1. Onboarding Feature (`src/features/onboarding/`)

**Responsibilities**: User assessment, profile creation, and initial goal setting

```typescript
// src/features/onboarding/components/onboarding-wizard.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { useCreateProfile } from "../queries/use-create-profile";
import { OnboardingStepSchema, type OnboardingStep } from "../schemas/onboarding-schema";

const ONBOARDING_STEPS = [
  "welcome",
  "skills_assessment",
  "goals_definition",
  "preferences_setup",
  "confirmation"
] as const;

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Partial<OnboardingStep>>({});

  const form = useForm<OnboardingStep>({
    resolver: zodResolver(OnboardingStepSchema),
    defaultValues: stepData,
  });

  const { mutate: createProfile, isPending } = useCreateProfile();

  const progressPercentage = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleStepComplete = (data: Partial<OnboardingStep>) => {
    const updatedData = { ...stepData, ...data };
    setStepData(updatedData);

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      createProfile(updatedData as OnboardingStep);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <Progress value={progressPercentage} className="w-full" />
            <CardTitle>
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {ONBOARDING_STEPS[currentStep] === "welcome" && (
            <WelcomeStep onNext={handleStepComplete} />
          )}
          {ONBOARDING_STEPS[currentStep] === "skills_assessment" && (
            <SkillsAssessmentStep
              onNext={handleStepComplete}
              onPrevious={handlePreviousStep}
              defaultValues={stepData}
            />
          )}
          {ONBOARDING_STEPS[currentStep] === "goals_definition" && (
            <GoalsDefinitionStep
              onNext={handleStepComplete}
              onPrevious={handlePreviousStep}
              defaultValues={stepData}
            />
          )}
          {ONBOARDING_STEPS[currentStep] === "preferences_setup" && (
            <PreferencesSetupStep
              onNext={handleStepComplete}
              onPrevious={handlePreviousStep}
              defaultValues={stepData}
            />
          )}
          {ONBOARDING_STEPS[currentStep] === "confirmation" && (
            <ConfirmationStep
              data={stepData}
              onConfirm={handleStepComplete}
              onPrevious={handlePreviousStep}
              isLoading={isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

**Separation of Concerns in Onboarding**:

```typescript
// src/features/onboarding/components/skills-assessment-step.tsx
interface SkillsAssessmentStepProps {
  onNext: (data: Partial<OnboardingStep>) => void;
  onPrevious: () => void;
  defaultValues?: Partial<OnboardingStep>;
}

export function SkillsAssessmentStep({ onNext, onPrevious, defaultValues }: SkillsAssessmentStepProps) {
  // Component focuses only on UI and user interaction
  // Business logic is delegated to custom hooks and actions
}

// src/features/onboarding/queries/use-create-profile.ts
export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserProfile, // Server action
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create profile. Please try again.");
      console.error("Profile creation error:", error);
    },
  });
}

// src/features/onboarding/schemas/onboarding-schema.ts
export const OnboardingStepSchema = z.object({
  // Strict typing for all onboarding data
  personalInfo: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
  }),
  skillsAssessment: z.array(SkillAssessmentSchema),
  goals: z.array(LearningGoalSchema),
  preferences: PreferencesSchema,
});
```

#### 2. Planner Feature (`src/features/planner/`)

**Responsibilities**: AI plan generation, plan visualization, and plan refinement

```typescript
// src/features/planner/components/plan-generator.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { useGeneratePlan } from "../queries/use-generate-plan";
import { PlanGenerationRequestSchema, type PlanGenerationRequest } from "../schemas/plan-generation-schema";

interface PlanGeneratorProps {
  goalId: string;
  userProfile: UserProfile;
  onPlanGenerated: (planId: string) => void;
}

export function PlanGenerator({ goalId, userProfile, onPlanGenerated }: PlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<PlanGenerationRequest>({
    resolver: zodResolver(PlanGenerationRequestSchema),
    defaultValues: {
      goalId,
      userPreferences: {
        timeAvailableHours: userProfile.time_availability_hours_per_week,
        learningStyle: userProfile.learning_style,
        preferredContentTypes: userProfile.preferred_content_types,
        currentSkillLevel: "beginner", // Could be inferred from user skills
        targetTimeframe: 12, // Default 3 months
      },
    },
  });

  const { mutate: generatePlan } = useGeneratePlan();

  const handleGeneratePlan = (data: PlanGenerationRequest) => {
    setIsGenerating(true);

    generatePlan(data, {
      onSuccess: ({ data: result }) => {
        onPlanGenerated(result.planId);
        setIsGenerating(false);
      },
      onError: () => {
        setIsGenerating(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Your Learning Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleGeneratePlan)} className="space-y-6">
          <div>
            <label htmlFor="goalDescription" className="text-sm font-medium">
              Describe your learning goal in detail
            </label>
            <Textarea
              id="goalDescription"
              placeholder="I want to learn React development so I can build modern web applications..."
              {...form.register("goalDescription")}
              className="mt-2"
              rows={4}
            />
            {form.formState.errors.goalDescription && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.goalDescription.message}
              </p>
            )}
          </div>

          <PlanPreferencesSelector
            control={form.control}
            userProfile={userProfile}
          />

          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner className="mr-2" />
                Generating Plan...
              </>
            ) : (
              "Generate Learning Plan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

**AI Integration with Proper Error Handling**:

```typescript
// src/features/planner/utils/ai-prompt-builder.ts
export class PlanGenerationPromptBuilder {
  private readonly basePrompt = `
    You are an expert learning consultant tasked with creating personalized learning plans.
    Your goal is to create structured, actionable, and achievable learning roadmaps.
  `;

  static buildPrompt(input: GeneratePlanInput): string {
    const builder = new PlanGenerationPromptBuilder();

    return builder
      .addGoalContext(input.goalDescription)
      .addUserPreferences(input.userPreferences)
      .addConstraints()
      .addOutputFormat()
      .build();
  }

  private addGoalContext(goalDescription: string): this {
    this.sections.push(`
      LEARNING GOAL:
      ${goalDescription}
    `);
    return this;
  }

  private addUserPreferences(preferences: UserPreferences): this {
    this.sections.push(`
      USER PREFERENCES:
      - Time availability: ${preferences.timeAvailableHours} hours/week
      - Learning style: ${preferences.learningStyle}
      - Content preferences: ${preferences.preferredContentTypes.join(", ")}
      - Current skill level: ${preferences.currentSkillLevel}
      - Target timeframe: ${preferences.targetTimeframe} weeks
    `);
    return this;
  }

  // Additional builder methods for modularity and readability
}

// src/features/planner/utils/plan-validation.ts
export class PlanValidationService {
  static validateGeneratedPlan(plan: unknown): AIGeneratedPlan {
    try {
      return AIGeneratedPlanSchema.parse(plan);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new PlanValidationError(
          "Generated plan does not meet quality standards",
          error.errors
        );
      }
      throw error;
    }
  }

  static validatePlanCompleteness(plan: AIGeneratedPlan): ValidationResult {
    const issues: string[] = [];

    if (plan.modules.length < 3) {
      issues.push("Plan should have at least 3 modules");
    }

    if (plan.estimatedHoursTotal < 10) {
      issues.push("Plan seems too brief for meaningful learning");
    }

    // Additional validation rules

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}
```

#### 3. Progress Feature (`src/features/progress/`)

**Responsibilities**: Progress tracking, analytics, and motivational features

```typescript
// src/features/progress/components/progress-dashboard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { Badge } from "@repo/ui/components/badge";
import { useUserProgress } from "../queries/use-user-progress";
import { useUpdateProgress } from "../queries/use-update-progress";
import { ProgressAnalytics } from "./progress-analytics";
import { StreakCounter } from "./streak-counter";
import { ProgressTimelineChart } from "./progress-timeline-chart";

interface ProgressDashboardProps {
  planId: string;
}

export function ProgressDashboard({ planId }: ProgressDashboardProps) {
  const { data: progressData, isLoading } = useUserProgress(planId);
  const { mutate: updateProgress } = useUpdateProgress();

  if (isLoading) {
    return <ProgressDashboardSkeleton />;
  }

  if (!progressData) {
    return <ProgressDashboardEmpty />;
  }

  const overallProgress = calculateOverallProgress(progressData);
  const timeSpentThisWeek = calculateWeeklyTimeSpent(progressData);
  const currentStreak = calculateCurrentStreak(progressData);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress.percentage}%</div>
            <Progress value={overallProgress.percentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {overallProgress.completedModules} of {overallProgress.totalModules} modules completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(timeSpentThisWeek / 60)}h</div>
            <p className="text-xs text-muted-foreground">
              {timeSpentThisWeek} minutes of learning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <StreakCounter streak={currentStreak} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Module Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ModuleProgressList
              progressData={progressData}
              onUpdateProgress={updateProgress}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressAnalytics progressData={progressData} />
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressTimelineChart progressData={progressData} />
        </CardContent>
      </Card>
    </div>
  );
}
```

**Progress Utilities with Complex Logic Extraction**:

```typescript
// src/features/progress/utils/progress-calculations.ts
export class ProgressCalculationService {
  static calculateOverallProgress(progressData: UserProgress[]): OverallProgress {
    const moduleProgress = this.groupProgressByModule(progressData);
    const totalModules = moduleProgress.size;
    const completedModules = this.countCompletedModules(moduleProgress);

    return {
      percentage: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
      completedModules,
      totalModules,
      inProgressModules: this.countInProgressModules(moduleProgress),
    };
  }

  static calculateWeeklyTimeSpent(progressData: UserProgress[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return progressData
      .filter(progress => new Date(progress.last_activity_date) >= oneWeekAgo)
      .reduce((total, progress) => total + progress.time_spent_minutes, 0);
  }

  static calculateCurrentStreak(progressData: UserProgress[]): number {
    // Complex streak calculation logic extracted from component
    const dailyActivity = this.groupProgressByDay(progressData);
    return this.calculateStreakFromDailyActivity(dailyActivity);
  }

  private static groupProgressByModule(progressData: UserProgress[]): Map<string, UserProgress[]> {
    return progressData.reduce((acc, progress) => {
      if (!acc.has(progress.module_id)) {
        acc.set(progress.module_id, []);
      }
      acc.get(progress.module_id)!.push(progress);
      return acc;
    }, new Map());
  }

  private static countCompletedModules(moduleProgress: Map<string, UserProgress[]>): number {
    return Array.from(moduleProgress.values()).filter(moduleProgressArray =>
      moduleProgressArray.some(progress => progress.status === "completed")
    ).length;
  }

  // Additional utility methods with clear single responsibilities
}

// src/features/progress/schemas/progress-analytics-schema.ts
export const ProgressAnalyticsSchema = z.object({
  overallProgress: z.object({
    percentage: z.number().min(0).max(100),
    completedModules: z.number().min(0),
    totalModules: z.number().min(0),
    estimatedCompletionDate: z.string().datetime().optional(),
  }),
  timeTracking: z.object({
    totalTimeSpent: z.number().min(0),
    averageSessionDuration: z.number().min(0),
    weeklyGoalProgress: z.number().min(0).max(100),
  }),
  learningInsights: z.object({
    mostActiveDay: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
    preferredResourceTypes: z.array(ResourceTypeSchema),
    averageDifficultyRating: z.number().min(1).max(5),
  }),
});

export type ProgressAnalytics = z.infer<typeof ProgressAnalyticsSchema>;
```

#### 4. Resource Management Feature (`src/features/resources/`)

**Responsibilities**: Resource curation, bookmarking, and recommendation

```typescript
// src/features/resources/components/resource-card.tsx
interface ResourceCardProps {
  resource: ModuleResource;
  progress?: UserProgress;
  onResourceClick: (resourceId: string) => void;
  onUpdateProgress: (progress: UpdateProgressInput) => void;
}

export function ResourceCard({ resource, progress, onResourceClick, onUpdateProgress }: ResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleResourceClick = () => {
    onResourceClick(resource.id);

    // Track resource view
    onUpdateProgress({
      moduleId: resource.module_id,
      resourceId: resource.id,
      status: "in_progress",
    });
  };

  const handleMarkComplete = () => {
    onUpdateProgress({
      moduleId: resource.module_id,
      resourceId: resource.id,
      status: "completed",
      completionPercentage: 100,
    });
  };

  return (
    <Card className={`transition-all duration-200 ${progress?.status === "completed" ? "opacity-75" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{resource.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <ResourceTypeIcon type={resource.resource_type} />
              <Badge variant="secondary">{resource.resource_type}</Badge>
              <Badge variant={getDifficultyVariant(resource.difficulty_level)}>
                {resource.difficulty_level}
              </Badge>
              {resource.is_primary && (
                <Badge variant="default">Primary</Badge>
              )}
            </div>
          </div>
          <ProgressStatusIcon status={progress?.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{resource.description}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{Math.round(resource.estimated_duration_minutes / 60)}h {resource.estimated_duration_minutes % 60}m</span>
          {resource.is_free ? (
            <Badge variant="outline" className="text-green-600">Free</Badge>
          ) : (
            <Badge variant="outline">${resource.price_usd}</Badge>
          )}
        </div>

        {resource.why_recommended && (
          <div className="border-l-2 border-blue-200 pl-3">
            <p className="text-sm italic text-muted-foreground">
              "{resource.why_recommended}"
            </p>
          </div>
        )}

        {isExpanded && (
          <ResourceDetails
            resource={resource}
            onClose={() => setIsExpanded(false)}
          />
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleResourceClick}
            className="flex-1"
            variant="default"
          >
            Start Learning
          </Button>

          {progress?.status !== "completed" ? (
            <Button
              onClick={handleMarkComplete}
              variant="outline"
              size="sm"
            >
              Mark Complete
            </Button>
          ) : (
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="sm"
            >
              {isExpanded ? "Hide Details" : "View Details"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Shared Components and Utilities

#### Shared Component Library (`src/shared/components/`)

```typescript
// src/shared/components/loading-spinner.tsx
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
  );
}

// src/shared/components/error-boundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export function ErrorBoundary({ children, fallback: Fallback }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={Fallback || DefaultErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Error caught by boundary:", error, errorInfo);
        // Send to error tracking service
        Sentry.captureException(error, { contexts: { errorInfo } });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

function DefaultErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-red-600">Something went wrong</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        <Button onClick={resetErrorBoundary} className="w-full">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
```

#### Query Patterns and State Management

```typescript
// src/shared/queries/query-keys.ts
export const queryKeys = {
  userProfile: ["user-profile"] as const,
  learningGoals: ["learning-goals"] as const,
  learningPlans: (goalId?: string) =>
    goalId ? ["learning-plans", goalId] as const : ["learning-plans"] as const,
  planModules: (planId: string) => ["plan-modules", planId] as const,
  userProgress: (planId?: string) =>
    planId ? ["user-progress", planId] as const : ["user-progress"] as const,
} as const;

// src/shared/queries/query-client-config.ts
export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes("40")) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
};

// src/shared/stores/ui-store.ts
interface UIState {
  sidebarOpen: boolean;
  currentPlan: string | null;
  activeModule: string | null;

  setSidebarOpen: (open: boolean) => void;
  setCurrentPlan: (planId: string | null) => void;
  setActiveModule: (moduleId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  currentPlan: null,
  activeModule: null,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentPlan: (planId) => set({ currentPlan: planId }),
  setActiveModule: (moduleId) => set({ activeModule: moduleId }),
}));
```

---

## Security and Performance Architecture

### Security Implementation

#### Authentication and Authorization

```typescript
// src/shared/auth/session-helpers.ts
import { createServerClient } from "@repo/supabase/server";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return user;
}

// src/shared/auth/route-guards.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isLoading } = useSession();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <>{children}</>;
}

// src/shared/auth/permissions.ts
export enum Permission {
  CREATE_PLAN = "create:plan",
  UPDATE_PLAN = "update:plan",
  DELETE_PLAN = "delete:plan",
  VIEW_ANALYTICS = "view:analytics",
}

export function hasPermission(user: User, permission: Permission): boolean {
  // Basic permission system - can be extended for roles
  return user?.id ? true : false;
}
```

#### Input Validation and Sanitization

```typescript
// src/shared/validation/input-sanitizer.ts
import DOMPurify from "dompurify";
import { z } from "zod";

export class InputSanitizer {
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
      ALLOWED_ATTR: [],
    });
  }

  static sanitizeUserInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML/script tags
      .substring(0, 2000); // Limit length
  }

  static validateAndSanitize<T>(schema: z.ZodSchema<T>, input: unknown): T {
    const result = schema.safeParse(input);

    if (!result.success) {
      throw new ValidationError("Invalid input", result.error.errors);
    }

    return result.data;
  }
}

// src/shared/validation/rate-limiter.ts
export class RateLimiter {
  private static requests = new Map<string, number[]>();

  static checkRateLimit(
    userId: string,
    operation: string,
    maxRequests: number = 10,
    windowMs: number = 60000
  ): boolean {
    const key = `${userId}:${operation}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const userRequests = this.requests.get(key)!;

    // Remove expired requests
    const validRequests = userRequests.filter(time => time > windowStart);

    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }
}
```

#### API Security Middleware

```typescript
// src/shared/middleware/security-middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { RateLimiter } from "@/shared/validation/rate-limiter";

export async function securityMiddleware(request: NextRequest) {
  // Apply security headers
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
  );

  // Check rate limits for authenticated routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const userId = request.headers.get('x-user-id');

    if (userId && !RateLimiter.checkRateLimit(userId, 'api', 100, 60000)) {
      return new NextResponse('Rate limit exceeded', { status: 429 });
    }
  }

  return response;
}
```

### Performance Optimization

#### Caching Strategy

```typescript
// src/shared/cache/cache-service.ts
export class CacheService {
  private static cache = new Map<string, { data: any; expiry: number }>();

  static set(key: string, data: any, ttlMs: number = 300000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  static generatePlanCacheKey(
    goalDescription: string,
    preferences: UserPreferences
  ): string {
    const hash = this.createHash(goalDescription + JSON.stringify(preferences));
    return `plan:${hash}`;
  }

  static createHash(input: string): string {
    // Simple hash function - could use crypto for production
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}

// Integration with plan generation
export async function generateLearningPlanCached(
  input: GeneratePlanInput
): Promise<PlanGenerationResult> {
  const cacheKey = CacheService.generatePlanCacheKey(
    input.goalDescription,
    input.userPreferences
  );

  const cached = CacheService.get<LearningPlan>(cacheKey);
  if (cached) {
    return { success: true, data: { planId: cached.id, plan: cached } };
  }

  const result = await generateLearningPlan(input);

  if (result.success) {
    CacheService.set(cacheKey, result.data.plan, 3600000); // Cache for 1 hour
  }

  return result;
}
```

#### Database Optimization

```sql
-- Additional performance indexes
CREATE INDEX CONCURRENTLY idx_user_progress_composite ON user_progress(user_id, status, last_activity_date);
CREATE INDEX CONCURRENTLY idx_learning_plans_active ON learning_plans(user_id, status) WHERE status = 'active';
CREATE INDEX CONCURRENTLY idx_module_resources_primary ON module_resources(module_id, is_primary) WHERE is_primary = true;

-- Materialized view for analytics
CREATE MATERIALIZED VIEW user_progress_summary AS
SELECT
  up.user_id,
  up.plan_id,
  COUNT(*) as total_modules,
  COUNT(*) FILTER (WHERE up.status = 'completed') as completed_modules,
  SUM(up.time_spent_minutes) as total_time_spent,
  MAX(up.last_activity_date) as last_activity
FROM user_progress up
GROUP BY up.user_id, up.plan_id;

CREATE UNIQUE INDEX ON user_progress_summary(user_id, plan_id);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_progress_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_progress_summary;
END;
$$ LANGUAGE plpgsql;
```

#### AI Cost Optimization

```typescript
// src/features/planner/utils/ai-cost-optimizer.ts
export class AICostOptimizer {
  private static readonly MAX_TOKENS = 4000;
  private static readonly COST_PER_TOKEN = 0.0001; // Example rate

  static estimateCost(prompt: string): number {
    const tokenCount = this.estimateTokens(prompt);
    return tokenCount * this.COST_PER_TOKEN;
  }

  static optimizePrompt(prompt: string): string {
    const lines = prompt.split('\n');
    const optimized = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    if (this.estimateTokens(optimized) > this.MAX_TOKENS) {
      return this.truncatePrompt(optimized, this.MAX_TOKENS);
    }

    return optimized;
  }

  static async generateWithFallback(
    prompt: string,
    options: {
      primaryModel: string;
      fallbackModel: string;
      maxCost: number;
    }
  ): Promise<string> {
    const cost = this.estimateCost(prompt);
    const modelToUse = cost > options.maxCost ? options.fallbackModel : options.primaryModel;

    try {
      return await this.generateWithModel(prompt, modelToUse);
    } catch (error) {
      if (modelToUse === options.primaryModel) {
        // Fallback to cheaper model
        return await this.generateWithModel(prompt, options.fallbackModel);
      }
      throw error;
    }
  }

  private static estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  private static truncatePrompt(prompt: string, maxTokens: number): string {
    const maxChars = maxTokens * 4;
    return prompt.substring(0, maxChars);
  }
}
```

### Scalability Architecture

#### Infrastructure Scaling Strategy

```typescript
// src/shared/config/environment.ts
import { z } from 'zod';

const EnvironmentSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().min(1).max(100).default(20),

  // AI Services
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MAX_REQUESTS_PER_MINUTE: z.coerce.number().default(50),

  // Caching
  REDIS_URL: z.string().url().optional(),
  CACHE_TTL_SECONDS: z.coerce.number().default(300),

  // Performance
  MAX_REQUEST_SIZE_MB: z.coerce.number().default(10),
  REQUEST_TIMEOUT_MS: z.coerce.number().default(30000),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export const env = EnvironmentSchema.parse(process.env);

// src/shared/monitoring/performance-monitor.ts
export class PerformanceMonitor {
  static trackRequestDuration(
    operation: string,
    startTime: number
  ): void {
    const duration = Date.now() - startTime;

    console.log(`Operation ${operation} took ${duration}ms`);

    // Send to monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: operation,
        value: duration,
      });
    }
  }

  static trackAIUsage(
    model: string,
    tokenCount: number,
    cost: number
  ): void {
    console.log(`AI Usage: ${model}, tokens: ${tokenCount}, cost: $${cost}`);

    // Track for cost optimization
    this.updateAICostMetrics(model, tokenCount, cost);
  }

  private static updateAICostMetrics(
    model: string,
    tokenCount: number,
    cost: number
  ): void {
    // Store metrics for analysis and alerts
  }
}
```

### Error Handling and Monitoring

```typescript
// src/shared/errors/error-handler.ts
export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, public validationErrors: any[]) {
    super(message, 'VALIDATION_ERROR', 400, { validationErrors });
  }
}

export class RateLimitError extends ApplicationError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_ERROR', 429);
  }
}

export class AIServiceError extends ApplicationError {
  constructor(message: string, public provider: string) {
    super(message, 'AI_SERVICE_ERROR', 503, { provider });
  }
}

// Global error handler
export function handleServerError(error: unknown): {
  message: string;
  code: string;
  statusCode: number;
} {
  if (error instanceof ApplicationError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  };
}

// src/shared/errors/map-supabase-error.ts
export function mapSupabaseError(e: unknown): ApplicationError {
  if (typeof e === 'object' && e && 'message' in e) {
    const msg = String((e as any).message || '');
    if (msg.includes('duplicate key value')) return new ApplicationError('Conflict', 'CONFLICT', 409);
    if (msg.includes('permission denied')) return new ApplicationError('Forbidden', 'FORBIDDEN', 403);
    if (msg.includes('Row Level Security')) return new ApplicationError('Unauthorized', 'UNAUTHORIZED', 401);
  }
  return new ApplicationError('Unexpected database error', 'DB_ERROR', 500);
}

// src/shared/actions/with-action-guard.ts
type ActionResult<T> = { success: true; data: T } | { success: false; error: { code: string; message: string } };

export async function withActionGuard<T>(op: () => Promise<T>, context: Record<string, any> = {}): Promise<ActionResult<T>> {
  try {
    const data = await op();
    return { success: true, data };
  } catch (err) {
    const mapped = err instanceof ApplicationError ? err : mapSupabaseError(err);
    console.error('action_error', { code: mapped.code, status: mapped.statusCode, context, err });
    return { success: false, error: { code: mapped.code, message: mapped.message } };
  }
}
```

---

## Technology Stack Justification

### Frontend Technology Decisions

#### Next.js 15 + React 19
**Decision**: Use Next.js 15 with App Router and React 19
**Rationale**:
- **Performance**: React Server Components reduce bundle size and improve initial load times
- **Developer Experience**: Built-in TypeScript support, automatic code splitting, and hot reloading
- **SEO**: Server-side rendering crucial for learning platform discoverability
- **Future-Proof**: Latest stable versions provide long-term support and performance benefits

#### Tailwind CSS v4
**Decision**: Use Tailwind CSS v4 for styling
**Rationale**:
- **Productivity**: Utility-first approach enables rapid UI development
- **Consistency**: Design system constraints prevent style drift
- **Performance**: Purging unused styles keeps bundle size minimal
- **Maintainability**: Clear visual patterns and responsive design utilities

#### React Hook Form + Zod
**Decision**: Use React Hook Form with Zod for form validation
**Rationale**:
- **Performance**: Minimal re-renders and excellent UX
- **Type Safety**: Zod provides runtime validation with TypeScript inference
- **Developer Experience**: Minimal boilerplate with powerful validation
- **Error Handling**: Built-in error states and messaging

### Backend Technology Decisions

#### Next.js Server Actions
**Decision**: Use Server Actions instead of traditional API routes
**Rationale**:
- **Type Safety**: End-to-end TypeScript without separate API contracts
- **Simplicity**: Direct function calls from client to server
- **Performance**: Reduced network overhead and better caching
- **Developer Experience**: Single codebase with clear data flow

#### Supabase
**Decision**: Use Supabase for database and storage (authentication handled by Better Auth)
**Rationale**:
- **Rapid Development**: Built-in authentication and real-time features
- **Security**: Row Level Security (RLS) provides data isolation
- **Scalability**: PostgreSQL with automatic scaling and backups
- **Cost Effectiveness**: Generous free tier and transparent pricing

#### React Query + Zustand
**Decision**: Use React Query for server state, Zustand for client state
**Rationale**:
- **Separation of Concerns**: Clear distinction between server and client state
- **Performance**: Intelligent caching and background updates
- **Developer Experience**: Excellent DevTools and debugging capabilities
- **Bundle Size**: Minimal overhead compared to Redux

### AI Integration Strategy

#### OpenAI Responses API with JSON Schema
**Decision**: Use OpenAI Responses API with JSON Schema structured outputs
**Rationale**:
- **Quality**: Best-in-class natural language understanding
- **Reliability**: Stable API with good uptime and support
- **Cost Control**: Structured outputs reduce token usage
- **Future Flexibility**: Easy to add other models or providers

---

## Deployment and Infrastructure

### Production Deployment Architecture

```yaml
# vercel.json
{
  "buildCommand": "cd apps/web && bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "functions": {
    "apps/web/app/**/*.tsx": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-key",
    "OPENAI_MODEL": "@openai-model",
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run check-types
      - run: bun run format-and-lint
      - run: bun run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Environment Configuration

```typescript
// src/shared/config/app-config.ts
export const appConfig = {
  app: {
    name: "ClearPath",
    version: "1.0.0",
    url: env.NODE_ENV === "production"
      ? "https://clearpath.app"
      : "http://localhost:3000",
  },

  features: {
    aiPlanGeneration: true,
    planRefinement: true,
    progressAnalytics: true,
    resourceBookmarking: true,
  },

  limits: {
    maxPlansPerUser: 10,
    maxModulesPerPlan: 20,
    maxResourcesPerModule: 10,
    planGenerationRateLimit: 5, // per hour
  },

  ai: {
    maxTokens: 4000,
    temperature: 0.7,
    model: "gpt-4o-mini",
    fallbackModel: "gpt-4o",
    maxCostPerRequest: 0.50, // USD
  },
} as const;
```

### Monitoring and Observability

```typescript
// src/shared/monitoring/error-tracking.ts
import * as Sentry from "@sentry/nextjs";

export function initializeErrorTracking() {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,

    beforeSend(event) {
      // Filter sensitive data
      if (event.extra) {
        delete event.extra.password;
        delete event.extra.apiKey;
      }
      return event;
    },
  });
}

// Usage in server actions
export async function withErrorTracking<T>(
  operation: () => Promise<T>,
  context: Record<string, any> = {}
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    Sentry.captureException(error, { contexts: { operation: context } });
    throw error;
  }
}
```

---

## Implementation Guidelines

### Development Workflow

1. **Feature Development**
   - Create feature branch: `feature/onboarding-wizard`
   - Implement following feature-based architecture
   - Write TypeScript with strict typing
   - Add comprehensive error handling
   - Include loading and error states

2. **Code Quality Standards**
   - All functions must have explicit return types
   - Use Zod for all data validation
   - Extract complex logic into utility functions
   - Components should be single-responsibility
   - Use meaningful variable and function names

3. **Testing Strategy**
   - Unit tests for utility functions and business logic
   - Integration tests for server actions
   - Component tests for critical user flows
   - E2E tests for complete user journeys

4. **Performance Considerations**
   - Implement caching for expensive operations
   - Use React Query for data fetching optimization
   - Monitor AI API costs and implement fallbacks
   - Optimize database queries with proper indexing

### Team Handoff Specifications

#### For Backend Engineers
- All server actions are typed and validated
- Database schema includes proper constraints and indexes
- Authentication and authorization patterns are established
- Error handling follows consistent patterns
- AI integration includes cost optimization

#### For Frontend Engineers
- Component architecture emphasizes reusability
- State management patterns are clearly defined
- Form handling includes validation and error states
- Performance optimization strategies are documented
- Accessibility considerations are built-in

#### For QA Engineers
- Error scenarios are well-defined with expected behaviors
- API contracts include validation rules and constraints
- User flows are documented with acceptance criteria
- Performance benchmarks are established
- Security considerations are testable

#### For DevOps Engineers
- Environment configuration is documented
- Deployment pipeline includes quality gates
- Monitoring and alerting strategies are defined
- Scaling considerations are documented
- Security headers and policies are configured

This comprehensive technical architecture provides a solid foundation for building ClearPath as a maintainable, scalable, and user-focused learning platform.
- Structured data models for users, learning plans, progress tracking, and resources
- Caching layer for expensive AI operations and frequently accessed data
- Real-time subscriptions for progress updates across devices
- Data backup and recovery through Supabase

**API and Integration Design:**
- Next.js Server Actions for all backend operations (no API routes)
- OpenAI API for plan generation and natural language processing
- Structured output formatting for consistent AI responses
- Rate limiting and cost optimization for AI usage
- Error handling with proper fallbacks and user feedback

**Security and Performance:**
- Row Level Security enforcement at database level
- API key management and rotation
- Input validation with Zod schemas at all boundaries
- Performance monitoring and optimization
- Cost tracking for AI API usage

**Risk Assessment:**
- AI cost explosion mitigation through caching and rate limiting
- Plan quality assurance through prompt engineering and user feedback
- Performance optimization for global user base
- Scalability planning for growth phases
