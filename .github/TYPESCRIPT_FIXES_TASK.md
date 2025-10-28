# TypeScript Strict Mode Compliance - Coding Agent Task

## Task Overview

Fix 37 TypeScript strict mode errors to achieve 100% type safety compliance. All errors are due to `exactOptionalPropertyTypes: true` in tsconfig.json.

## Priority: HIGH

**Estimated Time:** 3-4 hours
**Risk Level:** Low (non-breaking changes)
**Files Affected:** 12 files

---

## Task Breakdown

### 🔴 CRITICAL - Must Fix First (Priority 1)

#### 1. Fix RealtimeService.ts (7 errors)

**File:** `services/realtimeService.ts`

**Issues:**

- Line 71: `connectionError: undefined` - not assignable with exactOptionalPropertyTypes
- Lines 100, 115, 130: Supabase realtime API type mismatches
- Lines 107, 122, 137: Parameter 'payload' implicitly has 'any' type

**Required Changes:**

```typescript
// 1. Update RealtimeConnectionState interface in types/index.ts
export interface RealtimeConnectionState {
  isConnected: boolean;
  lastConnected?: Date | undefined;
  connectionError?: string | undefined;  // Add explicit undefined
  reconnectAttempts: number;
}

// 2. Fix line 71 in realtimeService.ts
this.connectionState.connectionError = undefined;  // This will now work

// 3. Add proper type imports
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// 4. Fix payload types (lines 107, 122, 137)
(payload: RealtimePostgresChangesPayload<CleaningSession>) => {
  // handler code
}

// 5. For the API mismatch, cast as any temporarily (Supabase v2 migration needed)
.on('postgres_changes' as any, { ... }, (payload: any) => {
```

---

#### 2. Fix AuthContext.tsx (3 errors)

**File:** `contexts/AuthContext.tsx`

**Issues:**

- Lines 66, 78, 101: Cannot assign `MockProfile | undefined` to `Profile | null`

**Required Changes:**

```typescript
// Lines 66, 78, 101 - Use nullish coalescing
setProfile(DEFAULT_MOCK_PROFILE ?? null);

// OR fix mockProfiles.ts to ensure DEFAULT_MOCK_PROFILE is never undefined
```

---

#### 3. Fix mockProfiles.ts (4 errors)

**File:** `data/mockProfiles.ts`

**Issues:**

- Lines 20, 30, 40: `avatar_url: undefined` not assignable
- Line 59: `DEFAULT_MOCK_PROFILE` may be undefined

**Required Changes:**

```typescript
// Update MockProfile interface in the file
export interface MockProfile extends Profile {
  avatar_url?: string | undefined; // Explicit undefined
}

// Fix line 59
export const DEFAULT_MOCK_PROFILE: MockProfile = MOCK_PROFILES.find((p) => p.role === 'cleaner')!; // Use non-null assertion since we know it exists

// OR
export const DEFAULT_MOCK_PROFILE: MockProfile =
  MOCK_PROFILES.find((p) => p.role === 'cleaner') ?? MOCK_PROFILES[0]; // Fallback to first profile
```

---

#### 4. Fix cleaningUpdateService.ts (2 errors)

**File:** `services/cleaningUpdateService.ts`

**Issues:**

- Lines 87, 101: `photo_urls: string[] | undefined` not assignable

**Required Changes:**

```typescript
// Update addUpdate parameter type to accept undefined
async addUpdate(sessionId: string, updateData: {
  update_type: 'status' | 'issue' | 'note' | 'completion' | 'arrival' | 'session_start' | 'session_pause' | 'session_resume' | 'session_complete';
  message: string;
  photo_urls?: string[] | undefined;  // Allow undefined explicitly
  requires_response?: boolean;
  is_urgent?: boolean;
}) {

// OR use nullish coalescing at call site
photo_urls: issueData.photo_urls ?? undefined,
```

---

#### 5. Fix cleaningSessionService.ts (1 error)

**File:** `services/cleaningSessionService.ts`

**Issue:**

- Line 284: `actual_guest_count: number | undefined` not assignable

**Required Change:**

```typescript
// Line 284 - Use explicit undefined handling
const session = await this.updateSessionStatus(sessionId, {
  status: 'completed',
  cleaner_completed_at: now,
  actual_guest_count: completionData.actual_guest_count ?? undefined,
  is_currently_paused: false,
  total_break_minutes: totalBreakMinutes,
});
```

---

#### 6. Fix gluestack-ui.config.ts (1 error)

**File:** `gluestack-ui.config.ts`

**Issue:**

- Line 2: Cannot find module '@gluestack-ui/config'

**Required Investigation & Fix:**

```bash
# Check if package is installed
npm list @gluestack-ui/config

# If not found, check correct import path
# May need to use:
import { config as defaultConfig } from '@gluestack-ui/themed';

# Or create default config without import
export const config = {
  // ... custom config
};
```

---

### 🟡 IMPORTANT - Fix Next (Priority 2)

#### 7. Fix ErrorBoundary.tsx (2 errors)

**File:** `components/ErrorBoundary.tsx`

**Issues:**

- Lines 35, 72: Missing 'override' modifier

**Required Changes:**

```typescript
// Line 35
override static getDerivedStateFromError(error: Error): State {
  return { hasError: true, error };
}

// Line 72
override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  console.error('Error boundary caught error:', error, errorInfo);
}
```

---

#### 8. Fix app/onboarding.tsx (4 errors)

**File:** `app/onboarding.tsx`

**Issues:**

- Lines 75, 79, 80, 81: 'step' is possibly undefined

**Required Changes:**

```typescript
// Add null check
const step = onboardingSteps[currentStep];
if (!step) {
  return null; // or redirect
}

// Then use step safely
<Text>{step.title}</Text>
<Text>{step.description}</Text>
// etc.

// OR use optional chaining
<Text>{step?.title ?? 'Onboarding'}</Text>
```

---

#### 9. Fix PhotoProofGate.tsx (2 errors)

**File:** `components/PhotoProofGate.tsx`

**Issues:**

- Lines 104, 119: `photo_url: string | undefined` not assignable

**Required Changes:**

```typescript
// Update PhotoProofRequirement in types/index.ts
export interface PhotoProofRequirement {
  id: string;
  session_id: string;
  category: 'before_cleaning' | 'after_cleaning' | 'specific_area' | 'issue_report';
  area_name: string;
  is_required: boolean;
  is_completed: boolean;
  photo_url?: string | undefined; // Explicit undefined
  notes?: string | undefined;
  created_at: string;
  completed_at?: string | undefined;
}
```

---

#### 10. Fix bannerStateService.ts (2 errors)

**File:** `services/bannerStateService.ts`

**Issues:**

- Lines 103, 125: `urgencyReason: string | undefined` not assignable

**Required Changes:**

```typescript
// Update BannerStateResult in types/index.ts
export interface BannerStateResult {
  status: BannerState;
  message: string;
  timeRemaining?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired?: boolean;
  nextAction?: string;
  urgencyReason?: string | undefined; // Add explicit undefined
}
```

---

#### 11. Fix DebugPanel.tsx (2 errors)

**File:** `components/DebugPanel.tsx`

**Issues:**

- Line 48: `profileRole: string | undefined` not assignable
- Line 62: `userAgent: string | undefined` not assignable

**Required Changes:**

```typescript
// Line 48 - Use nullish coalescing or update type
const debugInfo = {
  loading,
  user: !!user,
  profile: !!profile,
  profileRole: profile?.role ?? undefined, // Explicit undefined
};

// Line 62
const platformInfo = {
  platform: Platform.OS,
  userAgent:
    Platform.select({ web: () => navigator.userAgent, default: () => undefined })?.() ?? undefined,
};
```

---

#### 12. Fix Other Files (7 errors)

**Files:** Various

**app/auth/register.tsx (Line 114):**

```typescript
// Add null check
await signUp(email, password, fullName ?? '', role);
```

**app/profile.tsx (Line 133):**

```typescript
// Use nullish coalescing
await updateProfile({ full_name: fullName ?? '' });
```

**components/CleanerStatusBanner.tsx (Line 99):**

```typescript
// Update BannerStateContext in types to allow undefined for optional fields
const context: BannerStateContext = {
  sessions: todaySessions,
  currentTime: new Date(),
  activeSession: activeSession ?? undefined,
  nextSession: nextSession ?? undefined,
  userRole: profile?.role ?? 'cleaner',
  isOnline: true,
};
```

**components/TodoTasksSection.tsx (Line 60):**

```typescript
// Use nullish coalescing
isUrgent={task.isUrgent ?? false}
```

---

## Verification Steps

After making all fixes, run these commands in order:

```bash
# 1. Type check
npm run type-check

# Expected: 0 errors

# 2. Lint check
npm run lint

# Expected: 0 errors or only warnings

# 3. Format code
npm run format

# 4. Run tests
npm test

# Expected: All tests pass

# 5. Full validation
npm run validate

# Expected: All checks pass
```

---

## Type Definition Updates Required

### Update `types/index.ts`:

```typescript
// 1. RealtimeConnectionState
export interface RealtimeConnectionState {
  isConnected: boolean;
  lastConnected?: Date | undefined;
  connectionError?: string | undefined;
  reconnectAttempts: number;
}

// 2. PhotoProofRequirement
export interface PhotoProofRequirement {
  id: string;
  session_id: string;
  category: 'before_cleaning' | 'after_cleaning' | 'specific_area' | 'issue_report';
  area_name: string;
  is_required: boolean;
  is_completed: boolean;
  photo_url?: string | undefined;
  notes?: string | undefined;
  created_at: string;
  completed_at?: string | undefined;
}

// 3. BannerStateResult
export interface BannerStateResult {
  status: BannerState;
  message: string;
  timeRemaining?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired?: boolean;
  nextAction?: string;
  urgencyReason?: string | undefined;
}

// 4. BannerStateContext
export interface BannerStateContext {
  sessions: CleaningSession[];
  currentTime: Date;
  activeSession?: CleaningSession | undefined;
  nextSession?: CleaningSession | undefined;
  userRole: 'cleaner' | 'property_owner' | 'co_host';
  isOnline: boolean;
}
```

---

## Success Criteria

- ✅ `npm run type-check` returns 0 errors
- ✅ `npm run lint` returns 0 errors (warnings acceptable)
- ✅ All tests pass
- ✅ No runtime errors introduced
- ✅ Code formatting consistent

---

## Notes for Coding Agent

1. **Do not change business logic** - Only fix type issues
2. **Use explicit `| undefined`** for optional properties with exactOptionalPropertyTypes
3. **Use nullish coalescing (`??`)** when assigning potentially undefined values
4. **Test after each file** to avoid cascading errors
5. **Check imports** - Ensure all type imports are correct
6. **Document any blocked issues** - If something can't be fixed, note why

---

## Reference: exactOptionalPropertyTypes

With `exactOptionalPropertyTypes: true`, TypeScript distinguishes between:

```typescript
// ❌ WRONG - property can be missing, but if present must be string
interface Wrong {
  name?: string;
}
const obj: Wrong = { name: undefined }; // ERROR!

// ✅ CORRECT - property can be missing OR explicitly undefined
interface Correct {
  name?: string | undefined;
}
const obj: Correct = { name: undefined }; // OK!
```

---

## Contact

If you encounter any blocking issues or need clarification:

1. Check `CODEBASE_AUDIT_REPORT.md` for detailed examples
2. Reference the project instructions in `.github/instructions/`
3. Ask for human review if uncertain

**Deadline:** Complete within 24 hours
**Status:** 🔴 Not Started

---

**Created:** October 28, 2025
**Last Updated:** October 28, 2025
**Assigned To:** Coding Agent (GitHub Copilot Workspace Agent)
