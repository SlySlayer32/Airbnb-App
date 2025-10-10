# Airbnb Cleaning Management Platform

## What This App Does
A mobile-first platform connecting property owners with cleaners for Airbnb turnovers. Coordinates cleanings in the critical 4-hour window between guest checkout (11 AM) and checkin (3 PM). Tracks time, requires photo proof, and handles real-time communication.

**Users:**
- Property Owners: Manage properties, schedule cleanings, view reports
- Cleaners: View jobs, track time, upload photos, report issues
- Co-Hosts: Limited property coordination access

## Tech Stack (Established - Don't Change)
- Frontend: React Native + Expo SDK 54 (iOS, Android, Web)
- Backend: Supabase (PostgreSQL + Auth + Realtime + Storage)
- Language: TypeScript strict mode (NO 'any' types ever)
- Navigation: Expo Router (file-based routing)
- Styling: React Native StyleSheet only (no external CSS)
- Icons: @expo/vector-icons (Ionicons only)
- State: React Context for auth, useState for UI

## Critical Business Rules (ALWAYS Enforce)

### 1. Cleaning Window (NON-NEGOTIABLE)
- All cleanings MUST be scheduled 11 AM - 3 PM
- Validate time before saving to database
- Show warning if outside window
- Formula: `hour >= 11 && hour < 15`

### 2. Cancellation Notice (24 Hours)
- Calculate hours until cleaning: `Math.floor((scheduled - now) / 3600000)`
- Flag as "SHORT NOTICE" if < 24 hours (show in RED)
- Block cancellation if < 1 hour before start

### 3. Financial Privacy (SECURITY RULE)
- Cleaners NEVER see: rates, pricing, invoices, payments, owner revenue
- Use `RoleBasedWrapper` component to hide financial UI
- Database queries must filter by role (RLS enforced)

### 4. Photo Proof (QUALITY CONTROL)
- Cleaners cannot complete session without minimum photos
- Required: kitchen, bathroom, living area (3 minimum)
- Use `PhotoProofGate` component to enforce
- Validate photo count before allowing completion

### 5. Linen Requirements (AUTO-CALCULATE)
```typescript
const linens = {
  bath_towels: guestCount * 1,
  hand_towels: guestCount * 1,
  pillow_cases: guestCount * 2,
  kitchen_towels: 2,
  bath_mats: 1 + (propertyType === 'villa' && guestCount > 4 ? 1 : 0)
};
```

## Code Quality Standards (Non-Negotiable)

### TypeScript Requirements
1. **NO 'any' types** - Use proper interfaces from `/types/index.ts`
2. **All functions typed** - Parameters, return types, props
3. **Interface consistency** - Follow existing patterns exactly
4. **Import from types** - `import { CleaningSession } from '@/types'`

### Every Async Operation Must Have
1. **Loading state** - Show spinner or skeleton during fetch
2. **Error state** - User-friendly message (not technical jargon)
3. **Empty state** - Message when no data exists
4. **Success feedback** - Confirmation when action completes

Example Pattern:
```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Type[]>([]);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const result = await service.getData();
    setData(result);
  } catch (err) {
    console.error('[ComponentName.loadData]', err);
    setError('Could not load data. Please check your connection.');
  } finally {
    setLoading(false);
  }
};
```

### Service Layer Pattern (ALWAYS Follow)
- All database calls go through services in `/services/`
- NEVER call Supabase directly from components
- Services handle errors and show user-friendly alerts
- Services return typed data matching `/types/index.ts`

### Component Pattern
```typescript
// File: components/NewCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EntityType } from '@/types';
import { entityService } from '@/services';

interface NewCardProps {
  data: EntityType;
  onPress: () => void;
  onUpdate?: (id: string) => void;
}

export default function NewCard({ data, onPress, onUpdate }: NewCardProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    try {
      setLoading(true);
      await entityService.doSomething(data.id);
      Alert.alert('Success', 'Action completed');
      onUpdate?.(data.id);
    } catch (error) {
      // Error already shown by service
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Component content */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

## File Organization (Follow Exactly)
```
/app/                      → Screens (Expo Router)
/components/              → Reusable UI (18 components exist)
/services/                → Business logic (8 services exist)
/types/index.ts           → All TypeScript definitions
/contexts/AuthContext.tsx → Auth state management
/lib/supabase.ts         → Supabase client
/docs/                   → Project documentation
```

## Naming Standards (Follow Exactly)
- **Components**: `CleanerPropertyCard.tsx` (PascalCase)
- **Services**: `cleaningSessionService.ts` (camelCase + Service)
- **Screens**: `properties.tsx` (lowercase, matches route)
- **Functions**: `getUserData()` (camelCase)
- **Types**: `CleaningSession` (PascalCase, no 'I' prefix)
- **Constants**: `API_BASE_URL` (SCREAMING_SNAKE_CASE)

## Design System (Use Exactly)
```typescript
const colors = {
  primary: '#007AFF',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  background: '#f9fafb',
  cardBackground: '#ffffff',
  border: '#e5e7eb',
};

const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
};

const borderRadius = {
  small: 6, medium: 8, large: 12, round: 999
};
```

## When Writing New Features

### MUST Include:
1. Loading state with spinner
2. Error state with retry option
3. Empty state with helpful message
4. Role-based access control (if needed)
5. Business rule validation
6. Mobile-responsive design
7. All TypeScript types
8. Error handling in try/catch

### MUST NOT Include:
1. TODO comments or placeholders
2. console.log statements
3. 'any' types
4. Hardcoded values (use constants)
5. Direct Supabase calls (use services)
6. Incomplete implementations

## Response Structure (Always Follow)

When completing a task, structure response as:

**1. Confirming What Was Built**
"Built [feature] so that [user role] can [action]"

**2. Files Changed**
- Created: [list new files with paths]
- Modified: [list changed files]
- No database changes / Database changes: [describe]

**3. Business Rules Enforced**
- [Which of the 5 critical rules apply]
- [How code enforces them]

**4. Testing Steps**
1. [How to test this feature]
2. [Expected result]
3. [Edge cases tested]

**5. Next Recommended Step**
"The logical next step is [specific feature] because [technical/workflow reason]"

## Reference Documentation
- **Current phase**: `docs/phase-tracking/PHASE_STATUS.md`
- **All components**: `docs/manifests/COMPONENTS.md`
- **All services**: `docs/manifests/SERVICES.md`
- **All screens**: `docs/manifests/SCREENS.md`
- **Quick patterns**: `docs/reference/QUICK_REFERENCE.md`
- **User roles**: `docs/core/USER_ROLES.md`
- **Business rules**: `docs/core/BUSINESS_RULES.md`

## Success Criteria
✅ Code works immediately without debugging
✅ TypeScript compiles with zero errors
✅ Mobile responsive (test on phone simulator)
✅ All business rules enforced correctly
✅ Error handling covers all edge cases
✅ Matches existing component/service patterns
✅ Strategic next step provided

