# Common Service & API Patterns

> Reusable code templates for consistent development

## 📋 Table of Contents
- [Service Method Templates](#service-method-templates)
- [Component Patterns](#component-patterns)
- [Error Handling](#error-handling)
- [Loading States](#loading-states)
- [Real-time Subscriptions](#real-time-subscriptions)

---

## 🔧 Service Method Templates

### Standard GET Method
```typescript
async getData(filters?: FilterType): Promise<EntityType[]> {
  try {
    let query = supabase
      .from('table_name')
      .select(`
        *,
        related_table (
          field1,
          field2
        )
      `);
    
    // Apply filters if provided
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error('[serviceName.getData]', error);
    Alert.alert('Error', 'Could not load data. Please check your connection.');
    throw error;
  }
}
```

---

### Standard CREATE Method
```typescript
async createItem(itemData: Omit<EntityType, 'id'>): Promise<EntityType> {
  try {
    // 1. Validate business rules
    this.validateItemData(itemData);
    
    // 2. Insert into database
    const { data, error } = await supabase
      .from('table_name')
      .insert({
        ...itemData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;

    // 3. Trigger notifications for important actions
    await notificationService.sendToUser(affectedUserId, {
      title: 'Item Created',
      message: 'Description of what happened',
      type: 'info',
      priority: 'normal',
    });
    
    return data;
    
  } catch (error) {
    console.error('[serviceName.createItem]', error);
    Alert.alert('Error', 'Could not create item. Please try again.');
    throw error;
  }
}
```

---

### Standard UPDATE Method
```typescript
async updateItem(id: string, updates: Partial<EntityType>): Promise<EntityType> {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error('[serviceName.updateItem]', error);
    Alert.alert('Error', 'Could not save changes. Please try again.');
    throw error;
  }
}
```

---

### Standard DELETE Method
```typescript
async deleteItem(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('table_name')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    Alert.alert('Success', 'Item deleted successfully');
    
  } catch (error) {
    console.error('[serviceName.deleteItem]', error);
    Alert.alert('Error', 'Could not delete item. Please try again.');
    throw error;
  }
}
```

---

## 🧩 Component Patterns

### Standard Component with Async Action
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

---

### Screen with Data Loading
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

---

## 🚨 Error Handling

### Try-Catch Pattern
```typescript
const handleAction = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Perform operation
    const result = await someService.doSomething();
    
    // Success feedback (for important actions)
    Alert.alert('Success', 'Action completed successfully');
    
    // Update UI
    onSuccess(result);
    
  } catch (error) {
    // Log technical details
    console.error('[ComponentName.handleAction]', error);
    
    // User-friendly message
    const userMessage = error instanceof Error && error.message.includes('network')
      ? 'Please check your internet connection'
      : 'Something went wrong. Please try again.';
    
    // Show error to user
    Alert.alert('Error', userMessage);
    setError(userMessage);
    
  } finally {
    // Always cleanup
    setLoading(false);
  }
};
```

---

## ⏳ Loading States

### Simple Loading State
```typescript
{loading ? (
  <ActivityIndicator size="small" color="#007AFF" />
) : (
  <Text>Content</Text>
)}
```

### Conditional Content with Loading
```typescript
{loading && <Text style={styles.loadingText}>Loading...</Text>}
{!loading && data.length === 0 && (
  <Text style={styles.emptyText}>No items found</Text>
)}
{!loading && data.length > 0 && (
  <FlatList data={data} renderItem={...} />
)}
```

### Full Screen Loading
```typescript
if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}
```

---

## 🔄 Real-time Subscriptions

### Subscribe in Component
```typescript
useEffect(() => {
  const subscriptionConfig = {
    onSessionUpdate: (session) => {
      console.log('Session updated:', session);
      refreshData();
    },
    onSessionInsert: (session) => {
      console.log('New session:', session);
      addToList(session);
    },
  };
  
  realtimeService.subscribe(subscriptionConfig);
  
  return () => {
    realtimeService.unsubscribe();
  };
}, []);
```

### Connection Status Tracking
```typescript
const [realtimeConnected, setRealtimeConnected] = useState(false);

useEffect(() => {
  const checkConnection = () => {
    setRealtimeConnected(realtimeService.isConnected());
  };
  
  const interval = setInterval(checkConnection, 5000);
  return () => clearInterval(interval);
}, []);
```

---

## 🎯 Business Logic Patterns

### Cleaning Window Validation
```typescript
function validateCleaningWindow(scheduledTime: Date): void {
  const hour = scheduledTime.getHours();
  
  if (hour < 11 || hour >= 15) {
    throw new Error('Cleanings must be scheduled between 11 AM and 3 PM');
  }
}

function isWithinCleaningWindow(scheduledTime: Date): boolean {
  const hour = scheduledTime.getHours();
  return hour >= 11 && hour < 15;
}
```

### Cancellation Notice Calculation
```typescript
function calculateCancellationNotice(scheduledTime: Date): {
  hours: number;
  isShortNotice: boolean;
  canCancel: boolean;
} {
  const now = new Date();
  const scheduled = new Date(scheduledTime);
  const diffMs = scheduled.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  
  return {
    hours: Math.max(0, hours),
    isShortNotice: hours < 24,
    canCancel: hours >= 1,
  };
}
```

### Linen Requirements Calculation
```typescript
function calculateLinenRequirements(
  guestCount: number,
  propertyType: string,
  hasPool: boolean = false
): LinenRequirement {
  return {
    guest_count: guestCount,
    towels_bath: guestCount * 1,
    towels_hand: guestCount * 1,
    pillow_cases: guestCount * 2,
    kitchen_towels: 2, // Fixed
    bath_mats: 1 + (propertyType === 'villa' && guestCount > 4 ? 1 : 0),
    towels_pool: hasPool ? guestCount : 0,
  };
}
```

---

## 🔐 Role-Based Access Patterns

### Component-Level Access Control
```typescript
import RoleBasedWrapper from '@/components/RoleBasedWrapper';

// Hide from specific role
<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <FinancialDataComponent />
</RoleBasedWrapper>

// Show different content per role
function DashboardContent() {
  const { profile } = useAuth();
  
  if (profile?.role === 'cleaner') {
    return <CleanerDashboard />;
  } else {
    return <OwnerDashboard />;
  }
}
```

### Service-Level Role Filtering
```typescript
async getDataForUser(userId: string, userRole: string): Promise<EntityType[]> {
  let query = supabase.from('table_name').select('*');
  
  if (userRole === 'cleaner') {
    // Cleaners see only assigned items
    query = query.in('property_id', assignedPropertyIds);
  } else if (userRole === 'property_owner') {
    // Owners see only their items
    query = query.eq('owner_id', userId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
```

---

## 📱 React Native Patterns

### Safe Area Handling
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={styles.container}>
  {/* Content won't be hidden by notch or status bar */}
</SafeAreaView>
```

### Platform-Specific Styles
```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 20 : 16,
    paddingTop: Platform.OS === 'android' ? 40 : 0, // Android status bar
  },
});
```

### Keyboard Avoiding
```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={styles.container}
>
  <TextInput /> {/* Keyboard won't cover input */}
</KeyboardAvoidingView>
```

---

## 🎨 Styling Patterns

### Standard Card Style
```typescript
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
    elevation: 3, // Android shadow
  },
});
```

### Status-Based Color
```typescript
function getStatusColor(status: string): string {
  const statusColors = {
    completed: '#10b981',    // Green
    in_progress: '#007AFF',  // Blue
    scheduled: '#6b7280',    // Gray
    cancelled: '#ef4444',    // Red
    overdue: '#f59e0b',      // Orange
  };
  
  return statusColors[status] || '#6b7280';
}

// Usage
<View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]} />
```

### Priority-Based Style
```typescript
function getPriorityStyle(priority: string) {
  const styles = {
    urgent: { backgroundColor: '#ef4444', color: '#ffffff' },
    high: { backgroundColor: '#f59e0b', color: '#ffffff' },
    medium: { backgroundColor: '#3b82f6', color: '#ffffff' },
    normal: { backgroundColor: '#6b7280', color: '#ffffff' },
  };
  
  return styles[priority] || styles.normal;
}
```

---

## ✅ Validation Patterns

### Form Validation
```typescript
function validateForm(formData: FormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!formData.password || formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### Business Rule Validation
```typescript
function validateSessionStart(session: CleaningSession, currentTime: Date): void {
  // Check status
  if (session.status !== 'scheduled') {
    throw new Error('Only scheduled sessions can be started');
  }
  
  // Check time window
  const hour = currentTime.getHours();
  if (hour < 11 || hour >= 15) {
    throw new Error('Cleanings can only be started between 11 AM and 3 PM');
  }
  
  // Check if too early
  const scheduledTime = new Date(session.scheduled_cleaning_time);
  const minutesUntilScheduled = (scheduledTime.getTime() - currentTime.getTime()) / (1000 * 60);
  if (minutesUntilScheduled > 30) {
    throw new Error('Cannot start more than 30 minutes before scheduled time');
  }
}
```

---

## 🎯 Common Utility Functions

### Time Formatting
```typescript
function formatTimeRemaining(minutes: number): string {
  if (minutes < 0) return 'Overdue';
  if (minutes === 0) return 'Now';
  if (minutes < 60) return `${minutes} min`;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
```

### Date Formatting
```typescript
function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function formatTime(time: string | Date): string {
  const d = new Date(time);
  return d.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}
```

---

**Last Updated**: January 2025  
**Maintenance**: Add new patterns as they emerge in development

