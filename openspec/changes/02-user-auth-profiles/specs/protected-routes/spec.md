## ADDED Requirements

### Requirement: Authentication Middleware
The system SHALL implement a Next.js middleware (`middleware.ts`) at the app root that checks for a valid refresh token cookie on every request. Requests to protected routes without a valid session SHALL be redirected to `/login`.

#### Scenario: Unauthenticated access to protected route
- **WHEN** a user without a valid session cookie navigates to `/dashboard`
- **THEN** the middleware redirects the user to `/login` with a `callbackUrl` query parameter

#### Scenario: Authenticated access to protected route
- **WHEN** a user with a valid session cookie navigates to `/dashboard`
- **THEN** the middleware allows the request to proceed

#### Scenario: Authenticated user accesses auth page
- **WHEN** a user with a valid session cookie navigates to `/login` or `/register`
- **THEN** the middleware redirects the user to `/select-profile`

### Requirement: Protected Route Configuration
The system SHALL define a list of protected route patterns that require authentication. Protected routes SHALL include: `/dashboard`, `/profile/*`, `/watch`, `/settings`. Public routes SHALL include: `/`, `/login`, `/register`, `/api/health`, `/api/auth/*`.

#### Scenario: Protected route pattern match
- **WHEN** a request matches a protected route pattern
- **THEN** the middleware checks for a valid session before allowing access

#### Scenario: API route protection
- **WHEN** an unauthenticated request is made to `/api/profiles`
- **THEN** the API returns a 401 Unauthorized response

### Requirement: Profile Selection Gate
The system SHALL require users to select an active profile before accessing content routes. Users without an active profile SHALL be redirected to `/select-profile` after authentication.

#### Scenario: Authenticated user without active profile
- **WHEN** a logged-in user with no active profile navigates to `/dashboard`
- **THEN** the system redirects to `/select-profile`

#### Scenario: Authenticated user with active profile
- **WHEN** a logged-in user with an active profile navigates to `/dashboard`
- **THEN** the system allows access

### Requirement: Server-Side Auth Verification
Protected server components SHALL verify authentication status using a server-side utility function that reads the session cookie and validates it against Redis. The utility SHALL return the user ID and profile ID if valid, or null if invalid.

#### Scenario: Server component with valid session
- **WHEN** a server component calls the auth verification utility with a valid session
- **THEN** the utility returns the user ID and active profile ID

#### Scenario: Server component with invalid session
- **WHEN** a server component calls the auth verification utility with an expired or missing session
- **THEN** the utility returns null

### Requirement: Client-Side Auth Context
The system SHALL provide a React Context (`AuthProvider`) that exposes authentication state (isAuthenticated, user, activeProfile) to client components. The context SHALL be initialized from server-rendered data and updated via token refresh.

#### Scenario: Auth context provides user data
- **WHEN** a client component consumes the AuthProvider context
- **THEN** the component receives the current authentication state and user data

#### Scenario: Auth context reflects logout
- **WHEN** a user logs out
- **THEN** the AuthProvider context updates to reflect unauthenticated state

### Requirement: Route Redirect Preservation
The system SHALL preserve the original destination URL when redirecting unauthenticated users to login. After successful authentication, the user SHALL be redirected back to the original URL.

#### Scenario: Redirect with callback URL
- **WHEN** an unauthenticated user attempts to access `/watch/movie-123`
- **THEN** they are redirected to `/login?callbackUrl=/watch/movie-123` and after login, redirected back to `/watch/movie-123`
