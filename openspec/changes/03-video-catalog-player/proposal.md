## Why

The core value of a streaming platform is browsing content and watching videos. This change implements the catalog (FR-3), title details page (FR-4), and video player (FR-5) - the essential features that define the platform.

## What Changes

- Build catalog page with categories, filters, and search
- Create title detail pages (movies, series with episodes)
- Implement HLS video player with full controls (play/pause, seek, volume, fullscreen, quality, subtitles)
- Set up video encoding pipeline (FFmpeg for HLS transcoding)
- Configure CDN for video delivery
- Implement admin content management (upload, edit, delete titles)

## Capabilities

### New Capabilities
- `catalog`: Browse, filter, search content by categories (movies, series, documentaries)
- `title-details`: Title detail page with synopsis, cast, duration, rating, episodes for series
- `video-player`: HLS video player with controls, quality selection, subtitle support
- `video-encoding`: FFmpeg pipeline for HLS transcoding with multiple bitrates
- `content-management`: Admin panel for uploading and managing catalog content

### Modified Capabilities
- None

## Impact

- Adds database models: Title, Episode, Category, Genre, CastMember
- New pages: `/catalog`, `/title/[id]`, `/watch/[id]`, `/admin/content`
- New API routes: `/api/catalog`, `/api/titles`, `/api/admin/upload`
- Video storage integration (S3/R2)
- FFmpeg integration for encoding
- CDN configuration for video delivery
- Depends on: project-foundation-setup, user-auth-profiles
- Agents involved: video-engineering, frontend-ui, backend-api, devops-infra
