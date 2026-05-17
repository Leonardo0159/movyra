## ADDED Requirements

### Requirement: Profile Creation
The system SHALL allow an authenticated user to create up to 5 profiles per account. Each profile MUST have a name (max 30 characters, alphanumeric and spaces only) and an avatar selected from 6 predefined options. The system SHALL enforce a unique profile name per user.

#### Scenario: Successful profile creation
- **WHEN** an authenticated user submits a valid profile name and avatar selection
- **THEN** the system creates a Profile record linked to the user and returns the created profile

#### Scenario: Profile creation exceeds limit
- **WHEN** a user attempts to create a 6th profile
- **THEN** the system returns an error "Maximum 5 profiles allowed per account"

#### Scenario: Duplicate profile name
- **WHEN** a user attempts to create a profile with a name that already exists for their account
- **THEN** the system returns an error "Profile name already exists"

#### Scenario: Invalid profile name
- **WHEN** a user submits a profile name with special characters or exceeding 30 characters
- **THEN** the system returns a validation error

### Requirement: Profile Update
The system SHALL allow an authenticated user to update their profile name and avatar. Updates SHALL be performed via API route `PATCH /api/profiles/:profileId`.

#### Scenario: Successful profile update
- **WHEN** a user sends a valid PATCH request with new name and/or avatar
- **THEN** the system updates the profile and returns the updated profile data

#### Scenario: Update to duplicate name
- **WHEN** a user attempts to update a profile name to one that already exists for their account
- **THEN** the system returns an error "Profile name already exists"

#### Scenario: Update non-owned profile
- **WHEN** a user attempts to update a profile that belongs to another user
- **THEN** the system returns a 403 Forbidden error

### Requirement: Profile Deletion
The system SHALL allow an authenticated user to delete their profiles. A user MUST have at least one profile remaining after deletion. The deletion SHALL cascade from Prisma with `onDelete: Cascade`.

#### Scenario: Successful profile deletion
- **WHEN** a user deletes one of their profiles and has more than one profile
- **THEN** the system removes the profile and returns a success response

#### Scenario: Deletion of last profile
- **WHEN** a user attempts to delete their only remaining profile
- **THEN** the system returns an error "Cannot delete the last profile"

#### Scenario: Deletion of non-owned profile
- **WHEN** a user attempts to delete a profile belonging to another user
- **THEN** the system returns a 403 Forbidden error

### Requirement: Profile Listing
The system SHALL allow an authenticated user to list all their profiles via API route `GET /api/profiles`. The response SHALL include profile id, name, avatar, and isActive status.

#### Scenario: List all profiles
- **WHEN** an authenticated user requests their profiles
- **THEN** the system returns an array of all profiles associated with the user

#### Scenario: List profiles for unauthenticated user
- **WHEN** an unauthenticated user requests profiles
- **THEN** the system returns a 401 Unauthorized error

### Requirement: Profile Switching
The system SHALL allow a user to switch between their profiles. Only one profile per user MAY be active at a time. Switching SHALL use a database transaction to ensure exactly one `isActive=true` profile per user.

#### Scenario: Successful profile switch
- **WHEN** a user selects a different profile to activate
- **THEN** the system sets the selected profile's `isActive` to true and all other profiles' `isActive` to false in a single transaction

#### Scenario: Switch to already active profile
- **WHEN** a user selects the profile that is already active
- **THEN** the system returns success with no changes (idempotent)

### Requirement: Avatar Selection
The system SHALL provide exactly 6 predefined avatar options. Avatars SHALL be identified by string keys: "avatar1" through "avatar6". Avatar images SHALL be SVGs rendered inline from the client bundle.

#### Scenario: Valid avatar selection
- **WHEN** a user selects one of the 6 predefined avatars
- **THEN** the system accepts the avatar key and stores it on the profile

#### Scenario: Invalid avatar key
- **WHEN** a user submits an avatar key not in the predefined set
- **THEN** the system returns a validation error "Invalid avatar selection"

### Requirement: Active Profile Retrieval
The system SHALL provide a way to retrieve the currently active profile for an authenticated user via API route `GET /api/profiles/active`.

#### Scenario: Retrieve active profile
- **WHEN** an authenticated user requests their active profile
- **THEN** the system returns the profile with `isActive=true`, or null if none is set
