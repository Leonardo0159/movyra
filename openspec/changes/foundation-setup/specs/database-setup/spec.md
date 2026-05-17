## ADDED Requirements

### Requirement: PostgreSQL Database Connection
The application SHALL connect to a PostgreSQL database using Prisma ORM with:
- Connection string configured via `DATABASE_URL` environment variable
- Connection pooling for production environments
- SSL enabled for production connections

#### Scenario: Database connection established
- **WHEN** application starts
- **THEN** Prisma client connects to PostgreSQL using `DATABASE_URL`

### Requirement: Prisma Schema Definition
The Prisma schema (`prisma/schema.prisma`) SHALL define:
- Provider: `postgresql`
- Output: `@prisma/client`
- Base models for users, profiles, titles, episodes (stubs for future features)

#### Scenario: Run Prisma migration
- **WHEN** developer runs `npx prisma migrate dev`
- **THEN** database schema is created/updated based on `schema.prisma`

### Requirement: Prisma Client Singleton
The application SHALL export a singleton Prisma client instance from `src/lib/prisma.ts` to prevent multiple connections during development (hot reload).

#### Scenario: Import Prisma client
- **WHEN** any module imports `@/lib/prisma`
- **THEN** the same Prisma client instance is returned

### Requirement: Database Seeding
The project SHALL include a seed script (`prisma/seed.ts`) that:
- Populates the database with sample data for development
- Can be run via `npx prisma db seed`
- Is idempotent (safe to run multiple times)

#### Scenario: Seed database
- **WHEN** developer runs `npx prisma db seed`
- **THEN** sample data is inserted without duplicating existing records
