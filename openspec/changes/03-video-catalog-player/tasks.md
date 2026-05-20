## 1. Database Schema & Migrations

- [x] 1.1 Create Prisma schema models: Title, Episode, Category, Genre, CastMember, VideoVersion
- [x] 1.2 Add relations between models (Title-Category, Title-Genre, Title-CastMember, Title-Episode, Episode-VideoVersion)
- [x] 1.3 Create and run Prisma migration
- [x] 1.4 Seed database with sample categories and genres

## 2. Storage Configuration (Cloudflare R2)

- [x] 2.1 Configure Cloudflare R2 bucket and credentials in environment variables
- [x] 2.2 Implement R2 client utility with S3-compatible SDK
- [x] 2.3 Create presigned URL generation function for uploads
- [x] 2.4 Implement file upload validation (format, size limits)
- [x] 2.5 Set up storage path conventions (`videos/{titleId}/`, `thumbnails/{titleId}/`)

## 3. Video Encoding Pipeline

- [x] 3.1 Install FFmpeg and verify installation
- [x] 3.2 Create FFmpeg wrapper function for HLS transcoding with multiple bitrates
- [x] 3.3 Implement master HLS playlist generation
- [x] 3.4 Set up Redis connection and BullMQ queue for encoding jobs
- [x] 3.5 Create encoding job worker with concurrency limit (max 2)
- [x] 3.6 Implement thumbnail extraction at 10%, 30%, 50%, 70%, 90% of duration
- [x] 3.7 Upload encoded HLS files and thumbnails to R2
- [x] 3.8 Update database with video version metadata after encoding completes
- [x] 3.9 Implement job status tracking (pending, processing, completed, failed)
- [x] 3.10 Add error handling and retry logic for failed encoding jobs

## 4. Catalog API & Server Components

- [x] 4.1 Create `GET /api/catalog` endpoint with pagination, filtering, and search
- [x] 4.2 Implement catalog data fetching function with Prisma queries
- [x] 4.3 Create catalog page Server Component at `/catalog/page.tsx`
- [x] 4.4 Build category row component with horizontal scrolling
- [x] 4.5 Build title card component with poster, title, year, type badge, rating
- [x] 4.6 Implement filter bar component (type + genre filters)
- [x] 4.7 Implement search input with 300ms debounce
- [x] 4.8 Add infinite scroll or pagination for catalog loading
- [x] 4.9 Add loading states and error handling for catalog page

## 5. Title Details Page

- [x] 5.1 Create `GET /api/titles/[id]` endpoint
- [x] 5.2 Create title details page Server Component at `/title/[id]/page.tsx`
- [x] 5.3 Build backdrop hero section with poster overlay
- [x] 5.4 Build metadata display component (year, duration, rating, genres)
- [x] 5.5 Build cast member list component with placeholder avatars
- [x] 5.6 Build episode list component for series with season selector
- [x] 5.7 Build related content section with genre-based recommendations
- [x] 5.8 Implement "Watch" button navigation to `/watch/[id]`
- [x] 5.9 Add 404 handling for non-existent titles
- [x] 5.10 Add loading states and error handling for details page

## 6. Video Player Component

- [x] 6.1 Install HLS.js dependency
- [x] 6.2 Create base video player component with HLS.js integration
- [x] 6.3 Implement play/pause controls with keyboard shortcut (Space)
- [x] 6.4 Implement seek bar with click and drag support
- [x] 6.5 Implement volume control with mute toggle (M key)
- [x] 6.6 Implement fullscreen toggle (F key)
- [x] 6.7 Implement time display (current / duration)
- [x] 6.8 Add controls auto-hide after 3 seconds of inactivity
- [x] 6.9 Implement quality selection menu with available renditions
- [x] 6.10 Implement subtitle track selection and display
- [x] 6.11 Add keyboard shortcuts: Arrow Left/Right (seek ±5s), Arrow Up/Down (volume)
- [x] 6.12 Implement playback position saving (every 10s + on pause/exit)
- [x] 6.13 Implement resume playback from saved position
- [x] 6.14 Add ARIA labels and keyboard navigation for accessibility
- [x] 6.15 Add aria-live regions for screen reader state announcements
- [x] 6.16 Implement native HLS fallback for Safari

## 7. Watch Page

- [x] 7.1 Create watch page at `/watch/[id]/page.tsx`
- [x] 7.2 Integrate video player component with title/episode video URL
- [x] 7.3 Display title/episode metadata below player
- [x] 7.4 Implement next/previous episode navigation for series
- [x] 7.5 Add loading state while video manifest loads
- [x] 7.6 Add error state for unavailable or failed video content

## 8. Admin Content Management UI

- [x] 8.1 Create admin layout with navigation sidebar
- [x] 8.2 Build content list page at `/admin/content` with search, filter, pagination
- [x] 8.3 Build title form component for create/edit (movies and series)
- [x] 8.4 Implement genre/category multi-select in title form
- [x] 8.5 Implement cast member management in title form
- [x] 8.6 Build image upload component (poster, backdrop) with validation
- [x] 8.7 Build video upload component with progress indicator
- [x] 8.8 Build episode management UI for series (add, edit, delete episodes)
- [x] 8.9 Implement soft delete with confirmation dialog
- [x] 8.10 Add admin role authorization check to all admin pages

## 9. Admin Content Management API

- [x] 9.1 Create `POST /api/admin/titles` endpoint for title creation
- [x] 9.2 Create `PUT /api/admin/titles/[id]` endpoint for title update
- [x] 9.3 Create `DELETE /api/admin/titles/[id]` endpoint for soft/hard delete
- [x] 9.4 Create `GET /api/admin/titles` endpoint with pagination
- [x] 9.5 Create `POST /api/admin/upload/presign` endpoint for presigned URLs
- [x] 9.6 Create `POST /api/admin/encoding/trigger` endpoint to start encoding
- [x] 9.7 Create `GET /api/admin/encoding/[jobId]` endpoint for job status
- [x] 9.8 Add admin role middleware to all admin API routes
- [x] 9.9 Implement webhook handler for encoding completion notification

## 10. Testing

- [x] 10.1 Write unit tests for catalog API endpoint
- [x] 10.2 Write unit tests for title details API endpoint
- [x] 10.3 Write unit tests for FFmpeg encoding wrapper
- [x] 10.4 Write unit tests for presigned URL generation
- [x] 10.5 Write component tests for title card component
- [x] 10.6 Write component tests for video player controls
- [x] 10.7 Write integration test for catalog page with filters
- [x] 10.8 Write integration test for title details page
- [x] 10.9 Write integration test for admin content CRUD operations

## 11. Polish & Accessibility

- [x] 11.1 Run Lighthouse audit on catalog page (target: >90)
- [x] 11.2 Run Lighthouse audit on watch page (target: >90)
- [x] 11.3 Verify WCAG 2.1 AA compliance on all pages
- [x] 11.4 Test keyboard navigation across all interactive elements
- [x] 11.5 Test screen reader compatibility (NVDA/VoiceOver)
- [x] 11.6 Add Sentry error tracking to player and encoding components
- [x] 11.7 Verify responsive design on mobile, tablet, and desktop
