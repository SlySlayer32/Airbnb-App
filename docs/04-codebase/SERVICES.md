# 🔧 Service Manifest

> Complete API reference for all 8 business logic services

## 📋 Table of Contents
- [Overview](#overview)
- [Core Business Services](#core-business-services)
- [Infrastructure Services](#infrastructure-services)
- [Service Patterns](#service-patterns)

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

### cleaningSessionService
**Path**: `/services/cleaningSessionService.ts`  
**Purpose**: Manages complete cleaning session lifecycle from creation to completion  
**Database Tables**: `cleaning_sessions`  
**Dependencies**: `notificationService`, `cleaningUpdateService`

#### Key Methods

##### `getTodaySessions(): Promise<CleaningSession[]>`
Fetches all cleaning sessions scheduled for today with enhanced metadata.

**Returns**: Array of sessions with priority levels and time validation  
**Use Cases**: Dashboard, daily schedule view  
**Business Logic**:
- Calculates time_until_start_minutes
- Determines priority_level (urgent/high/medium/normal)
- Validates cleaning_window_status
- Sets status_indicator for UI display

**Example**:
```typescript
const sessions = await cleaningSessionService.getTodaySessions();
// Returns sessions with dashboard_metadata populated
```

---

##### `startCleaning(sessionId: string): Promise<CleaningSession>`
Marks cleaner as arrived and session in-progress.

**Business Logic**:
- Sets `cleaner_arrived_at` timestamp
- Updates status to 'in_progress'
- Records start in cleaning_updates
- Validates session is in 'scheduled' status
- Notifies property owner

**Example**:
```typescript
await cleaningSessionService.startCleaning(sessionId);
// Status: 'scheduled' → 'in_progress'
```

---

##### `pauseSession(sessionId: string, reason?: string): Promise<CleaningSession>`
Pauses active session for break tracking.

**Parameters**:
- `sessionId: string` - Session to pause
- `reason?: string` - Optional pause reason (default: "Break")

**Business Logic**:
- Validates session is currently 'in_progress'
- Validates session is not already paused
- Sets `cleaner_paused_at` timestamp
- Sets `is_currently_paused` flag
- Records pause event in cleaning_updates

**Example**:
```typescript
await cleaningSessionService.pauseSession(sessionId, 'Lunch break');
```

---

##### `resumeSession(sessionId: string): Promise<CleaningSession>`
Resumes paused session and calculates break time.

**Business Logic**:
- Validates session is currently paused
- Calculates time since pause
- Adds to `total_break_minutes`
- Clears pause timestamp and flag
- Records resume event in cleaning_updates

**Example**:
```typescript
await cleaningSessionService.resumeSession(sessionId);
// Break time added to total_break_minutes
```

---

##### `completeCleaning(sessionId: string, completionData): Promise<CleaningSession>`
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
- Records completion in cleaning_updates
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
- Notifies affected parties

---

### propertyService
**Path**: `/services/propertyService.ts`  
**Purpose**: Manages property CRUD operations  
**Database Tables**: `properties`, `linen_requirements`

#### Key Methods

##### `getPropertiesForOwner(): Promise<EnhancedProperty[]>`
Fetches all properties owned by current user.

**Returns**: Array of properties with sessions and linen requirements  
**RLS**: Only returns properties where `owner_id` matches auth user

---

##### `getPropertiesForCleaner(): Promise<EnhancedProperty[]>`
Fetches properties assigned to current cleaner.

**Returns**: Array of properties with access codes, WiFi, supply locations  
**RLS**: Only returns properties where cleaner is in `team_members` table

---

### cleaningUpdateService
**Path**: `/services/cleaningUpdateService.ts`  
**Purpose**: Handles real-time progress updates during sessions  
**Database Tables**: `cleaning_updates`

#### Key Methods

##### `addUpdate(sessionId, updateData): Promise<CleaningUpdate>`
Adds progress update or note to session.

##### `recordSessionStart(sessionId, propertyName?): Promise<CleaningUpdate>`
Auto-records when cleaner starts session.

##### `recordSessionPause(sessionId, reason?): Promise<CleaningUpdate>`
Auto-records pause events.

##### `recordSessionResume(sessionId): Promise<CleaningUpdate>`
Auto-records resume events.

##### `recordSessionComplete(sessionId, propertyName?, notes?): Promise<CleaningUpdate>`
Auto-records completion.

---

## 🚨 Infrastructure Services

### notificationService
**Path**: `/services/notificationService.ts`  
**Purpose**: Centralized notification system  
**Database Tables**: `notifications`

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

---

### realtimeService
**Path**: `/services/realtimeService.ts`  
**Purpose**: Manages Supabase real-time subscriptions  
**Class-Based**: Uses RealtimeService class

#### Key Methods

##### `subscribe(config): Promise<void>`
Subscribes to real-time database changes.

**Parameters**:
```typescript
{
  onSessionUpdate?: (session: CleaningSession) => void;
  onUpdateReceived?: (update: CleaningUpdate) => void;
  onNotification?: (notification: Notification) => void;
}
```

##### `unsubscribe(): Promise<void>`
Cleans up subscriptions.

---

### photoProofService
**Path**: `/services/photoProofService.ts`  
**Purpose**: Manages photo upload and validation  
**Class-Based**: Uses PhotoProofService class

#### Key Methods

##### `generatePhotoRequirements(sessionId, sessionType, propertyRooms)`
Generates required photo checklist.

##### `validatePhotoProof(sessionId): Promise<PhotoProofValidation>`
Checks if all required photos uploaded.

---

### bannerStateService
**Path**: `/services/bannerStateService.ts`  
**Purpose**: Dashboard banner state machine logic  
**Exports**: `BannerStateService` object

#### Key Methods

##### `determineState(context): BannerState`
Determines which banner to show based on session state and time.

**Returns**: One of 7 states (relax, scheduled, ready, active, break, awaiting_photos, day_wrap)

---

## 🔄 Service Patterns

### Standard Service Structure
```typescript
import { supabase } from '@/utils/supabase';
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
      console.error('[serviceName.methodName]', error);
      Alert.alert('Error', 'User-friendly message');
      throw error;
    }
  },
};
```

---

**Last Updated**: January 2025  
**Total Services**: 8  
**Maintenance**: Keep synchronized with actual service implementations

