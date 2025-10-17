# 🎯 Cursor AI Development Roadmap
## Single Source of Truth for AI-Assisted Development

> **Version**: 2.0  
> **Last Updated**: October 17, 2025  
> **Purpose**: Comprehensive guide for Cursor AI to interpret vague input, generate production-grade code, and maintain architectural excellence using only copyright-safe documentation.

---

## 📚 Table of Contents

1. [Startup Sequence](#startup-sequence)
2. [Vague Input Interpretation Framework](#vague-input-interpretation-framework)
3. [Production-Grade Code Standards](#production-grade-code-standards)
4. [Copyright-Safe Documentation References](#copyright-safe-documentation-references)
5. [Business Context & Rules](#business-context--rules)
6. [Technical Architecture](#technical-architecture)
7. [Code Patterns & Templates](#code-patterns--templates)
8. [Quality Assurance Checklist](#quality-assurance-checklist)
9. [Examples: Vague → Production](#examples-vague--production)

---

## 🚀 Startup Sequence

### Execute BEFORE Responding to ANY Request

**Step 1: Essential Context (MANDATORY - 30 seconds)**
```
1. READ: This file (CURSOR_ROADMAP.md) - You're here ✓
2. READ: docs/08-ai-context/ai-README.md - Project overview
3. READ: docs/07-project-management/phase-status.md - Current priorities
4. SCAN: docs/04-codebase/ - Existing components, services, screens, types
```

**Step 2: Identify Task Type**
- **New Feature**: Review feature specs, check existing patterns, enforce business rules
- **Bug Fix**: Check troubleshooting docs, identify root cause, preserve existing behavior
- **Vague Request**: Use interpretation framework below to clarify and propose solution
- **General Question**: Provide context-aware answer with documentation references

**Step 3: Self-Test Questions**
- [ ] Have I read the required documentation for THIS conversation?
- [ ] Do I understand which business rules apply?
- [ ] Do I know what components/services already exist?
- [ ] Am I using only open source/public documentation references?
- [ ] Is my proposed solution production-grade and complete?

**Penalty for Skipping**: Hours of rework, duplicate features, broken business rules

---

## 🧠 Vague Input Interpretation Framework

### Philosophy: Transform Ambiguity into Actionable Specifications

When users provide vague, incomplete, or ambiguous requests, follow this systematic approach to clarify intent and deliver production-grade solutions.

### The 5-Question Clarification Method

**1. Who is this for?**
- Identify affected user roles: property_owner, cleaner, or co_host
- If unclear, ask: "Which user role needs this feature?"
- Consider multi-role scenarios (e.g., owner creates, cleaner consumes)

**2. What problem does this solve?**
- Extract the core business need
- If unclear, ask: "What specific problem are you trying to solve?"
- Frame as user story: "As a [role], I want to [action], so that [benefit]"

**3. Where does this fit?**
- Determine UI placement: dashboard, dedicated screen, modal, or component
- Consider user workflows and navigation patterns
- If unclear, suggest: "This could work as [option 1] or [option 2]. Which fits better?"

**4. What are the edge cases?**
- Consider: no data, network failure, permission denied, invalid input
- Think: "What happens when..."
  - User has no properties?
  - API call fails?
  - They're offline?
  - They lack permissions?

**5. Which business rules apply?**
- Map request to the 5 Critical Business Rules (see below)
- Identify permission requirements (read/write/delete)
- Check for rule interactions (e.g., scheduling requires window validation)

### Vague Input Response Template

When receiving ambiguous requests, respond with:

```
I understand you want [interpretation of request]. 

Before I implement this, let me clarify a few things:

1. **User Role**: Is this for [role A], [role B], or both?
2. **Primary Goal**: Are you trying to [goal interpretation]?
3. **UI Placement**: Should this be [placement suggestion]?
4. **Business Rules**: This will need to enforce [rules 1, 2, 3]. Is that correct?

Based on your answers, I'll create a complete, production-ready implementation.

Alternatively, if you prefer, I can proceed with this interpretation:
[Provide most likely interpretation with reasoning]
```

### Confidence Levels for Vague Requests

**High Confidence (80%+)**: Proceed with implementation, note assumptions
- Clear role indication (mentions "cleaner", "owner", etc.)
- Similar feature exists as reference
- Straightforward business logic

**Medium Confidence (50-80%)**: Clarify 1-2 key points before implementation
- Role unclear but context helps
- Multiple valid interpretations
- Business rule implications uncertain

**Low Confidence (<50%)**: Request clarification on all 5 questions
- No role mentioned
- Multiple conflicting interpretations
- No similar features exist
- Complex business rule implications

### Examples of Vague Input Handling

**Vague Request**: "Add a list"
**Interpretation Process**:
1. Who? → Unclear (ask or infer from context)
2. What problem? → Need to display data (but what data?)
3. Where? → Probably a screen (but which one?)
4. Edge cases? → Unknown without data type
5. Rules? → Cannot determine

**Response**: 
"I'd be happy to add a list. Could you clarify:
1. What should the list show? (properties, cleanings, team members, etc.)
2. Who will see this list? (owners, cleaners, co-hosts, or all)
3. Where should it appear? (dashboard, dedicated screen, or modal)

Based on your answer, I'll create a complete implementation with loading states, error handling, and proper permissions."

---

**Vague Request**: "Improve the dashboard"
**Interpretation Process**:
1. Who? → Context suggests owner (most common dashboard user)
2. What problem? → Unclear (performance? UI? missing data?)
3. Where? → Dashboard (specified)
4. Edge cases? → Unknown without specific improvement
5. Rules? → Dashboard-specific rules apply

**Response**:
"I can improve the dashboard. To provide the most valuable enhancement, could you specify which aspect:
1. **Performance**: Make it load faster?
2. **Data**: Add more statistics or information?
3. **UI/UX**: Improve layout or visual design?
4. **Functionality**: Add new features or actions?

Alternatively, I can analyze the current dashboard and suggest the top 3 improvements based on user flow optimization and business value."

---

## ✨ Production-Grade Code Standards

### Definition: Production-Grade Code

Code is production-grade when it:
1. **Handles ALL states**: loading, error, empty, success
2. **Prevents failures gracefully**: try/catch, user-friendly errors
3. **Follows established patterns**: matches existing codebase style
4. **Uses proper types**: no 'any', complete interfaces
5. **Includes security**: role-based access, input validation
6. **Is maintainable**: clear naming, appropriate comments
7. **Performs well**: efficient queries, proper caching
8. **Is testable**: pure functions, separated concerns

### The Production-Grade Checklist

**Before Providing ANY Code Implementation:**

#### 1. Type Safety ✓
- [ ] All TypeScript interfaces defined in `/types/index.ts`
- [ ] No 'any' types used
- [ ] All function parameters typed
- [ ] All function returns typed
- [ ] Props interfaces defined for components

#### 2. Error Handling ✓
- [ ] All async operations wrapped in try/catch
- [ ] User-friendly error messages (no technical jargon)
- [ ] Error states displayed in UI
- [ ] Fallback behavior defined for failures
- [ ] Console logging for debugging (removed before commit)

#### 3. Loading States ✓
- [ ] Loading indicators for operations >500ms
- [ ] Skeleton screens or spinners visible
- [ ] Loading state prevents duplicate actions
- [ ] Clear indication of what's loading

#### 4. Empty States ✓
- [ ] Message when no data exists
- [ ] Helpful guidance on what to do next
- [ ] Visually distinct from error state
- [ ] Call-to-action button if applicable

#### 5. Business Rules ✓
- [ ] All applicable business rules enforced (see section below)
- [ ] Validation runs before database operations
- [ ] User feedback for rule violations
- [ ] Rules documented in code comments if complex

#### 6. Security & Permissions ✓
- [ ] Role-based access control implemented
- [ ] UI elements hidden for unauthorized roles (RoleBasedWrapper)
- [ ] API calls validate permissions
- [ ] Sensitive data never exposed to wrong roles
- [ ] Input sanitization for user-provided data

#### 7. Performance ✓
- [ ] FlatList used for lists >10 items (not ScrollView)
- [ ] Pagination implemented for large datasets (50+ records)
- [ ] Images optimized (compressed, proper sizing)
- [ ] Expensive operations memoized (React.memo, useMemo)
- [ ] Database queries optimized (proper indexes, limited fields)

#### 8. Mobile Responsiveness ✓
- [ ] Layout adapts to screen sizes
- [ ] Touch targets minimum 44pt
- [ ] Text readable without zooming
- [ ] Works in portrait and landscape
- [ ] Tested on both iOS and Android patterns

#### 9. Accessibility ✓
- [ ] Sufficient color contrast
- [ ] Screen reader support (accessibility labels)
- [ ] Keyboard navigation possible
- [ ] Error messages announced
- [ ] Focus management proper

#### 10. Code Quality ✓
- [ ] Follows existing naming conventions
- [ ] Uses existing design system (colors, spacing, shadows)
- [ ] DRY principle applied (no duplicate logic)
- [ ] Functions single responsibility
- [ ] Comments explain "why", not "what"
- [ ] No TODO comments in submitted code
- [ ] No console.log statements in submitted code

### Production vs. Prototype Code

**❌ Prototype Code (Never Provide)**
```typescript
// BAD: No types, no error handling, hardcoded values
function getData() {
  const data = fetch('/api/properties');
  return data;
}

// Component: No loading, no error, assumes data exists
function PropertyList({ properties }) {
  return properties.map(p => <div>{p.name}</div>);
}
```

**✅ Production-Grade Code (Always Provide)**
```typescript
// GOOD: Complete types, error handling, flexible
async function getProperties(userId: string): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('[PropertyService.getProperties]', error);
    Alert.alert('Error', 'Could not load properties. Please check your connection.');
    throw error;
  }
}

// Component: All states handled, proper types, accessible
interface PropertyListProps {
  properties: Property[];
  onPropertyPress: (id: string) => void;
  loading?: boolean;
}

export default function PropertyList({ properties, onPropertyPress, loading = false }: PropertyListProps) {
  if (loading) {
    return <LoadingSpinner message="Loading properties..." />;
  }
  
  if (properties.length === 0) {
    return (
      <EmptyState 
        message="No properties yet"
        actionLabel="Add Property"
        onAction={() => router.push('/properties/new')}
      />
    );
  }
  
  return (
    <FlatList
      data={properties}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PropertyCard 
          property={item} 
          onPress={() => onPropertyPress(item.id)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}
```

### Code Completeness Requirements

**Every implementation must include:**

1. **Types** (if new data structures)
   - Interface in `/types/index.ts`
   - Proper TypeScript throughout

2. **Service Layer** (if database operations)
   - Methods in appropriate service file
   - Error handling
   - Proper Supabase queries

3. **Component** (if UI changes)
   - Complete component file
   - All necessary imports
   - Proper props interface
   - All states handled

4. **Navigation** (if new screens)
   - File in `/app/` directory
   - Update `_layout.tsx` if needed
   - Proper route configuration

5. **Styles**
   - Use existing design system
   - React Native StyleSheet
   - Mobile responsive

6. **Testing Steps**
   - Clear instructions to verify
   - Expected results
   - Edge cases to test

---

## 📖 Copyright-Safe Documentation References

### Philosophy: Only Use Open Source, Public, or Original Documentation

To ensure all generated code is free from copyright concerns, ONLY reference documentation that is:
1. **Open source** (MIT, Apache, BSD licenses)
2. **Publicly available official documentation**
3. **Original to this project**

### Approved Documentation Sources

#### **Primary References (Use First)**

**React Native**
- Official Docs: https://reactnative.dev/docs/getting-started
- License: MIT (open source)
- Use for: Component APIs, native modules, platform-specific code

**Expo**
- Official Docs: https://docs.expo.dev/
- License: MIT (open source)
- Use for: Expo SDK, router, build configuration

**TypeScript**
- Official Docs: https://www.typescriptlang.org/docs/
- License: Apache 2.0 (open source)
- Use for: Type definitions, advanced typing patterns

**Supabase**
- Official Docs: https://supabase.com/docs
- License: Apache 2.0 (open source)
- Use for: Database queries, auth, realtime, storage

**MDN Web Docs**
- Official Docs: https://developer.mozilla.org/
- License: CC-BY-SA (open source)
- Use for: JavaScript fundamentals, Web APIs

#### **Secondary References (Use When Needed)**

**React**
- Official Docs: https://react.dev/
- License: MIT (open source)
- Use for: Hooks, patterns, component lifecycle

**npm Packages**
- Check individual package licenses
- Only reference packages with MIT, Apache, or BSD licenses
- Use for: Third-party integrations

#### **Project-Specific Documentation (Always Safe)**

All documentation in this repository:
- `/docs/**/*.md` - All project documentation
- `.cursorrules` - Cursor rules
- `.cursor/**/*.md` - Cursor-specific guides
- `.github/instructions/**/*.md` - GitHub Copilot instructions
- `README.md`, `CHANGELOG.md`, etc.

### Forbidden Documentation Sources

**❌ NEVER Reference:**
1. Proprietary documentation (behind paywalls)
2. Closed-source codebases (without explicit permission)
3. Copyrighted tutorials or courses
4. Stack Overflow answers (copyright ambiguity)
5. Blog posts (unless explicitly CC-licensed)
6. YouTube videos (unless explicitly CC-licensed)
7. Books or paid content

### How to Cite Documentation

When providing implementation guidance, cite sources:

**Good**:
```
According to the React Native documentation (https://reactnative.dev/docs/flatlist),
FlatList should be used for large lists because it only renders visible items.
```

**Good**:
```
Per Supabase docs (https://supabase.com/docs/guides/auth/row-level-security),
Row Level Security (RLS) should be enabled for all tables handling user data.
```

**Bad**:
```
I saw in a tutorial that you should use FlatList for performance.
```

**Bad**:
```
A Stack Overflow answer suggested this approach...
```

### Original Pattern Development

When no existing documentation covers the use case:
1. **Synthesize from fundamentals** using approved sources
2. **Create original patterns** based on project context
3. **Document new patterns** in `/docs/reference/API_PATTERNS.md`
4. **Cite base principles** from approved docs

**Example**:
```
"Based on React Native's FlatList API and Supabase's realtime subscription pattern,
I've created an original pattern for real-time list updates that combines both..."
```

---

## 🏢 Business Context & Rules

### Application Purpose

**Airbnb Property Cleaning Management Platform**

Connects property owners with cleaning teams for scheduling, communication, quality control, and workflow management between guest stays.

### User Roles & Capabilities

#### **property_owner** (Primary Revenue Generator)
**Can:**
- Manage multiple Airbnb properties
- Schedule cleanings between guest stays
- View cleaning reports and photos
- Handle billing and payments
- Set property-specific cleaning requirements
- Receive notifications about issues

**Cannot:**
- Perform cleanings (not a cleaner)
- See other owners' properties

#### **cleaner** (Service Provider)
**Can:**
- Receive cleaning assignments
- Update cleaning progress in real-time
- Report maintenance issues
- Access property details (codes, WiFi, instructions)
- Submit completion photos and notes

**Cannot:**
- See financial information (rates, invoices, payments)
- Manage properties they don't clean
- View other cleaners' assignments

#### **co_host** (Limited Management)
**Can:**
- View properties (read-only for most)
- Help coordinate schedules
- View reports

**Cannot:**
- Modify billing information
- Add/remove team members
- Delete properties

### The 5 Critical Business Rules (ALWAYS Enforce)

#### **Rule 1: Cleaning Window (11 AM - 3 PM)**

**Why**: Airbnb checkout at 11 AM, checkin at 3 PM = exactly 4 hours for turnover

**Implementation**:
```typescript
function isWithinCleaningWindow(scheduledTime: Date): boolean {
  const hour = scheduledTime.getHours();
  return hour >= 11 && hour < 15; // 11 AM to 3 PM
}

// MUST validate before creating/updating sessions
if (!isWithinCleaningWindow(scheduledTime)) {
  throw new Error('Cleanings must be scheduled between 11 AM and 3 PM');
}
```

**Enforcement Points**:
- Schedule creation (block invalid times)
- Schedule updates (validate time changes)
- Dashboard warnings (show if outside window)

---

#### **Rule 2: 24-Hour Cancellation Notice**

**Why**: Cleaners plan schedules around assigned jobs. Last-minute cancellations waste time and income.

**Implementation**:
```typescript
function calculateCancellationNotice(scheduledTime: string): number {
  const scheduled = new Date(scheduledTime);
  const now = new Date();
  const diffMs = scheduled.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
}

function isShortNotice(hours: number): boolean {
  return hours < 24;
}

function canCancelSession(hours: number): boolean {
  return hours >= 1; // Must be at least 1 hour before
}
```

**UI Behavior**:
- \> 24 hours: Green "Cancel" button
- < 24 hours: Red "SHORT NOTICE" warning, requires confirmation
- < 1 hour: Cancel button disabled

---

#### **Rule 3: Financial Privacy for Cleaners**

**Why**: Professional boundaries maintain trust. Cleaners focus on quality, not rate shopping.

**Cleaners NEVER See**:
- Hourly rates or per-job pricing
- Property owner revenue
- Invoice totals or payment amounts
- Other cleaners' compensation

**Implementation**:
```typescript
// UI level
<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <InvoiceComponent />
</RoleBasedWrapper>

// Service level
async getPropertyDetails(propertyId: string, userRole: string) {
  const fields = userRole === 'cleaner'
    ? 'id, name, address, access_code, special_instructions'
    : '*';
  return supabase.from('properties').select(fields).eq('id', propertyId);
}
```

**Enforcement Points**:
- Component visibility (RoleBasedWrapper)
- Service query filtering
- Database RLS policies
- Navigation restrictions

---

#### **Rule 4: Photo Proof Requirement**

**Why**: Visual evidence eliminates quality disputes, protects cleaners, gives owners confidence.

**Minimum Requirements**:
- **Standard**: 3 photos (kitchen, bathroom, living area)
- **Deep Clean**: 5 photos (+ bedrooms + outdoor)
- **Property-Specific**: Additional for pool, hot tub, etc.

**Implementation**:
```typescript
function canCompleteSession(photos: Photo[], requirements: PhotoRequirement[]): boolean {
  const requiredAreas = requirements.filter(r => r.required).map(r => r.area);
  const providedAreas = photos.map(p => p.area);
  return requiredAreas.every(area => providedAreas.includes(area));
}
```

**Enforcement Points**:
- PhotoProofGate component (blocks completion)
- Service validation (completeCleaning method)
- UI feedback (progress indicator: "2/3 photos")

---

#### **Rule 5: Linen Auto-Calculation**

**Why**: Removes guesswork. Cleaners know exactly what to bring before arriving.

**Formula**:
```typescript
function calculateLinenRequirements(
  guestCount: number, 
  propertyType: string
): LinenRequirements {
  return {
    bath_towels: guestCount * 1,
    hand_towels: guestCount * 1,
    pillow_cases: guestCount * 2,
    washcloths: guestCount * 2,
    kitchen_towels: 2,
    bath_mats: 1,
    pool_towels: propertyHas('pool') ? guestCount : 0,
    extra_bath_mats: (propertyType === 'villa' && guestCount > 4) ? 1 : 0
  };
}
```

**Display**: Show on property cards, session details, cleaner job view

---

### Rule Interaction Matrix

**Scheduling Flow**:
1. Validate 11 AM - 3 PM window (Rule 1) ✓
2. Calculate linens for guest count (Rule 5) ✓
3. Assign cleaner → Send notification

**Cancellation Flow**:
1. Calculate notice hours (Rule 2) ✓
2. Show warning if < 24 hours
3. Block if < 1 hour

**Completion Flow**:
1. Validate photos uploaded (Rule 4) ✓
2. Allow completion if photos complete
3. Hide invoice from cleaner (Rule 3) ✓
4. Notify owner with photos

---

## 🏗️ Technical Architecture

### Tech Stack (Established - Do Not Change)

- **Frontend**: React Native + Expo SDK 54 (iOS, Android, Web)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Language**: TypeScript strict mode (NO 'any' types ever)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet only (no external CSS)
- **Icons**: @expo/vector-icons (Ionicons only)
- **State**: React Context for auth, useState for UI

### Project Structure

```
/app/                    # Expo Router screens (13 screens)
  /auth/                # Authentication (login, register, forgot-password)
  /_layout.tsx         # Root layout with AuthProvider
  /index.tsx           # Dashboard (role-specific)
  /properties.tsx      # Property management
  /schedule.tsx        # Cleaning schedules
  /team.tsx            # Team management
  /invoices.tsx        # Financial (owner/co_host only)
  /maintenance.tsx     # Maintenance tickets
  /reports.tsx         # Performance reports
  /profile.tsx         # User profile
  /onboarding.tsx      # First-time setup

/components/            # Reusable UI (18 components)
  /CleanerPropertyCard.tsx
  /OwnerPropertyCard.tsx
  /RoleBasedWrapper.tsx
  /QuickActions.tsx
  [... 14 more]

/services/             # Business logic (8 services)
  /cleaningSessionService.ts
  /propertyService.ts
  /notificationService.ts
  [... 5 more]

/types/                # TypeScript definitions
  /index.ts           # All type definitions

/contexts/             # React contexts
  /AuthContext.tsx    # Auth & user state

/lib/                  # Utilities
  /supabase.ts        # Supabase client

/docs/                 # Documentation (80+ files)
  /04-codebase/       # Component/service manifests
  /core/              # Business rules, user roles
  /reference/         # Quick reference, patterns
  /workflows/         # Development processes
```

### Data Architecture

**Core Tables** (Supabase PostgreSQL):
- `properties` - Property details, access info
- `profiles` - User accounts (linked to Supabase auth)
- `team_members` - User-to-property mappings with roles
- `cleaning_sessions` - Individual cleaning appointments
- `cleaning_updates` - Real-time progress updates
- `notifications` - Alert system
- `linen_requirements` - Guest-count-based calculations
- `maintenance_tickets` - Issue tracking

**Data Flow**:
1. **Authentication**: User Login → Supabase Auth → AuthContext → Profile → Role-based Route
2. **Property Management**: Owner creates → Service validation → Supabase → UI update
3. **Cleaning Sessions**: Schedule → Assign → Update → Realtime → Notify → Complete
4. **Real-time**: Component action → Service → Supabase → Subscription → UI broadcast

### Design System (Use Exactly)

**Colors**:
```typescript
const colors = {
  primary: '#007AFF',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  background: '#f9fafb',
  cardBackground: '#ffffff',
  border: '#e5e7eb',
};
```

**Spacing**:
```typescript
const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
};
```

**Border Radius**:
```typescript
const borderRadius = {
  small: 6, medium: 8, large: 12, round: 999
};
```

**Shadows**:
```typescript
const shadows = {
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
};
```

### Naming Conventions

- **Components**: `CleanerPropertyCard.tsx` (PascalCase)
- **Services**: `cleaningSessionService.ts` (camelCase + Service)
- **Screens**: `properties.tsx` (lowercase, matches route)
- **Functions**: `getUserData()` (camelCase)
- **Types**: `CleaningSession` (PascalCase, no 'I' prefix)
- **Constants**: `API_BASE_URL` (SCREAMING_SNAKE_CASE)

---

## 📝 Code Patterns & Templates

### Component Template

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SomeType } from '@/types';
import { someService } from '@/services';

interface ComponentNameProps {
  data: SomeType;
  onAction: (id: string) => void;
  loading?: boolean;
}

export default function ComponentName({ 
  data, 
  onAction, 
  loading = false 
}: ComponentNameProps) {
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      await someService.doSomething(data.id);
      Alert.alert('Success', 'Action completed');
      onAction(data.id);
      
    } catch (error) {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLocalLoading(false);
    }
  };

  if (loading || localLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleAction}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleAction}
      disabled={loading || localLoading}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{data.name}</Text>
        <Ionicons name="chevron-forward" size={20} color="#6b7280" />
      </View>
      <View style={styles.content}>
        {/* Component-specific content */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    // Component-specific styles
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 8,
  },
  retryText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

### Service Template

```typescript
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { SomeType } from '@/types';

export const domainService = {
  /**
   * Get data with proper error handling
   * @param filters - Optional filtering parameters
   * @returns Array of data items
   */
  async getData(filters?: any): Promise<SomeType[]> {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .select(`
          *,
          related_table (name, other_field)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('[DomainService.getData]', error);
      Alert.alert('Error', 'Could not load data. Please check your connection.');
      throw error;
    }
  },

  /**
   * Create with validation and notifications
   * @param itemData - Data to create (without id)
   * @returns Created item
   */
  async createItem(itemData: Omit<SomeType, 'id'>): Promise<SomeType> {
    try {
      // Validate business rules
      if (!itemData.required_field) {
        throw new Error('Required field is missing');
      }

      const { data, error } = await supabase
        .from('table_name')
        .insert({
          ...itemData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;

      // Trigger notifications if needed
      await this.notifyStakeholders(data);
      
      return data;
      
    } catch (error) {
      console.error('[DomainService.createItem]', error);
      Alert.alert('Error', 'Could not create item. Please try again.');
      throw error;
    }
  },

  /**
   * Update with optimistic UI support
   * @param id - Item ID
   * @param updates - Partial updates to apply
   * @returns Updated item
   */
  async updateItem(id: string, updates: Partial<SomeType>): Promise<SomeType> {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('[DomainService.updateItem]', error);
      Alert.alert('Error', 'Could not save changes. Please try again.');
      throw error;
    }
  },

  /**
   * Delete with confirmation
   * @param id - Item ID to delete
   */
  async deleteItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('table_name')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('[DomainService.deleteItem]', error);
      Alert.alert('Error', 'Could not delete item. Please try again.');
      throw error;
    }
  },

  /**
   * Private helper for notifications
   */
  async notifyStakeholders(data: SomeType): Promise<void> {
    // Implementation specific to domain
  }
};
```

### Screen Template

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Text } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { someService } from '@/services';
import { SomeType } from '@/types';
import ComponentName from '@/components/ComponentName';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

export default function FeatureScreen() {
  const { profile } = useAuth();
  const [data, setData] = useState<SomeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await someService.getData();
      setData(result);
    } catch (error) {
      setError('Could not load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAction = (id: string) => {
    // Handle action
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <LoadingSpinner message="Loading..." />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0 && !refreshing) {
    return (
      <EmptyState 
        message="No items yet"
        actionLabel="Add New"
        onAction={() => {/* Handle add */}}
      />
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {data.map((item) => (
        <ComponentName 
          key={item.id}
          data={item}
          onAction={handleAction}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
});
```

---

## ✅ Quality Assurance Checklist

### Before Marking ANY Task Complete

**Code Quality**:
- [ ] TypeScript compiles with zero errors (`npm run type-check`)
- [ ] No 'any' types used
- [ ] All functions have proper types
- [ ] Follows existing naming conventions
- [ ] Uses design system (colors, spacing, shadows)

**Error Handling**:
- [ ] All async operations in try/catch
- [ ] User-friendly error messages
- [ ] Error states displayed in UI
- [ ] Console errors logged for debugging

**States Handled**:
- [ ] Loading state (spinner/skeleton)
- [ ] Error state (message + retry)
- [ ] Empty state (helpful message + CTA)
- [ ] Success state (proper data display)

**Business Rules**:
- [ ] All applicable rules enforced
- [ ] Validation before database operations
- [ ] User feedback for violations

**Security**:
- [ ] Role-based access control
- [ ] UI hidden for unauthorized roles
- [ ] API validates permissions
- [ ] No sensitive data exposure

**Performance**:
- [ ] FlatList for lists >10 items
- [ ] Pagination for datasets >50 records
- [ ] Images optimized
- [ ] No unnecessary re-renders

**Mobile**:
- [ ] Responsive layout
- [ ] Touch targets ≥44pt
- [ ] Works portrait and landscape
- [ ] Tested on iOS and Android patterns

**Completeness**:
- [ ] No TODO comments
- [ ] No console.log statements
- [ ] All imports present
- [ ] Documentation updated if needed

---

## 🎓 Examples: Vague → Production

### Example 1: "Add a button"

**Vague Request**: "Add a button"

**Interpretation Process**:
- Who? → Unknown
- What problem? → Unknown
- Where? → Unknown
- Edge cases? → Unknown
- Rules? → Unknown

**Clarification Response**:
"I can add a button. To provide the right implementation, I need to know:
1. **What should the button do?** (e.g., save data, navigate, trigger action)
2. **Who will see it?** (owner, cleaner, co_host, or all)
3. **Where should it appear?** (which screen or component)
4. **What happens when clicked?** (expected behavior)

Once you clarify, I'll create a complete button with proper loading states, error handling, and any necessary business rule enforcement."

---

### Example 2: "Make it better"

**Vague Request**: "Make the property list better"

**Interpretation Process**:
- Who? → Context suggests owners (most common)
- What problem? → Could be UX, performance, or functionality
- Where? → Property list (specified)
- Edge cases? → Unknown
- Rules? → Property-related rules apply

**Proactive Response**:
"I can enhance the property list. Here are the top 3 improvements I recommend based on best practices:

1. **Performance**: Add pagination for faster loading when you have many properties
2. **UX**: Add search/filter to find properties quickly
3. **Visual**: Improve card design with property status indicators

Which would provide the most value? Or if you have a different improvement in mind, let me know what's not working well currently."

---

### Example 3: "Fix the bug"

**Vague Request**: "Fix the bug with cleanings"

**Interpretation Process**:
- Who? → Unknown (affects which features to check)
- What problem? → Bug exists but symptoms unclear
- Where? → Cleanings (narrowed down)
- Edge cases? → Cannot determine without bug details
- Rules? → Likely Rules 1, 2, or 4 (cleaning-related)

**Clarification Response**:
"I can help fix the bug with cleanings. To diagnose and resolve it efficiently, please provide:
1. **What's happening?** (error message, unexpected behavior, crash, etc.)
2. **When does it happen?** (during creation, update, completion, etc.)
3. **Who experiences it?** (owners, cleaners, or both)
4. **Steps to reproduce**: Can you consistently trigger it?

Alternatively, if you can share the error message or describe the unexpected behavior, I can investigate and propose a fix."

---

### Example 4: Complete Transformation

**Vague Request**: "Cleaners need to see stuff"

**Interpretation Process**:
- Who? → Cleaners (clearly specified) ✓
- What problem? → Missing information (but what information?)
- Where? → Likely dashboard or property view
- Edge cases? → Need to know what "stuff" is
- Rules? → Must respect Rule 3 (no financial data)

**Proactive Implementation**:
"Based on your request for cleaners to see more information, I'll implement a comprehensive cleaner dashboard that shows:

**What Cleaners Will See:**
1. **Today's Assignments** (time, location, guest count)
2. **Property Details** (access codes, WiFi, special instructions)
3. **Linen Requirements** (auto-calculated from guest count - Rule 5)
4. **Maintenance Reports** (any issues at property)
5. **Performance Stats** (jobs completed, average time)

**What Cleaners Won't See** (Rule 3 - Financial Privacy):
- ❌ Rates or pricing
- ❌ Invoices or payments
- ❌ Owner revenue

**Implementation includes:**
- Loading states while fetching data
- Error handling if network fails
- Empty state if no assignments
- Real-time updates when new assignments added
- Mobile-responsive design
- Role-based access control

Does this align with what you need? If you want different information displayed, let me know!"

---

## 🎯 Success Metrics

### The Roadmap is Successful When:

1. **Vague requests become clear specifications** in 1-2 exchanges
2. **Production-grade code generated** on first attempt (no major revisions)
3. **All business rules enforced** automatically without reminder
4. **Copyright concerns eliminated** through proper documentation sourcing
5. **Consistency maintained** across all generated code
6. **Non-technical users empowered** to build complex features
7. **Technical debt minimized** through proper patterns from start

---

## 📚 Additional Resources

**Project Documentation**:
- Entry Point: `docs/AI-README.md`
- Business Rules: `docs/core/BUSINESS_RULES.md`
- User Roles: `docs/core/USER_ROLES.md`
- Components: `docs/04-codebase/COMPONENTS.md`
- Services: `docs/04-codebase/SERVICES.md`
- Patterns: `docs/reference/API_PATTERNS.md`
- Troubleshooting: `docs/reference/TROUBLESHOOTING.md`

**External References** (Copyright-Safe):
- React Native: https://reactnative.dev/docs
- Expo: https://docs.expo.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- Supabase: https://supabase.com/docs
- MDN: https://developer.mozilla.org/

---

**Last Updated**: October 17, 2025  
**Maintained By**: AI Development System  
**Version**: 2.0

---

## 🚨 Final Reminder

**Before responding to ANY request:**
1. Read this roadmap (you're here ✓)
2. Identify task type (new feature, bug, vague, question)
3. Apply appropriate framework (clarification, production standards, business rules)
4. Use only copyright-safe documentation
5. Generate production-grade, complete code
6. Verify against quality checklist

**Time to read**: 10-15 minutes  
**Time saved from rework**: Hours to days  
**Quality improvement**: 10x

---

*This roadmap represents the single source of truth for AI-assisted development on this project. All other documentation supports and extends these core principles.*
