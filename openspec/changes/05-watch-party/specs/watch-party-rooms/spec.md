## ADDED Requirements

### Requirement: Create Watch Party Room
The system SHALL allow authenticated users to create a new Watch Party room for a specific video. Upon creation, the system MUST generate a unique 8-character alphanumeric room ID, assign the creator as the host, and persist the room in PostgreSQL. The room SHALL be accessible via the URL path `/party/[id]`.

#### Scenario: Successful room creation
- **WHEN** an authenticated user creates a Watch Party for a valid video
- **THEN** the system generates a unique 8-character alphanumeric room ID, assigns the user as host, persists the room in the database, and returns the room ID and URL

#### Scenario: Unauthenticated user attempts to create room
- **WHEN** an unauthenticated user attempts to create a Watch Party room
- **THEN** the system returns a 401 Unauthorized error and redirects to login

#### Scenario: Room creation for non-existent video
- **WHEN** a user attempts to create a Watch Party for a video ID that does not exist
- **THEN** the system returns a 404 Not Found error

#### Scenario: Duplicate room ID prevention
- **WHEN** the system generates a room ID that already exists in the database
- **THEN** the system regenerates a new unique ID before persisting

### Requirement: Join Watch Party Room
The system SHALL allow authenticated users to join an existing Watch Party room using the room ID. Upon joining, the system MUST add the user as a participant, update their presence status, and synchronize them to the current playback state.

#### Scenario: Successful room join
- **WHEN** an authenticated user navigates to a valid `/party/[id]` URL
- **THEN** the system adds the user as a participant, connects them via WebSocket, and synchronizes the current playback state

#### Scenario: Join non-existent room
- **WHEN** a user attempts to join a room with an ID that does not exist
- **THEN** the system returns a 404 Not Found error and displays an appropriate message

#### Scenario: Join full room
- **WHEN** a user attempts to join a room that has reached maximum capacity (50 participants)
- **THEN** the system returns a 409 Conflict error with a message indicating the room is full

### Requirement: Leave Watch Party Room
The system SHALL allow participants to leave a Watch Party room at any time. The system MUST remove the participant from the room, update presence for remaining participants, and handle host transfer if the leaving user is the host.

#### Scenario: Participant leaves room
- **WHEN** a participant clicks the "Leave Room" button
- **THEN** the system removes them from the participant list, disconnects their WebSocket, and notifies remaining participants

#### Scenario: Host leaves room
- **WHEN** the host leaves the room and other participants remain
- **THEN** the system promotes the longest-connected participant to host and notifies all remaining participants of the host change

#### Scenario: Last participant leaves room
- **WHEN** the last participant leaves the room
- **THEN** the system marks the room as inactive and preserves the room data in the database

### Requirement: Room Metadata and Information
The system SHALL display room metadata including room ID, host name, participant count, current video title, and room creation time. The room ID SHALL be copyable to clipboard for sharing.

#### Scenario: View room information
- **WHEN** a participant views the Watch Party room page
- **THEN** the system displays the room ID (with copy button), host name, participant count, video title, and creation time

#### Scenario: Copy room ID to clipboard
- **WHEN** a participant clicks the "Copy Link" button
- **THEN** the system copies the full room URL to the clipboard and displays a confirmation toast

### Requirement: Room Lifecycle and Expiration
The system SHALL mark rooms as inactive after all participants have left. Inactive rooms SHALL be queryable for history but SHALL NOT accept new joins. Rooms inactive for more than 24 hours SHALL be eligible for cleanup.

#### Scenario: Room marked inactive
- **WHEN** all participants leave a room
- **THEN** the system updates the room status to "inactive" and records the deactivation timestamp

#### Scenario: Attempt to join inactive room
- **WHEN** a user attempts to join a room with status "inactive"
- **THEN** the system returns a 410 Gone error with a message that the room has ended

#### Scenario: Reactivate inactive room
- **WHEN** the original host rejoins an inactive room within 24 hours of deactivation
- **THEN** the system reactivates the room and restores host status
