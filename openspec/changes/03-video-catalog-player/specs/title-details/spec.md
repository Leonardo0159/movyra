## ADDED Requirements

### Requirement: Display title details page
The system SHALL render a detail page for each title at `/title/[id]` showing: backdrop image, poster, title, synopsis, release year, duration, rating, genres, cast members, and related content.

#### Scenario: Movie details page loads
- **WHEN** user navigates to `/title/[movie-id]`
- **THEN** system displays movie details with backdrop, poster, synopsis, metadata, and cast

#### Scenario: Series details page loads
- **WHEN** user navigates to `/title/[series-id]`
- **THEN** system displays series details with backdrop, poster, synopsis, metadata, cast, and episode list

#### Scenario: Title not found
- **WHEN** user navigates to `/title/[non-existent-id]`
- **THEN** system displays 404 page

### Requirement: Display cast and crew information
The system SHALL display cast members associated with a title, including name, role/character, and profile image. Cast SHALL be sorted by billing order.

#### Scenario: Cast list renders
- **WHEN** title details page loads
- **THEN** cast members are displayed with name, role, and image

#### Scenario: Cast member without image
- **WHEN** cast member has no profile image
- **THEN** system displays a placeholder avatar

### Requirement: Episode list for series
For series titles, the system SHALL display episodes organized by season. Users SHALL be able to switch between seasons and see episode number, title, synopsis, and duration.

#### Scenario: Series shows episode list
- **WHEN** user views a series detail page
- **THEN** system displays episodes grouped by season with episode number, title, and duration

#### Scenario: Switch between seasons
- **WHEN** user selects a different season from season selector
- **THEN** episode list updates to show episodes for selected season

#### Scenario: Episode synopsis expand/collapse
- **WHEN** user clicks on an episode synopsis
- **THEN** full synopsis is shown/hidden

### Requirement: Watch button navigation
The system SHALL display a "Watch" button on the title details page that navigates to the video player at `/watch/[id]` (for movies) or `/watch/[id]?episode=[episodeId]` (for series).

#### Scenario: Watch movie
- **WHEN** user clicks "Watch" button on a movie detail page
- **THEN** system navigates to `/watch/[movie-id]`

#### Scenario: Watch series episode
- **WHEN** user clicks "Watch" button on a specific episode
- **THEN** system navigates to `/watch/[series-id]?episode=[episodeId]`

### Requirement: Related content suggestions
The system SHALL display related content on the title details page based on shared genres or categories. At least 6 related titles SHALL be shown when available.

#### Scenario: Related titles displayed
- **WHEN** user views title details page
- **THEN** system shows related titles with matching genres

#### Scenario: No related content available
- **WHEN** no titles share genres with current title
- **THEN** related content section is hidden

### Requirement: Title details API endpoint
The system SHALL provide a REST API endpoint `GET /api/titles/[id]` that returns full title details including metadata, cast, genres, and episodes (for series).

#### Scenario: Fetch movie details
- **WHEN** client requests `GET /api/titles/[movie-id]`
- **THEN** API returns movie details with metadata, cast, and genres

#### Scenario: Fetch series details with episodes
- **WHEN** client requests `GET /api/titles/[series-id]`
- **THEN** API returns series details with metadata, cast, genres, and all episodes organized by season
