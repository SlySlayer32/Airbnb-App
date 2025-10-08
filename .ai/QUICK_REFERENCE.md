# ⚡ Quick Reference Sheet

> Fast lookup for common commands, patterns, imports, and standards

## 📋 Table of Contents
- [Common Commands](#common-commands)
- [Project Structure](#project-structure)
- [Import Patterns](#import-patterns)
- [Naming Conventions](#naming-conventions)
- [Styling System](#styling-system)
- [Navigation Routes](#navigation-routes)
- [TypeScript Patterns](#typescript-patterns)

## 💻 Common Commands

### Development
```bash
npm start                    # Start Expo dev server
npm run android             # Launch Android emulator
npm run ios                 # Launch iOS simulator
npm run web                 # Launch web browser

npm run lint                # Type checking with tsc
npm run type-check          # Explicit type checking
```

### Git Workflow
```bash
git status                  # Check current changes
git add .                   # Stage all changes
git commit -m "message"     # Commit with message
git push origin main        # Push to main branch

git --no-pager diff         # View changes
git --no-pager log -5       # View last 5 commits
```

### Testing
```bash
npx expo start              # Test on device/simulator
npm run lint                # Check for TypeScript errors
```

## 📁 Project Structure

### Folders by File Count
```
components/     18 files    Reusable UI components
services/       8 files     Business logic & API calls
app/            13 files    Screens (10 main + 3 auth)
types/          1 file      All TypeScript definitions
contexts/       1 file      Auth state management
```

### Component Organization
```
components/
├── Cleaner-specific (7)     # CleanerDashboard, CleanerPropertyCard, etc.
├── Owner-specific (2)       # OwnerPropertyCard, etc.
├── Shared (9)              # NotificationBadge, RoleBasedWrapper, etc.
```

### Service Organization
```
services/
├── Core Business Logic (5)  # property, cleaningSession, cleaningUpdate
├── Infrastructure (3)       # notification, photoProof, realtime
```

### Screen Organization
```
app/
├── Dashboard (1)           # index.tsx (role-specific)
├── Main Screens (8)        # properties, schedule, team, etc.
├── Auth Screens (3)        # login, register, forgot-password
├── Special (1)             # onboarding.tsx
```

## 📦 Import Patterns

### Components
```typescript
// From components folder
import RoleBasedWrapper from '@/components/RoleBasedWrapper';
import CleanerPropertyCard from '@/components/CleanerPropertyCard';
import { NotificationBadge } from '@/components/NotificationBadge';
```

### Services
```typescript
// Individual service imports
import { propertyService } from '@/services/propertyService';
import { cleaningSessionService } from '@/services/cleaningSessionService';

// Or from index barrel export
import { propertyService, cleaningSessionService } from '@/services';
```

### Types
```typescript
// All types from single file
import { Property, CleaningSession, TeamMember } from '@/types';
import type { EnhancedProperty, CleaningUpdate } from '@/types';
```

### Contexts
```typescript
// Auth context
import { useAuth } from '@/contexts/AuthContext';
```

### React Native
```typescript
// Common UI imports
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
```

### Navigation
```typescript
// Expo Router
import { useRouter, useLocalSearchParams } from 'expo-router';
```

## 📝 Naming Conventions

### Components
**Format**: `[Role][Feature]Component.tsx`

**Examples:**
- `CleanerPropertyCard.tsx` - Property card for cleaners
- `OwnerPropertyCard.tsx` - Property card for owners
- `CleaningUpdates.tsx` - Generic (used by multiple roles)
- `RoleBasedWrapper.tsx` - Access control wrapper

**Rules:**
- PascalCase for component names
- File name matches component name exactly
- Descriptive of purpose and target user

### Services
**Format**: `[domain]Service.ts`

**Examples:**
- `propertyService.ts` - Property management
- `cleaningSessionService.ts` - Cleaning sessions
- `notificationService.ts` - Notification handling

**Rules:**
- camelCase for service exports
- Singular noun + "Service"
- One service per business domain

### Screens
**Format**: `[feature].tsx`

**Examples:**
- `properties.tsx` - `/properties` route
- `schedule.tsx` - `/schedule` route
- `auth/login.tsx` - `/auth/login` route

**Rules:**
- Lowercase with hyphens for multi-word
- File name determines route path
- One screen per file

### Types
**Format**: `PascalCase` interfaces

**Examples:**
- `Property` - Property entity
- `CleaningSession` - Cleaning session entity
- `TeamMember` - Team member entity

**Rules:**
- Interface for data structures
- Type for unions and aliases
- No `I` prefix (don't use `IProperty`)

## 🎨 Styling System

### Color Palette
```typescript
const colors = {
  // Primary
  primary: '#007AFF',           // Main brand color
  
  // Status colors
  success: '#10b981',           // Green for success
  warning: '#f59e0b',           // Orange for warnings
  error: '#ef4444',             // Red for errors
  
  // Text colors
  textPrimary: '#1f2937',       // Dark gray for primary text
  textSecondary: '#6b7280',     // Medium gray for secondary text
  textLight: '#9ca3af',         // Light gray for disabled text
  
  // Background colors
  background: '#f9fafb',        // App background
  cardBackground: '#ffffff',    // Card/container background
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  
  // Border colors
  border: '#e5e7eb',            // Standard border
  borderLight: '#f3f4f6',       // Light border
};
```

### Spacing System
```typescript
const spacing = {
  xs: 4,      // Extra small spacing
  sm: 8,      // Small spacing
  md: 12,     // Medium spacing
  lg: 16,     // Large spacing (default)
  xl: 24,     // Extra large spacing
  xxl: 32,    // Extra extra large spacing
};

// Usage in styles
padding: spacing.lg,           // 16px padding
marginBottom: spacing.md,      // 12px margin
```

### Border Radius
```typescript
const borderRadius = {
  small: 6,     // Small radius (buttons, inputs)
  medium: 8,    // Medium radius (small cards)
  large: 12,    // Large radius (main cards)
  round: 999,   // Fully rounded (avatars, badges)
};
```

### Shadow Styles
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
    elevation: 3,
  },
});
```

## 🧭 Navigation Routes

### Main Routes
```typescript
'/'               → index.tsx (Dashboard - role-specific)
'/properties'     → properties.tsx (Property management)
'/schedule'       → schedule.tsx (Cleaning schedules)
'/team'           → team.tsx (Team member management)
'/invoices'       → invoices.tsx (Financial management)
'/maintenance'    → maintenance.tsx (Maintenance tickets)
'/reports'        → reports.tsx (Performance reports)
'/profile'        → profile.tsx (User profile settings)
'/onboarding'     → onboarding.tsx (First-time setup)
```

### Auth Routes (Modals)
```typescript
'/auth/login'           → auth/login.tsx
'/auth/register'        → auth/register.tsx
'/auth/forgot-password' → auth/forgot-password.tsx
```

### Navigation Usage
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to route
router.push('/properties');

// Navigate with params
router.push('/properties?filter=active');

// Replace (no back button)
router.replace('/dashboard');

// Go back
router.back();
```

## 📘 TypeScript Patterns

### Component Props
```typescript
interface ComponentNameProps {
  // Required props
  data: EntityType;
  onPress: () => void;
  
  // Optional props
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  
  // Callbacks
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

### Service Methods
```typescript
export const domainService = {
  // Get data
  async getData(filters?: FilterType): Promise<EntityType[]> {
    // Implementation
  },
  
  // Create item
  async createItem(data: Omit<EntityType, 'id'>): Promise<EntityType> {
    // Implementation
  },
  
  // Update item
  async updateItem(id: string, updates: Partial<EntityType>): Promise<EntityType> {
    // Implementation
  },
  
  // Delete item
  async deleteItem(id: string): Promise<void> {
    // Implementation
  },
};
```

### Status Types
```typescript
// Common status unions
type SessionStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
type PropertyStatus = 'active' | 'occupied' | 'maintenance' | 'inactive';
type UserRole = 'property_owner' | 'cleaner' | 'co_host';
type NotificationPriority = 'urgent' | 'high' | 'normal';
```

### State Management
```typescript
// Local UI state
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<EntityType[]>([]);

// Auth context state
const { user, profile, loading } = useAuth();
```

## 🔧 Common Code Patterns

### Error Handling
```typescript
const handleAction = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const result = await someService.doSomething();
    
    // Success feedback
    Alert.alert('Success', 'Action completed');
    
  } catch (error) {
    console.error('Action failed:', error);
    const message = error.message || 'Something went wrong';
    Alert.alert('Error', message);
    setError(message);
  } finally {
    setLoading(false);
  }
};
```

### Loading States
```typescript
{loading ? (
  <ActivityIndicator size="large" color="#007AFF" />
) : (
  <ContentComponent data={data} />
)}

{loading && <Text style={styles.loading}>Loading...</Text>}
```

### Empty States
```typescript
{data.length === 0 && !loading && (
  <View style={styles.emptyState}>
    <Ionicons name="document-outline" size={48} color="#9ca3af" />
    <Text style={styles.emptyText}>No items found</Text>
  </View>
)}
```

### Role-Based Access
```typescript
import RoleBasedWrapper from '@/components/RoleBasedWrapper';

<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <FinancialDataComponent />
</RoleBasedWrapper>
```

## 📊 Business Rule Helpers

### Cleaning Window Validation
```typescript
const isWithinCleaningWindow = (time: string): boolean => {
  const hour = new Date(time).getHours();
  return hour >= 11 && hour < 15; // 11 AM - 3 PM
};
```

### Cancellation Notice Calculation
```typescript
const calculateNoticeHours = (scheduledTime: string): number => {
  const scheduled = new Date(scheduledTime);
  const now = new Date();
  const diffMs = scheduled.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
};

const isShortNotice = (hours: number): boolean => hours < 24;
```

### Linen Scaling
```typescript
const calculateLinenRequirements = (guestCount: number): LinenRequirement => ({
  towels_bath: guestCount,
  towels_hand: guestCount,
  pillow_cases: guestCount * 2,
  kitchen_towels: 2,
  bath_mats: 1,
});
```

---

**Pro Tip**: Bookmark this file for instant access to common patterns during development!
