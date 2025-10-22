# App Directory

This directory contains the **Expo Router** file-based routing structure for the Airbnb property management app.

## Structure

### Root Files
- `_layout.tsx` - Root layout with providers (GluestackUIProvider, QueryClient, etc.)
- `index.tsx` - Home/dashboard screen (main entry point)

### Authentication Group
- `auth/login.tsx` - User login screen
- `auth/register.tsx` - User registration screen  
- `auth/forgot-password.tsx` - Password reset screen

### Main App Screens
- `properties.tsx` - Property management screen
- `schedule.tsx` - Cleaning schedule screen
- `team.tsx` - Team management screen
- `maintenance.tsx` - Maintenance requests screen
- `invoices.tsx` - Invoice management screen
- `reports.tsx` - Analytics and reports screen
- `profile.tsx` - User profile screen
- `onboarding.tsx` - First-time user onboarding

## Routing Convention

- **File path = Route path** - `app/properties.tsx` → `/properties`
- **Groups** - `(auth)` creates route groups without affecting URL structure
- **Dynamic routes** - Use `[id].tsx` for dynamic parameters
- **Layouts** - `_layout.tsx` files create nested layouts

## Navigation

Use `expo-router` for navigation, not `react-navigation` directly:

```typescript
import { router } from 'expo-router';

// Navigate to a screen
router.push('/properties');

// Navigate with parameters
router.push({
  pathname: '/properties/[id]',
  params: { id: '123' }
});

// Replace current screen
router.replace('/login');

// Go back
router.back();
```

## Screen Structure

Each screen should follow this pattern:

```typescript
import { View } from 'react-native';
import { VStack, Heading } from '@gluestack-ui/themed';

export default function ScreenName() {
  return (
    <VStack flex={1} p="$4">
      <Heading size="xl">Screen Title</Heading>
      {/* Screen content */}
    </VStack>
  );
}
```

## Layout Hierarchy

```
app/
├── _layout.tsx          # Root layout (providers)
├── index.tsx            # Home screen
├── (auth)/              # Auth group
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
└── [screen].tsx         # Individual screens
```

## Best Practices

1. **Use Gluestack UI components** for all UI elements
2. **Implement proper TypeScript types** for all props and data
3. **Handle loading and error states** appropriately
4. **Use TanStack Query** for data fetching
5. **Follow the established patterns** from `.cursor/rules/`
6. **Keep screens focused** - one main purpose per screen
7. **Use proper navigation patterns** - avoid deep nesting
