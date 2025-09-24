---
applyTo: 'app/**/*.tsx'
---

# Screen & Navigation Patterns

## File-Based Routing Structure

```
app/
  _layout.tsx           → Root layout with AuthGuard
  index.tsx            → Dashboard (role-specific content)
  properties.tsx       → Property management
  schedule.tsx         → Cleaning schedules
  team.tsx            → Team member management
  invoices.tsx        → Financial management (owner/co_host only)
  auth/
    login.tsx         → Authentication screens (modals)
```

## Navigation Patterns

```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to screen
router.push('/properties');

// Navigate with parameters
router.push('/properties?filter=active');

// Replace current screen (no back button)
router.replace('/dashboard');

// Go back
router.back();
```

## Role-Based Screen Protection

```tsx
import RoleBasedWrapper from '@/components/RoleBasedWrapper';

// Wrap sensitive content
<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <FinancialDataComponent />
</RoleBasedWrapper>
```

## Screen Template

```tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { someService } from '@/services';
import { SomeType } from '@/types';

export default function FeatureScreen() {
  const { profile } = useAuth();
  const [data, setData] = useState<SomeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await someService.getData();
      setData(result);
    } catch (error) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {/* Screen content */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
```

## Performance Rules

- Use FlatList for lists >10 items (not ScrollView)
- Implement RefreshControl for pull-to-refresh
- Show loading states during data fetching
- Include empty states for when no data exists
