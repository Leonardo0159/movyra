## 1. Database Schema Updates

- [ ] 1.1 Add WatchHistory model to Prisma schema with fields: id, userId, contentId, progressSeconds, totalDuration, lastWatchedAt, completed, createdAt, updatedAt
- [ ] 1.2 Add Favorite model to Prisma schema with fields: id, userId, contentId, createdAt
- [ ] 1.3 Add ParentalSettings model to Prisma schema with fields: id, userId, pinHash, maxAgeRating, enabled, createdAt, updatedAt
- [ ] 1.4 Run Prisma migration to create new tables
- [ ] 1.5 Add unique constraints: Favorite(userId, contentId), WatchHistory(userId, contentId)
- [ ] 1.6 Add indexes for performance: WatchHistory(userId, lastWatchedAt), Favorite(userId)

## 2. Watch History Implementation

- [ ] 2.1 Create Server Action `updateWatchProgress` for reporting playback progress
- [ ] 2.2 Create Server Action `getWatchHistory` for retrieving user's watch history
- [ ] 2.3 Create Server Action `markContentCompleted` for marking content as completed
- [ ] 2.4 Implement progress debounce logic in video player component (15-second interval)
- [ ] 2.5 Add immediate progress save on player pause/stop events
- [ ] 2.6 Create `ContinueWatchingRow` component for home page display
- [ ] 2.7 Add progress bar overlay to content cards in Continue Watching section
- [ ] 2.8 Integrate resume playback prompt in video player when saved progress exists
- [ ] 2.9 Write unit tests for watch progress Server Actions
- [ ] 2.10 Write integration tests for progress reporting flow

## 3. Recommendations Implementation

- [ ] 3.1 Create Redis client utility for caching recommendations
- [ ] 3.2 Implement recommendation algorithm: genre-based scoring from watch history
- [ ] 3.3 Implement similar content matching based on shared genres/tags
- [ ] 3.4 Create Server Action `getRecommendations` with Redis caching (1-hour TTL)
- [ ] 3.5 Create GET Route Handler `/api/recommendations` for client-side fetching
- [ ] 3.6 Implement cache invalidation when watch history changes significantly
- [ ] 3.7 Create `RecommendationsRow` component for home page display
- [ ] 3.8 Add loading skeleton for recommendations section
- [ ] 3.9 Implement fallback to trending content when insufficient history
- [ ] 3.10 Write unit tests for recommendation algorithm
- [ ] 3.11 Write tests for Redis caching behavior

## 4. Favorites Implementation

- [ ] 4.1 Create Server Action `addFavorite` for adding content to favorites
- [ ] 4.2 Create Server Action `removeFavorite` for removing content from favorites
- [ ] 4.3 Create Server Action `getFavorites` for retrieving user's favorites list
- [ ] 4.4 Create Server Action `isFavorite` for checking if content is favorited
- [ ] 4.5 Implement 500-item favorites limit validation
- [ ] 4.6 Create GET Route Handler `/api/favorites` for listing favorites
- [ ] 4.7 Create POST Route Handler `/api/favorites` for adding favorites
- [ ] 4.8 Create DELETE Route Handler `/api/favorites/:contentId` for removing favorites
- [ ] 4.9 Add bookmark icon toggle to content cards with favorite state
- [ ] 4.10 Create "My List" page at `/my-list` with grid layout
- [ ] 4.11 Implement empty state for My List page
- [ ] 4.12 Add "My List" link to main navigation
- [ ] 4.13 Write unit tests for favorites Server Actions
- [ ] 4.14 Write integration tests for favorites API endpoints

## 5. Parental Control Implementation

- [ ] 5.1 Create Server Action `setParentalPin` with bcrypt hashing
- [ ] 5.2 Create Server Action `verifyParentalPin` for PIN verification
- [ ] 5.3 Create Server Action `getParentalSettings` for retrieving settings
- [ ] 5.4 Create Server Action `updateParentalSettings` for updating age rating limits
- [ ] 5.5 Implement PIN attempt tracking and 5-minute lockout after 3 failures
- [ ] 5.6 Create POST Route Handler `/api/parental/pin` for setting PIN
- [ ] 5.7 Create POST Route Handler `/api/parental/verify` for verifying PIN
- [ ] 5.8 Create GET Route Handler `/api/parental/settings` for getting settings
- [ ] 5.9 Create PUT Route Handler `/api/parental/settings` for updating settings
- [ ] 5.10 Create `ParentalControlSettings` page component in profile settings
- [ ] 5.11 Create PIN input dialog component with validation
- [ ] 5.12 Implement content filtering in catalog based on age rating
- [ ] 5.13 Add PIN verification flow for restricted content access
- [ ] 5.14 Implement 30-minute session timeout for PIN verification
- [ ] 5.15 Add adult/child profile distinction for control bypass
- [ ] 5.16 Write unit tests for PIN hashing and verification
- [ ] 5.17 Write integration tests for parental control API endpoints

## 6. UI Integration and Polish

- [ ] 6.1 Update home page layout to include Continue Watching and Recommendations sections
- [ ] 6.2 Add section ordering logic: Continue Watching first, then Recommendations
- [ ] 6.3 Ensure all new sections are responsive and accessible (WCAG 2.1 AA)
- [ ] 6.4 Add keyboard navigation support for all new content rows
- [ ] 6.5 Implement proper loading states for all new sections
- [ ] 6.6 Add error boundaries for recommendation and history sections
- [ ] 6.7 Update profile settings navigation to include parental controls link
- [ ] 6.8 Run Lighthouse audit and ensure performance score > 90

## 7. Testing and Quality

- [ ] 7.1 Write end-to-end tests for watch history flow
- [ ] 7.2 Write end-to-end tests for favorites management
- [ ] 7.3 Write end-to-end tests for parental control PIN flow
- [ ] 7.4 Write end-to-end tests for recommendations display
- [ ] 7.5 Run full test suite and fix any failures
- [ ] 7.6 Run ESLint and fix all warnings/errors
- [ ] 7.7 Verify TypeScript compilation with no errors
- [ ] 7.8 Manual testing of all features in development environment
