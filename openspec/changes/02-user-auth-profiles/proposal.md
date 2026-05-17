## Why

Users need to register, login, and manage profiles to access the streaming platform. This change implements authentication (FR-1) and profile management (FR-2), which are prerequisites for all personalized features like recommendations, watch history, and watch parties.

## What Changes

- Implement JWT-based authentication with bcrypt password hashing
- Create login, registration, and logout flows
- Build profile management (create, edit, delete, avatar selection)
- Add session management using Redis (from foundation setup)
- Create protected routes that require authentication
- Implement profile switching UI (Netflix-style profile selection)

## Capabilities

### New Capabilities
- `user-auth`: User registration, login, logout, JWT token management, password hashing
- `profile-management`: Profile CRUD operations, avatar selection, profile switching
- `protected-routes`: Route guards and authentication middleware for protected pages

### Modified Capabilities
- None

## Impact

- Adds new database models: User, Profile, Session
- Creates API routes: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- Creates API routes: `/api/profiles/*` for profile CRUD
- Adds authentication middleware for protected routes
- New UI pages: login, register, profile selection, profile management
- Depends on: project-foundation-setup (database, Redis, sessions)
- Agents involved: backend-api, frontend-ui
