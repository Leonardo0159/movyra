## ADDED Requirements

### Requirement: Admin routes require ADMIN role
The system SHALL restrict access to all routes under `/admin/movies/*` to authenticated users with the ADMIN role.

#### Scenario: Admin user accesses movie routes
- **WHEN** an authenticated user with ADMIN role accesses any `/admin/movies/*` route
- **THEN** the system allows access to the requested page

#### Scenario: Non-admin user accesses movie routes
- **WHEN** an authenticated user without ADMIN role accesses any `/admin/movies/*` route
- **THEN** the system redirects to the home page

#### Scenario: Unauthenticated user accesses movie routes
- **WHEN** an unauthenticated user accesses any `/admin/movies/*` route
- **THEN** the system redirects to the login page

### Requirement: JWT token validation for admin access
The system SHALL validate the JWT access token stored in cookies to verify admin role before rendering admin movie pages.

#### Scenario: Valid admin JWT token
- **WHEN** user has a valid `access_token` cookie with role=ADMIN
- **THEN** the system grants access to admin movie pages

#### Scenario: Expired JWT token
- **WHEN** user has an expired `access_token` cookie
- **THEN** the system redirects to the login page

#### Scenario: Invalid JWT token
- **WHEN** user has a malformed or tampered `access_token` cookie
- **THEN** the system redirects to the login page
