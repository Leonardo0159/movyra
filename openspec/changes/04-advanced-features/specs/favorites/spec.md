## ADDED Requirements

### Requirement: Add content to favorites
The system SHALL allow authenticated users to add content to their "My List" (favorites) for later viewing.

#### Scenario: User adds content to favorites
- **WHEN** authenticated user clicks "Add to My List" on a content item
- **THEN** content is added to user's favorites list and UI updates to show "In My List"

#### Scenario: Unauthenticated user attempts to add favorites
- **WHEN** unauthenticated user clicks "Add to My List"
- **THEN** system prompts user to login or register

### Requirement: Remove content from favorites
The system SHALL allow users to remove content from their "My List" at any time.

#### Scenario: User removes content from favorites
- **WHEN** user clicks "Remove from My List" on a favorited item
- **THEN** content is removed from favorites list and UI updates accordingly

#### Scenario: Remove from favorites detail page
- **WHEN** user removes content while on the content detail page
- **THEN** UI immediately reflects the removal without page reload

### Requirement: My List page
The system SHALL provide a dedicated "My List" page accessible from the main navigation that displays all user's favorited content.

#### Scenario: User navigates to My List page
- **WHEN** user clicks "My List" in navigation
- **THEN** system displays all favorited content in a grid layout

#### Scenario: Empty My List page
- **WHEN** user has no favorites and navigates to My List page
- **THEN** system displays empty state with prompt to add content

### Requirement: Favorites API endpoints
The system SHALL provide API endpoints for managing favorites: POST `/api/favorites` to add, DELETE `/api/favorites/:contentId` to remove, and GET `/api/favorites` to list.

#### Scenario: Add favorite via API
- **WHEN** authenticated user sends POST to `/api/favorites` with valid contentId
- **THEN** system adds content to favorites and returns 201 Created

#### Scenario: Remove favorite via API
- **WHEN** authenticated user sends DELETE to `/api/favorites/:contentId`
- **THEN** system removes content from favorites and returns 204 No Content

#### Scenario: List favorites via API
- **WHEN** authenticated user sends GET to `/api/favorites`
- **THEN** system returns array of favorited content with metadata

#### Scenario: Duplicate favorite attempt
- **WHEN** user attempts to add content already in favorites
- **THEN** system returns 409 Conflict error

### Requirement: Favorites indicator on content cards
The system SHALL display a visual indicator (bookmark icon) on content cards to show whether content is in the user's favorites.

#### Scenario: Favorites indicator shows saved state
- **WHEN** content card renders for user with favorites
- **THEN** bookmark icon is filled for favorited items and outlined for non-favorited items

#### Scenario: Favorites indicator updates on toggle
- **WHEN** user toggles favorite status on a content card
- **THEN** icon updates immediately to reflect new state

### Requirement: Favorites count limit
The system SHALL limit the number of favorites per user to 500 items to prevent excessive database growth.

#### Scenario: User reaches favorites limit
- **WHEN** user with 500 favorites attempts to add another item
- **THEN** system returns error message indicating limit reached

#### Scenario: User below favorites limit
- **WHEN** user with fewer than 500 favorites adds content
- **THEN** content is successfully added to favorites
