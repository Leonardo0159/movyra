## 1. Database Schema & Prisma Setup

- [ ] 1.1 Add User, Profile models to Prisma schema with relations and constraints
- [ ] 1.2 Run `npx prisma migrate dev` to create and apply migration
- [ ] 1.3 Generate Prisma client with `npx prisma generate`
- [ ] 1.4 Add Prisma client singleton utility for dev hot-reload compatibility

## 2. Auth Utilities & Configuration

- [ ] 2.1 Add JWT secret and auth-related env variables to `.env.example`
- [ ] 2.2 Create JWT utility module (sign, verify, refresh token generation)
- [ ] 2.3 Create bcrypt utility module (hash, compare) with cost factor 12
- [ ] 2.4 Create zod schemas for registration, login, and profile validation
- [ ] 2.5 Configure Redis client utility for session storage

## 3. Authentication Server Actions

- [ ] 3.1 Implement `registerUser` Server Action with validation, bcrypt hashing, and Prisma creation
- [ ] 3.2 Implement `loginUser` Server Action with credential verification, JWT generation, Redis session storage, and cookie setting
- [ ] 3.3 Implement `logoutUser` Server Action with Redis token blacklist and cookie clearing
- [ ] 3.4 Implement `refreshToken` Server Action with Redis validation and token rotation
- [ ] 3.5 Add error handling and typed responses to all auth Server Actions

## 4. Profile API Routes

- [ ] 4.1 Create `GET /api/profiles` route to list user profiles
- [ ] 4.2 Create `POST /api/profiles` route to create a new profile with limit enforcement
- [ ] 4.3 Create `PATCH /api/profiles/:profileId` route to update profile
- [ ] 4.4 Create `DELETE /api/profiles/:profileId` route to delete profile with last-profile guard
- [ ] 4.5 Create `GET /api/profiles/active` route to retrieve active profile
- [ ] 4.6 Create `POST /api/profiles/:profileId/switch` route with transactional isActive toggle
- [ ] 4.7 Add auth middleware to all profile API routes (verify user ownership)

## 5. Authentication Middleware

- [ ] 5.1 Create `middleware.ts` at app root with route matching logic
- [ ] 5.2 Implement session cookie validation in middleware
- [ ] 5.3 Add redirect logic: unauthenticated → `/login`, authenticated → `/select-profile` for auth pages
- [ ] 5.4 Configure matcher to exclude public routes and static assets
- [ ] 5.5 Add `callbackUrl` query parameter preservation on redirect

## 6. Auth Provider & Context

- [ ] 6.1 Create `AuthProvider` React Context with TypeScript types
- [ ] 6.2 Implement context state: isAuthenticated, user, activeProfile, loading
- [ ] 6.3 Create `useAuth` custom hook for context consumption
- [ ] 6.4 Wrap app layout with AuthProvider and initialize from server data
- [ ] 6.5 Implement automatic token refresh logic in provider

## 7. Login & Registration Pages

- [ ] 7.1 Create `/login` page with email/password form using shadcn/ui components
- [ ] 7.2 Create `/register` page with email/password/confirm-password form
- [ ] 7.3 Add client-side form validation with zod and react-hook-form
- [ ] 7.4 Connect forms to Server Actions with loading states and error display
- [ ] 7.5 Add accessibility: labels, aria-describedby for errors, keyboard navigation
- [ ] 7.6 Add redirect to `/select-profile` on successful login/registration

## 8. Profile Selection Page

- [ ] 8.1 Create `/select-profile` page with grid of user profiles
- [ ] 8.2 Render avatar SVGs inline for each profile option
- [ ] 8.3 Add "Manage Profiles" and "Add Profile" buttons
- [ ] 8.4 Implement profile click handler to switch active profile and redirect
- [ ] 8.5 Add accessibility: focus management, screen reader labels for avatars

## 9. Profile Management UI

- [ ] 9.1 Create `/profile/manage` page listing all profiles with edit/delete actions
- [ ] 9.2 Create profile edit dialog/modal with name input and avatar picker
- [ ] 9.3 Create profile delete confirmation dialog
- [ ] 9.4 Create add profile flow with name input and avatar selection
- [ ] 9.5 Connect all UI to profile API routes with optimistic updates
- [ ] 9.6 Add loading states, error toasts, and success feedback

## 10. Avatar Component

- [ ] 10.1 Create `AvatarPicker` component with 6 predefined SVG avatars
- [ ] 10.2 Create `AvatarDisplay` component for rendering profile avatars
- [ ] 10.3 Add hover/selected states for avatar picker using Tailwind
- [ ] 10.4 Ensure avatars are accessible with alt text and role attributes

## 11. Protected Route Components

- [ ] 11.1 Create `AuthCheck` server component for granular route protection
- [ ] 11.2 Create server-side `getSession()` utility for Redis + cookie validation
- [ ] 11.3 Add AuthCheck wrapper to protected layout sections
- [ ] 11.4 Create skeleton/loading states for protected pages during auth check

## 12. Testing

- [ ] 12.1 Write unit tests for JWT utility functions
- [ ] 12.2 Write unit tests for bcrypt utility functions
- [ ] 12.3 Write unit tests for zod validation schemas
- [ ] 12.4 Write integration tests for auth Server Actions (register, login, logout)
- [ ] 12.5 Write integration tests for profile API routes (CRUD, switch, ownership)
- [ ] 12.6 Write component tests for login and registration forms
- [ ] 12.7 Write component tests for profile selection and management UI
- [ ] 12.8 Write middleware tests for route protection logic

## 13. Cleanup & Verification

- [ ] 13.1 Run `npm run lint` and fix all ESLint errors
- [ ] 13.2 Run `npm run build` and verify no TypeScript errors
- [ ] 13.3 Run test suite and ensure all tests pass
- [ ] 13.4 Verify accessibility with axe-core or Lighthouse audit
- [ ] 13.5 Manual test: full auth flow (register → login → select profile → manage profile → logout)
- [ ] 13.6 Verify Redis session cleanup on logout and expiration
