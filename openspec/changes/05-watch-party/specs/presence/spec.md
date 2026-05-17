## ADDED Requirements

### Requirement: Real-Time Presence Tracking
The system SHALL track which users are currently connected to each Watch Party room in real-time. Presence information SHALL be stored in Redis for fast access and updated on every connection and disconnection event.

#### Scenario: User joins room presence update
- **WHEN** a user successfully joins a Watch Party room
- **THEN** the system adds the user to the room's presence set in Redis with their user ID, display name, avatar URL, and join timestamp

#### Scenario: User disconnects presence update
- **WHEN** a user's WebSocket connection is closed
- **THEN** the system removes the user from the room's presence set in Redis and broadcasts the departure to remaining participants

### Requirement: Presence Display
The system SHALL display a list of all current room participants with their display name, avatar, and connection status (connected, reconnecting, disconnected). The participant list SHALL be visible to all room participants.

#### Scenario: View participant list
- **WHEN** a participant views the Watch Party room page
- **THEN** the system displays all current participants with their avatar, display name, and a green dot indicator for connected status

#### Scenario: Participant count display
- **WHEN** participants are in a room
- **THEN** the system displays the current participant count (e.g., "5 watching") in the room header

### Requirement: Connection Status Indicators
The system SHALL show real-time connection status for each participant. Statuses SHALL include: "connected" (green), "reconnecting" (yellow), and "disconnected" (gray). Status changes SHALL be reflected within 2 seconds.

#### Scenario: Participant connection drops
- **WHEN** a participant's WebSocket connection drops
- **THEN** the system shows their status as "reconnecting" for up to 30 seconds, then "disconnected" if not restored

#### Scenario: Participant reconnects
- **WHEN** a reconnecting participant's connection is restored
- **THEN** the system updates their status to "connected" and notifies other participants

### Requirement: Host Presence Indicator
The system SHALL clearly indicate which participant is the current host. The host SHALL have a distinct visual indicator (crown icon or "Host" badge) next to their name in the participant list.

#### Scenario: Host identification in participant list
- **WHEN** viewing the participant list
- **THEN** the system displays a crown icon and "Host" label next to the host's name

#### Scenario: Host transfer visual update
- **WHEN** the host leaves and a new host is promoted
- **THEN** the system removes the host indicator from the previous host and adds it to the new host in all participants' views

### Requirement: Presence on Room Entry
The system SHALL broadcast the updated participant list to all room participants whenever someone joins or leaves. New participants SHALL receive the full current participant list upon joining.

#### Scenario: New participant broadcast
- **WHEN** a new user joins the room
- **THEN** the system broadcasts the updated participant list to all existing participants and sends the full list to the new participant

#### Scenario: Participant departure broadcast
- **WHEN** a user leaves the room
- **THEN** the system broadcasts the updated participant list to all remaining participants

### Requirement: Presence Persistence for Rejoin
The system SHALL persist participant join/leave events in PostgreSQL for audit and history purposes. When a room is reactivated, the system SHALL restore presence information from the last known state.

#### Scenario: Participant history recording
- **WHEN** a participant joins or leaves a room
- **THEN** the system records the event in the database with user ID, room ID, action (join/leave), and timestamp

#### Scenario: Room reactivation with presence
- **WHEN** a room is reactivated within 24 hours of deactivation
- **THEN** the system restores the room state and clears any stale presence entries from Redis

### Requirement: Maximum Participant Enforcement
The system SHALL enforce a maximum of 50 participants per Watch Party room. When the limit is reached, the system SHALL reject new join attempts with an appropriate error.

#### Scenario: Room at capacity
- **WHEN** a room has 50 connected participants and a 51st user attempts to join
- **THEN** the system rejects the join attempt and returns a message indicating the room is full

#### Scenario: Spot opens when participant leaves
- **WHEN** a participant leaves a full room
- **THEN** the system updates the participant count and allows the next waiting user to join
