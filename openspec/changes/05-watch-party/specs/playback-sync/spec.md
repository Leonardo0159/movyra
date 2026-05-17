## ADDED Requirements

### Requirement: Host Playback Authority
The system SHALL designate the room host as the sole authority for playback state changes. Only the host's play, pause, seek, and playback rate commands SHALL be broadcast to all participants. Non-host playback actions SHALL be sent as requests to the host.

#### Scenario: Host pauses playback
- **WHEN** the host pauses the video
- **THEN** the system broadcasts the pause command with current timestamp to all participants, and all participants' players pause within 500ms

#### Scenario: Non-host attempts to pause
- **WHEN** a non-host participant pauses the video
- **THEN** the system sends a pause request to the host, and the host's client decides whether to apply the pause

#### Scenario: Host seeks to new position
- **WHEN** the host seeks to a new timestamp in the video
- **THEN** the system broadcasts the seek command with the target timestamp to all participants, and all participants' players seek to the specified position

### Requirement: Playback State Synchronization
The system SHALL synchronize playback state using time-offset tuples containing `currentTime`, `playbackRate`, and `serverTimestamp`. Each client SHALL calculate local playback position from the server-provided offset to account for network latency.

#### Scenario: Initial sync on room join
- **WHEN** a new participant joins an active room
- **THEN** the system sends the current playback state (currentTime, playbackRate, isPlaying, serverTimestamp) and the participant's player syncs to the correct position

#### Scenario: Periodic resync
- **WHEN** 30 seconds have elapsed since the last synchronization
- **THEN** the server broadcasts the current authoritative playback state, and clients adjust their playback position if drift exceeds 500ms

#### Scenario: Drift correction
- **WHEN** a client detects playback drift greater than 500ms from the authoritative state
- **THEN** the client smoothly adjusts playback rate by ±0.25x for up to 3 seconds to realign, or performs a hard seek if drift exceeds 2 seconds

### Requirement: Play/Pause Broadcast
The system SHALL broadcast play and pause state changes to all connected participants within the room via WebSocket. The broadcast MUST include the action type, current time, and server timestamp.

#### Scenario: Play broadcast
- **WHEN** the host starts playback
- **THEN** the server broadcasts `{ action: "play", currentTime: <number>, timestamp: <ISO string> }` to all participants

#### Scenario: Pause broadcast
- **WHEN** the host pauses playback
- **THEN** the server broadcasts `{ action: "pause", currentTime: <number>, timestamp: <ISO string> }` to all participants

### Requirement: Seek Synchronization
The system SHALL synchronize seek operations across all participants. When the host seeks, the system MUST broadcast the target timestamp and all participants MUST seek to that position.

#### Scenario: Host seeks forward
- **WHEN** the host seeks forward by 30 seconds
- **THEN** the server broadcasts `{ action: "seek", targetTime: <number>, timestamp: <ISO string> }` and all participants seek to the target time

#### Scenario: Host seeks backward
- **WHEN** the host seeks backward to the beginning of the video
- **THEN** the server broadcasts the seek command with targetTime of 0 and all participants seek to the beginning

### Requirement: Playback Rate Synchronization
The system SHALL synchronize playback rate changes (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x) across all participants. The host's playback rate change SHALL be immediately broadcast to all participants.

#### Scenario: Host changes playback rate
- **WHEN** the host changes playback rate from 1x to 1.5x
- **THEN** the server broadcasts `{ action: "playbackRate", rate: 1.5, timestamp: <ISO string> }` and all participants' players update to 1.5x speed

### Requirement: Network Disconnection Recovery
The system SHALL handle client disconnections gracefully. Upon reconnection, the client SHALL automatically rejoin the room and receive the current playback state to resume synchronized viewing.

#### Scenario: Client disconnects and reconnects
- **WHEN** a participant's WebSocket connection drops and is re-established within 30 seconds
- **THEN** the system automatically rejoins the participant to the room and sends the current playback state for resynchronization

#### Scenario: Prolonged disconnection
- **WHEN** a participant's connection is lost for more than 30 seconds
- **THEN** the system removes the participant from the room and updates presence; if the participant reconnects, they must manually rejoin

### Requirement: Video End Handling
The system SHALL handle video completion events. When the host's video ends, the system SHALL notify all participants and transition the room to a "ended" state.

#### Scenario: Host video ends
- **WHEN** the host's video reaches the end
- **THEN** the server broadcasts `{ action: "ended" }` to all participants, and the room transitions to "ended" state with an option to restart or leave

#### Scenario: Non-host video ends early
- **WHEN** a non-host participant's video ends before the host's (due to buffering or lag)
- **THEN** the client pauses at the end and waits for the host to reach the end before transitioning
