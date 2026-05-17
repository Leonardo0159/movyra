## ADDED Requirements

### Requirement: Browse catalog by categories
The system SHALL display content organized by categories (movies, series, documentaries) on the catalog page. Each category SHALL show a horizontal row of title cards with poster images.

#### Scenario: User views catalog page
- **WHEN** user navigates to `/catalog`
- **THEN** system displays content grouped by categories with title cards showing poster, title, and release year

#### Scenario: Category rows are horizontally scrollable
- **WHEN** a category has more titles than fit in the viewport
- **THEN** user can scroll horizontally to see all titles in that category

### Requirement: Filter content by type and genre
The system SHALL allow users to filter catalog content by type (movie, series, documentary) and by genre. Filters SHALL be combinable.

#### Scenario: Filter by content type
- **WHEN** user selects "Series" filter
- **THEN** catalog displays only series titles

#### Scenario: Filter by genre
- **WHEN** user selects "Action" genre filter
- **THEN** catalog displays only titles tagged with Action genre

#### Scenario: Combine type and genre filters
- **WHEN** user selects "Movies" type and "Comedy" genre
- **THEN** catalog displays only comedy movies

### Requirement: Search content by title
The system SHALL provide a search input that allows users to search for titles by name. Search results SHALL update as the user types (debounced).

#### Scenario: Search returns matching titles
- **WHEN** user types "matrix" in search input
- **THEN** system displays titles matching "matrix" in title field

#### Scenario: Search is debounced
- **WHEN** user types rapidly in search input
- **THEN** search API calls are debounced by 300ms to avoid excessive requests

#### Scenario: No results found
- **WHEN** search query matches no titles
- **THEN** system displays "No results found" message

### Requirement: Catalog pagination/infinite scroll
The system SHALL support pagination for catalog browsing. Initial load SHALL fetch first page, subsequent pages SHALL load on scroll or explicit pagination.

#### Scenario: Initial catalog load
- **WHEN** user opens catalog page
- **THEN** system loads first 20 titles per category

#### Scenario: Load more content
- **WHEN** user scrolls to bottom of catalog (or clicks "Load More")
- **THEN** system fetches and appends next page of results

### Requirement: Title card display
Each title card in the catalog SHALL display: poster image, title, release year, content type badge, and average rating (if available). Cards SHALL be keyboard navigable and accessible.

#### Scenario: Title card renders with required information
- **WHEN** catalog renders a title card
- **THEN** card shows poster, title, year, type badge, and rating

#### Scenario: Title card is keyboard accessible
- **WHEN** user tabs through catalog
- **THEN** each title card receives focus and can be activated with Enter key

#### Scenario: Click title card navigates to details
- **WHEN** user clicks or activates a title card
- **THEN** system navigates to `/title/[id]` for that title

### Requirement: Catalog API endpoint
The system SHALL provide a REST API endpoint `GET /api/catalog` that supports query parameters for pagination, filtering, and search. Response SHALL include titles with metadata and pagination info.

#### Scenario: Fetch catalog with filters
- **WHEN** client requests `GET /api/catalog?type=movie&genre=action&page=1&limit=20`
- **THEN** API returns paginated list of action movies with total count

#### Scenario: Search via API
- **WHEN** client requests `GET /api/catalog?search=matrix`
- **THEN** API returns titles matching search term
