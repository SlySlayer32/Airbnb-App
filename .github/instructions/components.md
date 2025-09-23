---
applyTo: 'components/**/*.tsx'
---

# Component Development Patterns

## Naming Convention

Format: `[Role][Feature]Card` (e.g., `CleanerPropertyCard`, `OwnerScheduleCard`)

## Standard Component Template

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SomeType } from '@/types';

interface ComponentProps {
  data: SomeType;
  onAction: (id: string) => void;
  loading?: boolean;
}

export default function ComponentName({ data, onAction, loading = false }: ComponentProps) {
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      await someService.doSomething(data.id);
      onAction(data.id);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      Alert.alert('Error', 'User-friendly error message');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleAction} disabled={loading || localLoading}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.name}</Text>
        {(loading || localLoading) && <Text style={styles.loading}>Loading...</Text>}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
  loading: {
    fontSize: 14,
    color: '#007AFF',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
});
```

## Design System Values

```typescript
// Use these exact values for consistency
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

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
const borderRadius = { small: 6, medium: 8, large: 12 };
```

## Error Handling Rules

- Always show loading indicators for actions >500ms
- Use Alert.alert for system messages
- Provide user-friendly error messages (no technical jargon)
- Include error recovery options when possible
