# Development Conventions

> Project-specific patterns and standards

## File Naming

- **Components**: `CleanerDashboard.tsx` (PascalCase)
- **Services**: `cleaningSessionService.ts` (camelCase + Service)
- **Screens**: `properties.tsx` (lowercase, matches route)
- **Types**: All in `types/index.ts`
- **Utils**: `supabase.ts` (camelCase)

## Import Order

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

## Code Organization

### Service Layer Pattern
```typescript
export const serviceName = {
  async getData(): Promise<Type[]> {
    try {
      const { data, error } = await supabase.from('table').select();
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[serviceName.getData]', error);
      Alert.alert('Error', 'User-friendly message');
      throw error;
    }
  },
};
```

### Component Pattern
```typescript
export default function ComponentName({ prop1, prop2 }: Props) {
  const [state, setState] = useState<Type>(initialValue);

  const handleAction = async () => {
    try {
      setLoading(true);
      await service.method();
    } catch (error) {
      // Error already shown by service
    } finally {
      setLoading(false);
    }
  };

  return <View>{/* JSX */}</View>;
}
```

## TypeScript Standards

### No 'any' Types
```typescript
// ❌ Bad
function process(data: any) { }

// ✅ Good
function process(data: CleaningSession) { }
```

### Explicit Return Types
```typescript
// ❌ Bad
async function getData() { }

// ✅ Good
async function getData(): Promise<Data[]> { }
```

## Design System

### Colors
```typescript
primary: '#007AFF'
success: '#10b981'
warning: '#f59e0b'
error: '#ef4444'
```

### Spacing
```typescript
xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
```

### Standard Card
```typescript
{
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}
```

## Comment Style

```typescript
// Brief explanatory comments only
// Focus on WHY, not WHAT

// ❌ Bad: Gets the user data
// ✅ Good: Uses cached data to avoid API rate limits
```

## Business Rules

Always enforce:
1. Cleaning window (11 AM - 3 PM)
2. 24-hour cancellation notice
3. Financial privacy for cleaners
4. Photo proof requirements
5. Linen auto-calculation

---

**Last Updated**: January 2025

