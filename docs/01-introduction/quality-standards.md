# Code Quality Standards

## TypeScript Requirements

### NO 'any' Types Ever
```typescript
// ❌ Never
function doSomething(data: any) { }

// ✅ Always
function doSomething(data: CleaningSession) { }

// ✅ If truly unknown
function doSomething(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // Type guard to narrow
  }
}
```

### All Functions Fully Typed
```typescript
// ❌ Missing return type
async function getSession(id: string) {
  return await supabase.from('sessions').select().eq('id', id);
}

// ✅ Explicit return type
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

## Every Async Operation Must Have

### 1. Loading State
```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  try {
    setLoading(true);
    await service.doSomething();
  } finally {
    setLoading(false);
  }
};

// Show spinner during operation
{loading && <ActivityIndicator />}
```

### 2. Error State
```typescript
const [error, setError] = useState<string | null>(null);

try {
  await service.doSomething();
} catch (err) {
  console.error('[ComponentName.handleAction]', err);
  setError('Could not complete action. Please try again.');
}

// Show error message
{error && <Text style={styles.error}>{error}</Text>}
```

### 3. Empty State
```typescript
const [data, setData] = useState<Type[]>([]);

// Show message when no data
{data.length === 0 && (
  <Text style={styles.empty}>
    No items found. Add your first item to get started.
  </Text>
)}
```

### 4. Success Feedback
```typescript
const handleAction = async () => {
  try {
    await service.doSomething();
    Alert.alert('Success', 'Action completed successfully');
    onUpdate?.();
  } catch (error) {
    // Error already shown by service
  }
};
```

## Service Layer Pattern

### NEVER Call Supabase Directly from Components
```typescript
// ❌ Bad - Component calling Supabase directly
function Component() {
  const { data } = await supabase.from('sessions').select();
}

// ✅ Good - Component calls service
function Component() {
  const data = await cleaningSessionService.getSessions();
}
```

### Services Handle Errors and Show Alerts
```typescript
// In service
export const cleaningSessionService = {
  async getSessions(): Promise<CleaningSession[]> {
    try {
      const { data, error } = await supabase
        .from('cleaning_sessions')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[cleaningSessionService.getSessions]', error);
      Alert.alert('Error', 'Could not load sessions');
      throw error; // Re-throw so component knows it failed
    }
  }
};
```

## Component Pattern

```typescript
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

## Quality Checklist

Before completing any task, verify:

- [ ] TypeScript (no 'any' types)
- [ ] Loading state (spinner during async)
- [ ] Error state (user-friendly message)
- [ ] Empty state (when no data)
- [ ] Try/catch on all service calls
- [ ] Business rules enforced
- [ ] Mobile responsive
- [ ] Follows existing patterns
- [ ] No TODOs or console.logs

## What NEVER to Do

- ❌ Use 'any' type
- ❌ Call Supabase directly from components (use services)
- ❌ Skip error handling
- ❌ Create incomplete features
- ❌ Ignore business rules (cleaning window, financial privacy, etc.)
- ❌ Deviate from specs without explaining why
- ❌ Use hardcoded values (use design system constants)
- ❌ Create inline styles (use StyleSheet.create)
- ❌ Add TODO comments or placeholders

## Design System

### Colors
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
```

### Spacing
```typescript
const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
};
```

### Border Radius
```typescript
const borderRadius = {
  small: 6, medium: 8, large: 12, round: 999
};
```

## Error Handling Pattern

### Services Show Errors, Components Handle State
```typescript
// In service
catch (error) {
  console.error('[ServiceName.method]', error);
  Alert.alert('Error', 'User-friendly message here');
  throw error; // Re-throw so component knows it failed
}

// In component
try {
  await service.doSomething();
  // Success - update UI
  Alert.alert('Success', 'Action completed');
} catch (error) {
  // Error already shown by service
  // Just handle local UI state
  setLoading(false);
}
```

## Business Rules Enforcement

Always enforce these 5 critical rules:

1. **Cleaning Window**: Validate time is 11 AM - 3 PM
2. **Cancellation Notice**: Check 24-hour minimum
3. **Financial Privacy**: Hide financial data from cleaners
4. **Photo Proof**: Require minimum 3 photos
5. **Linen Requirements**: Auto-calculate based on guest count

## Testing Requirements

### Manual Testing Checklist
- [ ] Test as property_owner
- [ ] Test as cleaner
- [ ] Test as co_host
- [ ] Test in demo mode
- [ ] Test with real Supabase
- [ ] Test on iOS, Android, Web
- [ ] Test edge cases (empty states, errors, slow network)

### Type Checking
```bash
npm run type-check  # Should pass with 0 errors
```

## Success Criteria

Code is production-ready when:
- ✅ TypeScript compiles with zero errors
- ✅ All async operations have loading/error/empty states
- ✅ Business rules enforced correctly
- ✅ Error handling covers all edge cases
- ✅ Matches existing component/service patterns
- ✅ Mobile responsive (test on phone simulator)
- ✅ No hardcoded values (use design system)
- ✅ No TODOs or placeholders

---

**Remember**: Quality code is maintainable, testable, and follows established patterns.

