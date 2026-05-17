## ADDED Requirements

### Requirement: FFmpeg HLS transcoding
The system SHALL transcode uploaded video files to HLS format with multiple bitrate renditions. Default renditions SHALL include: 360p (800kbps), 480p (1400kbps), 720p (2800kbps), and 1080p (5000kbps).

#### Scenario: Transcode uploaded video to HLS
- **WHEN** a new video file is uploaded to storage
- **THEN** encoding pipeline generates HLS manifest (.m3u8) and segmented TS files for each rendition

#### Scenario: Multiple bitrate renditions
- **WHEN** encoding completes
- **THEN** output includes at least 4 quality renditions with corresponding bitrates

#### Scenario: Master playlist generation
- **WHEN** all renditions are encoded
- **THEN** system generates a master HLS playlist referencing all variant streams

### Requirement: Encoding queue management
The system SHALL use a job queue (Redis + BullMQ) to manage encoding tasks. Jobs SHALL be processed asynchronously with configurable concurrency limits.

#### Scenario: Encoding job queued
- **WHEN** video upload completes
- **THEN** encoding job is added to queue with video file reference

#### Scenario: Concurrent job limit
- **WHEN** multiple encoding jobs are queued
- **THEN** system processes maximum 2 jobs concurrently to manage CPU resources

#### Scenario: Job progress tracking
- **WHEN** encoding job is in progress
- **THEN** system updates job progress percentage in database

### Requirement: Video upload to storage
The system SHALL support uploading video files to Cloudflare R2 storage via presigned URLs. Supported formats SHALL include MP4, MKV, AVI, and MOV.

#### Scenario: Generate presigned URL
- **WHEN** admin initiates video upload
- **THEN** system generates presigned URL valid for 1 hour

#### Scenario: Upload to R2
- **WHEN** client uploads file using presigned URL
- **THEN** file is stored in R2 bucket at designated key path

#### Scenario: Unsupported format rejection
- **WHEN** uploaded file has unsupported extension
- **THEN** system rejects upload and returns error message

### Requirement: Encoding job status tracking
The system SHALL track encoding job status (pending, processing, completed, failed) and make status available via API. Failed jobs SHALL include error details.

#### Scenario: Check encoding status
- **WHEN** client requests `GET /api/admin/encoding/[jobId]`
- **THEN** API returns current job status and progress

#### Scenario: Encoding failure handling
- **WHEN** FFmpeg encoding fails
- **THEN** job status is set to "failed" with error message stored

#### Scenario: Encoding completion notification
- **WHEN** encoding job completes successfully
- **THEN** system updates title/episode record with video version metadata

### Requirement: Thumbnail generation
The system SHALL generate thumbnail images from video content during encoding. Thumbnails SHALL be captured at 10%, 30%, 50%, 70%, and 90% of video duration.

#### Scenario: Generate thumbnails
- **WHEN** encoding pipeline processes video
- **THEN** system captures 5 thumbnail images at specified time positions

#### Scenario: Store thumbnails
- **WHEN** thumbnails are generated
- **THEN** images are uploaded to storage and URLs stored in database

### Requirement: Storage organization
The system SHALL organize stored content in a structured path format: `videos/{titleId}/{versionId}/` for HLS content and `thumbnails/{titleId}/` for thumbnails.

#### Scenario: HLS content path structure
- **WHEN** video is encoded
- **THEN** HLS files are stored at `videos/{titleId}/{versionId}/` with master playlist at root

#### Scenario: Thumbnail path structure
- **WHEN** thumbnails are generated
- **THEN** images are stored at `thumbnails/{titleId}/thumb_{timestamp}.jpg

### Requirement: Encoding API endpoint
The system SHALL provide admin API endpoints for managing encoding: `POST /api/admin/encoding/trigger` to start encoding, `GET /api/admin/encoding/[jobId]` to check status.

#### Scenario: Trigger encoding
- **WHEN** admin calls `POST /api/admin/encoding/trigger` with video key
- **THEN** encoding job is created and job ID is returned

#### Scenario: Query encoding status
- **WHEN** admin calls `GET /api/admin/encoding/[jobId]`
- **THEN** API returns job status, progress, and output details if completed
