## Why

Currently, the platform has no way to register or upload movies. Users need an admin interface to manage the movie catalog, starting with uploading local video files and registering movie metadata.

## What Changes

- New admin page (`/admin/movies`) accessible only to authenticated administrators
- Movie upload form with file picker for local video files
- Movie metadata registration (title, description, genre, release year, cover image)
- Server-side video processing pipeline (transcode to HLS format)
- Integration with existing database schema for movie entities
- Upload progress tracking and status feedback

## Capabilities

### New Capabilities
- `admin-movie-management`: Admin interface for registering and uploading movies, including form UI, file upload handling, and server-side processing
- `admin-authentication`: Restrict admin routes to authenticated users with admin role

### Modified Capabilities
<!-- Leave empty - no existing specs to modify -->

## Impact

- New page: `src/app/admin/movies/page.tsx`
- New API routes / Server Actions for movie upload and registration
- Database schema updates (Prisma) for movie entity if not already present
- Video processing service integration (FFmpeg transcoding to HLS)
- Affected agents: frontend-ui, backend-api, video-engineering
