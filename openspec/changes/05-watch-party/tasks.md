## 1. Database Schema and Prisma Migration

- [ ] 1.1 Add WatchParty model to Prisma schema with fields: id, videoId, hostId, status, createdAt, updatedAt, deactivatedAt
- [ ] 1.2 Add WatchPartyParticipant model with fields: id, roomId, userId, joinedAt, leftAt, role (host/participant)
- [ ] 1.3 Add ChatMessage model with fields: id, roomId, userId, content, sequenceNumber, createdAt
- [ ] 1.4 Add relations between WatchParty, WatchPartyParticipant, ChatMessage, User, and Video models
- [ ] 1.5 Generate Prisma client and run migration
- [ ] 1.6 Verify migration with `npx prisma studio`

## 2. WebSocket Server Infrastructure

- [ ] 2.1 Install Socket.io and @socket.io/redis-adapter dependencies
- [ ] 2.2 Create Socket.io server setup at `src/server/socket.ts` with Redis adapter configuration
- [ ] 2.3 Implement Socket.io route handler at `src/app/api/socket/route.ts` for Next.js integration
- [ ] 2.4 Configure Redis connection with environment variables
- [ ] 2.5 Implement room-based namespace routing (each Watch Party room as a Socket.io room)
- [ ] 2.6 Add connection authentication middleware (validate JWT token on WebSocket connect)
- [ ] 2.7 Implement heartbeat/ping-pong mechanism for connection health monitoring
- [ ] 2.8 Add Socket.io event types in `src/types/socket.ts` with TypeScript interfaces

## 3. Watch Party Room API

- [ ] 3.1 Create `POST /api/watch-party` endpoint for room creation
- [ ] 3.2 Implement room ID generation (8-char alphanumeric) with collision detection
- [ ] 3.3 Create `GET /api/watch-party/[id]` endpoint for room retrieval
- [ ] 3.4 Create `POST /api/watch-party/[id]/join` endpoint for joining a room
- [ ] 3.5 Create `POST /api/watch-party/[id]/leave` endpoint for leaving a room
- [ ] 3.6 Implement room capacity check (max 50 participants)
- [ ] 3.7 Add host transfer logic when host leaves
- [ ] 3.8 Create `GET /api/watch-party/[id]/participants` endpoint for participant list
- [ ] 3.9 Add input validation and error handling for all endpoints
- [ ] 3.10 Write unit tests for room API endpoints

## 4. Playback Sync Server Logic

- [ ] 4.1 Implement Socket.io event handler for `playback:action` (play, pause, seek, playbackRate)
- [ ] 4.2 Add host authority validation (only host actions are broadcast)
- [ ] 4.3 Implement non-host playback request forwarding to host
- [ ] 4.4 Create time-offset calculation utility with server timestamp
- [ ] 4.5 Implement periodic resync broadcast (every 30 seconds)
- [ ] 4.6 Add video end event handler and room state transition
- [ ] 4.7 Implement drift detection and correction logic on server side
- [ ] 4.8 Write unit tests for playback sync logic

## 5. Chat Server Logic

- [ ] 5.1 Implement Socket.io event handler for `chat:message`
- [ ] 5.2 Add sequence number generation (monotonically increasing per room)
- [ ] 5.3 Implement message persistence to PostgreSQL
- [ ] 5.4 Add message broadcast to all room participants
- [ ] 5.5 Implement rate limiting (10 messages per 10 seconds per user)
- [ ] 5.6 Create `GET /api/watch-party/[id]/chat` endpoint for chat history with pagination
- [ ] 5.7 Add message validation (max 500 characters, sanitize input)
- [ ] 5.8 Implement host kick functionality via Socket.io event
- [ ] 5.9 Write unit tests for chat logic

## 6. Presence Server Logic

- [ ] 6.1 Implement Socket.io connection handler for presence tracking in Redis
- [ ] 6.2 Add participant join/leave events to Redis sets
- [ ] 6.3 Implement presence broadcast on join/leave
- [ ] 6.4 Add connection status tracking (connected, reconnecting, disconnected)
- [ ] 6.5 Implement presence cleanup on disconnect with 30-second grace period
- [ ] 6.6 Create presence state restoration on room reactivation
- [ ] 6.7 Write unit tests for presence logic

## 7. Watch Party Room UI

- [ ] 7.1 Create `/party/[id]/page.tsx` route with server component for room data fetching
- [ ] 7.2 Build room header component with room ID, video title, participant count
- [ ] 7.3 Implement "Copy Link" button with clipboard API and toast notification
- [ ] 7.4 Create participant list sidebar component with avatars and status indicators
- [ ] 7.5 Add host badge/crown icon for host identification
- [ ] 7.6 Build room creation flow (button on video player page)
- [ ] 7.7 Implement join room UI with loading states and error handling
- [ ] 7.8 Add "Leave Room" button with confirmation
- [ ] 7.9 Style all components with shadcn/ui and Tailwind CSS 4
- [ ] 7.10 Ensure accessibility (WCAG 2.1 AA) for all room UI components

## 8. Video Player Sync Integration

- [ ] 8.1 Create `WatchPartySyncContext` React Context with sync methods (play, pause, seek, setPlaybackRate)
- [ ] 8.2 Modify existing HLS.js player component to accept external sync commands via context
- [ ] 8.3 Implement host playback controls that emit Socket.io events
- [ ] 8.4 Implement non-host playback controls that send requests to host
- [ ] 8.5 Add smooth drift correction (playback rate adjustment) for minor drift
- [ ] 8.6 Add hard seek for major drift (>2 seconds)
- [ ] 8.7 Implement periodic resync UI indicator
- [ ] 8.8 Handle video end state with room-ended overlay
- [ ] 8.9 Write component tests for sync context and player integration

## 9. Chat UI

- [ ] 9.1 Create chat panel component with message list and input
- [ ] 9.2 Implement message display with avatar, name, content, and timestamp
- [ ] 9.3 Add chat input with character counter (500 max) and send button
- [ ] 9.4 Implement real-time message reception via Socket.io
- [ ] 9.5 Add auto-scroll to latest message behavior
- [ ] 9.6 Implement chat history loading on join (last 50 messages)
- [ ] 9.7 Add "load older messages" pagination on scroll to top
- [ ] 9.8 Implement rate limit cooldown UI feedback
- [ ] 9.9 Add ARIA live regions for screen reader announcements
- [ ] 9.10 Style chat with shadcn/ui components and Tailwind CSS 4

## 10. Presence UI

- [ ] 10.1 Create presence status indicator component (green/yellow/gray dots)
- [ ] 10.2 Implement real-time participant list updates via Socket.io
- [ ] 10.3 Add "X watching" count in room header
- [ ] 10.4 Implement join/leave animations for participant list
- [ ] 10.5 Add reconnection status banner when connection drops
- [ ] 10.6 Implement "room full" error display
- [ ] 10.7 Write component tests for presence UI

## 11. Error Handling and Edge Cases

- [ ] 11.1 Implement WebSocket reconnection logic with exponential backoff
- [ ] 11.2 Add "reconnecting" overlay UI during connection loss
- [ ] 11.3 Handle host disconnect with automatic promotion UI notification
- [ ] 11.4 Implement graceful degradation when Redis is unavailable
- [ ] 11.5 Add error boundaries for Watch Party page components
- [ ] 11.6 Implement Sentry error tracking for WebSocket and API errors
- [ ] 11.7 Add loading states for all async operations
- [ ] 11.8 Handle invalid room ID URL format

## 12. Testing and Verification

- [ ] 12.1 Write integration tests for WebSocket room events
- [ ] 12.2 Write integration tests for playback sync flow (play, pause, seek)
- [ ] 12.3 Write integration tests for chat message flow
- [ ] 12.4 Write integration tests for presence tracking
- [ ] 12.5 Test multi-client synchronization with 3+ simulated clients
- [ ] 12.6 Test host disconnect and promotion scenario
- [ ] 12.7 Test reconnection and state resync
- [ ] 12.8 Run accessibility audit with axe-core on Watch Party pages
- [ ] 12.9 Run Lighthouse performance audit (target: >90)
- [ ] 12.10 Run full test suite and fix any failures

## 13. Documentation and Cleanup

- [ ] 13.1 Update AGENTS.md with Watch Party architecture overview
- [ ] 13.2 Add environment variable documentation for Redis and Socket.io config
- [ ] 13.3 Document WebSocket event contracts in a reference file
- [ ] 13.4 Run `npm run lint` and fix all linting errors
- [ ] 13.5 Run `npm run build` and verify production build succeeds
- [ ] 13.6 Clean up unused imports and dead code
