## ADDED Requirements

### Requirement: Set parental control PIN
The system SHALL allow users to set a 4-digit PIN for parental controls, stored as a bcrypt hash in the database.

#### Scenario: User sets PIN for first time
- **WHEN** user enters and confirms a 4-digit PIN in parental control settings
- **THEN** system stores the PIN as a bcrypt hash and enables parental controls

#### Scenario: PIN must be confirmed
- **WHEN** user enters a PIN that does not match the confirmation
- **THEN** system displays error message and requires re-entry

#### Scenario: Invalid PIN format
- **WHEN** user attempts to set a PIN that is not exactly 4 digits
- **THEN** system displays validation error and rejects the PIN

### Requirement: Age rating restriction
The system SHALL allow users to configure maximum allowed age rating for content, blocking access to content exceeding the configured rating.

#### Scenario: Content blocked by age rating
- **WHEN** parental controls are enabled and user attempts to access content exceeding configured rating
- **THEN** system blocks access and displays restriction message

#### Scenario: Content allowed within age rating
- **WHEN** parental controls are enabled and content rating is within configured limit
- **THEN** system allows normal access to content

#### Scenario: Age rating configuration options
- **WHEN** user configures age rating restriction
- **THEN** system provides options: L (Livre), 10, 12, 14, 16, 18

### Requirement: PIN verification for restricted content
The system SHALL require PIN verification before allowing access to content blocked by parental controls.

#### Scenario: User enters correct PIN
- **WHEN** user enters correct PIN to access restricted content
- **THEN** system grants temporary access for that viewing session

#### Scenario: User enters incorrect PIN
- **WHEN** user enters incorrect PIN three times
- **THEN** system locks PIN entry for 5 minutes and displays lockout message

#### Scenario: PIN verification session expires
- **WHEN** user accesses restricted content after session timeout (30 minutes)
- **THEN** system requires PIN verification again

### Requirement: Parental control settings page
The system SHALL provide a dedicated settings page for parental controls accessible from the profile management area.

#### Scenario: User accesses parental control settings
- **WHEN** user navigates to profile settings and selects parental controls
- **THEN** system displays parental control configuration page with current settings

#### Scenario: Toggle parental controls on/off
- **WHEN** user toggles parental controls on or off
- **THEN** system requires current PIN to confirm the change

### Requirement: Parental control API endpoints
The system SHALL provide API endpoints for parental controls: POST `/api/parental/pin` to set/update PIN, POST `/api/parental/verify` to verify PIN, GET `/api/parental/settings` to get settings, and PUT `/api/parental/settings` to update settings.

#### Scenario: Set PIN via API
- **WHEN** authenticated user sends POST to `/api/parental/pin` with valid 4-digit PIN
- **THEN** system stores hashed PIN and returns 200 OK

#### Scenario: Verify PIN via API
- **WHEN** user sends POST to `/api/parental/verify` with PIN
- **THEN** system returns success or failure based on PIN match

#### Scenario: Get parental settings via API
- **WHEN** authenticated user sends GET to `/api/parental/settings`
- **THEN** system returns current parental control settings (excluding PIN hash)

### Requirement: Content filtering in catalog
The system SHALL filter content in catalog views based on configured parental control restrictions, hiding restricted content by default.

#### Scenario: Restricted content hidden from catalog
- **WHEN** parental controls are enabled with age rating limit
- **THEN** catalog views exclude content exceeding the configured rating

#### Scenario: Restricted content shown with PIN
- **WHEN** user verifies PIN for restricted content
- **THEN** content becomes visible in catalog for the current session

### Requirement: Parental control bypass for adult profiles
The system SHALL allow adult profiles (age >= 18) to bypass parental controls after PIN verification, while child profiles (age < 18) cannot disable controls.

#### Scenario: Adult profile bypasses controls
- **WHEN** adult profile verifies PIN
- **THEN** parental controls can be temporarily disabled for that session

#### Scenario: Child profile cannot disable controls
- **WHEN** child profile attempts to disable parental controls
- **THEN** system denies the request and displays appropriate message
