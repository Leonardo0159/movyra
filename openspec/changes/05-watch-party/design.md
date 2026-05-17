## Context

Movyra is a streaming platform (Netflix-like) built with Next.js 16.2.6 App Router, React 19.2.4, TypeScript 5, PostgreSQL with Prisma ORM, and Redis. The platform currently supports video catalog browsing and HLS playback with adaptive bitrate.

Watch Party introduces real-time synchronized viewing sessions where multiple users can watch the same content together, with synchronized playback controls and live chat. This is the first feature requiring WebSocket-based real-time communication and cross-client state synchronization.

The feature depends on: project-foundation-setup, user-auth-profiles, video-catalog-player. All prerequisite database models (User, Video, Session) and authentication flows are assumed to be in place.

Constraints:
- Next.js App Router architecture with server components as default
- Must work with existing HLS.js video player infrastructure
- Must scale beyond single-server via Redis pub/sub
- Must maintain WCAG 2.1 AA accessibility standards

## Goals / Non-Goals

**Goals:**
- Enable users to create and join Watch Party rooms with unique shareable IDs
- Synchronize video playback state (play, pause, seek, playback rate) across all participants in real-time
- Provide real-time text chat within Watch Party rooms
- Track and display user presence (who is in the room, connection status)
- Implement host controls with play/pause authority
- Support invitation flow via shareable room links
- Handle network disconnections gracefully with automatic rejoin and state resync

**Non-Goals:**
- Video/audio voice chat (future feature)
- Screen sharing capabilities
- Cross-platform native apps (web only for now)
- Watch Party scheduling or recurring sessions
- Content recommendation within Watch Party context
- Moderation tools beyond host kick functionality

## Decisions

### D1: WebSocket Implementation — Socket.io over Native WebSockets

**Decision:** Use Socket.io for WebSocket communication.

**Rationale:** Socket.io provides built-in rooms/namespaces, automatic reconnection, fallback transports, and binary support. Native WebSockets would require reimplementing these features. Socket.io's room abstraction maps directly to Watch Party rooms, simplifying presence and broadcast logic.

**Alternatives considered:**
- Native WebSockets: lighter weight but requires manual reconnection, heartbeat, and room management
- Server-Sent Events + WebSocket hybrid: unnecessary complexity for bidirectional needs
- Pusher/Ably (managed): adds external dependency and cost; self-hosted preferred for study project

### D2: Playback Sync Authority — Host-Driven Model

**Decision:** The room host is the sole authority for playback state changes. Client actions from non-host participants are sent as requests to the host, who relays the authoritative state.

**Rationale:** Prevents conflicting playback commands (e.g., two users pausing simultaneously). The host model is simple, predictable, and matches user expectations for "watch parties." The host's player state is broadcast to all participants via the server.

**Alternatives considered:**
- Server-authoritative: server tracks time and broadcasts; adds server-side timer complexity and latency sensitivity
- Last-write-wins: causes jarring jumps when multiple users interact
- Voting-based: too complex for MVP

### D3: State Synchronization — Time-Offset Model

**Decision:** Synchronize using `currentTime + playbackRate + timestamp` tuples rather than raw `currentTime` values. Each client calculates local offset from server timestamp to account for network latency.

**Rationale:** Raw currentTime broadcasts accumulate drift over time. The time-offset model allows each client to independently calculate expected playback position, reducing drift and server load. The server broadcasts state changes, and clients reconcile using the provided timestamp.

**Alternatives considered:**
- Periodic currentTime polling: wastes bandwidth, introduces visible jumps
- NTP-style clock sync: overkill for video playback tolerance (~500ms acceptable)

### D4: Database Persistence — Prisma Models for Rooms and Messages

**Decision:** Persist WatchParty rooms and chat messages in PostgreSQL via Prisma. Use Redis for ephemeral presence and real-time pub/sub only.

**Rationale:** Chat history and room metadata need persistence for rejoin scenarios and audit. Redis is unsuitable for durable storage. Prisma provides type-safe queries that integrate with existing TypeScript codebase.

**Alternatives considered:**
- Redis-only: fast but data loss on restart; unacceptable for chat history
- MongoDB: adds another database; PostgreSQL already in use

### D5: Redis Pub/Sub for Multi-Server Scaling

**Decision:** Use Redis pub/sub to broadcast WebSocket events across multiple server instances. Each server instance subscribes to room channels and relays messages to locally connected clients.

**Rationale:** Socket.io's adapter pattern with Redis supports horizontal scaling. When a user sends a message, the receiving server publishes to Redis; all servers subscribed to that room channel receive and deliver to their local clients.

**Alternatives considered:**
- Sticky sessions: limits scaling flexibility and requires load balancer configuration
- Single server: acceptable for development but not production-ready

### D6: Video Player Integration — External Sync Controls via Ref/Context

**Decision:** Extend the existing HLS.js player component to accept external sync commands via React Context. A `WatchPartySyncContext` provides `play()`, `pause()`, `seek(time)`, and `setPlaybackRate(rate)` methods that the player component consumes.

**Rationale:** Decouples sync logic from player rendering. The player remains a reusable component; sync is layered on top via context. This avoids prop drilling and keeps the player component testable in isolation.

**Alternatives considered:**
- Direct prop passing: verbose and hard to manage with nested components
- Global state (Zustand/Redux): overkill for component-local sync needs
- Custom events: harder to type and test

### D7: Room Identification — URL-Based Short IDs

**Decision:** Watch Party rooms are identified by URL-friendly short IDs (8-character alphanumeric, e.g., `aB3xK9mQ`). Rooms are accessed via `/party/[id]` route.

**Rationale:** Short IDs are easy to share and type. UUIDs are too long for manual entry. The `/party/[id]` route follows Next.js App Router conventions for dynamic routes.

**Alternatives considered:**
- UUID: too long for sharing
- Sequential integers: predictable, security concern
- Custom slugs: collision risk, requires uniqueness checks

## Risks / Trade-offs

### [Clock Drift Between Clients] → Mitigation
Network latency varies per client, causing playback to drift over time.
**Mitigation:** Implement periodic resync (every 30 seconds) where server broadcasts authoritative time. Clients smoothly adjust using small playback rate tweaks rather than hard seeks. Acceptable drift threshold: ±500ms.

### [Host Disconnect] → Mitigation
If the host disconnects, playback sync authority is lost.
**Mitigation:** Automatically promote the longest-connected participant to host. Display notification to all participants. Persist host state in Redis for quick recovery.

### [Chat Message Ordering] → Mitigation
Concurrent messages from multiple clients may arrive out of order.
**Mitigation:** Server assigns monotonically increasing sequence numbers to messages. Clients render in sequence order, not arrival order.

### [Scalability of Broadcast] → Mitigation
Large rooms (>50 participants) generate significant broadcast traffic.
**Mitigation:** Implement message batching for chat (group messages into 100ms windows). Cap room size at 50 participants for MVP. Use Redis pub/sub for multi-server distribution.

### [Video Provider Restrictions] → Trade-off
Some video content may have DRM or embedding restrictions that prevent synchronized playback.
**Mitigation:** Only allow Watch Party for content owned by the platform. Display clear error if content is not eligible.

### [Redis as Single Point of Failure] → Trade-off
If Redis goes down, real-time features break but rooms persist in PostgreSQL.
**Mitigation:** Graceful degradation: room data remains accessible, chat messages are persisted but not delivered in real-time. Users see "connection restored" message when Redis recovers.

## Migration Plan

### Deployment Steps
1. Deploy Prisma schema migration (WatchParty, WatchPartyParticipant, ChatMessage tables)
2. Deploy Redis instance and configure connection
3. Deploy WebSocket server endpoint (`/api/socket` or dedicated Socket.io server)
4. Deploy API routes for room CRUD operations
5. Deploy frontend pages (`/party/[id]`, party creation UI)
6. Enable feature flag for Watch Party (gradual rollout)
7. Monitor WebSocket connection metrics and error rates via Sentry

### Rollback Strategy
- Feature flag allows instant disable of Watch Party UI
- WebSocket server can be decommissioned without affecting core platform
- Database tables can remain; no destructive rollback needed
- If issues detected, disable feature flag and investigate; no data loss

## Open Questions

1. **Should Watch Party rooms expire?** Define TTL for inactive rooms (e.g., 24 hours after last activity) vs. permanent rooms.
2. **Maximum room size?** Proposing 50 for MVP; needs validation with load testing.
3. **Should chat support reactions/emotes?** Out of scope for MVP but should design message schema to support future extensions.
4. **How to handle different video qualities?** All participants should use the same quality tier; host's quality setting should be broadcast. Needs investigation into HLS.js multi-client quality sync.
5. **Should there be a "ready" state before playback starts?** Consider a waiting room phase where host can start when everyone is ready.
