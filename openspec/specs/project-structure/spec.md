# project-structure Specification

## Purpose
TBD - created by archiving change foundation-setup. Update Purpose after archive.
## Requirements
### Requirement: Next.js App Router Structure
The application SHALL use Next.js 16.2.6 App Router with the following structure:
- `src/app/` as the root for pages and layouts
- `src/app/layout.tsx` as the root layout
- `src/app/page.tsx` as the home page
- `src/app/globals.css` for global styles

#### Scenario: Access home page
- **WHEN** user navigates to `/`
- **THEN** the root layout wraps the home page component

### Requirement: Feature-Based Directory Organization
The project SHALL organize code by feature with the following directories:
- `src/features/` for feature-specific modules
- `src/components/` for shared UI components
- `src/lib/` for utilities and configurations
- `src/types/` for TypeScript type definitions

#### Scenario: Create new feature module
- **WHEN** developer adds a new feature
- **THEN** feature code is placed in `src/features/<feature-name>/`

### Requirement: TypeScript Configuration
TypeScript SHALL be configured with:
- `strict: true` mode enabled
- Path alias `@/*` mapping to `./src/*`
- `noEmit: true` for Next.js compilation
- Target ES2020 or higher

#### Scenario: Import using path alias
- **WHEN** developer imports `@/components/Button`
- **THEN** TypeScript resolves to `src/components/Button`

### Requirement: ESLint 9 Flat Config
ESLint SHALL use flat config (`eslint.config.mjs`) with:
- Next.js recommended rules
- TypeScript support
- React hooks rules

#### Scenario: Run lint check
- **WHEN** developer runs `npm run lint`
- **THEN** ESLint checks all source files with configured rules

