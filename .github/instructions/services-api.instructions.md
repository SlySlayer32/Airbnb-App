---
applyTo: 'services/**'
description: 'Complete API reference for all service layer methods with signatures and examples'
---

# Services API Reference

## Service Architecture

```
UI Layer → Service Layer → Supabase Client → Database
   ↓           ↓              ↓                 ↓
Screens    Business Logic  Auth/RLS         PostgreSQL
```

**Key Principles:**

- Services handle all business logic and validation
- Services throw `ServiceError` with context
- Services return typed data (not Supabase response objects)
- Services are stateless (no internal state)
- All services exported via `services/index.ts`

---

## propertyService

**Location:** `services/propertyService.ts`

### getPropertiesForOwner()

Fetch all properties owned by the authenticated user with their current/next sessions.

```typescript
async getPropertiesForOwner(): Promise<EnhancedProperty[]>
```

**Returns:** Array of properties with `current_session` populated
**Throws:** Error if user not authenticated
**RLS:** Automatically filters by `owner_id = auth.uid()`

**Example:**

```typescript
const properties = await propertyService.getPropertiesForOwner();
// Returns: EnhancedProperty[] with current_session attached
properties.forEach((prop) => {
  console.log(prop.name, prop.current_session?.status);
});
```

---

### getPropertiesForCleaner()

Fetch properties assigned to the authenticated cleaner with upcoming sessions.

```typescript
async getPropertiesForCleaner(): Promise<EnhancedProperty[]>
```

**Returns:** Array of properties with upcoming sessions
**Throws:** Error if user not authenticated or not a team member
**RLS:** Filters by `assigned_cleaner_id`

**Example:**

```typescript
const assignedProperties = await propertyService.getPropertiesForCleaner();
// Returns: Properties where cleaner has upcoming sessions
```

---

### createProperty()

Create a new property with default linen requirements.

```typescript
async createProperty(
  propertyData: Omit<EnhancedProperty, 'id' | 'current_session' | 'next_session' | 'linen_requirements'>
): Promise<EnhancedProperty>
```

**Parameters:**

- `propertyData` — Property details (owner_id auto-set from auth)

**Returns:** Created property
**Throws:** Error if validation fails
**Side Effects:** Creates default linen requirements for 1 to `max_occupancy` guests

**Example:**

```typescript
const property = await propertyService.createProperty({
  name: 'Beach House',
  address: '123 Ocean Dr',
  rooms: 3,
  bathrooms: 2,
  max_occupancy: 6,
  property_type: 'house',
  access_method: 'smart_lock',
  access_code: '1234',
  default_checkin_time: '15:00',
  default_checkout_time: '11:00',
  estimated_cleaning_duration: 120,
  has_pool: true,
  has_balcony: false,
  // ... other required fields
});
```

---

### updateProperty()

Update property details.

```typescript
async updateProperty(
  id: string,
  updates: Partial<EnhancedProperty>
): Promise<EnhancedProperty>
```

**Parameters:**

- `id` — Property UUID
- `updates` — Partial property data to update

**Returns:** Updated property
**Throws:** Error if property not found or unauthorized
**RLS:** User must own the property

**Example:**

```typescript
await propertyService.updateProperty(propertyId, {
  access_code: '5678',
  status: 'maintenance',
});
```

---

### getLinenRequirements()

Get linen requirements for all guest counts for a property.

```typescript
async getLinenRequirements(propertyId: string): Promise<LinenRequirement[]>
```

**Returns:** Array of linen requirements sorted by guest_count
**Example:**

```typescript
const requirements = await propertyService.getLinenRequirements(propertyId);
// Returns: [{ guest_count: 1, bed_sheets_double: 1, ... }, ...]

const requirement = requirements.find((r) => r.guest_count === 4);
```

---

### updateLinenRequirements()

Replace all linen requirements for a property.

```typescript
async updateLinenRequirements(
  propertyId: string,
  requirements: LinenRequirement[]
): Promise<void>
```

**Parameters:**

- `propertyId` — Property UUID
- `requirements` — Complete array of linen requirements

**Side Effects:** Deletes existing requirements and inserts new ones

---

## cleaningSessionService

**Location:** `services/cleaningSessionService.ts`

### createSession()

Create a new cleaning session.

```typescript
async createSession(
  sessionData: Omit<CleaningSession, 'id'>
): Promise<CleaningSession>
```

**Returns:** Created session with property and team member data joined
**Example:**

```typescript
const session = await cleaningSessionService.createSession({
  property_id: propertyId,
  assigned_cleaner_id: cleanerId,
  guest_count: 2,
  checkin_time: '2025-10-29T15:00:00Z',
  checkout_time: '2025-10-31T11:00:00Z',
  scheduled_cleaning_time: '2025-10-31T12:00:00Z',
  session_type: 'checkout_clean',
  status: 'scheduled',
});
```

---

### startSession()

Start a cleaning session with business rule validation.

```typescript
async startSession(sessionId: string): Promise<CleaningSession>
```

**Business Rules Enforced:**

- Must be within 11 AM - 3 PM cleaning window
- Session status must be 'scheduled' or 'confirmed'
- Not already started
- Not more than 30 minutes early

**Updates:** `status: 'in_progress'`, `cleaner_arrived_at`, `cleaner_started_at`
**Side Effects:** Records session start in cleaning_updates
**Throws:** Error if validation fails

**Example:**

```typescript
try {
  const session = await cleaningSessionService.startSession(sessionId);
  router.push('/session-active');
} catch (error) {
  if (error.message.includes('11:00 AM and 3:00 PM')) {
    showToast({ title: 'Outside cleaning window', status: 'error' });
  }
}
```

---

### pauseSession()

Pause an active cleaning session (for breaks).

```typescript
async pauseSession(sessionId: string, reason?: string): Promise<CleaningSession>
```

**Requirements:**

- Session must be `in_progress`
- Not already paused

**Updates:** `cleaner_paused_at`, `is_currently_paused: true`
**Side Effects:** Records pause event in cleaning_updates

**Example:**

```typescript
await cleaningSessionService.pauseSession(sessionId, 'Lunch break');
```

---

### resumeSession()

Resume a paused cleaning session.

```typescript
async resumeSession(sessionId: string): Promise<CleaningSession>
```

**Requirements:**

- Session must be `in_progress` and paused

**Updates:** `cleaner_resumed_at`, `is_currently_paused: false`, `total_break_minutes` (calculated)
**Side Effects:** Records resume event

**Example:**

```typescript
await cleaningSessionService.resumeSession(sessionId);
```

---

### completeSession()

Complete a cleaning session with business rule validation.

```typescript
async completeSession(
  sessionId: string,
  completionData: {
    actual_guest_count?: number;
    notes?: string;
    photos?: string[];
    photosComplete?: boolean;
    checklistComplete?: boolean;
  }
): Promise<CleaningSession>
```

**Business Rules Enforced:**

- Session must be `in_progress`
- Minimum 30-minute duration
- Photos required if `photos_required === true` or 3+ guests/rooms

**Updates:** `status: 'completed'`, `cleaner_completed_at`, `total_break_minutes` (final)
**Side Effects:** Records completion in cleaning_updates

**Example:**

```typescript
await cleaningSessionService.completeSession(sessionId, {
  actual_guest_count: 2,
  notes: 'Extra cleaning in kitchen',
  photos: ['url1', 'url2'],
  photosComplete: true,
});
```

---

### cancelSession()

Cancel a session with notification.

```typescript
async cancelSession(
  sessionId: string,
  cancellationData: {
    cancelled_by: string;
    cancellation_reason: string;
    cancellation_notice_hours: number;
  }
): Promise<CleaningSession>
```

**Updates:** `status: 'cancelled'`, cancellation fields
**Side Effects:** Sends notification to property owner

---

### getTodaySessions()

Get all sessions for authenticated cleaner today with enhanced metadata.

```typescript
async getTodaySessions(): Promise<CleaningSession[]>
```

**Returns:** Sessions with `dashboard_metadata` populated
**Filters:** Today's date (00:00 to 23:59), assigned to current cleaner
**Enriches:** Adds time calculations, window validation, priority levels

**Example:**

```typescript
const sessions = await cleaningSessionService.getTodaySessions();
sessions.forEach((session) => {
  const meta = session.dashboard_metadata!;
  console.log(meta.status_indicator); // 'starting_soon' | 'overdue' | ...
  console.log(meta.time_until_start_minutes); // 45
  console.log(meta.priority_level); // 'high'
});
```

---

### getCleanerSessions()

Get sessions for cleaner (today, week, or all upcoming).

```typescript
async getCleanerSessions(
  period: 'today' | 'week' | 'all' = 'today'
): Promise<CleaningSession[]>
```

**Parameters:**

- `period` — Time range filter

**Returns:** Sessions with property and team member data

---

### Helper Methods

```typescript
// Calculate effective working time (excluding breaks)
calculateEffectiveWorkingMinutes(session: CleaningSession): number

// Get session state (scheduled | active | paused | completed | cancelled)
getSessionState(session: CleaningSession): 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled'

// Check if session can be paused
canPauseSession(session: CleaningSession): boolean

// Check if session can be resumed
canResumeSession(session: CleaningSession): boolean
```

---

## cleaningUpdateService

**Location:** `services/cleaningUpdateService.ts`

### recordSessionStart()

Record session start event in activity log.

```typescript
async recordSessionStart(sessionId: string, propertyName?: string): Promise<void>
```

### recordSessionPause()

Record session pause event.

```typescript
async recordSessionPause(sessionId: string, reason?: string): Promise<void>
```

### recordSessionResume()

Record session resume event.

```typescript
async recordSessionResume(sessionId: string): Promise<void>
```

### recordSessionComplete()

Record session completion event.

```typescript
async recordSessionComplete(
  sessionId: string,
  propertyName?: string,
  notes?: string
): Promise<void>
```

### addUpdate()

Add a custom update/activity log entry.

```typescript
async addUpdate(
  sessionId: string,
  updateData: {
    update_type: 'status' | 'note' | 'issue' | 'completion';
    message: string;
    photo_urls?: string[];
    metadata?: any;
  }
): Promise<void>
```

---

## realtimeService

**Location:** `services/realtimeService.ts`

### subscribe()

Subscribe to realtime updates for sessions and activity.

```typescript
subscribe(config: RealtimeSubscriptionConfig): () => void
```

**Parameters:**

```typescript
interface RealtimeSubscriptionConfig {
  onSessionUpdate: (session: CleaningSession) => void;
  onSessionInsert: (session: CleaningSession) => void;
  onSessionDelete: (sessionId: string) => void;
  onUpdateInsert: (update: any) => void;
  onError?: (error: Error) => void;
}
```

**Returns:** Unsubscribe function
**Features:** Auto-reconnect with exponential backoff

**Example:**

```typescript
useEffect(() => {
  const unsubscribe = realtimeService.subscribe({
    onSessionUpdate: (session) => {
      setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
    },
    onSessionInsert: (session) => {
      setSessions((prev) => [...prev, session]);
    },
    onSessionDelete: (sessionId) => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    },
  });

  return () => unsubscribe();
}, []);
```

---

## PhotoProofService

**Location:** `services/photoProofService.ts`

### getSessionPhotoStatus()

Get photo proof completion status for a session.

```typescript
async getSessionPhotoStatus(sessionId: string): Promise<PhotoProofStatus>
```

**Returns:**

```typescript
interface PhotoProofStatus {
  session_id: string;
  total_required: number;
  total_completed: number;
  is_complete: boolean;
  missing_categories: string[];
  requirements: PhotoProofRequirement[];
}
```

### uploadPhoto()

Upload a photo for photo proof requirement.

```typescript
async uploadPhoto(
  sessionId: string,
  file: File,
  category: 'before_cleaning' | 'after_cleaning' | 'specific_area' | 'issue_report',
  areaName: string
): Promise<PhotoUploadResult>
```

---

## notificationService

**Location:** `services/notificationService.ts`

### sendToUser()

Send push notification to a user.

```typescript
async sendToUser(
  userId: string,
  type: 'session_cancelled' | 'cleaning_started' | 'cleaning_completed',
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void>
```

---

## dashboardLayoutService

**Location:** `services/dashboardLayoutService.ts`

### getLayout()

Get user's dashboard layout configuration.

```typescript
async getLayout(): Promise<DashboardLayout | null>
```

### saveLayout()

Save user's dashboard layout.

```typescript
async saveLayout(components: DashboardComponent[]): Promise<void>
```

---

## BannerStateService

**Location:** `services/bannerStateService.ts`

### calculateState()

Calculate cleaner's current status banner state.

```typescript
calculateState(context: BannerStateContext): BannerStateResult
```

**Parameters:**

```typescript
interface BannerStateContext {
  sessions: CleaningSession[];
  currentTime: Date;
  activeSession?: CleaningSession;
  nextSession?: CleaningSession;
  userRole: 'cleaner' | 'property_owner' | 'co_host';
  isOnline: boolean;
}
```

**Returns:**

```typescript
interface BannerStateResult {
  status: 'relax' | 'scheduled' | 'ready' | 'active' | 'break' | 'awaiting_photos' | 'day_wrap';
  message: string;
  timeRemaining?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired?: boolean;
  nextAction?: string;
  urgencyReason?: string;
}
```

---

## Error Handling Pattern

All services use consistent error handling:

```typescript
// ✅ Services throw errors with context
export async function someOperation() {
  try {
    const { data, error } = await supabase.from('table').select('*');

    if (error) {
      throw new ServiceError('Failed to fetch data', 'FETCH_ERROR', { error, tableName: 'table' });
    }

    return data || [];
  } catch (error) {
    logger.error('someOperation failed', error);
    throw error;
  }
}

// UI handles errors
try {
  await cleaningSessionService.startSession(sessionId);
} catch (error) {
  if (error instanceof ServiceError) {
    showToast({ title: error.message, status: 'error' });
  } else {
    showToast({ title: 'Something went wrong', status: 'error' });
  }
}
```

---

## Service Import Pattern

**Always import from central hub:**

```typescript
// ✅ Correct
import { cleaningSessionService, propertyService, realtimeService } from '@/services';
// ❌ Don't import directly
import { propertyService } from '@/services/propertyService';
```

---

## Quick Reference Table

| Service                  | Key Methods                                                                  | Purpose                              |
| ------------------------ | ---------------------------------------------------------------------------- | ------------------------------------ |
| `propertyService`        | getPropertiesForOwner, getPropertiesForCleaner, createProperty               | Property CRUD and linen requirements |
| `cleaningSessionService` | startSession, pauseSession, resumeSession, completeSession, getTodaySessions | Session lifecycle management         |
| `cleaningUpdateService`  | recordSessionStart, addUpdate                                                | Activity logging                     |
| `realtimeService`        | subscribe                                                                    | Realtime updates subscription        |
| `PhotoProofService`      | getSessionPhotoStatus, uploadPhoto                                           | Photo proof validation               |
| `BannerStateService`     | calculateState                                                               | Status banner logic                  |
| `dashboardLayoutService` | getLayout, saveLayout                                                        | Dashboard customization              |
| `notificationService`    | sendToUser                                                                   | Push notifications                   |
