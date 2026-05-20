## 1. Setup and Routing

- [x] 1.1 Create directory structure: `src/app/admin/movies/upload/`
- [x] 1.2 Create page component: `src/app/admin/movies/upload/page.tsx`
- [x] 1.3 Verify admin layout protects the new route (reuse existing `verifyAdmin` from admin layout)

## 2. Upload UI Components

- [x] 2.1 Create `MovieUploadForm` component with fields: title, synopsis, release year, genre selector, category selector, cover image upload
- [x] 2.2 Create `FilePicker` component with drag-and-drop support and file validation (type: MP4/MKV/AVI/MOV, max 10GB)
- [x] 2.3 Create `UploadProgress` component showing upload percentage bar and encoding status badge
- [x] 2.4 Assemble components in upload page with proper layout and styling (Tailwind + shadcn/ui)

## 3. Upload Logic Hook

- [x] 3.1 Create `useMovieUpload` hook in `src/hooks/use-movie-upload.ts`
- [x] 3.2 Implement file validation logic (type checking, size limit)
- [x] 3.3 Implement presigned URL request to `/api/admin/upload/presign`
- [x] 3.4 Implement multipart upload with progress tracking (XMLHttpRequest or fetch with ReadableStream)
- [x] 3.5 Implement encoding trigger call to `/api/admin/encoding/trigger` after upload completes
- [x] 3.6 Add error handling and retry logic for failed uploads

## 4. Server Actions for Database Operations

- [x] 4.1 Create Server Action `createTitleWithMetadata` to create Title record with status PROCESSING
- [ ] 4.2 Create Server Action `updateTitleAfterEncoding` to update Title status and link VideoVersion
- [x] 4.3 Add form validation and error handling in Server Actions
- [x] 4.4 Wire Server Actions to `MovieUploadForm` component

## 5. Integration and Testing

- [ ] 5.1 Test complete flow: select file → fill metadata → upload → encoding → success
- [ ] 5.2 Test error scenarios: invalid file type, network failure, encoding failure
- [ ] 5.3 Test access control: verify non-admin users are redirected
- [ ] 5.4 Test with sample movie files (validate FFmpeg pipeline creates VideoVersion)
- [x] 5.5 Add loading states and disable form during upload
- [x] 5.6 Add accessibility checks (WCAG 2.1 AA): labels, focus management, screen reader support

## 6. Polish and Documentation

- [x] 6.1 Add navigation link to `/admin/movies/upload` in admin sidebar
- [x] 6.2 Add success/error toast notifications using shadcn/ui toast
- [x] 6.3 Update Portuguese comments in all new files
- [x] 6.4 Verify Lighthouse performance score > 90 for upload page
