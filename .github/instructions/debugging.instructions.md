---
applyTo: '**'
description: 'Debugging strategies, common issues, logging patterns, and troubleshooting guide'
---

# Debugging & Troubleshooting Guide

## Development Tools

### React Native Debugger

```bash
# Enable remote debugging (deprecated but still useful)
# Shake device or press Cmd+D (iOS) / Cmd+M (Android)
# Select "Debug" from menu

# Better: Use Flipper (recommended)
npx react-native-flipper
```

### Flipper Setup

```bash
# Install Flipper desktop app
# https://fbflipper.com/

# Features:
# - Network inspector
# - React DevTools
# - Layout inspector
# - Logs viewer
# - Redux DevTools (if using Redux)
```

### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Expo",
      "type": "reactnative",
      "request": "attach",
      "program": "${workspaceFolder}/.expo/launchReactNative.js"
    },
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Logging Strategies

### Structured logging

```typescript
// utils/logger.ts
export const logger = {
  debug: (message: string, data?: any) => {
    if (__DEV__) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);

    // Send to error tracking service (Sentry, etc.)
    if (!__DEV__) {
      // trackError(message, error);
    }
  },
};

// Usage
logger.info('User logged in', { userId: user.id });
logger.error('Failed to fetch properties', error);
```

### Debugging service calls

```typescript
export const propertyService = {
  async getProperties(filters?: PropertyFilters) {
    logger.debug('Fetching properties', { filters });

    try {
      const result = await supabase.from('properties').select('*');
      logger.debug('Properties fetched', {
        count: result.data?.length,
        filters,
      });
      return result.data;
    } catch (error) {
      logger.error('Failed to fetch properties', { error, filters });
      throw error;
    }
  },
};
```

### Network request logging

```typescript
// Log all Supabase requests in dev
if (__DEV__) {
  const originalFrom = supabase.from.bind(supabase);
  supabase.from = (table: string) => {
    console.log(`[SUPABASE] Query: ${table}`);
    return originalFrom(table);
  };
}
```

## Common Issues & Solutions

### Metro bundler issues

**Symptom:** "Cannot find module" or cached files

```bash
# Solution: Clear Metro cache
npx expo start --clear

# Or manually
rm -rf node_modules/.cache
rm -rf .expo
npx expo start
```

**Symptom:** Metro won't start

```bash
# Kill Metro process
# Windows
taskkill /F /IM node.exe

# macOS/Linux
killall -9 node

# Restart
npx expo start
```

### TypeScript path resolution

**Symptom:** `@/components/*` imports not working

```typescript
// Check tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

// Check babel.config.js
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
        },
      },
    ],
  ],
};

// Check metro.config.js has proper resolver
```

### Navigation issues

**Symptom:** Navigation not working, "undefined is not a function"

```typescript
// ❌ Don't use react-navigation directly

// ✅ Use expo-router
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

router.push('/properties');

// Check _layout.tsx has proper Stack setup
```

**Symptom:** "Cannot read property 'navigate'"

```typescript
// Ensure component is within navigation context
// Check that _layout.tsx wraps the app
```

### Supabase connection issues

**Symptom:** "Invalid API key" or network errors

```typescript
// 1. Check environment variables loaded
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);

// 2. Check .env file exists and formatted correctly
EXPO_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

// 3. Restart dev server after .env changes
npx expo start --clear

// 4. Check network connectivity
try {
  const { data, error } = await supabase.from('properties').select('*');
  console.log('Supabase connection:', error ? 'FAILED' : 'SUCCESS');
} catch (error) {
  console.error('Network error:', error);
}
```

### State update issues

**Symptom:** Component not re-rendering after state change

```typescript
// ❌ Mutating state
const [items, setItems] = useState([]);
items.push(newItem); // Mutation!

// ✅ Create new array
setItems([...items, newItem]);
setItems(items.concat(newItem));

// For objects
setUser({ ...user, name: 'New Name' });
```

**Symptom:** Stale state in callbacks

```typescript
// ❌ Using stale state
const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1); // Always uses initial count
  }, 1000);
  return () => clearInterval(interval);
}, []); // Missing dependency

// ✅ Use functional update
setCount(prev => prev + 1);

// Or include in dependencies
}, [count]);
```

### Performance issues

**Symptom:** Slow list rendering

```typescript
// ❌ Using map for long lists
{items.map(item => <ItemCard key={item.id} item={item} />)}

// ✅ Use FlatList
<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <ItemCard item={item} />}
  removeClippedSubviews
  maxToRenderPerBatch={10}
/>
```

**Symptom:** Unnecessary re-renders

```typescript
// Use React DevTools Profiler
// Wrap components with memo
export const PropertyCard = memo(function PropertyCard(props) {
  // ...
});

// Memoize callbacks
const handlePress = useCallback(() => {
  router.push(`/properties/${property.id}`);
}, [property.id]);

// Memoize expensive computations
const sortedProperties = useMemo(
  () => properties.sort((a, b) => a.name.localeCompare(b.name)),
  [properties]
);
```

### Platform-specific issues

**Symptom:** Works on iOS but not Android (or vice versa)

```typescript
import { Platform } from 'react-native';

// Check platform-specific code
if (Platform.OS === 'ios') {
  // iOS-specific
} else if (Platform.OS === 'android') {
  // Android-specific
}

// Check permissions
// Android might need additional AndroidManifest.xml entries
// iOS might need Info.plist entries
```

**Symptom:** Different layout on web vs native

```typescript
// Use Platform.select for cross-platform styles
const styles = {
  container: {
    ...Platform.select({
      web: {
        maxWidth: 1200,
        margin: '0 auto',
      },
      default: {
        flex: 1,
      },
    }),
  },
};
```

## Debugging Workflows

### Debugging service layer

```typescript
// Add console logs at key points
export async function startSession(propertyId: string) {
  console.log('1. Starting session for property:', propertyId);

  const property = await propertyService.getPropertyById(propertyId);
  console.log('2. Property retrieved:', property);

  if (!property) {
    console.log('3. Property not found, throwing error');
    throw new Error('Property not found');
  }

  console.log('4. Creating session record');
  const session = await createSessionRecord(property);
  console.log('5. Session created:', session);

  return session;
}
```

### Debugging component rendering

```typescript
// Use console.log in render
export function PropertyCard({ property }: PropertyCardProps) {
  console.log('PropertyCard render:', property.id);

  useEffect(() => {
    console.log('PropertyCard mounted:', property.id);
    return () => console.log('PropertyCard unmounted:', property.id);
  }, []);

  return <View>...</View>;
}

// Or use React DevTools to inspect component tree
```

### Debugging realtime subscriptions

```typescript
export function subscribeToSession(sessionId: string) {
  console.log('Subscribing to session:', sessionId);

  const channel = supabase
    .channel(`session-${sessionId}`)
    .on('postgres_changes', { table: 'cleaning_sessions' }, (payload) => {
      console.log('Realtime update received:', payload);
    })
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  return channel;
}
```

## Error Tracking

### Setup Sentry (example)

```typescript
// app/_layout.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  enableAutoSessionTracking: true,
  tracesSampleRate: 1.0,
});

// Wrap error boundaries
<Sentry.ErrorBoundary fallback={ErrorFallback}>
  <App />
</Sentry.ErrorBoundary>

// Manual error tracking
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { operation: 'startSession' },
    extra: { propertyId, userId },
  });
  throw error;
}
```

## Testing in Different Environments

### iOS Simulator debugging

```bash
# Open React DevTools
npx react-devtools

# View logs
# Xcode -> Open Developer Tool -> Console

# Common iOS issues:
# - Check Info.plist for permissions
# - Check App Transport Security settings
# - Verify provisioning profiles
```

### Android Emulator debugging

```bash
# View logs
adb logcat

# Filter React Native logs
adb logcat *:S ReactNative:V ReactNativeJS:V

# Common Android issues:
# - Check AndroidManifest.xml for permissions
# - Verify keystore for release builds
# - Check Gradle configuration
```

### Web debugging

```bash
# Use browser DevTools
# Cmd+Option+I (Mac) / F12 (Windows)

# Check:
# - Console for errors
# - Network tab for failed requests
# - React DevTools extension
# - Redux DevTools (if using Redux)
```

## Debugging Checklist

When encountering an issue:

- [ ] Check console for error messages
- [ ] Verify environment variables are loaded
- [ ] Clear Metro cache (`npx expo start --clear`)
- [ ] Check network connectivity
- [ ] Verify Supabase connection
- [ ] Check TypeScript errors (`npm run type-check`)
- [ ] Check ESLint warnings (`npm run lint`)
- [ ] Test on different platforms (iOS/Android/Web)
- [ ] Check if issue exists in production build
- [ ] Review recent code changes (git diff)
- [ ] Search GitHub issues for similar problems
- [ ] Add strategic console.logs
- [ ] Use React DevTools to inspect component state
- [ ] Check for state mutation
- [ ] Verify dependencies are up to date

## Getting Help

### Before asking for help, gather:

1. Error message (full stack trace)
2. Steps to reproduce
3. Platform (iOS/Android/Web)
4. Expo version (`expo --version`)
5. Node version (`node --version`)
6. Relevant code snippets
7. What you've already tried

### Where to ask:

- GitHub Issues (project-specific)
- Expo Forums
- React Native Discord
- Stack Overflow (tag: react-native, expo)

### Creating a minimal reproduction:

```bash
# Create minimal repro with Snack
# https://snack.expo.dev

# Or create new Expo app
npx create-expo-app debug-issue
# Add minimal code to reproduce issue
```
