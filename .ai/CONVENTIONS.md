# 📐 Code Conventions & Standards

> Unified code patterns and design system for consistent development

## 📋 Table of Contents
- [TypeScript Standards](#typescript-standards)
- [Component Patterns](#component-patterns)
- [Service Layer Patterns](#service-layer-patterns)
- [Design System](#design-system)
- [Error Handling](#error-handling)
- [State Management](#state-management)
- [Performance Guidelines](#performance-guidelines)

---

## 📘 TypeScript Standards

### No `any` Types
```typescript
// ❌ Bad
const data: any = await fetchData();

// ✅ Good
const data: UserData = await fetchData();
```

### Complete Interface Definitions
```typescript
// ✅ Component props interface
interface ComponentNameProps {
  // Required props
  data: EntityType;
  onAction: () => void;
  
  // Optional props with defaults
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  
  // Callbacks
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

### Status Type Unions
```typescript
// Use string literal unions for status fields
type SessionStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
type PropertyStatus = 'active' | 'occupied' | 'maintenance' | 'inactive';
type UserRole = 'property_owner' | 'cleaner' | 'co_host';
type NotificationPriority = 'urgent' | 'high' | 'normal';

// Not generic strings
// ❌ Bad: status: string
// ✅ Good: status: SessionStatus
```

### Partial and Omit Utilities
```typescript
// Create without ID (database generates it)
type CreatePropertyInput = Omit<Property, 'id' | 'created_at' | 'updated_at'>;

// Update allows partial fields
type UpdatePropertyInput = Partial<Property>;

// Example usage
async createProperty(data: Omit<Property, 'id'>): Promise<Property> {
  // Implementation
}

async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  // Implementation
}
```

---

## 🧩 Component Patterns

### Naming Convention
**Format**: `[Role][Feature]Component.tsx`

**Examples**:
- `CleanerPropertyCard.tsx` - Property card for cleaners
- `OwnerPropertyCard.tsx` - Property card for owners
- `CleaningUpdates.tsx` - Generic (multiple roles)
- `RoleBasedWrapper.tsx` - Access control

### Standard Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EntityType } from '@/types';
import { someService } from '@/services';

interface ComponentNameProps {
  data: EntityType;
  onAction: () => void;
  loading?: boolean;
}

export default function ComponentName({ 
  data, 
  onAction, 
  loading = false 
}: ComponentNameProps) {
  // Local state
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Side effects
  useEffect(() => {
    // Component did mount logic
  }, []);

  // Event handlers
  const handleAction = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      await someService.doSomething(data.id);
      onAction();
      
    } catch (error) {
      const message = 'Something went wrong. Please try again.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLocalLoading(false);
    }
  };

  // Render
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleAction}
      disabled={loading || localLoading}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{data.name}</Text>
        {(loading || localLoading) && (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Component content */}
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
  loadingText: {
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

### Component Pre-Flight Checklist
Before writing a component:
- [ ] Write the business problem in one sentence
- [ ] List required props and their types
- [ ] Define states: loading, empty, success, error
- [ ] Identify main CTA and side effects
- [ ] Check if similar component exists to adapt

---

## 🔧 Service Layer Patterns

### Service File Structure
```typescript
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { EntityType } from '@/types';
import { notificationService } from './notificationService';

// Export service as object with methods
export const domainService = {
  
  // GET - Fetch data
  async getData(filters?: FilterType): Promise<EntityType[]> {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .select(`
          *,
          related_table (
            field1,
            field2
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('[domainService.getData]', error);
      Alert.alert('Error', 'Could not load data. Please check your connection.');
      throw error;
    }
  },

  // POST - Create item
  async createItem(itemData: Omit<EntityType, 'id'>): Promise<EntityType> {
    try {
      // Validate business rules
      if (!itemData.required_field) {
        throw new Error('Required field is missing');
      }

      const { data, error } = await supabase
        .from('table_name')
        .insert({
          ...itemData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;

      // Trigger notifications for important actions
      await notificationService.sendToUser(affectedUserId, {
        title: 'Item Created',
        message: 'Description of what happened',
        type: 'info',
        priority: 'normal',
      });
      
      return data;
      
    } catch (error) {
      console.error('[domainService.createItem]', error);
      Alert.alert('Error', 'Could not create item. Please try again.');
      throw error;
    }
  },

  // PATCH - Update item
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
      console.error('[domainService.updateItem]', error);
      Alert.alert('Error', 'Could not save changes. Please try again.');
      throw error;
    }
  },

  // DELETE - Remove item
  async deleteItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('table_name')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('[domainService.deleteItem]', error);
      Alert.alert('Error', 'Could not delete item. Please try again.');
      throw error;
    }
  },
};
```

### Service Naming Convention
- File: `[domain]Service.ts` (camelCase)
- Export: `export const domainService = { ... }`
- Methods: Descriptive verb + noun (e.g., `getPropertiesForOwner`)

### Service Documentation
Add comment at top of file:
```typescript
/**
 * Property Service
 * 
 * Manages property CRUD operations and linen requirements.
 * 
 * Database Tables: properties, linen_requirements
 * RLS: User must be owner or assigned via team_members
 * 
 * @see types/index.ts for Property and LinenRequirement interfaces
 */
```

---

## 🎨 Design System

### Color Palette
```typescript
const colors = {
  // Primary brand color
  primary: '#007AFF',
  
  // Status colors
  success: '#10b981',    // Green
  warning: '#f59e0b',    // Orange
  error: '#ef4444',      // Red
  info: '#3b82f6',       // Blue
  
  // Text colors
  textPrimary: '#1f2937',      // Dark gray
  textSecondary: '#6b7280',    // Medium gray
  textLight: '#9ca3af',        // Light gray
  textWhite: '#ffffff',        // White
  
  // Background colors
  background: '#f9fafb',       // App background
  cardBackground: '#ffffff',   // Card/container background
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  
  // Border colors
  border: '#e5e7eb',          // Standard border
  borderLight: '#f3f4f6',     // Light border
  
  // Role-specific colors
  owner: '#8b5cf6',           // Purple
  cleaner: '#10b981',         // Green
  coHost: '#f59e0b',          // Orange
};
```

### Spacing System
```typescript
const spacing = {
  xs: 4,       // Extra small (rare use)
  sm: 8,       // Small spacing
  md: 12,      // Medium spacing
  lg: 16,      // Large spacing (default)
  xl: 24,      // Extra large
  xxl: 32,     // Extra extra large
};

// Usage in styles
padding: spacing.lg,           // 16px
marginBottom: spacing.md,      // 12px
gap: spacing.sm,               // 8px
```

### Typography
```typescript
const typography = {
  // Headings
  h1: { fontSize: 32, fontWeight: 'bold', color: '#1f2937' },
  h2: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  h3: { fontSize: 20, fontWeight: '600', color: '#1f2937' },
  h4: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  
  // Body text
  body: { fontSize: 16, fontWeight: 'normal', color: '#1f2937' },
  bodySecondary: { fontSize: 16, fontWeight: 'normal', color: '#6b7280' },
  
  // Small text
  caption: { fontSize: 14, fontWeight: 'normal', color: '#6b7280' },
  label: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  
  // Buttons
  button: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  buttonSmall: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
};
```

### Border Radius
```typescript
const borderRadius = {
  small: 6,      // Small elements (chips, tags)
  medium: 8,     // Medium elements (buttons, inputs)
  large: 12,     // Large elements (cards)
  round: 999,    // Fully rounded (avatars, badges)
};
```

### Shadows (iOS & Android)
```typescript
const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
```

### Standard Layout Components
```typescript
// Card container
const cardStyles = {
  backgroundColor: colors.cardBackground,
  borderRadius: borderRadius.large,
  padding: spacing.lg,
  marginBottom: spacing.lg,
  ...shadows.medium,
};

// Section heading
const sectionHeadingStyles = {
  fontSize: 16,
  fontWeight: '600',
  color: colors.textPrimary,
  marginBottom: spacing.sm,
};

// Divider
const dividerStyles = {
  height: 1,
  backgroundColor: colors.border,
  marginVertical: spacing.md,
};

// Button primary
const buttonPrimaryStyles = {
  backgroundColor: colors.primary,
  borderRadius: borderRadius.medium,
  padding: spacing.md,
  alignItems: 'center',
};

// Button text
const buttonTextStyles = {
  color: colors.textWhite,
  fontSize: 16,
  fontWeight: '600',
};
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
    // Log technical details for debugging
    console.error('[ComponentName.handleAction]', error);
    
    // User-friendly error message
    const userMessage = error.message?.includes('network')
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

### Error States in UI
```typescript
// Loading state
{loading && <ActivityIndicator size="large" color="#007AFF" />}

// Error state
{error && (
  <View style={styles.errorContainer}>
    <Ionicons name="alert-circle" size={24} color="#ef4444" />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={handleRetry}>
      <Text style={styles.retryText}>Try Again</Text>
    </TouchableOpacity>
  </View>
)}

// Empty state
{!loading && data.length === 0 && (
  <View style={styles.emptyState}>
    <Ionicons name="document-outline" size={48} color="#9ca3af" />
    <Text style={styles.emptyText}>No items found</Text>
    <Text style={styles.emptySubtext}>Add your first item to get started</Text>
  </View>
)}
```

---

## 🔄 State Management

### Local State (useState)
Use for UI-specific state that doesn't need sharing:
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [modalVisible, setModalVisible] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
```

### Context State (AuthContext)
Use for global app state:
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, profile, loading } = useAuth();

// Available data:
// - user: Supabase auth user
// - profile: User profile with role
// - loading: Initial auth check
```

### Real-time Subscriptions
Use for live data updates:
```typescript
import { realtimeService } from '@/services';

useEffect(() => {
  realtimeService.subscribe({
    onSessionUpdate: (session) => {
      // Handle session update
      refreshData();
    },
  });

  return () => {
    realtimeService.unsubscribe();
  };
}, []);
```

---

## ⚡ Performance Guidelines

### Use FlatList for Large Lists
```typescript
// ❌ Bad: ScrollView with map (for > 10 items)
<ScrollView>
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</ScrollView>

// ✅ Good: FlatList with optimization
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemCard item={item} />}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={10}
  removeClippedSubviews={true}
/>
```

### Memoize Expensive Components
```typescript
import React, { memo } from 'react';

const ExpensiveComponent = memo(({ data }: Props) => {
  // Complex rendering logic
  return <View>{/* ... */}</View>;
});
```

### Debounce Search Input
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery]);

useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery);
  }
}, [debouncedQuery]);
```

### Optimize Images
```typescript
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="cover"
  // Optimize image loading
  cache="force-cache"
  priority="normal"
/>
```

---

## ✅ Code Quality Checklist

Before committing code:
- [ ] No TypeScript errors (`npm run lint`)
- [ ] No console.logs in production code
- [ ] All async operations have error handling
- [ ] Loading states shown for operations > 500ms
- [ ] Empty states handled gracefully
- [ ] Role-based access control applied where needed
- [ ] Business rules enforced (cleaning window, cancellation notice, etc.)
- [ ] Follows existing component/service patterns
- [ ] User-friendly error messages (no technical jargon)
- [ ] Tested on different screen sizes

---

**Last Updated**: January 2025  
**Maintenance**: Update when new patterns are established
