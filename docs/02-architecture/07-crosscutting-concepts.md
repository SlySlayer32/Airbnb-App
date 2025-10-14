# Crosscutting Concepts

> Design patterns and architectural decisions that affect multiple components

## Overview

This document describes crosscutting concerns that span multiple components and layers of the application, including error handling, state management, security, and design patterns.

## 1. Error Handling Strategy

### Principles

**1. User-Friendly Messages**
- Never show technical errors to users
- Provide actionable guidance
- Use clear, simple language

**2. Service Layer Responsibility**
- Services show error alerts
- Components handle loading states
- Centralized error messages

**3. Logging Strategy**
- Console logging for development
- Error tracking service for production (planned)
- Structured logging with context

### Implementation

**Service Layer Pattern**:
```typescript
// In service
async createItem(data: ItemData): Promise<Item> {
  try {
    // Validate business rules
    this.validateItemData(data);

    // Database operation
    const { data: item, error } = await supabase
      .from('items')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return item;

  } catch (error) {
    // Log technical details
    console.error('[ServiceName.createItem]', error);

    // Show user-friendly message
    Alert.alert(
      'Error',
      'Could not create item. Please check your connection and try again.'
    );

    // Re-throw for component handling
    throw error;
  }
}
```

**Component Layer Pattern**:
```typescript
// In component
const handleCreate = async () => {
  try {
    setLoading(true);
    setError(null);

    const item = await itemService.createItem(formData);

    // Success feedback
    Alert.alert('Success', 'Item created successfully');

    // Update UI
    onItemCreated(item);

  } catch (error) {
    // Error already shown by service
    // Just handle local state
    setError('Failed to create item');
  } finally {
    setLoading(false);
  }
};
```

### Error Types

**Network Errors**:
```typescript
if (error.message.includes('network') || error.message.includes('fetch')) {
  return 'Please check your internet connection';
}
```

**Validation Errors**:
```typescript
if (error.message.includes('validation')) {
  return 'Please check your input and try again';
}
```

**Permission Errors**:
```typescript
if (error.message.includes('permission') || error.message.includes('unauthorized')) {
  return 'You do not have permission to perform this action';
}
```

**Generic Errors**:
```typescript
return 'Something went wrong. Please try again.';
```

---

## 2. State Management Strategy

### Three-Tier Approach

**1. Global State (AuthContext)**
- User authentication
- User profile
- Session management
- Demo mode flag

**When to Use**:
- Data needed across multiple screens
- Authentication state
- User profile information

**Implementation**:
```typescript
// contexts/AuthContext.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // ... auth logic

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Usage in component
const { user, profile } = useAuth();
```

**2. Local State (useState)**
- Component UI state
- Form inputs
- Loading indicators
- Error messages

**When to Use**:
- Data specific to one component
- Temporary UI state
- Form inputs

**Implementation**:
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useState({ name: '', email: '' });

// Update state
setLoading(true);
setFormData({ ...formData, name: 'New Name' });
```

**3. Real-time State (Supabase Subscriptions)**
- Multi-user data
- Live updates
- Session status
- Notifications

**When to Use**:
- Data that changes in real-time
- Multi-user collaboration
- Live status updates

**Implementation**:
```typescript
useEffect(() => {
  const subscription = realtimeService.subscribe(
    'cleaning_sessions',
    (payload) => {
      if (payload.eventType === 'UPDATE') {
        setSessions(prev => prev.map(s =>
          s.id === payload.new.id ? payload.new : s
        ));
      }
    }
  );

  return () => realtimeService.unsubscribe(subscription);
}, []);
```

### State Management Anti-Patterns

**❌ Don't**: Use global state for everything
```typescript
// Bad: Unnecessary global state
const [selectedItem, setSelectedItem] = useState(null); // Only used in one component
```

**✅ Do**: Use local state when appropriate
```typescript
// Good: Local state for component-specific data
const [selectedItem, setSelectedItem] = useState(null);
```

**❌ Don't**: Store derived state
```typescript
// Bad: Storing computed value
const [fullName, setFullName] = useState('');
// Derived from firstName + lastName
```

**✅ Do**: Compute on render
```typescript
// Good: Compute on render
const fullName = `${firstName} ${lastName}`;
```

---

## 3. Security Architecture

### Defense in Depth

**Layer 1: Component Level**
- Hide sensitive UI elements from unauthorized roles
- Use `RoleBasedWrapper` component

**Implementation**:
```typescript
<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <InvoiceCard />
</RoleBasedWrapper>
```

**Layer 2: Service Level**
- Filter data by role
- Validate permissions before operations
- Sanitize inputs

**Implementation**:
```typescript
async getPropertyDetails(propertyId: string, userRole: string) {
  // Filter fields based on role
  const fields = userRole === 'cleaner'
    ? 'id, name, address, access_code, special_instructions' // No financial fields
    : '*'; // Everything for owners

  return supabase.from('properties').select(fields).eq('id', propertyId);
}
```

**Layer 3: Database Level**
- Row Level Security (RLS) policies
- Role-based access control
- Encrypted connections

**Implementation**:
```sql
-- Example RLS policy
CREATE POLICY "Cleaners cannot see invoices"
ON invoices
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'property_owner'
  )
);
```

### Financial Privacy

**Critical Rule**: Cleaners NEVER see financial data

**What Cleaners Cannot See**:
- Hourly rates
- Per-job pricing
- Property owner revenue
- Invoice totals
- Payment amounts

**What Cleaners CAN See**:
- Job assignments
- Property details
- Work history
- Performance feedback

**Enforcement**:
```typescript
// Component level
<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <InvoiceCard />
</RoleBasedWrapper>

// Service level
if (userRole === 'cleaner') {
  throw new Error('Insufficient permissions');
}

// Database level
CREATE POLICY "Hide financial data from cleaners"
ON properties
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE role != 'cleaner'
  )
);
```

---

## 4. Design System

### Color Palette

**Primary Colors**:
```typescript
const colors = {
  primary: '#007AFF',      // iOS Blue
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Orange
  error: '#ef4444',        // Red
  info: '#3b82f6',         // Blue
};
```

**Text Colors**:
```typescript
const textColors = {
  primary: '#1f2937',      // Dark gray
  secondary: '#6b7280',    // Medium gray
  tertiary: '#9ca3af',     // Light gray
  inverse: '#ffffff',      // White
};
```

**Background Colors**:
```typescript
const backgrounds = {
  primary: '#ffffff',      // White
  secondary: '#f9fafb',    // Light gray
  tertiary: '#f3f4f6',     // Medium gray
  overlay: 'rgba(0,0,0,0.5)', // Dark overlay
};
```

**Border Colors**:
```typescript
const borders = {
  light: '#e5e7eb',        // Light gray
  medium: '#d1d5db',       // Medium gray
  dark: '#9ca3af',         // Dark gray
};
```

### Spacing Scale

```typescript
const spacing = {
  xs: 4,      // 4px
  sm: 8,      // 8px
  md: 12,     // 12px
  lg: 16,     // 16px
  xl: 24,     // 24px
  xxl: 32,    // 32px
  xxxl: 48,   // 48px
};
```

### Border Radius

```typescript
const borderRadius = {
  small: 6,      // 6px
  medium: 8,     // 8px
  large: 12,     // 12px
  xlarge: 16,    // 16px
  round: 999,    // Fully rounded
};
```

### Typography

```typescript
const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
};
```

### Shadows

**Small Shadow** (Subtle elevation):
```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.05,
shadowRadius: 2,
elevation: 1, // Android
```

**Medium Shadow** (Card elevation):
```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3, // Android
```

**Large Shadow** (Modal elevation):
```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 8,
elevation: 5, // Android
```

---

## 5. Platform Differences

### iOS vs Android vs Web

**Safe Area Handling**:
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={styles.container}>
  {/* Content respects notch and status bar */}
</SafeAreaView>
```

**Platform-Specific Styles**:
```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 20 : 16,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
});
```

**Keyboard Behavior**:
```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={styles.container}
>
  <TextInput />
</KeyboardAvoidingView>
```

**Storage**:
```typescript
// iOS/Android: AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Web: localStorage
const storage = Platform.OS === 'web' ? window.localStorage : AsyncStorage;
```

---

## 6. Performance Optimization

### List Rendering

**Use FlatList for Long Lists**:
```typescript
// ❌ Bad: ScrollView with map
<ScrollView>
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</ScrollView>

// ✅ Good: FlatList with virtualization
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

### Debouncing

**Debounce Search Inputs**:
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

### Image Optimization

**Lazy Loading**:
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: photoUrl }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
/>
```

---

## 7. Testing Strategy

### Manual Testing (Current)

**Testing Checklist**:
- [ ] Test as property_owner
- [ ] Test as cleaner
- [ ] Test as co_host
- [ ] Test in demo mode
- [ ] Test with real Supabase
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Test on web
- [ ] Test edge cases (empty states, errors)

### Automated Testing (Planned)

**Unit Tests**:
```typescript
// Example test
describe('cleaningSessionService', () => {
  it('should validate cleaning window', () => {
    const validTime = new Date('2025-01-15T12:00:00Z');
    expect(isWithinCleaningWindow(validTime)).toBe(true);

    const invalidTime = new Date('2025-01-15T16:00:00Z');
    expect(isWithinCleaningWindow(invalidTime)).toBe(false);
  });
});
```

**Integration Tests**:
```typescript
// Example test
describe('Session Lifecycle', () => {
  it('should complete session with photos', async () => {
    const session = await createSession(testData);
    await uploadPhotos(session.id, 3);
    const completed = await completeSession(session.id);
    expect(completed.status).toBe('completed');
  });
});
```

---

## 8. Code Quality Standards

### TypeScript Strictness

**No 'any' Types**:
```typescript
// ❌ Bad
function processData(data: any) {
  return data.something;
}

// ✅ Good
function processData(data: CleaningSession) {
  return data.status;
}
```

**Explicit Return Types**:
```typescript
// ❌ Bad
async function getSession(id: string) {
  return await supabase.from('sessions').select().eq('id', id);
}

// ✅ Good
async function getSession(id: string): Promise<CleaningSession | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
```

### Code Organization

**File Naming**:
- Components: `CleanerDashboard.tsx` (PascalCase)
- Services: `cleaningSessionService.ts` (camelCase + Service)
- Screens: `properties.tsx` (lowercase)
- Types: All in `types/index.ts`

**Import Order**:
```typescript
// 1. React & React Native
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// 2. Third-party libraries
import { Ionicons } from '@expo/vector-icons';

// 3. Internal imports (@ alias)
import { CleaningSession } from '@/types';
import { cleaningSessionService } from '@/services';
import ComponentName from '@/components/ComponentName';

// 4. Relative imports (avoid if possible)
import { localHelper } from './helpers';
```

---

**Last Updated**: January 2025
**Maintenance**: Update as new patterns emerge

