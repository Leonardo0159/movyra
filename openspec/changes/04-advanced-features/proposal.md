## Why

After the core catalog and player are built, users need personalized features: watch history, recommendations, favorites list, and parental controls. These features (FR-6, FR-7, FR-8, FR-10) improve engagement and make the platform feel complete.

## What Changes

- Track watch history and implement "continue watching"
- Build basic recommendation system (genre/history-based)
- Create "My List" favorites functionality
- Implement parental controls with PIN and age rating restrictions
- Add UI for recommendations, history, and favorites sections

## Capabilities

### New Capabilities
- `watch-history`: Track viewing progress, "continue watching" feature, resume playback
- `recommendations`: Basic recommendation engine based on genre and viewing history
- `favorites`: "My List" functionality to save and manage favorite titles
- `parental-control`: PIN-based content restriction by age rating

### Modified Capabilities
- None

## Impact

- Adds database models: WatchHistory, Favorite, ParentalSettings
- New API routes: `/api/history`, `/api/recommendations`, `/api/favorites`, `/api/parental`
- Modifies video player to report progress to history
- Adds recommendation sections to home page
- Adds parental control settings to profile management
- Depends on: project-foundation-setup, user-auth-profiles, video-catalog-player
- Agents involved: backend-api, frontend-ui
