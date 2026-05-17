## ADDED Requirements

### Requirement: User Registration
The system SHALL allow new users to register with an email and password. The password MUST be hashed using bcrypt with a cost factor of at least 12 before storage. The email MUST be unique across all users. Registration SHALL be performed via a Next.js Server Action.

#### Scenario: Successful registration
- **WHEN** a user submits a valid email and password (min 8 chars, 1 uppercase, 1 number, 1 special char)
- **THEN** the system creates a User record with bcrypt-hashed password and returns a success response

#### Scenario: Duplicate email registration
- **WHEN** a user submits an email that already exists in the database
- **THEN** the system returns an error message "Email already registered" and does not create a new user

#### Scenario: Weak password registration
- **WHEN** a user submits a password that does not meet complexity requirements
- **THEN** the system returns a validation error listing the unmet requirements

#### Scenario: Invalid email format
- **WHEN** a user submits an email that does not match a valid email pattern
- **THEN** the system returns a validation error "Invalid email format"

### Requirement: User Login
The system SHALL allow registered users to login with email and password. On successful login, the system SHALL generate a JWT access token (15min TTL) and a refresh token (7d TTL). The refresh token MUST be stored in an httpOnly, secure, sameSite=strict cookie. The refresh token MUST also be stored in Redis with matching TTL for revocation support.

#### Scenario: Successful login
- **WHEN** a user submits valid email and password credentials
- **THEN** the system verifies the password against the stored bcrypt hash, generates JWT access and refresh tokens, sets the refresh token cookie, stores it in Redis, and returns the access token

#### Scenario: Invalid credentials
- **WHEN** a user submits an email that does not exist or an incorrect password
- **THEN** the system returns a generic error "Invalid email or password" without revealing which field is incorrect

#### Scenario: Login with unverified account
- **WHEN** a user attempts to login (email verification not yet implemented)
- **THEN** the system allows login (email verification is out of scope for this change)

### Requirement: User Logout
The system SHALL allow authenticated users to logout. On logout, the system SHALL blacklist the refresh token in Redis and clear the refresh token cookie.

#### Scenario: Successful logout
- **WHEN** an authenticated user triggers logout
- **THEN** the system adds the refresh token to Redis blacklist, clears the cookie, and returns a success response

#### Scenario: Logout with expired token
- **WHEN** a user triggers logout with an already-expired refresh token
- **THEN** the system clears the cookie and returns success (idempotent operation)

### Requirement: Token Refresh
The system SHALL provide a mechanism to refresh the access token using a valid refresh token. The refresh token MUST be validated against Redis storage and the blacklist.

#### Scenario: Successful token refresh
- **WHEN** a client sends a valid, non-blacklisted refresh token
- **THEN** the system generates a new access token and refresh token pair, stores the new refresh token in Redis, blacklists the old one, and returns the new access token with updated cookie

#### Scenario: Refresh with blacklisted token
- **WHEN** a client sends a refresh token that has been blacklisted (e.g., from logout)
- **THEN** the system returns an "Unauthorized" error and clears the cookie

#### Scenario: Refresh with expired token
- **WHEN** a client sends an expired refresh token
- **THEN** the system returns an "Unauthorized" error

### Requirement: Password Validation
The system SHALL validate passwords against the following rules: minimum 8 characters, at least 1 uppercase letter, at least 1 number, at least 1 special character. Validation SHALL use zod schema.

#### Scenario: Valid password passes validation
- **WHEN** a password "SecureP@ss1" is validated
- **THEN** the validation passes

#### Scenario: Short password fails validation
- **WHEN** a password "Ab1@" (4 chars) is validated
- **THEN** validation fails with "Password must be at least 8 characters"

#### Scenario: Missing uppercase fails validation
- **WHEN** a password "securepass1@" is validated
- **THEN** validation fails with "Password must contain at least one uppercase letter"

### Requirement: Session Management
The system SHALL store active refresh tokens in Redis with a TTL matching the token expiration. The system SHALL check Redis on each token refresh to verify the token has not been revoked.

#### Scenario: Session stored in Redis on login
- **WHEN** a user successfully logs in
- **THEN** a session entry is created in Redis with key `session:<refreshTokenHash>` and TTL of 7 days

#### Scenario: Session removed from Redis on logout
- **WHEN** a user logs out
- **THEN** the corresponding session entry is removed from Redis or marked as blacklisted
