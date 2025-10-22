# Tech Stack Reference

## Core Framework

### React Native & Expo
- **React Native 0.81.4** - Cross-platform mobile development
- **Expo 54** - Managed workflow with Expo Router
- **React 19.1** - Latest stable version
- **TypeScript 5.9** - Strict mode, no enums, prefer interfaces

### Navigation & Routing
- **Expo Router 6.0** - File-based routing (primary)
- **React Navigation 7.1** - Underlying navigation library
- Deep linking, universal links, and URL parameters

## State Management

### Global State - Zustand
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppStore {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Server State - TanStack Query
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});
```

## UI & Styling

### Component Library
- **Gluestack UI 1.1** - Universal, accessible component library
- **NativeWind 4.1** - Tailwind CSS for React Native (primary styling)
- **Tailwind CSS 3.4** - Configuration and theming

### Animations & Gestures
- **React Native Reanimated 4.1** - High-performance animations
- **Moti 0.29** - Declarative animations on Reanimated
- **React Native Gesture Handler 2.28** - Native gesture interactions
- **Lottie React Native 7.4** - JSON-based animations

### UI Components
- **@gorhom/bottom-sheet 5.2** - Smooth bottom sheets
- **React Native SVG 15.9** - Vector graphics
- **React Native Toast Message 2.2** - Toast notifications
- **Expo Image 3.0** - Optimized image loading

## Forms & Validation

### Form Handling
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

function SignupScreen() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignupForm) => {
    // Handle submission
  };
}
```

## Data & Backend

### Backend Services
- **Supabase 2.49** - Backend-as-a-Service (auth, database, storage, realtime)
- **TanStack Query 5.64** - Server state management and caching
- **React Native MMKV 3.1** - Fast key-value storage (alternative to AsyncStorage)
- **@react-native-community/netinfo 12.0** - Network state monitoring

### Supabase Integration
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

## Performance & Optimization

### List Rendering
- **@shopify/flash-list 1.7** - High-performance list (replaces FlatList)
- **React Native Worklets 0.5** - JavaScript worklets for animations

### App Performance
- **Expo Splash Screen** - Native splash screen handling
- **Expo Updates** - OTA updates

### Image Optimization
```typescript
import { Image } from 'expo-image';

function OptimizedImage({ uri, aspectRatio }: Props) {
  return (
    <Image
      source={{ uri }}
      placeholder={{ blurhash: 'L6PZfSjE.AyE_3t7t7R4~qnhF6IU' }}
      contentFit="cover"
      transition={200}
      style={{ width: '100%', aspectRatio }}
      cachePolicy="memory-disk"
      priority="high"
    />
  );
}
```

## Security & Storage

### Secure Storage
- **Expo Secure Store** - Encrypted key-value storage
- **Expo Local Authentication** - Biometric authentication
- **Expo Crypto** - Cryptographic functions
- **React Native MMKV** - Encrypted fast storage

### Security Implementation
```typescript
import * as SecureStore from 'expo-secure-store';

export async function storeToken(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getToken(key: string) {
  return await SecureStore.getItemAsync(key);
}

export async function deleteToken(key: string) {
  await SecureStore.deleteItemAsync(key);
}
```

## Developer Experience

### Error Tracking & Monitoring
- **Sentry React Native 6.5** - Error tracking and performance monitoring
- **Expo Constants** - Environment variables and configuration

### Testing Stack
- **Detox 20.29** - E2E testing framework
- **Jest 29.7** + React Native Testing Library - Unit/integration testing
- **ESLint 8.56** + Prettier 3.4** - Code quality and formatting
- **Husky 9.1** + lint-staged 15.3** - Git hooks and pre-commit checks
- **Commitlint** - Conventional commit messages

### Development Tools
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/react-native';

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    enabled: !__DEV__,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.ReactNativeTracing({
        tracingOrigins: ['localhost', /^\//],
        routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
      }),
    ],
  });
}
```

## Internationalization

### i18n Setup
- **i18n-js 4.4** + **expo-localization 18.0** - Multi-language support
- **date-fns 4.1** - Date formatting and manipulation

```typescript
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { en, es, fr } from './translations';

export const i18n = new I18n({
  en,
  es,
  fr,
});

i18n.locale = Localization.locale;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
```

## Package Versions

### Core Dependencies
```json
{
  "expo": "54.0.13",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "typescript": "~5.9.2",
  "@gluestack-ui/themed": "^1.1.63",
  "nativewind": "^4.1.23",
  "react-native-reanimated": "~4.1.0",
  "react-native-gesture-handler": "~2.28.0",
  "@tanstack/react-query": "^5.64.2",
  "zustand": "^5.0.2",
  "@supabase/supabase-js": "^2.49.4",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1",
  "@shopify/flash-list": "^1.7.3",
  "react-native-mmkv": "^3.1.0"
}
```

### Development Dependencies
```json
{
  "@typescript-eslint/eslint-plugin": "^8.20.0",
  "@typescript-eslint/parser": "^8.20.0",
  "eslint": "^8.56.0",
  "eslint-config-expo": "~10.0.0",
  "prettier": "^3.4.2",
  "jest": "^29.7.0",
  "detox": "^20.29.1",
  "husky": "^9.1.7",
  "lint-staged": "^15.3.0"
}
```

## Configuration Files

### Metro Config
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      drop_console: !__DEV__,
    },
  },
};

module.exports = config;
```

### Babel Config
```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'nativewind/babel',
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

### TypeScript Config
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```
