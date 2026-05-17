# Movyra - Streaming Platform

A Netflix-like streaming platform built for study purposes.

## Tech Stack

- **Framework:** Next.js 16.2.6 (App Router)
- **UI:** React 19.2.4 + Tailwind CSS 4 + shadcn/ui
- **Database:** PostgreSQL + Prisma ORM
- **Cache/Sessions:** Redis (ioredis)
- **Monitoring:** Sentry
- **Language:** TypeScript 5 (strict mode)

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local database services)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd movyra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. Start local services (PostgreSQL & Redis):
   ```bash
   docker compose up -d
   ```

5. Run database migrations:
   ```bash
   npm run db:migrate
   ```

6. Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |

## Project Structure

```
src/
├── app/              # Next.js App Router (pages, layouts)
├── components/       # Shared UI components
│   └── ui/           # shadcn/ui primitives
├── features/         # Feature-specific modules
├── lib/              # Utilities, configs, shared logic
└── types/            # TypeScript type definitions
```

## Environment Variables

See `.env.example` for all required and optional variables.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | No | Redis connection string |
| `SENTRY_DSN` | No | Sentry DSN for error tracking |
| `SENTRY_ENVIRONMENT` | No | Environment name (development/staging/production) |
| `SENTRY_RELEASE` | No | Release version (defaults to git commit SHA) |

## License

MIT
