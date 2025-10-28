---
applyTo: '**/*.{ts,tsx}'
description: 'Core type definitions, domain models, and type usage patterns'
---

# Type System Reference

## Core Domain Types

### User & Authentication Types

```typescript
export type UserRole = 'cleaner' | 'property_owner' | 'co_host';

// Profile type (from Supabase auth.users)
interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
```

**Usage:**

```typescript
const { profile } = useAuth();
if (profile?.role === 'cleaner') {
  // Show cleaner-specific UI
}
```

---

### Property Types

```typescript
// Enhanced property with all metadata
export interface EnhancedProperty {
  // Core fields
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
  default_checkin_time: string; // e.g., "15:00"
  default_checkout_time: string; // e.g., "11:00"
  estimated_cleaning_duration: number; // minutes

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;

  // Relations (populated by joins)
  current_session?: CleaningSession;
  next_session?: CleaningSession;
  linen_requirements?: LinenRequirement[];
}

// Legacy property type (being phased out)
export interface Property {
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

**Usage:**

```typescript
// Fetching properties
const properties = await propertyService.getPropertiesForOwner();
// Returns: EnhancedProperty[]

// Creating a property
const newProperty: Omit<
  EnhancedProperty,
  'id' | 'current_session' | 'next_session' | 'linen_requirements'
> = {
  owner_id: user.id,
  name: 'Sunset Villa',
  address: '123 Beach Rd',
  // ... other required fields
};
```

---

### Cleaning Session Types

```typescript
export interface CleaningSession {
  // Core fields
  id: string;
  property_id: string;
  assigned_cleaner_id?: string;
  guest_count: number;
  checkin_time: string; // ISO 8601
  checkout_time: string; // ISO 8601
  scheduled_cleaning_time: string; // ISO 8601
  session_type:
    | 'checkout_clean'
    | 'checkin_prep'
    | 'maintenance_clean'
    | 'deep_clean'
    | 'inspection';
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

  // Status tracking (lifecycle fields)
  cleaner_arrived_at?: string;
  cleaner_started_at?: string;
  cleaner_completed_at?: string;
  actual_guest_count?: number;

  // Pause/Resume tracking
  cleaner_paused_at?: string;
  cleaner_resumed_at?: string;
  total_break_minutes?: number;
  is_currently_paused?: boolean;

  // Photo requirements
  photos_required?: boolean;
  photos_completed?: boolean;
  completion_photos?: string[];

  // Dashboard-specific metadata (only present in getTodaySessions response)
  dashboard_metadata?: DashboardMetadata;

  // Relations (populated by joins)
  properties?: { name: string; owner_id: string };
  team_members?: { name: string; phone: string };
  linen_requirements?: LinenRequirement;
}

// Dashboard metadata for session cards
export interface DashboardMetadata {
  time_until_start_minutes: number;
  cleaning_window_status: 'valid' | 'outside_window';
  is_within_cleaning_window: boolean;
  is_overdue: boolean;
  has_started: boolean;
  has_completed: boolean;
  expected_completion_time: string;
  cleaning_window_start: string; // ISO 8601
  cleaning_window_end: string; // ISO 8601
  status_indicator: 'completed' | 'in_progress' | 'overdue' | 'starting_soon' | 'scheduled';
  priority_level: 'urgent' | 'high' | 'medium' | 'normal';
}
```

**Usage:**

```typescript
// Fetching today's sessions
const sessions = await cleaningSessionService.getTodaySessions();
// Returns: CleaningSession[] with dashboard_metadata populated

// Starting a session
await cleaningSessionService.startSession(sessionId);
// Updates: status, cleaner_arrived_at, cleaner_started_at

// Completing a session
await cleaningSessionService.completeSession(sessionId, {
  actual_guest_count: 2,
  notes: 'Extra cleaning in kitchen',
  photosComplete: true,
});
```

---

### Linen Requirements

```typescript
export interface LinenRequirement {
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
  additional_items?: any; // JSONB for custom items
}
```

**Usage:**

```typescript
// Get linen requirements for a property
const requirements = await propertyService.getLinenRequirements(propertyId);
// Returns: LinenRequirement[]

// Find requirement for specific guest count
const requirement = requirements.find((r) => r.guest_count === session.guest_count);
```

---

### Team Member Types

```typescript
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'cleaner' | 'cohost' | 'contractor';
  imageUrl: string;
  assignedProperties: string[];
  rating: number;
}
```

---

### Realtime & Subscription Types

```typescript
export interface RealtimeConnectionState {
  isConnected: boolean;
  lastConnected?: Date;
  connectionError?: string;
  reconnectAttempts: number;
}

export interface RealtimeSubscriptionConfig {
  onSessionUpdate: (session: CleaningSession) => void;
  onSessionInsert: (session: CleaningSession) => void;
  onSessionDelete: (sessionId: string) => void;
  onUpdateInsert: (update: any) => void;
  onError?: (error: Error) => void;
}
```

**Usage:**

```typescript
const unsubscribe = realtimeService.subscribe({
  onSessionUpdate: (session) => {
    setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
  },
  onSessionInsert: (session) => {
    setSessions((prev) => [...prev, session]);
  },
});

// Cleanup
useEffect(() => () => unsubscribe(), []);
```

---

### Photo Proof Types

```typescript
export interface PhotoProofRequirement {
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

export interface PhotoProofStatus {
  session_id: string;
  total_required: number;
  total_completed: number;
  is_complete: boolean;
  missing_categories: string[];
  requirements: PhotoProofRequirement[];
}

export interface PhotoUploadResult {
  success: boolean;
  photo_url?: string;
  photo_id?: string;
  error?: string;
  upload_progress?: number;
}
```

**Usage:**

```typescript
// Check photo proof status
const status = await PhotoProofService.getSessionPhotoStatus(sessionId);
if (!status.is_complete) {
  // Show photo proof gate
  showPhotoProofModal(status.missing_categories);
}

// Upload photo
const result = await PhotoProofService.uploadPhoto(
  sessionId,
  file,
  'after_cleaning',
  'Living Room'
);
```

---

### Banner State Machine Types

```typescript
export type BannerState =
  | 'relax'
  | 'scheduled'
  | 'ready'
  | 'active'
  | 'break'
  | 'awaiting_photos'
  | 'day_wrap';

export interface BannerStateContext {
  sessions: CleaningSession[];
  currentTime: Date;
  activeSession?: CleaningSession;
  nextSession?: CleaningSession;
  userRole: 'cleaner' | 'property_owner' | 'co_host';
  isOnline: boolean;
}

export interface BannerStateResult {
  status: BannerState;
  message: string;
  timeRemaining?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired?: boolean;
  nextAction?: string;
  urgencyReason?: string;
}
```

**Usage:**

```typescript
const bannerState = BannerStateService.calculateState({
  sessions: todaySessions,
  currentTime: new Date(),
  activeSession: currentSession,
  userRole: profile.role,
  isOnline: true,
});

// Returns: { status: 'ready', message: 'Ready to start cleaning...', priority: 'high' }
```

---

### Dashboard Customization Types

```typescript
export type DashboardComponentType =
  | 'stats'
  | 'todayJobs'
  | 'quickActions'
  | 'todoTasks'
  | 'activity'
  | 'calendar';

export interface DashboardComponent {
  id: string;
  type: DashboardComponentType;
  order: number;
}

export interface DashboardLayout {
  id: string;
  user_id: string;
  components: DashboardComponent[];
  created_at: string;
  updated_at: string;
}
```

---

### Navigation Types

```typescript
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}

export interface SidebarState {
  isOpen: boolean;
  isPinned: boolean;
}
```

---

## Type Guards & Utilities

```typescript
// Type guard for EnhancedProperty
export function isEnhancedProperty(property: any): property is EnhancedProperty {
  return 'image_url' in property && 'owner_id' in property;
}

// Type guard for active session
export function isActiveSession(session: CleaningSession): boolean {
  return session.status === 'in_progress' && !session.is_currently_paused;
}

// Type guard for paused session
export function isPausedSession(session: CleaningSession): boolean {
  return session.status === 'in_progress' && session.is_currently_paused === true;
}
```

---

## Common Type Patterns

### Service Response Types

Services return typed data directly (not Supabase response objects):

```typescript
// ✅ Service returns typed data
async getProperties(): Promise<EnhancedProperty[]>

// ❌ Don't return Supabase response
async getProperties(): Promise<{ data: any[], error: any }>
```

### Optional Fields

Optional fields use `?:` syntax:

```typescript
interface Session {
  id: string; // Required
  notes?: string; // Optional
  photos_required?: boolean; // Optional (may be undefined)
}
```

### Union Types for Status

Use string literal unions for finite sets:

```typescript
type SessionStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';
type PropertyStatus = 'active' | 'occupied' | 'maintenance' | 'inactive';
```

### Omit for Create Operations

Use `Omit` to exclude generated fields:

```typescript
type PropertyInput = Omit<
  EnhancedProperty,
  'id' | 'current_session' | 'next_session' | 'linen_requirements'
>;

// Usage
const newProperty: PropertyInput = {
  owner_id: user.id,
  name: 'Sunset Villa',
  // ... no need for 'id' (generated by DB)
};
```

---

## Import Patterns

**Always import types from central location:**

```typescript
// ✅ Correct
import { CleaningSession, EnhancedProperty, UserRole } from '@/types';

// ❌ Don't create local types
interface CleaningSession { ... } // Wrong!
```

---

## Type Safety Best Practices

### 1. No `any` types

```typescript
// ❌ Avoid
function processData(data: any) { ... }

// ✅ Use proper types
function processData(session: CleaningSession) { ... }
```

### 2. Use type inference when obvious

```typescript
// ✅ Inference works
const sessions = await cleaningSessionService.getTodaySessions();
// Type: CleaningSession[]

// ❌ Redundant annotation
const sessions: CleaningSession[] = await cleaningSessionService.getTodaySessions();
```

### 3. Explicit return types for exported functions

```typescript
// ✅ Explicit return type
export async function getProperties(): Promise<EnhancedProperty[]> {
  // ...
}

// ❌ Implicit return type (for exports)
export async function getProperties() {
  // Bad for exported APIs
  // ...
}
```

---

## Migration Notes

**Legacy `Property` type is being phased out:**

- Old components may use `Property` interface
- New code should use `EnhancedProperty`
- Both are supported for compatibility during migration

**Field name mappings:**

- `Property.imageUrl` → `EnhancedProperty.image_url`
- `Property.nextClean` → `EnhancedProperty.current_session`

---

## Quick Reference

| Type                | Purpose                     | Key Fields                                                 |
| ------------------- | --------------------------- | ---------------------------------------------------------- |
| `EnhancedProperty`  | Full property with metadata | id, name, address, access_method, current_session          |
| `CleaningSession`   | Cleaning job state          | id, status, scheduled_cleaning_time, dashboard_metadata    |
| `DashboardMetadata` | Session UI metadata         | time_until_start_minutes, status_indicator, priority_level |
| `LinenRequirement`  | Guest-count-specific linens | guest*count, bed_sheets*\_, towels\_\_                     |
| `PhotoProofStatus`  | Photo completion status     | is_complete, missing_categories                            |
| `BannerStateResult` | Cleaner status banner       | status, message, priority, actionRequired                  |
| `UserRole`          | User permission level       | 'cleaner' \| 'property_owner' \| 'co_host'                 |
