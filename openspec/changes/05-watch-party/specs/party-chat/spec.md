## ADDED Requirements

### Requirement: Send Chat Message
The system SHALL allow participants in a Watch Party room to send text messages visible to all other participants in the same room. Messages SHALL be limited to 500 characters and MUST be persisted in PostgreSQL.

#### Scenario: Successful message send
- **WHEN** a participant types a message and submits it
- **THEN** the system broadcasts the message to all room participants via WebSocket, persists it to the database with sender ID, timestamp, and room ID, and displays it in the chat UI

#### Scenario: Message exceeds character limit
- **WHEN** a participant attempts to send a message longer than 500 characters
- **THEN** the system truncates the message to 500 characters or rejects it with an error message

#### Scenario: Unauthenticated user attempts to send message
- **WHEN** an unauthenticated user attempts to send a chat message
- **THEN** the system rejects the message and returns a 401 Unauthorized error

### Requirement: Message Ordering and Delivery
The system SHALL assign monotonically increasing sequence numbers to chat messages within a room. Messages SHALL be displayed in sequence order, not arrival order, to ensure consistent ordering across all clients.

#### Scenario: Concurrent message ordering
- **WHEN** two participants send messages within the same 100ms window
- **THEN** the server assigns sequence numbers and all clients display the messages in the same order

#### Scenario: Message delivery to all participants
- **WHEN** a participant sends a message
- **THEN** all other connected participants receive the message within 200ms

### Requirement: Chat History on Join
The system SHALL load the last 50 chat messages when a participant joins or rejoins a Watch Party room. Older messages SHALL be loadable via pagination.

#### Scenario: Load chat history on join
- **WHEN** a participant joins an active room
- **THEN** the system fetches and displays the last 50 messages from the database, ordered by sequence number ascending

#### Scenario: Load older messages via pagination
- **WHEN** a participant scrolls to the top of the chat history
- **THEN** the system fetches the next 50 older messages and prepends them to the chat display

### Requirement: Message Metadata
Each chat message SHALL include the sender's user ID, display name, avatar URL, timestamp, and sequence number. The system SHALL display this metadata alongside the message content.

#### Scenario: Display message with sender info
- **WHEN** a message is displayed in the chat UI
- **THEN** the system shows the sender's avatar, display name, message content, and relative timestamp (e.g., "2 min ago")

### Requirement: Host Kick from Chat
The system SHALL allow the room host to remove a participant from the chat. A kicked participant SHALL be disconnected from the WebSocket room and removed from the participant list.

#### Scenario: Host kicks participant
- **WHEN** the host selects "Kick" on a participant
- **THEN** the system disconnects the participant from the room, removes them from the participant list, and notifies remaining participants

#### Scenario: Non-host attempts to kick
- **WHEN** a non-host participant attempts to kick another participant
- **THEN** the system rejects the action and returns a 403 Forbidden error

### Requirement: Chat Input Accessibility
The chat input SHALL be keyboard accessible, support screen readers, and include proper ARIA labels. The chat message list SHALL be announced to assistive technology when new messages arrive.

#### Scenario: Keyboard navigation in chat
- **WHEN** a user navigates the chat interface using only keyboard
- **THEN** the user can tab to the input field, type a message, and submit with Enter key

#### Scenario: Screen reader announces new messages
- **WHEN** a new message arrives in the chat
- **THEN** the system uses ARIA live regions to announce the sender name and message content to screen readers

### Requirement: Message Rate Limiting
The system SHALL enforce a rate limit of 10 messages per 10 seconds per participant to prevent spam. Exceeding the rate limit SHALL result in temporary message rejection.

#### Scenario: Rate limit enforced
- **WHEN** a participant sends more than 10 messages within 10 seconds
- **THEN** the system rejects subsequent messages for the remainder of the 10-second window and displays a cooldown message

#### Scenario: Rate limit resets
- **WHEN** the 10-second window expires after rate limit is triggered
- **THEN** the system allows the participant to send messages again
