## ADDED Requirements

### Requirement: HLS video playback
The system SHALL play HLS (HTTP Live Streaming) video content using HLS.js library. The player SHALL support adaptive bitrate streaming, automatically selecting quality based on network conditions.

#### Scenario: Video starts playing
- **WHEN** user navigates to `/watch/[id]` with valid video content
- **THEN** HLS player loads manifest and begins playback automatically

#### Scenario: Adaptive bitrate switching
- **WHEN** network bandwidth changes during playback
- **THEN** player automatically switches to appropriate quality level

#### Scenario: HLS.js fallback for native HLS support
- **WHEN** browser supports native HLS playback (e.g., Safari)
- **THEN** player uses native `<video>` element instead of HLS.js

### Requirement: Player controls
The system SHALL provide standard video player controls: play/pause, seek bar, volume control, fullscreen toggle, and time display. Controls SHALL auto-hide after 3 seconds of inactivity.

#### Scenario: Play/pause toggle
- **WHEN** user clicks play button or presses Space key
- **THEN** video playback toggles between playing and paused

#### Scenario: Seek to position
- **WHEN** user clicks or drags on seek bar
- **THEN** video jumps to corresponding timestamp

#### Scenario: Volume control
- **WHEN** user adjusts volume slider
- **THEN** audio volume changes from 0% (mute) to 100%

#### Scenario: Fullscreen toggle
- **WHEN** user clicks fullscreen button or presses F key
- **THEN** player enters/exits fullscreen mode

#### Scenario: Controls auto-hide
- **WHEN** user does not interact with player for 3 seconds during playback
- **THEN** controls fade out and hide

#### Scenario: Controls show on mouse move
- **WHEN** user moves mouse over player with controls hidden
- **THEN** controls become visible again

### Requirement: Quality selection
The system SHALL allow users to manually select video quality from available resolutions (e.g., 360p, 480p, 720p, 1080p). Auto quality option SHALL be available and selected by default.

#### Scenario: Open quality menu
- **WHEN** user clicks quality/settings button
- **THEN** player displays list of available quality levels

#### Scenario: Select specific quality
- **WHEN** user selects "720p" from quality menu
- **THEN** player switches to 720p rendition and disables adaptive switching

#### Scenario: Auto quality mode
- **WHEN** user selects "Auto" from quality menu
- **THEN** player resumes adaptive bitrate selection

### Requirement: Subtitle support
The system SHALL display subtitles/captions when available. Users SHALL be able to enable/disable subtitles and select from available languages.

#### Scenario: Enable subtitles
- **WHEN** user enables subtitles from player controls
- **THEN** subtitles are displayed overlaid on video

#### Scenario: Select subtitle language
- **WHEN** multiple subtitle tracks are available and user selects a language
- **THEN** player displays subtitles in selected language

#### Scenario: Disable subtitles
- **WHEN** user disables subtitles
- **THEN** subtitle overlay is removed from video

### Requirement: Keyboard shortcuts
The system SHALL support keyboard shortcuts for common player actions: Space (play/pause), Arrow Left/Right (seek -/+ 5s), Arrow Up/Down (volume), M (mute), F (fullscreen).

#### Scenario: Seek with arrow keys
- **WHEN** user presses Arrow Right key
- **THEN** video seeks forward 5 seconds

#### Scenario: Mute toggle
- **WHEN** user presses M key
- **THEN** audio toggles between muted and unmuted

### Requirement: Player state persistence
The system SHALL save playback position when user leaves the player and resume from that position when they return. Position SHALL be saved every 10 seconds and on pause/exit.

#### Scenario: Save playback position
- **WHEN** user pauses video or navigates away
- **THEN** system saves current playback position to user profile

#### Scenario: Resume playback
- **WHEN** user returns to a previously watched title
- **THEN** player offers to resume from saved position

### Requirement: Player accessibility
The player SHALL be fully accessible: all controls SHALL be keyboard navigable, ARIA labels SHALL be provided, and screen readers SHALL announce playback state changes.

#### Scenario: Keyboard navigation
- **WHEN** user tabs through player controls
- **THEN** each control receives focus and displays visible focus indicator

#### Scenario: Screen reader announcements
- **WHEN** playback state changes (play, pause, seek)
- **THEN** screen reader announces the new state via aria-live region

### Requirement: Watch page layout
The watch page at `/watch/[id]` SHALL display the video player prominently with title information below. For series, episode navigation SHALL be available.

#### Scenario: Movie watch page
- **WHEN** user navigates to `/watch/[movie-id]`
- **THEN** page shows full-width player with movie title and metadata below

#### Scenario: Series watch page with episode navigation
- **WHEN** user navigates to `/watch/[series-id]?episode=[episodeId]`
- **THEN** page shows player with episode title and next/previous episode navigation
