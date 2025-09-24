---
applyTo: 'types/**/*.ts'
---

# TypeScript Type Definitions

## Type Definition Rules

- Define all interfaces in `/types/index.ts`
- Use descriptive property names that match business concepts
- Include status enums for workflow states
- Add optional properties with `?` for non-required fields
- Use string literal types for constrained values

## Standard Interface Pattern

```typescript
export interface BusinessEntity {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Business properties
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'pending';
  
  // Relations
  owner_id: string;
  assigned_user_id?: string;
  
  // Optional metadata
  metadata?: Record<string, any>;
}
```

## Key Domain Types

```typescript
// User roles
type UserRole = 'property_owner' | 'cleaner' | 'co_host';

// Session status flow
type SessionStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// Notification priorities
type NotificationPriority = 'urgent' | 'high' | 'normal';

// Property status
type PropertyStatus = 'active' | 'occupied' | 'maintenance' | 'inactive';
```

## Component Props Pattern

```typescript
interface ComponentNameProps {
  // Required data
  data: EntityType;
  
  // Required callbacks
  onPress: () => void;
  onEdit?: (id: string) => void;
  
  // Optional UI state
  loading?: boolean;
  disabled?: boolean;
  
  // Style overrides
  style?: ViewStyle;
}
```

## Service Return Types

```typescript
// Always use Promise<T> for async operations
interface ServiceInterface {
  getData: (filters?: FilterType) => Promise<EntityType[]>;
  createItem: (data: Omit<EntityType, 'id'>) => Promise<EntityType>;
  updateItem: (id: string, updates: Partial<EntityType>) => Promise<EntityType>;
  deleteItem: (id: string) => Promise<void>;
}
```

## Business Logic Types

```typescript
// Cleaning session workflow
interface CleaningSession {
  id: string;
  property_id: string;
  assigned_cleaner_id?: string;
  guest_count: number;
  checkin_time: string;
  checkout_time: string;
  scheduled_cleaning_time: string;
  session_type: 'checkout_clean' | 'checkin_prep' | 'maintenance_clean';
  status: SessionStatus;
  
  // Cancellation tracking
  cancelled_at?: string;
  cancellation_reason?: string;
  cancellation_notice_hours?: number;
  
  // Progress tracking
  cleaner_arrived_at?: string;
  cleaner_completed_at?: string;
  actual_guest_count?: number;
}

// Linen requirements calculation
interface LinenRequirement {
  guest_count: number;
  bed_sheets_single: number;
  bed_sheets_double: number;
  bed_sheets_queen: number;
  bed_sheets_king: number;
  pillow_cases: number;
  towels_bath: number;
  towels_hand: number;
  towels_face: number;
  kitchen_towels: number;
  bath_mats: number;
}
```
