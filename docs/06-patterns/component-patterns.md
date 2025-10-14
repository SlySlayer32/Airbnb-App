# Component Patterns

> Reusable React component templates

## Standard Component with Async Action

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EntityType } from '@/types';
import { entityService } from '@/services';

interface ComponentNameProps {
  data: EntityType;
  onPress: () => void;
  onUpdate?: (id: string) => void;
}

export default function ComponentName({ data, onPress, onUpdate }: ComponentNameProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    try {
      setLoading(true);
      setError(null);

      await entityService.doSomething(data.id);

      Alert.alert('Success', 'Action completed successfully');
      onUpdate?.(data.id);

    } catch (error) {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{data.name}</Text>
        {loading && <ActivityIndicator size="small" color="#007AFF" />}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && (
        <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
          <Text style={styles.actionText}>Take Action</Text>
        </TouchableOpacity>
      )}
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## Screen with Data Loading

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { EntityType } from '@/types';
import { entityService } from '@/services';

export default function ScreenName() {
  const { profile } = useAuth();
  const [data, setData] = useState<EntityType[]>([]);
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
      const result = await entityService.getData();
      setData(result);
    } catch (err) {
      setError('Failed to load data');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {data.map(item => (
        <ItemCard key={item.id} item={item} onPress={() => {}} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## Loading States

```typescript
// Simple loading state
{loading ? (
  <ActivityIndicator size="small" color="#007AFF" />
) : (
  <Text>Content</Text>
)}

// Conditional content with loading
{loading && <Text style={styles.loadingText}>Loading...</Text>}
{!loading && data.length === 0 && (
  <Text style={styles.emptyText}>No items found</Text>
)}
{!loading && data.length > 0 && (
  <FlatList data={data} renderItem={...} />
)}

// Full screen loading
if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}
```

## Empty States

```typescript
{data.length === 0 && !loading && (
  <View style={styles.emptyState}>
    <Ionicons name="document-outline" size={48} color="#9ca3af" />
    <Text style={styles.emptyText}>No items found</Text>
  </View>
)}
```

## Role-Based Access

```typescript
import RoleBasedWrapper from '@/components/RoleBasedWrapper';

<RoleBasedWrapper allowedRoles={['property_owner']}>
  <AdminComponent />
</RoleBasedWrapper>
```

---

**Last Updated**: January 2025

