## Context

This is a greenfield project - no existing codebase. We're building a Netflix-like streaming platform from scratch for study purposes. The foundation must support future features: video streaming, user authentication, profiles, catalog, watch party, and recommendations.

## Goals / Non-Goals

**Goals:**
- Set up Next.js 16.2.6 with App Router as the base framework
- Configure TypeScript 5 with strict mode and path aliases
- Integrate Tailwind CSS 4 with shadcn/ui for consistent UI components
- Establish PostgreSQL database with Prisma ORM for type-safe data access
- Configure Redis for session management and caching
- Integrate Sentry for error tracking and performance monitoring
- Create clean, maintainable project structure following best practices

**Non-Goals:**
- Authentication implementation (covered in separate change)
- Video upload/encoding infrastructure (covered in separate change)
- Deployment configuration (will be addressed later)
- Testing framework setup beyond basic configuration

## Decisions

### 1. Next.js 16.2.6 with App Router
**Decision:** Use Next.js 16.2.6 App Router over Pages Router.
**Rationale:** App Router is the future of Next.js, offers better performance with React Server Components, and aligns with modern React patterns.
**Alternatives considered:** Pages Router (legacy, not recommended for new projects).

### 2. Prisma ORM over Drizzle
**Decision:** Use Prisma as the primary ORM.
**Rationale:** Prisma offers excellent TypeScript integration, intuitive schema definition, automatic migrations, and a mature ecosystem. Better for learning and rapid development.
**Alternatives considered:** Drizzle (lighter, but less mature ecosystem and learning resources).

### 3. Redis for Sessions and Caching
**Decision:** Use Redis for session storage and application caching.
**Rationale:** Redis is industry-standard for session management, offers fast in-memory operations, and integrates well with Next.js.
**Alternatives considered:** Database sessions (slower), JWT-only stateless auth (limited flexibility).

### 4. shadcn/ui + Tailwind CSS 4
**Decision:** Use shadcn/ui component library with Tailwind CSS 4.
**Rationale:** shadcn/ui provides accessible, customizable components built on Radix UI primitives. Tailwind CSS 4 offers zero-config setup and excellent developer experience.
**Alternatives considered:** Material UI (heavier, less customizable), Chakra UI (good but larger bundle).

### 5. Sentry for Monitoring
**Decision:** Integrate Sentry for error tracking and performance monitoring.
**Rationale:** Sentry provides comprehensive error tracking, performance monitoring, and release health out of the box. Free tier is generous for study projects.
**Alternatives considered:** LogRocket (more focused on session replay), custom logging (more work, less features).

### 6. Project Structure
**Decision:** Organize code by feature/domain rather than by type.
**Rationale:** Feature-based structure scales better, keeps related code together, and improves maintainability.
**Structure:**
```
src/
  app/          # Next.js App Router pages and layouts
  components/   # Reusable UI components
  lib/          # Utilities, configs, shared logic
  features/     # Feature-specific code (auth, profiles, etc.)
  types/        # TypeScript type definitions
```

## Risks / Trade-offs

### [Risk] Next.js 16 breaking changes from training data
→ **Mitigation:** Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

### [Risk] Over-engineering for a study project
→ **Mitigation:** Keep setup minimal. Only add infrastructure that's explicitly needed for MVP features.

### [Risk] PostgreSQL + Redis adds operational complexity
→ **Mitigation:** Use Docker Compose for local development. Consider managed services (Neon, Upstash) for production later.

### [Trade-off] Prisma adds abstraction layer over raw SQL
→ **Acceptable:** Type safety and developer productivity outweigh performance overhead for MVP scale.

### [Trade-off] shadcn/ui requires manual component installation
→ **Acceptable:** Better tree-shaking and customization vs. all-in-one libraries.
