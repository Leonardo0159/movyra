## 1. Database Schema & Migrations

- [ ] 1.1 Create Prisma schema models: Title, Episode, Category, Genre, CastMember, VideoVersion
- [ ] 1.2 Add relations between models (Title-Category, Title-Genre, Title-CastMember, Title-Episode, Episode-VideoVersion)
- [ ] 1.3 Create and run Prisma migration
- [ ] 1.4 Seed database with sample categories and genres

## 2. Storage Configuration (Cloudflare R2)

- [ ] 2.1 Configure Cloudflare R2 bucket and credentials in environment variables
- [ ] 2.2 Implement R2 client utility with S3-compatible SDK
- [ ] 2.3 Create presigned URL generation function for uploads
- [ ] 2.4 Implement file upload validation (format, size limits)
- [ ] 2.5 Set up storage path conventions (`videos/{titleId}/`, `thumbnails/{titleId}/`)

## 3. Video Encoding Pipeline

- [ ] 3.1 Install FFmpeg and verify installation
- [ ] 3.2 Create FFmpeg wrapper function for HLS transcoding with multiple bitrates
- [ ] 3.3 Implement master HLS playlist generation
- [ ] 3.4 Set up Redis connection and BullMQ queue for encoding jobs
- [ ] 3.5 Create encoding job worker with concurrency limit (max 2)
- [ ] 3.6 Implement thumbnail extraction at 10%, 30%, 50%, 70%, 90% of duration
- [ ] 3.7 Upload encoded HLS files and thumbnails to R2
- [ ] 3.8 Update database with video version metadata after encoding completes
- [ ] 3.9 Implement job status tracking (pending, processing, completed, failed)
- [ ] 3.10 Add error handling and retry logic for failed encoding jobs

## 4. Catalog API & Server Components

- [ ] 4.1 Create `GET /api/catalog` endpoint with pagination, filtering, and search
- [ ] 4.2 Implement catalog data fetching function with Prisma queries
- [ ] 4.3 Create catalog page Server Component at `/catalog/page.tsx`
- [ ] 4.4 Build category row component with horizontal scrolling
- [ ] 4.5 Build title card component with poster, title, year, type badge, rating
- [ ] 4.6 Implement filter bar component (type + genre filters)
- [ ] 4.7 Implement search input with 300ms debounce
- [ ] 4.8 Add infinite scroll or pagination for catalog loading
- [ ] 4.9 Add loading states and error handling for catalog page

## 5. Title Details Page

- [ ] 5.1 Create `GET /api/titles/[id]` endpoint
- [ ] 5.2 Create title details page Server Component at `/title/[id]/page.tsx`
- [ ] 5.3 Build backdrop hero section with poster overlay
- [ ] 5.4 Build metadata display component (year, duration, rating, genres)
- [ ] 5.5 Build cast member list component with placeholder avatars
- [ ] 5.6 Build episode list component for series with season selector
- [ ] 5.7 Build related content section with genre-based recommendations
- [ ] 5.8 Implement "Watch" button navigation to `/watch/[id]`
- [ ] 5.9 Add 404 handling for non-existent titles
- [ ] 5.10 Add loading states and error handling for details page

## 6. Video Player Component

- [ ] 6.1 Install HLS.js dependency
- [ ] 6.2 Create base video player component with HLS.js integration
- [ ] 6.3 Implement play/pause controls with keyboard shortcut (Space)
- [ ] 6.4 Implement seek bar with click and drag support
- [ ] 6.5 Implement volume control with mute toggle (M key)
- [ ] 6.6 Implement fullscreen toggle (F key)
- [ ] 6.7 Implement time display (current / duration)
- [ ] 6.8 Add controls auto-hide after 3 seconds of inactivity
- [ ] 6.9 Implement quality selection menu with available renditions
- [ ] 6.10 Implement subtitle track selection and display
- [ ] 6.11 Add keyboard shortcuts: Arrow Left/Right (seek ±5s), Arrow Up/Down (volume)
- [ ] 6.12 Implement playback position saving (every 10s + on pause/exit)
- [ ] 6.13 Implement resume playback from saved position
- [ ] 6.14 Add ARIA labels and keyboard navigation for accessibility
- [ ] 6.15 Add aria-live regions for screen reader state announcements
- [ ] 6.16 Implement native HLS fallback for Safari

## 7. Watch Page

- [ ] 7.1 Create watch page at `/watch/[id]/page.tsx`
- [ ] 7.2 Integrate video player component with title/episode video URL
- [ ] 7.3 Display title/episode metadata below player
- [ ] 7.4 Implement next/previous episode navigation for series
- [ ] 7.5 Add loading state while video manifest loads
- [ ] 7.6 Add error state for unavailable or failed video content

## 8. Admin Content Management UI

- [ ] 8.1 Create admin layout with navigation sidebar
- [ ] 8.2 Build content list page at `/admin/content` with search, filter, pagination
- [ ] 8.3 Build title form component for create/edit (movies and series)
- [ ] 8.4 Implement genre/category multi-select in title form
- [ ] 8.5 Implement cast member management in title form
- [ ] 8.6 Build image upload component (poster, backdrop) with validation
- [ ] 8.7 Build video upload component with progress indicator
- [ ] 8.8 Build episode management UI for series (add, edit, delete episodes)
- [ ] 8.9 Implement soft delete with confirmation dialog
- [ ] 8.10 Add admin role authorization check to all admin pages

## 9. Admin Content Management API

- [ ] 9.1 Create `POST /api/admin/titles` endpoint for title creation
- [ ] 9.2 Create `PUT /api/admin/titles/[id]` endpoint for title update
- [ ] 9.3 Create `DELETE /api/admin/titles/[id]` endpoint for soft/hard delete
- [ ] 9.4 Create `GET /api/admin/titles` endpoint with pagination
- [ ] 9.5 Create `POST /api/admin/upload/presign` endpoint for presigned URLs
- [ ] 9.6 Create `POST /api/admin/encoding/trigger` endpoint to start encoding
- [ ] 9.7 Create `GET /api/admin/encoding/[jobId]` endpoint for job status
- [ ] 9.8 Add admin role middleware to all admin API routes
- [ ] 9.9 Implement webhook handler for encoding completion notification

## 10. Testing

- [ ] 10.1 Write unit tests for catalog API endpoint
- [ ] 10.2 Write unit tests for title details API endpoint
- [ ] 10.3 Write unit tests for FFmpeg encoding wrapper
- [ ] 10.4 Write unit tests for presigned URL generation
- [ ] 10.5 Write component tests for title card component
- [ ] 10.6 Write component tests for video player controls
- [ ] 10.7 Write integration test for catalog page with filters
- [ ] 10.8 Write integration test for title details page
- [ ] 10.9 Write integration test for admin content CRUD operations

## 11. Polish & Accessibility

- [ ] 11.1 Run Lighthouse audit on catalog page (target: >90)
- [ ] 11.2 Run Lighthouse audit on watch page (target: >90)
- [ ] 11.3 Verify WCAG 2.1 AA compliance on all pages
- [ ] 11.4 Test keyboard navigation across all interactive elements
- [ ] 11.5 Test screen reader compatibility (NVDA/VoiceOver)
- [ ] 11.6 Add Sentry error tracking to player and encoding components
- [ ] 11.7 Verify responsive design on mobile, tablet, and desktop
