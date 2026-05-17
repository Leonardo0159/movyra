## ADDED Requirements

### Requirement: Genre-based recommendations
The system SHALL generate recommendations based on the user's most frequently watched genres, prioritizing content from those genres that the user has not yet watched.

#### Scenario: Recommendations based on watched genres
- **WHEN** user has watch history with clear genre preferences
- **THEN** recommendations include content from those genres the user has not watched

#### Scenario: Insufficient history for genre recommendations
- **WHEN** user has watched fewer than 3 items
- **THEN** system falls back to trending/popular content recommendations

### Requirement: History-based similar content recommendations
The system SHALL recommend content similar to items in the user's watch history based on shared genres, tags, or metadata.

#### Scenario: Similar content recommendations
- **WHEN** user has watched content with identifiable genres/tags
- **THEN** recommendations include other content sharing those genres/tags

#### Scenario: No similar content available
- **WHEN** no similar content exists for user's watch history
- **THEN** system displays alternative recommendation sections or empty state

### Requirement: Recommendations caching
The system SHALL cache recommendations in Redis with a TTL of 1 hour to reduce database load and improve response times.

#### Scenario: Recommendations served from cache
- **WHEN** user requests recommendations within 1 hour of last generation
- **THEN** system returns cached recommendations without regenerating

#### Scenario: Cache expiration triggers regeneration
- **WHEN** user requests recommendations after cache TTL expires
- **THEN** system regenerates recommendations and updates cache

### Requirement: Recommendations API endpoint
The system SHALL provide a GET endpoint at `/api/recommendations` that returns personalized recommendations for the authenticated user.

#### Scenario: Authenticated user fetches recommendations
- **WHEN** authenticated user sends GET request to `/api/recommendations`
- **THEN** system returns array of recommended content with metadata

#### Scenario: Unauthenticated user requests recommendations
- **WHEN** unauthenticated user sends GET request to `/api/recommendations`
- **THEN** system returns 401 Unauthorized error

### Requirement: Recommendations UI section
The system SHALL display a "Recommended For You" section on the home page with horizontally scrollable content cards.

#### Scenario: Recommendations section displays on home page
- **WHEN** user navigates to home page
- **THEN** "Recommended For You" section appears with up to 12 recommended items

#### Scenario: Recommendations section loading state
- **WHEN** recommendations are being fetched
- **THEN** system displays loading skeleton placeholders
