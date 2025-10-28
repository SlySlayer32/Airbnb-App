---
applyTo: 'app/**'
description: 'Expo Router navigation patterns, routing, and screen layout guidelines'
---

# Navigation & Routing Guidelines

## Expo Router Fundamentals

### File-based routing

```
app/
  _layout.tsx              → Root layout (wraps all screens)
  index.tsx                → / (home screen)
  properties.tsx           → /properties
  schedule.tsx             → /schedule
  properties/
    [id].tsx               → /properties/:id (dynamic route)
    _layout.tsx            → Layout for properties/* routes
  auth/
    _layout.tsx            → Modal presentation
    login.tsx              → /auth/login (modal)
    register.tsx           → /auth/register (modal)
  (tabs)/
    _layout.tsx            → Tab navigator
    home.tsx               → Tab route
    profile.tsx            → Tab route
```

### Route mapping

- **File path** = **Route path**
- `app/properties.tsx` → `/properties`
- `app/properties/[id].tsx` → `/properties/:id`
- `app/(tabs)/home.tsx` → `/home` (inside tab group)
- `app/auth/login.tsx` → `/auth/login`

## Navigation API

### Router methods

```typescript
import { router } from 'expo-router';

// Navigate forward (push to stack)
router.push('/properties');
router.push('/properties/123');
router.push({
  pathname: '/properties/[id]',
  params: { id: '123' },
});

// Replace current screen (no back)
router.replace('/home');
router.replace('/auth/login');

// Navigate back
router.back();

// Check if can go back
if (router.canGoBack()) {
  router.back();
}

// Navigate to specific route in stack
router.dismiss(); // Close modal
router.dismissAll(); // Close all modals

// Set params for current route
router.setParams({ filter: 'active' });
```

### Navigation with params

```typescript
// Passing params
router.push({
  pathname: '/properties/[id]/edit',
  params: {
    id: property.id,
    mode: 'edit'
  }
});

// Receiving params in screen
import { useLocalSearchParams } from 'expo-router';

export default function PropertyDetailScreen() {
  const { id, mode } = useLocalSearchParams<{
    id: string;
    mode?: string
  }>();

  return (
    <View>
      <Text>Property ID: {id}</Text>
      {mode === 'edit' && <EditForm />}
    </View>
  );
}
```

## Layout Patterns

### Root layout (\_layout.tsx)

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@/gluestack-ui.config';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <AuthProvider>
        <AuthGuard>
          <Stack
            screenOptions={{
              headerShown: false, // Hide default header
              contentStyle: { backgroundColor: 'white' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="properties" />
            <Stack.Screen
              name="auth"
              options={{
                presentation: 'modal',
                headerShown: false
              }}
            />
          </Stack>
        </AuthGuard>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
```

### Nested layouts

```typescript
// app/properties/_layout.tsx
import { Stack } from 'expo-router';

export default function PropertiesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#f5f5f5' },
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Properties' }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: 'Property Details' }}
      />
    </Stack>
  );
}
```

### Tab navigation

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Icon } from '@gluestack-ui/themed';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon as={HomeIcon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, size }) => (
            <Icon as={CalendarIcon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon as={UserIcon} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
```

## Modal Screens

### Modal presentation

```typescript
// app/_layout.tsx
<Stack>
  <Stack.Screen
    name="auth"
    options={{
      presentation: 'modal',
      headerShown: true,
      title: 'Sign In',
    }}
  />
  <Stack.Screen
    name="filters"
    options={{
      presentation: 'modal',
      headerShown: true,
      title: 'Filters',
    }}
  />
</Stack>

// Opening modal
router.push('/auth/login');

// Closing modal
router.back(); // or router.dismiss();
```

### Full-screen modals

```typescript
<Stack.Screen
  name="camera"
  options={{
    presentation: 'fullScreenModal',
    headerShown: false,
    animation: 'slide_from_bottom',
  }}
/>
```

## Navigation Guards

### Auth guard pattern

```typescript
// components/AuthGuard.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useSegments, router } from 'expo-router';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // Redirect to home if already authenticated
      router.replace('/');
    }
  }, [user, segments, isLoading]);

  return <>{children}</>;
}
```

### Role-based routing

```typescript
function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { profile } = useAuth();

  useEffect(() => {
    if (profile && profile.role !== requiredRole) {
      router.replace('/unauthorized');
    }
  }, [profile, requiredRole]);

  if (profile?.role !== requiredRole) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
```

## Screen Options

### Dynamic screen options

```typescript
// Set options from screen component
import { Stack } from 'expo-router';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const property = useProperty(id);

  return (
    <>
      <Stack.Screen
        options={{
          title: property?.name || 'Property',
          headerRight: () => (
            <Button onPress={handleEdit}>Edit</Button>
          ),
        }}
      />
      <View>{/* Screen content */}</View>
    </>
  );
}
```

### Custom headers

```typescript
<Stack.Screen
  name="properties"
  options={{
    headerShown: true,
    header: () => <CustomHeader />,
  }}
/>

function CustomHeader() {
  return (
    <Box bg="$primary500" p="$4" safeAreaTop>
      <HStack justifyContent="space-between" alignItems="center">
        <Text color="white" fontSize="$xl" fontWeight="bold">
          Properties
        </Text>
        <HamburgerMenuButton />
      </HStack>
    </Box>
  );
}
```

## Deep Linking

### Configure deep links

```json
// app.json
{
  "expo": {
    "scheme": "airbnbapp",
    "web": {
      "bundler": "metro"
    }
  }
}
```

### Handle deep links

```typescript
// Opens: airbnbapp://properties/123
// Or: https://airbnbapp.com/properties/123

// Navigation automatically handled by Expo Router
// Just ensure route exists: app/properties/[id].tsx

// Custom handling if needed
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

useEffect(() => {
  const handleDeepLink = (event: { url: string }) => {
    const { path, queryParams } = Linking.parse(event.url);
    // Custom logic
  };

  Linking.addEventListener('url', handleDeepLink);
  return () => Linking.removeEventListener('url', handleDeepLink);
}, []);
```

## Navigation Patterns

### Drawer navigation

```typescript
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: '#3B82F6',
        drawerInactiveTintColor: '#6B7280',
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Icon as={HomeIcon} color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
```

### Programmatic drawer control

```typescript
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

function HamburgerButton() {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return <Button onPress={openDrawer}>Menu</Button>;
}
```

## Error Handling

### Not found (404) screen

```typescript
// app/+not-found.tsx
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <Text fontSize="$2xl">404 - Page Not Found</Text>
      <Link href="/" asChild>
        <Button mt="$4">Go Home</Button>
      </Link>
    </Box>
  );
}
```

### Error boundaries per route

```typescript
// app/_layout.tsx
import { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack />
    </ErrorBoundary>
  );
}
```

## Best Practices

### ✅ Do this

```typescript
// Use router from expo-router
import { router } from 'expo-router';
router.push('/properties');

// Type-safe params
const { id } = useLocalSearchParams<{ id: string }>();

// Declarative screen options
<Stack.Screen options={{ title: 'My Screen' }} />

// Handle back navigation
if (router.canGoBack()) {
  router.back();
} else {
  router.replace('/');
}
```

### ❌ Avoid this

```typescript
// Don't use react-navigation directly
import { useNavigation } from '@react-navigation/native';

navigation.navigate('Properties'); // Type-unsafe, breaks with Expo Router

// Don't manipulate URL directly on native
window.location.href = '/properties'; // Web-only

// Don't rely on navigation state for data
// Use proper state management instead
```

## Navigation Testing

### Test navigation behavior

```typescript
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

it('should navigate to property details', () => {
  render(<PropertyCard property={mockProperty} />);

  fireEvent.press(screen.getByTestId('property-card'));

  expect(router.push).toHaveBeenCalledWith('/properties/123');
});
```

## Performance Considerations

### Lazy load heavy screens

```typescript
// For very heavy screens (rarely needed)
const HeavyScreen = lazy(() => import('./HeavyScreen'));

export default function ScreenWrapper() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HeavyScreen />
    </Suspense>
  );
}
```

### Optimize screen transitions

```typescript
<Stack.Screen
  options={{
    animation: 'fade', // or 'slide_from_right', 'slide_from_bottom'
    animationDuration: 200,
  }}
/>
```

## Navigation Checklist

- [ ] All screens have proper routes in app/ directory
- [ ] Dynamic routes use [param] syntax
- [ ] Modal screens use modal presentation
- [ ] Auth guard protects authenticated routes
- [ ] Deep links configured in app.json
- [ ] 404 screen created (+not-found.tsx)
- [ ] Navigation uses router API (not react-navigation directly)
- [ ] Params are type-safe with useLocalSearchParams
- [ ] Back navigation handled gracefully
- [ ] Screen options set appropriately (titles, headers)
