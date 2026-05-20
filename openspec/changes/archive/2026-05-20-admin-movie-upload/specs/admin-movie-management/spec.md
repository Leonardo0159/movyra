## ADDED Requirements

### Requirement: Admin can access movie upload page
The system SHALL provide a dedicated page at `/admin/movies/upload` accessible only to authenticated users with ADMIN role.

#### Scenario: Admin accesses upload page
- **WHEN** an authenticated admin navigates to `/admin/movies/upload`
- **THEN** the system displays the movie upload form

#### Scenario: Non-admin user attempts access
- **WHEN** a non-admin user navigates to `/admin/movies/upload`
- **THEN** the system redirects to the home page

#### Scenario: Unauthenticated user attempts access
- **WHEN** an unauthenticated user navigates to `/admin/movies/upload`
- **THEN** the system redirects to the login page

### Requirement: Admin can select a local video file for upload
The system SHALL provide a file picker that accepts video files (MP4, MKV, AVI, MOV) with a maximum size of 10GB.

#### Scenario: Admin selects valid video file
- **WHEN** admin clicks the file picker and selects a valid video file
- **THEN** the system displays the file name, size, and format

#### Scenario: Admin selects invalid file type
- **WHEN** admin attempts to select a non-video file
- **THEN** the system rejects the file and displays an error message

#### Scenario: Admin selects file exceeding size limit
- **WHEN** admin selects a video file larger than 10GB
- **THEN** the system displays an error message indicating the size limit

### Requirement: Admin can enter movie metadata
The system SHALL provide form fields for movie metadata including: title (required), synopsis, release year, genre(s), category(ies), and cover image.

#### Scenario: Admin fills required metadata
- **WHEN** admin enters a title and submits the form
- **THEN** the system accepts the metadata and proceeds with upload

#### Scenario: Admin submits without required title
- **WHEN** admin submits the form without entering a title
- **THEN** the system displays a validation error for the title field

### Requirement: System uploads video file to storage
The system SHALL upload the selected video file to cloud storage using presigned URLs obtained from `/api/admin/upload/presign`.

#### Scenario: Successful file upload
- **WHEN** admin submits the form with a valid video file
- **THEN** the system obtains a presigned URL and uploads the file to storage

#### Scenario: Upload fails due to network error
- **WHEN** the upload request fails due to network issues
- **THEN** the system displays an error message and allows retry

### Requirement: System triggers video encoding after upload
The system SHALL trigger the encoding pipeline by calling `/api/admin/encoding/trigger` with the uploaded file's storage key after successful upload.

#### Scenario: Encoding triggered after upload
- **WHEN** the video file upload completes successfully
- **THEN** the system calls the encoding trigger endpoint with the storage key

#### Scenario: Encoding trigger fails
- **WHEN** the encoding trigger endpoint returns an error
- **THEN** the system logs the error and notifies the admin

### Requirement: System displays upload and encoding progress
The system SHALL display real-time progress for both file upload (percentage) and encoding status (pending, processing, completed, failed).

#### Scenario: Upload progress displayed
- **WHEN** a file upload is in progress
- **THEN** the system shows a progress bar with percentage completion

#### Scenario: Encoding status displayed
- **WHEN** encoding is in progress
- **THEN** the system shows the current encoding status (pending, processing, completed, failed)

#### Scenario: Encoding completes successfully
- **WHEN** encoding completes successfully
- **THEN** the system displays a success message and creates a VideoVersion record

#### Scenario: Encoding fails
- **WHEN** encoding fails
- **THEN** the system displays an error message with failure details

### Requirement: System creates Title and VideoVersion records
The system SHALL create a Title record with status PROCESSING before upload, and update it with VideoVersion reference after encoding completes.

#### Scenario: Title created before upload
- **WHEN** admin submits the movie upload form
- **THEN** the system creates a Title record with status PROCESSING

#### Scenario: VideoVersion created after encoding
- **WHEN** encoding completes successfully
- **THEN** the system creates a VideoVersion record linked to the Title
