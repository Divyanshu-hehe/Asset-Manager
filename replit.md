# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## PathNexis AI Platform

### Artifact: `pathnexis` (React + Vite frontend)

Full-stack career guidance platform for Tier 3/4 college students in India.

**Pages implemented:**
- `Home.tsx` — Marketing landing page with hero, stats, problem/solution, features, testimonials, CTA
- `Features.tsx` — Detailed feature breakdown with benefits lists
- `Pricing.tsx` — 3-tier pricing (Free / Pro ₹299/mo / Campus ₹199/mo) + FAQ
- `Login.tsx` — JWT auth login form with react-hook-form + zod validation
- `Signup.tsx` — Registration form (name, email, password, college, year, skills)
- `Dashboard.tsx` — Protected: resume score, roadmap progress, quick access, activity feed
- `Resume.tsx` — Protected: AI resume analyzer (paste text → score/strengths/suggestions/skill gaps)
- `Roadmap.tsx` — Protected: AI roadmap generator with checkbox progress tracking by category
- `Alumni.tsx` — Protected: searchable mentor directory with connect functionality
- `Referrals.tsx` — Protected: referral job board with apply functionality
- `Interview.tsx` — Protected: AI mock interview (setup → Q&A → per-question feedback + overall score)

**Backend API (Express 5, port 8080):**
- Auth: POST /api/auth/signup, /api/auth/login, GET /api/auth/me (SHA-256 JWT)
- Resume: POST /api/resume/analyze, GET /api/resume/latest
- Roadmap: POST /api/roadmap/generate, GET /api/roadmap/my, PATCH /api/roadmap/progress
- Mentors: GET /api/mentors, GET /api/mentors/:id, POST /api/mentors/:id/connect
- Referrals: GET /api/referrals, POST /api/referrals/:id/apply, GET /api/referrals/my-applications
- Interview: POST /api/interview/start, POST /api/interview/submit
- Dashboard: GET /api/dashboard/summary

**DB (PostgreSQL + Drizzle ORM):**
Tables: users, resumes, roadmaps, mentors, connections, referrals, referral_applications, interview_sessions
Seeded with 6 mentors and 6 referrals.

**Codegen:** OpenAPI spec at `lib/api-spec/openapi.yaml`, hooks at `lib/api-client-react`
