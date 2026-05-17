## ADDED Requirements

### Requirement: Track watch progress
The system SHALL track viewing progress for each user and content item, storing the current playback position in seconds, total duration, and timestamp of last viewing.

#### Scenario: User watches content and progress is saved
- **WHEN** user watches a video and the player reports progress
- **THEN** system stores the current position, total duration, and last watched timestamp

#### Scenario: Progress is updated on subsequent views
- **WHEN** user resumes watching the same content
- **THEN** system updates the existing record with new progress and timestamp

### Requirement: Resume playback from last position
The system SHALL allow users to resume playback from their last saved position when they re-watch content.

#### Scenario: User resumes from saved position
- **WHEN** user opens content they have previously watched with saved progress
- **THEN** player offers to resume from the last saved position

#### Scenario: No resume for completed content
- **WHEN** user opens content marked as completed
- **THEN** player starts from the beginning without resume option

### Requirement: Continue Watching section
The system SHALL display a "Continue Watching" section on the home page showing recently watched content with progress indicators, ordered by most recently watched.

#### Scenario: Continue Watching displays recent content
- **WHEN** user navigates to home page with watch history
- **THEN** "Continue Watching" section shows up to 10 recently watched items with progress bars

#### Scenario: Empty Continue Watching section
- **WHEN** user has no watch history
- **THEN** "Continue Watching" section is not displayed

### Requirement: Mark content as completed
The system SHALL mark content as completed when the user watches at least 90% of the total duration.

#### Scenario: Content marked as completed
- **WHEN** user watches past 90% of total duration
- **THEN** content is marked as completed in watch history

#### Scenario: Content not completed below threshold
- **WHEN** user stops watching before 90% of total duration
- **THEN** content remains marked as in-progress with current progress saved

### Requirement: Progress reporting debounce
The system SHALL debounce progress updates to avoid excessive database writes, reporting progress at intervals of no more than 15 seconds.

#### Scenario: Progress updates are debounced
- **WHEN** player is actively playing content
- **THEN** progress is reported to the server at most every 15 seconds

#### Scenario: Progress saved on pause/stop
- **WHEN** user pauses or stops playback
- **THEN** current progress is immediately saved regardless of debounce interval
