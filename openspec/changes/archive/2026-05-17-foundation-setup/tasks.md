## 1. Project Initialization

- [x] 1.1 Initialize Next.js 16.2.6 project with App Router (`npx create-next-app@latest`)
- [x] 1.2 Verify project structure: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- [x] 1.3 Configure TypeScript: strict mode, path alias `@/*` → `./src/*`, noEmit
- [x] 1.4 Set up ESLint 9 flat config (`eslint.config.mjs`) with Next.js and TypeScript rules
- [x] 1.5 Run `npm run lint` to verify configuration

## 2. Tailwind CSS 4 and shadcn/ui Setup

- [x] 2.1 Install Tailwind CSS 4 (zero-config setup)
- [x] 2.2 Initialize shadcn/ui (`npx shadcn@latest init`)
- [x] 2.3 Configure design tokens in `globals.css` using `@theme` directive
- [x] 2.4 Install base components: Button, Input, Card, Dialog, Dropdown Menu, Avatar, Badge, Skeleton
- [x] 2.5 Install `next-themes` for dark mode support
- [x] 2.6 Create theme toggle component
- [x] 2.7 Verify: all components render correctly in light and dark modes

## 3. PostgreSQL and Prisma Setup

- [x] 3.1 Install Prisma: `@prisma/client`, `prisma` (dev dependency)
- [x] 3.2 Initialize Prisma: `npx prisma init`
- [x] 3.3 Configure `DATABASE_URL` in `.env` and `.env.example`
- [x] 3.4 Create initial Prisma schema with stub models (User, Profile, Title, Episode)
- [x] 3.5 Run first migration: `npx prisma migrate dev --name init`
- [x] 3.6 Create Prisma client singleton in `src/lib/prisma.ts`
- [x] 3.7 Create seed script `prisma/seed.ts` with sample data
- [x] 3.8 Configure `prisma/seed.ts` in `package.json`
- [x] 3.9 Run seed: `npx prisma db seed`
- [x] 3.10 Verify: query seeded data from a test API route

## 4. Redis Integration

- [x] 4.1 Install Redis client (`ioredis` or `redis`)
- [x] 4.2 Configure `REDIS_URL` in `.env` and `.env.example`
- [x] 4.3 Create Redis client singleton in `src/lib/redis.ts`
- [x] 4.4 Create cache utility in `src/lib/cache.ts` with get, set, delete operations
- [x] 4.5 Implement graceful fallback when Redis is unavailable
- [x] 4.6 Test cache operations with a simple API route
- [x] 4.7 Verify: session storage works with Redis

## 5. Sentry Integration

- [x] 5.1 Install Sentry SDK: `@sentry/nextjs`
- [x] 5.2 Configure `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` in `.env`
- [x] 5.3 Set up Sentry in `sentry.client.config.ts` and `sentry.server.config.ts`
- [x] 5.4 Create Error Boundary component for React error capture
- [x] 5.5 Add Prisma middleware for database query performance tracking
- [x] 5.6 Configure release tracking with git commit hash
- [x] 5.7 Test: trigger a test error and verify it appears in Sentry dashboard

## 6. Project Structure and Utilities

- [x] 6.1 Create `src/features/` directory structure
- [x] 6.2 Create `src/components/` directory for shared components
- [x] 6.3 Create `src/lib/` directory for utilities
- [x] 6.4 Create `src/types/` directory for TypeScript definitions
- [x] 6.5 Set up environment variable validation utility
- [x] 6.6 Create `.env.example` with all required variables
- [x] 6.7 Add `.env` to `.gitignore`
- [x] 6.8 Verify: project builds successfully (`npm run build`)

## 7. Documentation and Cleanup

- [x] 7.1 Update `README.md` with project setup instructions
- [x] 7.2 Document environment variables in `.env.example`
- [x] 7.3 Add Docker Compose file for local PostgreSQL and Redis
- [x] 7.4 Run full lint check: `npm run lint`
- [x] 7.5 Run build: `npm run build` (zero errors)
- [x] 7.6 Start dev server: `npm run dev` and verify home page loads
