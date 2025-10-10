# ⚡ Quick Reference Sheet

> Fast lookup for common commands, patterns, imports, and standards

## 📋 Table of Contents
- [Common Commands](#common-commands)
- [Project Structure](#project-structure)
- [Import Patterns](#import-patterns)
- [Naming Conventions](#naming-conventions)
- [Styling System](#styling-system)
- [Navigation Routes](#navigation-routes)

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

## 📁 Project Structure

### Folders by File Count
```
components/     18 files    Reusable UI components
services/       8 files     Business logic & API calls
app/            13 files    Screens (10 main + 3 auth)
types/          1 file      All TypeScript definitions
contexts/       1 file      Auth state management
```

## 📦 Import Patterns

### Components
```typescript
import ComponentName from '@/components/ComponentName';
import { RoleBasedWrapper } from '@/components/RoleBasedWrapper';
```

### Services
```typescript
import { propertyService } from '@/services/propertyService';
import { cleaningSessionService } from '@/services/cleaningSessionService';

// Or from barrel export
import { propertyService, cleaningSessionService } from '@/services';
```

### Types
```typescript
import { Property, CleaningSession, TeamMember } from '@/types';
import type { EnhancedProperty, DashboardMetadata } from '@/types';
```

### React Native
```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
```

### Navigation
```typescript
import { useRouter, useLocalSearchParams } from 'expo-router';
```

## 📝 Naming Conventions

### Components
`CleanerPropertyCard.tsx` (PascalCase)

### Services
`cleaningSessionService.ts` (camelCase + Service)

### Screens
`properties.tsx` (lowercase)

### Functions
`getUserData()` (camelCase)

### Types
`CleaningSession` (PascalCase, no 'I' prefix)

## 🎨 Styling System

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

### Standard Card
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

```
'/'               → index.tsx (Dashboard)
'/properties'     → properties.tsx
'/schedule'       → schedule.tsx
'/team'           → team.tsx
'/invoices'       → invoices.tsx
'/maintenance'    → maintenance.tsx
'/reports'        → reports.tsx
'/profile'        → profile.tsx
'/onboarding'     → onboarding.tsx
'/auth/login'     → auth/login.tsx
```

## 📘 Common Patterns

### Error Handling
```typescript
try {
  setLoading(true);
  const result = await service.doSomething();
  Alert.alert('Success', 'Action completed');
} catch (error) {
  console.error('Error:', error);
  Alert.alert('Error', 'Something went wrong');
} finally {
  setLoading(false);
}
```

### Loading State
```typescript
{loading ? (
  <ActivityIndicator size="small" color="#007AFF" />
) : (
  <Content />
)}
```

### Empty State
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
<RoleBasedWrapper allowedRoles={['property_owner']}>
  <AdminComponent />
</RoleBasedWrapper>
```

---

**Pro Tip**: Bookmark this file for instant access to common patterns during development!

