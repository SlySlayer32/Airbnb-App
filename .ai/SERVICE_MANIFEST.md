# 🔧 Service Manifest

> Complete API reference for all 8 business logic services

## 📋 Table of Contents
- [Overview](#overview)
- [Core Business Services](#core-business-services)
- [Infrastructure Services](#infrastructure-services)
- [Service Patterns](#service-patterns)
- [Error Handling](#error-handling)

## 📊 Overview

### Service Architecture
```
Total Services: 8

By Category:
├── Core Business Logic: 3 services
│   ├── propertyService - Property management
│   ├── cleaningSessionService - Session lifecycle
│   └── cleaningUpdateService - Progress tracking
│
├── Infrastructure: 3 services
│   ├── notificationService - Alert system
│   ├── realtimeService - Supabase subscriptions
│   └── photoProofService - Photo upload/validation
│
└── UI Support: 2 services
    ├── bannerStateService - Dashboard banner logic
    └── index.ts - Service exports

All Services Use:
- Supabase for data persistence
- TypeScript for type safety
- Async/await for operations
- Try/catch for error handling
```

### Import Pattern
```typescript
// Individual service import
import { propertyService } from '@/services/propertyService';

// Multiple services from barrel export
import { propertyService, cleaningSessionService } from '@/services';
```

---

## 🏠 Core Business Services

### propertyService
**Path**: `/services/propertyService.ts`  
**Purpose**: Manages property CRUD operations and linen requirements  
**Database Tables**: `properties`, `linen_requirements`  
**Dependencies**: Supabase client, auth context  

#### Key Methods

##### `getPropertiesForOwner(): Promise<EnhancedProperty[]>`
Fetches all properties owned by current user with related data.

**Returns**: Array of properties with current/next cleaning sessions and linen requirements  
**RLS**: Only returns properties where `owner_id` matches authenticated user  
**Use Cases**: Owner dashboard, property management screen

**Example**:
```typescript
const properties = await propertyService.getPropertiesForOwner();
// Returns: [{ id, name, address, current_session, next_session, ... }]
```

---

##### `getPropertiesForCleaner(): Promise<EnhancedProperty[]>`
Fetches properties assigned to current cleaner via team_members.

**Returns**: Array of properties with access codes, WiFi, supply locations  
**RLS**: Only returns properties where cleaner is in `team_members` table  
**Use Cases**: Cleaner dashboard, job list screen

**Example**:
```typescript
const assignedProperties = await propertyService.getPropertiesForCleaner();
// Returns properties with access_code, wifi_password, supply locations
```

---

##### `createProperty(propertyData): Promise<EnhancedProperty>`
Creates new property with default linen requirements.

**Parameters**:
```typescript
{
  name: string;
  address: string;
  rooms: number;
  bathrooms: number;
  max_occupancy: number;
  property_type: 'apartment' | 'house' | 'condo' | 'villa' | 'studio';
  access_method: string;
  access_code?: string;
  // ... other property fields
}
```

**Returns**: Created property with generated ID  
**Side Effects**: Automatically creates default linen requirements  
**Use Cases**: Add property wizard, property import

**Example**:
```typescript
const newProperty = await propertyService.createProperty({
  name: 'Sunset Villa',
  address: '123 Beach St',
  rooms: 3,
  bathrooms: 2,
  max_occupancy: 6,
  property_type: 'villa',
  access_method: 'smart_lock',
});
```

---

##### `updateProperty(id, updates): Promise<EnhancedProperty>`
Updates existing property fields.

**Parameters**: 
- `id: string` - Property ID
- `updates: Partial<EnhancedProperty>` - Fields to update

**Returns**: Updated property object  
**Validation**: Checks user has permission to edit property  
**Use Cases**: Property settings, bulk updates

**Example**:
```typescript
const updated = await propertyService.updateProperty(propertyId, {
  access_code: '1234',
  wifi_password: 'newpassword',
});
```

---

##### `getLinenRequirements(propertyId): Promise<LinenRequirement[]>`
Fetches linen requirements for a property.

**Returns**: Array of linen requirements by guest count  
**Use Cases**: Cleaner preparation, property detail display

---

##### `createDefaultLinenRequirements(propertyId, maxOccupancy): Promise<void>`
Auto-generates linen requirements based on max occupancy.

**Business Logic**:
- Creates requirements for 1 to `maxOccupancy` guests
- Scales towels/linens linearly with guest count
- Adds property-specific items (pool towels for villas)

---

### cleaningSessionService
**Path**: `/services/cleaningSessionService.ts`  
**Purpose**: Manages complete cleaning session lifecycle from creation to completion  
**Database Tables**: `cleaning_sessions`  
**Dependencies**: `notificationService`, `cleaningUpdateService`, Supabase

#### Key Methods

##### `createSession(sessionData): Promise<CleaningSession>`
Creates new cleaning session and notifies assigned cleaner.

**Parameters**:
```typescript
{
  property_id: string;
  assigned_cleaner_id?: string;
  guest_count: number;
  checkin_time: string;
  checkout_time: string;
  scheduled_cleaning_time: string;
  session_type: 'checkout_clean' | 'checkin_prep' | 'maintenance_clean';
}
```

**Returns**: Created session with ID  
**Validations**:
- Cleaning time within 11 AM - 3 PM window
- No overlapping sessions for property
- Cleaner availability check

**Side Effects**:
- Sends notification to assigned cleaner
- Creates initial cleaning update record

**Example**:
```typescript
const session = await cleaningSessionService.createSession({
  property_id: propertyId,
  assigned_cleaner_id: cleanerId,
  guest_count: 4,
  checkin_time: '2025-01-15T15:00:00Z',
  checkout_time: '2025-01-15T11:00:00Z',
  scheduled_cleaning_time: '2025-01-15T12:00:00Z',
  session_type: 'checkout_clean',
});
```

---

##### `updateSessionStatus(sessionId, updates): Promise<CleaningSession>`
Updates session status and related fields.

**Parameters**: 
- `sessionId: string`
- `updates: Partial<CleaningSession>`

**Returns**: Updated session  
**Side Effects**: Triggers status change notifications

---

##### `startSession(sessionId): Promise<CleaningSession>`
Marks cleaner as arrived and session in-progress.

**Business Logic**:
- Sets `cleaner_arrived_at` timestamp
- Updates status to 'in_progress'
- Records start in cleaning updates
- Notifies property owner

**Example**:
```typescript
await cleaningSessionService.startSession(sessionId);
// Status: 'scheduled' → 'in_progress'
```

---

##### `completeSession(sessionId, completionData): Promise<CleaningSession>`
Marks session as completed with photos and notes.

**Parameters**:
```typescript
{
  actual_guest_count?: number;
  completion_notes?: string;
  photo_urls?: string[];
}
```

**Business Logic**:
- Sets `cleaner_completed_at` timestamp
- Updates status to 'completed'
- Validates photo proof requirements
- Records completion in cleaning updates
- Notifies property owner with summary

**Example**:
```typescript
await cleaningSessionService.completeSession(sessionId, {
  actual_guest_count: 4,
  completion_notes: 'All rooms cleaned thoroughly',
  photo_urls: ['https://...', 'https://...'],
});
```

---

##### `cancelSession(sessionId, cancellationData): Promise<CleaningSession>`
Cancels cleaning session with reason and notice period.

**Parameters**:
```typescript
{
  cancellation_reason: string;
  cancelled_by: string; // user_id
}
```

**Business Logic**:
- Calculates cancellation notice hours
- Flags if < 24 hours (short notice)
- Sets `cancelled_at` timestamp
- Updates status to 'cancelled'
- Notifies affected parties (owner/cleaner)

**Notice Calculation**:
```typescript
const hours = Math.floor((scheduled_time - now) / (1000 * 60 * 60));
const is_short_notice = hours < 24;
```

**Example**:
```typescript
await cleaningSessionService.cancelSession(sessionId, {
  cancellation_reason: 'Guest extended stay',
  cancelled_by: userId,
});
// If < 24 hrs: Flagged as SHORT NOTICE in UI
```

---

##### `getTodaySessions(): Promise<CleaningSession[]>`
Fetches all cleaning sessions scheduled for today.

**Returns**: Array of sessions with property and cleaner details  
**Use Cases**: Dashboard, daily schedule view

---

##### `getCleanerSessions(period): Promise<CleaningSession[]>`
Fetches sessions assigned to current cleaner.

**Parameters**: `period: 'today' | 'week' | 'all'`  
**Returns**: Filtered sessions for time period  
**RLS**: Only returns sessions assigned to authenticated cleaner  
**Use Cases**: Cleaner dashboard, job history

---

### cleaningUpdateService
**Path**: `/services/cleaningUpdateService.ts`  
**Purpose**: Handles real-time progress updates during cleaning sessions  
**Database Tables**: `cleaning_updates`  
**Dependencies**: `notificationService`, Supabase storage (for photos)

#### Key Methods

##### `addUpdate(sessionId, updateData): Promise<CleaningUpdate>`
Adds progress update or note to cleaning session.

**Parameters**:
```typescript
{
  update_type: 'note' | 'issue' | 'photo' | 'status_change';
  message: string;
  photo_url?: string;
  requires_response?: boolean;
  is_urgent?: boolean;
}
```

**Returns**: Created update with timestamp  
**Side Effects**: Sends notification if urgent or requires response

**Example**:
```typescript
await cleaningUpdateService.addUpdate(sessionId, {
  update_type: 'note',
  message: 'Bathroom cleaned, moving to bedrooms',
  requires_response: false,
  is_urgent: false,
});
```

---

##### `reportIssue(sessionId, issueData): Promise<CleaningUpdate>`
Reports maintenance issue or problem during cleaning.

**Parameters**:
```typescript
{
  issue_description: string;
  issue_type: 'maintenance' | 'supplies' | 'access' | 'other';
  photo_url?: string;
  is_urgent?: boolean;
}
```

**Business Logic**:
- Creates update with type 'issue'
- Sets `requires_response: true`
- Sends high/urgent priority notification to owner
- Creates maintenance ticket if needed

**Example**:
```typescript
await cleaningUpdateService.reportIssue(sessionId, {
  issue_description: 'Broken lock on front door',
  issue_type: 'maintenance',
  is_urgent: true,
});
// Triggers: URGENT notification to property owner
```

---

##### `getSessionUpdates(sessionId): Promise<CleaningUpdate[]>`
Fetches all updates for a cleaning session.

**Returns**: Array of updates ordered by timestamp (newest first)  
**Use Cases**: CleaningUpdates modal, session history

---

##### `recordSessionStart(sessionId, propertyName?): Promise<CleaningUpdate>`
Auto-records when cleaner marks session as started.

---

##### `recordSessionComplete(sessionId, propertyName?, notes?): Promise<CleaningUpdate>`
Auto-records when cleaner completes session.

---

## 🚨 Infrastructure Services

### notificationService
**Path**: `/services/notificationService.ts`  
**Purpose**: Centralized notification system for all user alerts  
**Database Tables**: `notifications`  
**Dependencies**: Supabase, (future: push notification service)

#### Key Methods

##### `sendToUser(userId, notificationData): Promise<Notification>`
Sends notification to specific user.

**Parameters**:
```typescript
{
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'normal' | 'high' | 'urgent';
  action_url?: string;
  related_session_id?: string;
}
```

**Business Logic**:
- Stores notification in database
- Marks as unread
- If urgent: Triggers push notification (future)
- If urgent: Sends SMS/email (future)

**Example**:
```typescript
await notificationService.sendToUser(ownerId, {
  title: 'Cleaning Started',
  message: 'Maria has started cleaning Sunset Villa',
  type: 'info',
  priority: 'normal',
  related_session_id: sessionId,
});
```

---

##### `getUnreadNotifications(): Promise<Notification[]>`
Fetches unread notifications for current user.

**Returns**: Array of unread notifications  
**Use Cases**: Notification badge count, notification center

---

##### `getUnreadCount(): Promise<number>`
Gets count of unread notifications.

**Returns**: Integer count  
**Use Cases**: Badge display, notification indicator

---

##### `markAsRead(notificationId): Promise<void>`
Marks single notification as read.

---

##### `markAllAsRead(): Promise<void>`
Marks all user's notifications as read.

**Use Cases**: "Mark all read" button, notification center

---

### realtimeService
**Path**: `/services/realtimeService.ts`  
**Purpose**: Manages Supabase real-time subscriptions for live updates  
**Dependencies**: Supabase client, auth context

#### Key Methods

##### `subscribe(config): Promise<void>`
Subscribes to real-time database changes.

**Parameters**:
```typescript
{
  onSessionUpdate?: (session: CleaningSession) => void;
  onUpdateReceived?: (update: CleaningUpdate) => void;
  onNotification?: (notification: Notification) => void;
  teamMemberId?: string;
}
```

**Business Logic**:
- Creates Supabase channel subscriptions
- Filters by user permissions (RLS)
- Handles connection state
- Auto-reconnects on disconnect

**Example**:
```typescript
await realtimeService.subscribe({
  onSessionUpdate: (session) => {
    console.log('Session updated:', session);
    refreshDashboard();
  },
  onNotification: (notification) => {
    showNotificationBadge();
  },
});
```

---

##### `unsubscribe(): Promise<void>`
Cleans up all real-time subscriptions.

**Use Cases**: Component unmount, user logout

---

### photoProofService
**Path**: `/services/photoProofService.ts`  
**Purpose**: Manages photo upload and validation for cleaning proof  
**Database Tables**: `photo_proof_requirements`, `cleaning_sessions`  
**Dependencies**: Supabase storage, camera API

#### Key Methods

##### `generatePhotoRequirements(sessionId, sessionType, propertyRooms): Promise<PhotoProofRequirement[]>`
Generates required photo checklist based on property.

**Business Logic**:
- Standard photos: Kitchen, bathrooms, living areas
- Extra photos: Based on room count
- Specific photos: Pool, hot tub (if property has them)

**Returns**: Array of required photo types

---

##### `validatePhotoProof(sessionId): Promise<PhotoProofValidation>`
Checks if all required photos have been uploaded.

**Returns**:
```typescript
{
  isComplete: boolean;
  missingPhotos: string[];
  uploadedCount: number;
  requiredCount: number;
}
```

**Use Cases**: Photo proof gate, completion validation

---

##### `capturePhoto(sessionId, photoType, imageUri): Promise<string>`
Uploads photo to Supabase storage.

**Parameters**:
- `sessionId: string`
- `photoType: string` (e.g., 'kitchen', 'bathroom_1')
- `imageUri: string` (local file path)

**Returns**: Public URL of uploaded photo  
**Storage**: `/cleaning-photos/{sessionId}/{photoType}.jpg`

---

### bannerStateService
**Path**: `/services/bannerStateService.ts`  
**Purpose**: Determines which banner to display on dashboard based on session state  
**Dependencies**: None (pure logic)

#### Types

##### `BannerStateContext`
```typescript
{
  hasActiveSession: boolean;
  activeSession?: CleaningSession;
  hasNextJob: boolean;
  nextJob?: CleaningSession;
  hasUpcomingJobs: boolean;
  sessionStatus?: SessionStatus;
}
```

##### `BannerStateResult`
```typescript
{
  showBanner: boolean;
  bannerType: 'active' | 'next' | 'no_jobs' | 'none';
  message: string;
  actionLabel?: string;
  priority: 'high' | 'medium' | 'low';
}
```

**Business Logic**:
- Active session → Show "In Progress" banner (high priority)
- Next job within 2 hours → Show "Upcoming" banner (medium priority)
- No jobs today → Show "No jobs scheduled" (low priority)

---

## 🔄 Service Patterns

### Standard Service Structure
```typescript
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';

export const serviceName = {
  async methodName(params): Promise<ReturnType> {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .select('*')
        .eq('filter', value);
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Service error:', error);
      Alert.alert('Error', 'User-friendly message');
      throw error;
    }
  },
};
```

### Error Handling Pattern
```typescript
try {
  // Service operation
  const result = await service.method();
  
  // Success notification if important
  Alert.alert('Success', 'Operation completed');
  
} catch (error) {
  // Log technical details
  console.error('Operation failed:', error);
  
  // Show user-friendly message
  Alert.alert('Error', 'Please try again');
}
```

### Notification Trigger Pattern
```typescript
// After important state change
await notificationService.sendToUser(affectedUserId, {
  title: 'Action Occurred',
  message: 'Description of what happened',
  type: 'info',
  priority: 'normal',
  related_session_id: sessionId,
});
```

---

## 🎯 Service Usage Examples

### Complete Cleaning Flow
```typescript
// 1. Owner creates session
const session = await cleaningSessionService.createSession({
  property_id: propertyId,
  assigned_cleaner_id: cleanerId,
  guest_count: 4,
  scheduled_cleaning_time: '2025-01-15T12:00:00Z',
  session_type: 'checkout_clean',
});
// → Cleaner receives notification

// 2. Cleaner starts session
await cleaningSessionService.startSession(session.id);
await cleaningUpdateService.recordSessionStart(session.id, propertyName);
// → Owner receives "cleaning started" notification

// 3. Cleaner sends updates
await cleaningUpdateService.addUpdate(session.id, {
  update_type: 'note',
  message: 'Kitchen done, moving to bathrooms',
});

// 4. Cleaner reports issue
await cleaningUpdateService.reportIssue(session.id, {
  issue_description: 'Broken faucet in bathroom',
  issue_type: 'maintenance',
  is_urgent: false,
});
// → Owner receives maintenance notification

// 5. Cleaner completes with photos
const photoUrls = await Promise.all([
  photoProofService.capturePhoto(session.id, 'kitchen', kitchenUri),
  photoProofService.capturePhoto(session.id, 'bathroom_1', bathroomUri),
]);

const validation = await photoProofService.validatePhotoProof(session.id);
if (validation.isComplete) {
  await cleaningSessionService.completeSession(session.id, {
    completion_notes: 'All areas cleaned',
    photo_urls: photoUrls,
  });
  // → Owner receives "cleaning completed" notification
}
```

---

**Last Updated**: January 2025  
**Total Services**: 8  
**Maintenance**: Keep synchronized with actual service implementations
