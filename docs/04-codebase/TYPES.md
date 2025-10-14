# 📝 TypeScript Types Reference

> Complete reference for all interfaces and types in the application

## 📋 Table of Contents
- [Core Entity Types](#core-entity-types)
- [Session Management Types](#session-management-types)
- [Photo Proof Types](#photo-proof-types)
- [Dashboard & UI Types](#dashboard--ui-types)
- [Real-time Types](#real-time-types)
- [Type Usage Patterns](#type-usage-patterns)

---

## 🏠 Core Entity Types

### Property
Basic property information for general use.

```typescript
interface Property {
  id: string;
  name: string;
  address: string;
  rooms: number;
  bathrooms: number;
  imageUrl: string;
  specialInstructions?: string;
  status: 'active' | 'maintenance' | 'occupied';
  nextClean?: Date;
  assignedCleaners: string[];
}
```

**Used In**: Property lists, basic displays

---

### EnhancedProperty
Comprehensive property data with all cleaner-focused information.

```typescript
interface EnhancedProperty {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  rooms: number;
  bathrooms: number;
  image_url: string;
  status: 'active' | 'occupied' | 'maintenance' | 'inactive';
  max_occupancy: number;
  property_type: 'apartment' | 'house' | 'condo' | 'villa' | 'studio';
  
  // Access Information
  access_method: 'key_lockbox' | 'smart_lock' | 'doorman' | 'owner_present' | 'other';
  access_code?: string;
  access_instructions?: string;
  wifi_name?: string;
  wifi_password?: string;
  
  // Property Features
  has_balcony: boolean;
  has_pool: boolean;
  has_hot_tub: boolean;
  has_bbq: boolean;
  has_laundry: boolean;
  special_areas?: string[];
  parking_instructions?: string;
  
  // Cleaning Logistics
  cleaning_supplies_location?: string;
  vacuum_location?: string;
  linen_storage_location?: string;
  default_checkin_time: string;
  default_checkout_time: string;
  estimated_cleaning_duration: number;
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  // Relations
  current_session?: CleaningSession;
  next_session?: CleaningSession;
  linen_requirements?: LinenRequirement[];
}
```

**Used In**: Cleaner property cards, detailed property views, session creation

---

## 🧹 Session Management Types

### CleaningSession
Complete session lifecycle data with pause/resume tracking.

```typescript
interface CleaningSession {
  id: string;
  property_id: string;
  assigned_cleaner_id?: string;
  guest_count: number;
  checkin_time: string;
  checkout_time: string;
  scheduled_cleaning_time: string;
  session_type: 'checkout_clean' | 'checkin_prep' | 'maintenance_clean' | 'deep_clean' | 'inspection';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  
  // Cancellation info
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
  cancellation_notice_hours?: number;
  
  // Special requests
  special_requests?: string;
  guest_notes?: string;
  custom_linen_requirements?: any;
  additional_cleaning_tasks?: string[];
  priority_areas?: string[];
  
  // Status tracking
  cleaner_arrived_at?: string;
  cleaner_started_at?: string;
  cleaner_completed_at?: string;
  actual_guest_count?: number;
  
  // Pause/Resume tracking (Phase 1)
  cleaner_paused_at?: string;
  cleaner_resumed_at?: string;
  total_break_minutes?: number;
  is_currently_paused?: boolean;
  
  // Photo requirements
  photos_required?: boolean;
  photos_completed?: boolean;
  completion_photos?: string[];
  
  // Dashboard metadata (only in getTodaySessions)
  dashboard_metadata?: DashboardMetadata;
  
  // Relations
  properties?: { name: string; owner_id: string };
  team_members?: { name: string; phone: string };
  linen_requirements?: LinenRequirement;
}
```

**Used In**: All session-related components and services

**Key Status Flow**:
```
scheduled → confirmed → in_progress → completed
         ↘ cancelled
         ↘ no_show
```

---

### DashboardMetadata
Enhanced metadata for intelligent dashboard displays.

```typescript
interface DashboardMetadata {
  time_until_start_minutes: number;
  cleaning_window_status: 'valid' | 'outside_window';
  is_within_cleaning_window: boolean;
  is_overdue: boolean;
  has_started: boolean;
  has_completed: boolean;
  expected_completion_time: string;
  cleaning_window_start: string;
  cleaning_window_end: string;
  status_indicator: 'completed' | 'in_progress' | 'overdue' | 'starting_soon' | 'scheduled';
  priority_level: 'urgent' | 'high' | 'medium' | 'normal';
}
```

**Used In**: CleanerDashboard, priority calculations, status displays

---

### LinenRequirement
Auto-calculated linen quantities per guest count.

```typescript
interface LinenRequirement {
  guest_count: number;
  bed_sheets_single: number;
  bed_sheets_double: number;
  bed_sheets_queen: number;
  bed_sheets_king: number;
  pillow_cases: number;
  duvet_covers: number;
  towels_bath: number;
  towels_hand: number;
  towels_face: number;
  towels_pool: number;
  kitchen_towels: number;
  bath_mats: number;
  additional_items?: any;
}
```

**Used In**: Property details, cleaner preparation, session info

---

## 📸 Photo Proof Types

### PhotoProofRequirement
Individual photo requirement for a session.

```typescript
interface PhotoProofRequirement {
  id: string;
  session_id: string;
  category: 'before_cleaning' | 'after_cleaning' | 'specific_area' | 'issue_report';
  area_name: string;
  is_required: boolean;
  is_completed: boolean;
  photo_url?: string;
  notes?: string;
  created_at: string;
  completed_at?: string;
}
```

**Used In**: PhotoProofGate component, photo validation

---

### PhotoProofValidation
Validation result for session completion.

```typescript
interface PhotoProofValidation {
  can_complete_session: boolean;
  missing_photos: PhotoProofRequirement[];
  completion_percentage: number;
  validation_message: string;
}
```

**Used In**: Completion flow, photo gate enforcement

---

## 📊 Dashboard & UI Types

### BannerState
Seven possible states for cleaner dashboard banner.

```typescript
type BannerState = 'relax' | 'scheduled' | 'ready' | 'active' | 'break' | 'awaiting_photos' | 'day_wrap';
```

**State Meanings**:
- `relax`: No jobs scheduled today
- `scheduled`: Jobs scheduled but not ready to start
- `ready`: Within 30 min of next job start time
- `active`: Currently cleaning
- `break`: Session paused
- `awaiting_photos`: Cleaning done, need photos
- `day_wrap`: All jobs complete for day

---

### BannerStateContext
Context data for banner state machine.

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

**Used In**: BannerStateService calculations

---

### BannerStateResult
State machine output with display information.

```typescript
interface BannerStateResult {
  status: BannerState;
  message: string;
  timeRemaining?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired?: boolean;
  nextAction?: string;
  urgencyReason?: string;
}
```

**Used In**: CleanerStatusBanner component

---

## 🔄 Real-time Types

### RealtimeConnectionState
Connection status tracking.

```typescript
interface RealtimeConnectionState {
  isConnected: boolean;
  lastConnected?: Date;
  connectionError?: string;
  reconnectAttempts: number;
}
```

**Used In**: Real-time service, connection indicators

---

### RealtimeSubscriptionConfig
Subscription callback configuration.

```typescript
interface RealtimeSubscriptionConfig {
  onSessionUpdate: (session: CleaningSession) => void;
  onSessionInsert: (session: CleaningSession) => void;
  onSessionDelete: (sessionId: string) => void;
  onUpdateInsert: (update: any) => void;
  onError?: (error: Error) => void;
}
```

**Used In**: Real-time service subscriptions

---

## 🎯 Type Usage Patterns

### Importing Types
```typescript
// Import specific types
import { CleaningSession, Property } from '@/types';

// Import with type keyword (for type-only imports)
import type { DashboardMetadata, BannerState } from '@/types';

// Both methods work - use 'type' keyword when possible for tree-shaking
```

### Status Type Guards
```typescript
// Type-safe status checking
function isSessionActive(status: CleaningSession['status']): boolean {
  return status === 'in_progress';
}

// Union type narrowing
type SessionStatus = CleaningSession['status'];
const validStatuses: SessionStatus[] = ['scheduled', 'in_progress', 'completed'];
```

### Partial Types for Updates
```typescript
// Update method accepts partial data
async updateSession(id: string, updates: Partial<CleaningSession>) {
  // TypeScript ensures only valid CleaningSession fields
}

// Create method omits auto-generated fields
async createSession(data: Omit<CleaningSession, 'id' | 'created_at'>) {
  // TypeScript ensures required fields present
}
```

### Optional Chaining
```typescript
// Safe access with optional chaining
const ownerName = session.properties?.name ?? 'Unknown Property';
const metadata = session.dashboard_metadata?.priority_level ?? 'normal';
```

---

## ✅ Type Safety Checklist

When creating new features:
- [ ] All function parameters typed
- [ ] All function return types specified
- [ ] Component props interface defined
- [ ] useState calls include type parameter
- [ ] No 'any' types used
- [ ] Optional fields marked with `?`
- [ ] Status fields use string literal unions
- [ ] Import types from `/types/index.ts`

---

**Last Updated**: January 2025  
**Source**: `/types/index.ts`  
**Total Interfaces**: 20+  
**Maintenance**: Update when adding new database tables or features

