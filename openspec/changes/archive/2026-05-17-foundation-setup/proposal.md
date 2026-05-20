## Why

The project needs a solid foundation before building streaming features. This change sets up the core infrastructure: Next.js 16.2.6 with App Router, TypeScript, Tailwind CSS 4, PostgreSQL with Prisma ORM, Redis for caching/sessions, and Sentry for monitoring. Without this foundation, no other features can be built.

## What Changes

- Initialize Next.js 16.2.6 project with App Router structure
- Configure TypeScript with strict mode and path aliases (`@/*` → `./src/*`)
- Set up Tailwind CSS 4 with shadcn/ui component library
- Configure PostgreSQL database with Prisma ORM
- Set up Redis for session management and caching
- Integrate Sentry for error tracking and performance monitoring
- Create base project structure (layouts, components, utils, lib)
- Configure ESLint 9 with flat config
- Set up environment variable management (`.env*` files)

## Capabilities

### New Capabilities
- `project-structure`: Base Next.js app structure with layouts, components, and utilities
- `database-setup`: PostgreSQL schema with Prisma ORM, migrations, and seeding
- `cache-sessions`: Redis integration for session management and caching
- `monitoring`: Sentry integration for error tracking and performance monitoring
- `ui-foundation`: shadcn/ui component library setup with Tailwind CSS 4

### Modified Capabilities
<!-- None - this is the initial setup -->

## Impact

- Creates entire project structure from scratch
- Sets up database schema foundation for users, profiles, titles, episodes
- Configures build tooling (TypeScript, ESLint, Tailwind)
- Establishes monitoring and error tracking infrastructure
- Affects: all future development depends on this foundation
- Agents involved: backend-api, frontend-ui, devops-infra
