## ADDED Requirements

### Requirement: Admin content list page
The system SHALL provide an admin page at `/admin/content` listing all catalog titles with search, filter, and pagination. Each entry SHALL show: title, type, status, release year, and actions (edit, delete).

#### Scenario: View content list
- **WHEN** admin navigates to `/admin/content`
- **THEN** system displays paginated list of all titles with metadata

#### Scenario: Search content in admin
- **WHEN** admin types in search field
- **THEN** list filters to show matching titles

#### Scenario: Filter by content type
- **WHEN** admin selects content type filter
- **THEN** list shows only titles of selected type

### Requirement: Create new title
The system SHALL allow admins to create new titles (movies, series, documentaries) with fields: title, type, synopsis, release year, duration, rating, genres, categories, cast members, poster image, and backdrop image.

#### Scenario: Create movie title
- **WHEN** admin fills movie form and submits
- **THEN** new movie title is created in database with all provided metadata

#### Scenario: Create series title
- **WHEN** admin fills series form and submits
- **THEN** new series title is created in database with all provided metadata

#### Scenario: Required field validation
- **WHEN** admin submits form with missing required fields
- **THEN** system displays validation errors and prevents submission

### Requirement: Edit existing title
The system SHALL allow admins to edit all fields of an existing title. Changes SHALL be saved and reflected immediately in the catalog.

#### Scenario: Edit title metadata
- **WHEN** admin modifies title fields and saves
- **THEN** database is updated and catalog reflects changes

#### Scenario: Edit genres and categories
- **WHEN** admin adds or removes genres/categories
- **THEN** title associations are updated in database

### Requirement: Manage episodes for series
For series titles, the system SHALL allow admins to add, edit, and delete episodes. Each episode SHALL have: season number, episode number, title, synopsis, duration, and video file.

#### Scenario: Add episode to series
- **WHEN** admin adds episode with season/episode number and metadata
- **THEN** episode is created and associated with the series

#### Scenario: Edit episode
- **WHEN** admin modifies episode details
- **THEN** episode record is updated in database

#### Scenario: Delete episode
- **WHEN** admin deletes an episode
- **THEN** episode is removed from database and associated video files are marked for deletion

### Requirement: Upload media assets
The system SHALL allow admins to upload poster images, backdrop images, and video files. Images SHALL be validated for format (JPEG, PNG, WebP) and size (max 5MB). Videos SHALL be validated for format and size (max 10GB).

#### Scenario: Upload poster image
- **WHEN** admin uploads a valid poster image
- **THEN** image is stored and URL saved to title record

#### Scenario: Upload video file
- **WHEN** admin uploads a valid video file
- **THEN** video is stored in R2 and encoding pipeline is triggered

#### Scenario: Invalid image format
- **WHEN** admin attempts to upload unsupported image format
- **THEN** system rejects upload with error message

#### Scenario: File size exceeded
- **WHEN** admin uploads file exceeding size limit
- **THEN** system rejects upload with size limit error

### Requirement: Delete title
The system SHALL allow admins to delete titles. Deletion SHALL be soft-delete by default (status set to "deleted") with option for permanent deletion. Associated episodes and media SHALL be handled appropriately.

#### Scenario: Soft delete title
- **WHEN** admin deletes a title
- **THEN** title status is set to "deleted" and it is hidden from catalog

#### Scenario: Permanent delete with confirmation
- **WHEN** admin confirms permanent deletion
- **THEN** title, episodes, and associated media are permanently removed

### Requirement: Content management API endpoints
The system SHALL provide REST API endpoints for content management: `POST /api/admin/titles` (create), `PUT /api/admin/titles/[id]` (update), `DELETE /api/admin/titles/[id]` (delete), `GET /api/admin/titles` (list).

#### Scenario: Create title via API
- **WHEN** admin sends `POST /api/admin/titles` with title data
- **THEN** new title is created and returned with generated ID

#### Scenario: Update title via API
- **WHEN** admin sends `PUT /api/admin/titles/[id]` with updated data
- **THEN** title is updated and changes are returned

#### Scenario: List titles with pagination
- **WHEN** admin sends `GET /api/admin/titles?page=1&limit=20`
- **THEN** API returns paginated list of titles with total count

### Requirement: Admin authentication and authorization
All admin endpoints and pages SHALL require authentication and admin role authorization. Non-admin users SHALL receive 403 Forbidden responses.

#### Scenario: Admin access granted
- **WHEN** authenticated admin user accesses admin pages
- **THEN** content management interface is displayed

#### Scenario: Non-admin access denied
- **WHEN** non-admin user attempts to access admin pages
- **THEN** system returns 403 Forbidden error

#### Scenario: Unauthenticated access denied
- **WHEN** unauthenticated user attempts to access admin pages
- **THEN** system redirects to login page
