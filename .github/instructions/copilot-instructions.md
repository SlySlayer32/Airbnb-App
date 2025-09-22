# CRITICAL: User Background & Communication Style

**The user has ZERO coding experience or technical knowledge.** This is a non-technical founder who has built an entire app through AI-assisted development. When working with them:

- Describe features in business terms, not technical terms
- Always provide complete, working code - no TODOs or placeholders
- Explain changes in plain English with business impact
- When errors occur, explain the problem and solution without technical jargon
- Assume every request needs full implementation including imports, types, and error handling
- Never assume they understand technical concepts like "props", "state", "async", etc.
- Focus on what the feature does for their business, not how it works technically

# Application Purpose & Business Context

## Airbnb Property Cleaning Management Platform
This app connects property owners with cleaning teams for Airbnb properties. It handles scheduling, communication, quality control, and workflow management.

## User Roles & Business Capabilities

### **property_owner** (Primary Revenue Generator)
- Manages multiple Airbnb properties
- Schedules cleanings between guest stays
- Views cleaning reports and photos
- Handles billing and payments
- Sets property-specific cleaning requirements
- Receives notifications about issues

### **cleaner** (Service Provider)
- Receives cleaning assignments
- Updates cleaning progress in real-time
- Reports maintenance issues
- Accesses property details (codes, WiFi, special instructions)
- Cannot see financial information
- Submits completion photos and notes

### **co_host** (Limited Management)
- Limited property management capabilities
- Can view reports but cannot modify billing
- Helps coordinate schedules
- Cannot add/remove team members

## Critical Business Rules

### Cleaning Window Constraints
- Cleanings MUST happen between checkout (11 AM) and checkin (3 PM)
- This 4-hour window is sacred - violations cause guest conflicts
- System should prevent scheduling outside this window

### Cancellation Notice Policy
- 24-hour cancellation notice required for standard notice
- Less than 24 hours = "short notice" (flagged in red)
- Short notice cancellations may incur fees
- Always calculate and display notice period in hours

### Linen Requirements Scaling
- Linen needs scale directly with guest count
- More guests = more towels, sheets, pillowcases needed
- System auto-calculates based on guest_count
- Essential for cleaner preparation and time estimation

### Urgent Issue Handling
- Urgent issues (broken locks, flooding, etc.) trigger immediate notifications
- Property owners get instant alerts
- Cleaners can escalate to urgent status
- Different notification priority levels

### Financial Privacy
- Cleaners never see pricing, rates, or financial data
- Only completion status and basic property details
- Owner/co-host roles handle all financial aspects

# Technical Stack & Architecture

## Core Technologies
- **Frontend**: Expo SDK 51 + React Native + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Navigation**: Expo Router (file-based routing with typed routes)
- **Styling**: React Native StyleSheet (no external CSS libraries)
- **Icons**: @expo/vector-icons (Ionicons only - consistent across app)
- **State**: React Context for auth, local useState for UI

## Project Structure & File Organization
```
/app                    # Expo Router screens
  /(auth)              # Authentication screens (login, register, forgot-password)
  /_layout.tsx         # Root layout with AuthProvider and navigation
  /index.tsx           # Dashboard (role-specific content)
  /properties.tsx      # Property management
  /schedule.tsx        # Cleaning schedules
  /team.tsx            # Team member management
  /invoices.tsx        # Financial management
  /maintenance.tsx     # Maintenance tickets
  /reports.tsx         # Performance reports
  /profile.tsx         # User profile settings
  /onboarding.tsx      # First-time user setup

/components             # Reusable UI components
  /CleanerPropertyCard.tsx    # Property view for cleaners
  /OwnerPropertyCard.tsx      # Property view for owners
  /RoleBasedWrapper.tsx       # Access control component
  /QuickActions.tsx           # Dashboard quick action buttons
  /DashboardStats.tsx         # Statistics display
  [Other role-specific components]

/contexts              # React contexts
  /AuthContext.tsx     # Authentication & user state

/services             # Business logic & Supabase queries
  /cleaningSessionService.ts  # Cleaning workflow
  /propertyService.ts         # Property management
  /notificationService.ts     # Alert system
  /cleaningUpdateService.ts   # Progress tracking
  /index.ts                   # Service exports

/types                # TypeScript definitions
  /index.ts           # All type definitions

/data                 # Mock data & constants
  /mockData.ts        # Basic demo data
  /mockEnhancedData.ts # Advanced demo scenarios

/lib                  # Utilities
  /supabase.ts        # Supabase client configuration

/shims                # Platform compatibility
  /node-fetch.js      # Supabase React Native compatibility
```

# Data Architecture & Flow

## Database Schema (Supabase Tables)

### Core Tables
- **properties**: Property details, access info, cleaning logistics
- **profiles**: User accounts linked to Supabase auth
- **team_members**: Links users to properties with roles
- **cleaning_sessions**: Individual cleaning appointments
- **cleaning_updates**: Real-time progress updates during cleaning
- **notifications**: Alert system for all users
- **linen_requirements**: Guest-count-based linen calculations
- **maintenance_tickets**: Issue tracking system

## Data Flow Patterns

### 1. Authentication Flow
```
User Login → Supabase Auth → AuthContext → Profile Fetch → Role-based Route
```

### 2. Property Management Flow
```
Owner creates property → Service layer validation → Supabase storage → UI update
```

### 3. Cleaning Session Flow
```
Schedule created → Cleaner assigned → Session updates → Real-time notifications → Completion
```

### 4. Real-time Communication
```
Component action → Service call → Supabase → Real-time subscription → UI broadcast
```

# Component Creation Patterns & Examples

## Component Naming Convention
- **Format**: `[Role][Feature]Card` (e.g., `CleanerPropertyCard`, `OwnerScheduleCard`)
- **Purpose**: Immediately clear who uses it and what it does
- **Consistency**: All similar components follow same pattern

## Standard Component Template
```tsx
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

export default function ComponentName({ data, onAction, loading = false }: ComponentNameProps) {
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
      
      <View style={styles.content}>
        {/* Component-specific content */}
      </View>
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
  content: {
    // Component-specific styles
  },
});
```

## Real Example: CleanerPropertyCard Pattern
This component shows property info optimized for cleaners:
- Access codes prominently displayed
- Guest count for linen calculation
- Special cleaning areas highlighted
- Emergency contact readily available
- WiFi credentials for mobile access
- Cleaning supply locations

# Service Layer Patterns & Examples

## Service Creation Rules
1. **One service per business domain** (property, cleaning, notifications, etc.)
2. **All Supabase queries go through services** (never direct in components)
3. **Always handle errors and return typed data**
4. **Include notification triggers for important actions**
5. **Use transactions for multi-table operations**

## Standard Service Template
```typescript
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { SomeType } from '@/types';

export const domainService = {
  // Get data with proper error handling
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
      console.error('Service error:', error);
      Alert.alert('Error', 'Could not load data. Please check your connection.');
      throw error;
    }
  },

  // Create with validation and notifications
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
      console.error('Create error:', error);
      Alert.alert('Error', 'Could not create item. Please try again.');
      throw error;
    }
  },

  // Update with optimistic UI support
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
      console.error('Update error:', error);
      Alert.alert('Error', 'Could not save changes. Please try again.');
      throw error;
    }
  },

  // Delete with confirmation
  async deleteItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('table_name')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Could not delete item. Please try again.');
      throw error;
    }
  },

  // Private helper for notifications
  async notifyStakeholders(data: SomeType): Promise<void> {
    // Implementation specific to domain
  }
};
```

## Real Example: cleaningSessionService
Handles the complete cleaning workflow:
- Creates sessions with linen calculations
- Updates status with automatic notifications
- Handles cancellations with notice period tracking
- Manages cleaner arrival and completion
- Triggers real-time updates to property owners

# State Management Patterns

## When to Use Each State Type

### Local State (useState)
**Use For:**
- UI state (modal visibility, loading indicators, form inputs)
- Temporary user interactions (selections, filters)
- Component-specific data that doesn't need sharing

**Example:**
```tsx
const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
```

### Context State (AuthContext)
**Use For:**
- User authentication state (user, profile, session)
- Global app settings (theme, language)
- Data that multiple screens need

**Example:**
```tsx
const { user, profile, loading } = useAuth();
```

### Supabase Real-time
**Use For:**
- Live notifications
- Cleaning progress updates
- Session status changes
- Multi-user collaboration data

**Example:**
```tsx
useEffect(() => {
  const channel = supabase
    .channel('cleaning_updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'cleaning_sessions' },
      (payload) => {
        // Handle real-time update
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

# Error Handling & User Feedback

## Standard Error Handling Pattern
```tsx
const handleAction = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const result = await someService.doSomething();
    
    // Success feedback
    Alert.alert('Success', 'Action completed successfully');
    
  } catch (error) {
    // Log technical details for debugging
    console.error('Action failed:', error);
    
    // Show user-friendly message
    const userMessage = error.message.includes('network') 
      ? 'Please check your internet connection'
      : 'Something went wrong. Please try again.';
    
    Alert.alert('Error', userMessage);
    setError(userMessage);
    
  } finally {
    setLoading(false);
  }
};
```

## User Feedback Rules
1. **Always show loading indicators** for actions taking >500ms
2. **Confirm destructive actions** (delete, cancel) with Alert.alert
3. **Provide success feedback** for important actions
4. **Explain errors in simple terms** - no technical jargon
5. **Use consistent Alert.alert** for system messages
6. **Show progress** for multi-step operations

# Styling Conventions & Design System

## Color Palette
```typescript
const colors = {
  // Primary brand color
  primary: '#007AFF',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b', 
  error: '#ef4444',
  
  // Text colors
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  
  // Background colors
  background: '#f9fafb',
  cardBackground: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
};
```

## Spacing System
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
```

## Border Radius Standards
```typescript
const borderRadius = {
  small: 6,
  medium: 8, 
  large: 12,
  round: 999,
};
```

## Shadow Standards
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

# Navigation & Routing Patterns

## File-Based Routing Structure
```
app/
  _layout.tsx           → Root layout (/)
  index.tsx            → Dashboard (/)
  properties.tsx       → Properties (/properties)
  schedule.tsx         → Schedule (/schedule)
  team.tsx            → Team (/team)
  invoices.tsx        → Invoices (/invoices)
  maintenance.tsx     → Maintenance (/maintenance)
  reports.tsx         → Reports (/reports)
  profile.tsx         → Profile (/profile)
  onboarding.tsx      → Onboarding (/onboarding)
  auth/
    login.tsx         → Login (/auth/login)
    register.tsx      → Register (/auth/register)
    forgot-password.tsx → Forgot Password (/auth/forgot-password)
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

// Navigate to modal
router.push('/auth/login'); // Automatically opens as modal due to _layout.tsx config
```

## Role-Based Route Protection
```tsx
// In _layout.tsx
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/properties') { // Allow demo access
        router.replace('/auth/login');
      } else if (user && profile && !profile.onboarded) {
        router.replace('/onboarding');
      }
    }
  }, [user, profile, loading, pathname]);

  // Loading and guard logic...
}
```

# Security & Permissions

## Security Rules
1. **Never expose Supabase keys in client code** - use environment variables
2. **Use Row Level Security (RLS) in Supabase** for data protection
3. **Validate user roles before operations** - don't trust client-side checks
4. **Sanitize user inputs** before database operations
5. **Don't store sensitive data in AsyncStorage** - use Supabase auth session

## Permission Checking Pattern
```tsx
// In components - UI level protection
import RoleBasedWrapper from '@/components/RoleBasedWrapper';

<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <FinancialDataComponent />
</RoleBasedWrapper>

// In services - API level protection
async someRestrictedAction() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (!['property_owner', 'co_host'].includes(profile.role)) {
    throw new Error('Insufficient permissions');
  }
  
  // Proceed with action...
}
```

# Performance Considerations

## Performance Rules
1. **Use FlatList for lists > 10 items** (not ScrollView)
2. **Implement pagination** for large datasets (50+ records)
3. **Optimize images** - use compressed formats and proper sizing
4. **Minimize re-renders** with React.memo for expensive components
5. **Use lazy loading** for heavy components not immediately visible
6. **Debounce search inputs** to avoid excessive API calls
7. **Cache frequently accessed data** in memory or AsyncStorage

## FlatList Implementation
```tsx
import { FlatList, RefreshControl } from 'react-native';

const renderProperty = ({ item }: { item: Property }) => (
  <PropertyCard property={item} onPress={handlePropertyPress} />
);

<FlatList
  data={properties}
  renderItem={renderProperty}
  keyExtractor={(item) => item.id}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
  }
  onEndReached={loadMoreProperties}
  onEndReachedThreshold={0.1}
  ListEmptyComponent={<EmptyStateComponent />}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={10}
/>
```

# Specific Business Logic Implementation

## Cleaning Session Status Flow
```typescript
type SessionStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// Status progression:
// scheduled → confirmed (cleaner assigned) → in_progress (cleaner arrived) → completed
```

## Cancellation Notice Calculation
```typescript
const calculateCancellationNotice = (scheduledTime: string): number => {
  const scheduled = new Date(scheduledTime);
  const now = new Date();
  const diffInMs = scheduled.getTime() - now.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  return Math.max(0, diffInHours);
};

const isShortNotice = (hours: number): boolean => hours < 24;
```

## Linen Requirements Calculation
```typescript
const calculateLinenRequirements = (guestCount: number, propertyType: string): LinenRequirement => {
  const baseRequirements = {
    towels_bath: guestCount,
    towels_hand: guestCount,
    towels_face: guestCount,
    pillow_cases: guestCount * 2,
    kitchen_towels: 2,
    bath_mats: 1,
  };

  // Adjust based on property type and guest count
  if (propertyType === 'villa' && guestCount > 4) {
    baseRequirements.towels_pool = guestCount;
    baseRequirements.bath_mats = 2;
  }

  return baseRequirements;
};
```

## Notification Priority Levels
```typescript
type NotificationPriority = 'urgent' | 'high' | 'normal';

const getNotificationPriority = (type: string, context: any): NotificationPriority => {
  switch (type) {
    case 'maintenance_urgent':
    case 'session_cancelled_short_notice':
      return 'urgent';
    case 'session_cancelled':
    case 'cleaning_issue':
      return 'high';
    default:
      return 'normal';
  }
};
```

# Testing & Debugging Guidance

## Common Issues & Solutions

### "Cannot read property of undefined" 
**Cause**: Accessing nested object properties without checking if they exist
**Solution**: Use optional chaining
```tsx
// Problem
const name = user.profile.name;

// Solution
const name = user?.profile?.name;
```

### "Network request failed"
**Cause**: Supabase connection issues or invalid API calls
**Solution**: Check environment variables and network connectivity
```tsx
// Debug Supabase connection
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Supabase Key exists:', !!supabase.supabaseKey);
```

### "Invalid hook call"
**Cause**: Using React hooks inside callbacks or conditionals
**Solution**: Only call hooks at the top level of components
```tsx
// Problem
if (someCondition) {
  const [state, setState] = useState(false);
}

// Solution
const [state, setState] = useState(false);
if (someCondition) {
  // Use state here
}
```

### White screen on app start
**Cause**: Navigation or authentication guard issues
**Solution**: Check AuthGuard logic and route configuration

## Debug Steps for Non-Technical Users
1. **Look at the error message in terminal** - it often tells you exactly what's wrong
2. **Check if similar working code exists** in the project
3. **Verify all imports are present** at the top of files
4. **Ensure types match between components** - especially props interfaces
5. **Test with mock data first** before connecting to real Supabase data

# Adding New Features (Step-by-Step Guide)

## When User Asks for New Features
Follow this exact sequence:

### 1. Identify Role Requirements
- **Who will use this feature?** (property_owner, cleaner, co_host, or multiple)
- **What permissions are needed?** (read-only, modify, delete)
- **Where should it appear in the app?** (dashboard, dedicated screen, modal)

### 2. Check Existing Patterns
- **Look for similar features** in the codebase
- **Identify reusable components** that can be adapted
- **Find service methods** that handle similar data

### 3. Create Complete Implementation
Always include:
- TypeScript types in `/types/index.ts`
- Service methods in `/services/[domain]Service.ts`
- Components in `/components/[RoleFeature]Component.tsx`
- Screen in `/app/[feature].tsx` if needed
- Update navigation in `_layout.tsx` if new route
- Add RoleBasedWrapper for access control

### 4. Implementation Template

#### A. Add Types
```typescript
// In /types/index.ts
export interface NewFeature {
  id: string;
  property_id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
```

#### B. Create Service
```typescript
// In /services/newFeatureService.ts
export const newFeatureService = {
  async getFeatures(propertyId?: string): Promise<NewFeature[]> {
    // Implementation
  },
  
  async createFeature(data: Omit<NewFeature, 'id'>): Promise<NewFeature> {
    // Implementation with notifications
  },
  
  async updateFeature(id: string, updates: Partial<NewFeature>): Promise<NewFeature> {
    // Implementation
  }
};
```

#### C. Create Component
```tsx
// In /components/NewFeatureCard.tsx
interface NewFeatureCardProps {
  feature: NewFeature;
  onPress: () => void;
}

export default function NewFeatureCard({ feature, onPress }: NewFeatureCardProps) {
  // Follow component template pattern
}
```

#### D. Add to Screen
```tsx
// In /app/features.tsx or existing screen
import { newFeatureService } from '@/services';
import NewFeatureCard from '@/components/NewFeatureCard';

export default function FeaturesScreen() {
  const [features, setFeatures] = useState<NewFeature[]>([]);
  
  // Implementation following screen patterns
}
```

### 5. Explain Changes
After implementing, explain:
- **What the feature does** in business terms
- **Who can access it** and how
- **Where to find it** in the app
- **Any new dependencies** or setup required

# Code Quality Standards

## Required for All Code
1. **No console.log in production code** - use proper error handling
2. **Always include TypeScript types** - no `any` types allowed
3. **Handle all possible states** - loading, error, empty, success
4. **Follow existing naming conventions exactly**
5. **Include helpful comments** only for complex business logic
6. **Use existing colors and spacing** from design system
7. **Test both success and error scenarios**

## Code Review Checklist
Before submitting any code, verify:
- [ ] All TypeScript errors resolved
- [ ] Error handling implemented for all async operations
- [ ] Loading states shown during async operations
- [ ] User feedback provided for all actions
- [ ] Existing patterns followed consistently
- [ ] No hardcoded values (use constants)
- [ ] Responsive design works on different screen sizes
- [ ] Role-based access control implemented where needed

# Version Control Best Practices

## For Non-Technical Users
- **Each feature should be one complete change** - don't mix unrelated changes
- **Test the app works** before committing (run `npx expo start`)
- **Commit message format**: "Add [feature] for [role]" (e.g., "Add property filtering for property owners")
- **If something breaks**, you can revert to the previous version
- **Always test on device** after major changes

## Commit Message Examples
- "Add real-time notifications for cleaning updates"
- "Fix linen calculation for large properties"
- "Update cleaner property card with WiFi credentials"
- "Add cancellation notice warning for short notice"

# Feature Implementation Checklist

When creating any new feature, automatically verify:

- [ ] **User role permissions checked** - who can access this?
- [ ] **TypeScript types created** - in `/types/index.ts`
- [ ] **Service layer methods implemented** - following service patterns
- [ ] **Proper error handling added** - user-friendly messages
- [ ] **Loading states included** - visual feedback during operations
- [ ] **Existing UI patterns followed** - consistent with app design
- [ ] **Appropriate notifications added** - for status changes
- [ ] **Related components updated** - maintain consistency
- [ ] **Role-based access tested** - verify permissions work
- [ ] **Changes explained in business terms** - what this does for users

# Success Metrics

The instructions are successful when:
1. **Business features can be described naturally** and get working code
2. **New code automatically follows all existing patterns**
3. **Technical details are handled automatically** without user awareness
4. **The app maintains consistency** as new features are added
5. **Errors are explained and fixed** in terms the user understands
6. **Every request gets complete working implementation**

Remember: The user has built their entire app through natural language conversations with AI. Your job is to be their complete technical co-founder who handles all the complexity while they focus on growing their business.