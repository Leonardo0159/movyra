## Context

The project already has an admin area (`/admin/content`) with a title creation form (`TitleForm`), Prisma schema with `Title`, `VideoVersion`, and related models, and API routes for presigned uploads and encoding webhooks. However, there's no streamlined flow for uploading local video files directly from the admin interface and associating them with a title.

Current architecture:
- Admin layout with JWT-based role verification (`ADMIN` role required)
- Prisma schema supports `Title` with `VideoVersion` (HLS manifests, storage keys)
- API routes exist for presigned uploads (`/api/admin/upload/presign`) and encoding triggers
- Video processing pipeline expects FFmpeg transcoding to HLS format

## Goals / Non-Goals

**Goals:**
- Provide a dedicated admin page for uploading local movie files with metadata
- Integrate with existing presigned upload and encoding pipeline
- Support progress tracking during upload
- Associate uploaded videos with Title records automatically
- Maintain consistency with existing admin UI patterns (shadcn/ui + Tailwind)

**Non-Goals:**
- Series/episode upload (movies only for this change)
- Bulk upload (single file per submission)
- Custom encoding profiles (use existing defaults)
- Cloud storage configuration (assume R2/S3 already configured)

## Decisions

### 1. Page Location: `/admin/movies/upload`
**Decision:** Create a new route under `/admin/movies/upload` rather than modifying existing `/admin/content/new`.
**Rationale:** Separates movie-specific upload flow from generic title creation. Existing `/admin/content/new` can remain for manual metadata-only entries.
**Alternatives considered:**
- Modify `/admin/content/new` to include upload → Would complicate existing form and mix concerns
- Use modal/dialog on content list → Poor UX for large file uploads

### 2. Upload Method: Client-side multipart upload with presigned URLs
**Decision:** Use existing `/api/admin/upload/presign` to get presigned URL, then upload directly from browser via multipart/form-data.
**Rationale:** Leverages existing infrastructure, avoids server memory issues with large files, supports progress tracking via XMLHttpRequest/Fetch with ReadableStream.
**Alternatives considered:**
- Server Actions with formData → Would buffer entire file on server, not suitable for large videos
- WebSocket upload → Overkill for this use case

### 3. Video Processing: Trigger encoding after upload completes
**Decision:** After successful upload, call `/api/admin/encoding/trigger` with the storage key to start FFmpeg transcoding pipeline.
**Rationale:** Existing encoding webhook infrastructure (`/api/admin/webhooks/encoding`) already handles job completion and VideoVersion creation.
**Alternatives considered:**
- Synchronous transcoding → Would block upload response, poor UX
- Client-side transcoding → Not feasible in browser

### 4. Form State: React hook for upload progress
**Decision:** Create `useMovieUpload` hook to manage file selection, upload progress, and status transitions.
**Rationale:** Encapsulates upload logic, reusable across components, clean separation from UI.
**Alternatives considered:**
- Inline state in component → Would bloat the page component
- Context provider → Overkill for single-page use

### 5. Database Integration: Server Action for Title + VideoVersion creation
**Decision:** Use Next.js Server Action to create Title record before upload, then update with VideoVersion after encoding completes.
**Rationale:** Server Actions provide type-safe, secure database operations without exposing API endpoints. Follows existing Prisma patterns.
**Alternatives considered:**
- API route for creation → More boilerplate, less type safety
- Client-side Prisma → Not possible (browser environment)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Large file uploads may timeout or fail | Implement chunked upload or retry logic; show clear error messages |
| Encoding job may fail silently | Poll encoding status endpoint; notify user on completion/failure |
| User navigates away during upload | Warn on page unload if upload in progress |
| No authentication on upload endpoint | Verify admin role in presign API route (already implemented) |
| Storage quota exceeded | Check storage limits before upload; display quota info |

## Migration Plan

1. Create `/admin/movies/upload` page with form UI
2. Implement `useMovieUpload` hook for upload logic
3. Wire up presigned upload flow and encoding trigger
4. Test with sample movie files (validate FFmpeg pipeline)
5. No database migration needed (schema already supports)
6. **Rollback:** Remove new page and hook; existing `/admin/content` flow unaffected

## Open Questions

- Should we validate video file format before upload (e.g., only accept MP4, MKV, AVI)?
- Do we need to generate thumbnails/posters automatically from video frames?
- Should upload progress be persisted across page refreshes?
