---
applyTo: '**'
description: 'Project context and coding guidelines for AI agents working in this Expo Router + React Native + Supabase app'
---

# Copilot instructions for Airbnb-App

Purpose: make AI agents productive fast in this Expo + React Native + TypeScript project by capturing the actual patterns used here.

## 📚 Specialized Instruction Files

This project uses **modular instruction files** that automatically apply based on file context:

| Instruction File                       | Applies To                       | Purpose                                        |
| -------------------------------------- | -------------------------------- | ---------------------------------------------- |
| **security.instructions.md**           | All files                        | Auth, RLS, input validation, secure storage    |
| **database.instructions.md**           | services/_, supabase/_, types/\* | Schema, queries, RLS policies, relationships   |
| **testing.instructions.md**            | Tests & test config              | Unit tests, E2E, mocking, coverage             |
| **components.instructions.md**         | components/\*\*                  | UI patterns, Gluestack UI, composition         |
| **navigation-routing.instructions.md** | app/\*\*                         | Expo Router, navigation, modals                |
| **services-layer.instructions.md**     | services/\*\*                    | Business logic, error handling, TanStack Query |
| **git-workflow.instructions.md**       | All files                        | Commits, branches, PR guidelines               |
| **debugging.instructions.md**          | All files                        | Tools, logging, common issues                  |
| **platform-specific.instructions.md**  | All files                        | iOS/Android/Web differences                    |
| **code-review.instructions.md**        | All files                        | Review standards, approval criteria            |
| **deployment.instructions.md**         | Build configs                    | EAS builds, releases, versioning               |

**💡 Tip:** When working on a specific type of file, the relevant specialized instructions are automatically available to provide deeper context.

## Directory map quick reference

Complete directory structure with purpose and key files:

| Directory     | Purpose                                  | Key Files                                                                           | When to Touch                                   |
| ------------- | ---------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------- |
| `app/`        | Expo Router screens (file-based routing) | `_layout.tsx` (providers + auth), `index.tsx` (home), `auth/*.tsx` (modals)         | Adding screens, changing navigation structure   |
| `components/` | Reusable UI components (Gluestack UI)    | `CleanerDashboard.tsx`, `OwnerDashboard.tsx`, `PropertyCard.tsx`, `README.md`       | Building/modifying UI, adding shared components |
| `services/`   | Business logic + Supabase integration    | `cleaningSessionService.ts`, `propertyService.ts`, `realtimeService.ts`, `index.ts` | Adding features, DB operations, realtime events |
| `contexts/`   | React contexts for global state          | `AuthContext.tsx` (auth + demo mode)                                                | Managing auth, adding global state              |
| `types/`      | TypeScript type definitions              | `index.ts` (all domain types)                                                       | Defining/modifying data structures              |
| `utils/`      | Cross-cutting utilities                  | `supabase.ts` (client setup)                                                        | Platform-specific code, shared helpers          |
| `constants/`  | App-wide constants                       | `componentLibrary.ts`                                                               | Configuration, static data                      |
| `data/`       | Mock data for demo mode                  | `mockData.ts`, `mockEnhancedData.ts`, `mockProfiles.ts`                             | Testing without Supabase, demo features         |
| `assets/`     | Static assets (fonts, images)            | `fonts/`, `images/`                                                                 | Adding images, fonts                            |
| `hooks/`      | Custom React hooks (future)              | TanStack Query hooks                                                                | Adding data fetching patterns                   |
| `e2e/`        | End-to-end tests (Detox)                 | `config.json`, `init.js`                                                            | Writing E2E tests                               |
| `scripts/`    | Build/maintenance scripts                | `fix-dependencies.js`, `README.md`                                                  | Automation, tooling issues                      |
| `shims/`      | Polyfills for Node.js APIs               | `node-fetch.js`                                                                     | Cross-platform compatibility                    |
| `supabase/`   | Database migration/setup files           | SQL schemas                                                                         | Database structure changes                      |

## Navigation cheat sheet

### Expo Router patterns

```typescript
import { router } from 'expo-router';

// Navigate to a screen
router.push('/properties'); // Stack navigation
router.replace('/auth/login'); // Replace current screen
router.back(); // Go back

// Navigate with params
router.push('/properties/123'); // Dynamic route [id].tsx
router.push({
  pathname: '/properties/[id]',
  params: { id: '123' },
});

// Modal routes (auth group)
router.push('/auth/login'); // Opens as modal
```

### File path → Route mapping

- `app/index.tsx` → `/`
- `app/properties.tsx` → `/properties`
- `app/properties/[id].tsx` → `/properties/:id`
- `app/auth/login.tsx` → `/auth/login` (modal)
- `app/(tabs)/schedule.tsx` → `/schedule` (if using tab groups)

### Navigation guards

- `AuthGuard` in `app/_layout.tsx` handles unauthenticated redirects
- Demo mode bypasses auth checks (see `AuthContext`)

## Service boundaries and data flows

### Service layer architecture

```
┌─────────────────────────────────────────────────┐
│  UI Layer (Screens + Components)                │
│  - app/*.tsx                                    │
│  - components/*.tsx                             │
└────────────┬────────────────────────────────────┘
             │ Uses hooks (TanStack Query)
             ↓
┌─────────────────────────────────────────────────┐
│  Service Layer (Business Logic)                 │
│  - services/*.ts                                │
│  - Validations, transformations, workflows      │
└────────────┬────────────────────────────────────┘
             │ Calls Supabase client
             ↓
┌─────────────────────────────────────────────────┐
│  Data Layer (Supabase)                          │
│  - utils/supabase.ts (client)                   │
│  - Database tables, RLS, realtime channels      │
└─────────────────────────────────────────────────┘
             ↑
             │ Realtime updates flow back via
┌────────────┴────────────────────────────────────┐
│  realtimeService.ts                             │
│  - Subscribes to channels                       │
│  - Broadcasts to UI via callbacks               │
└─────────────────────────────────────────────────┘
```

### Service responsibilities

| Service                     | Owns                                                                                      | Never Does                           |
| --------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| `cleaningSessionService.ts` | Session lifecycle (start/pause/resume/complete), validation, time windows, break tracking | Direct UI state, navigation          |
| `propertyService.ts`        | Property CRUD, filtering, assignment logic                                                | Session management                   |
| `realtimeService.ts`        | Supabase channel subscriptions, reconnection, event broadcasting                          | Business logic, data transformations |
| `notificationService.ts`    | Push notifications, badge counts, permissions                                             | Session state changes                |
| `photoProofService.ts`      | Photo upload, validation, proof requirements                                              | Session completion logic             |
| `cleaningUpdateService.ts`  | Activity logging, update creation                                                         | Session state mutations              |
| `dashboardLayoutService.ts` | Layout persistence, widget configuration                                                  | Data fetching                        |
| `bannerStateService.ts`     | Banner visibility logic, state management                                                 | Session operations                   |

### Cross-service communication

- Services communicate through returned data (no direct imports between domain services)
- Shared utilities in `utils/`
- Shared types in `types/index.ts`
- Event-driven via `realtimeService` for cross-component updates

## Query key conventions

When using TanStack Query (future hooks), follow these patterns:

```typescript
// Property queries
['properties'][('properties', propertyId)][('properties', 'active')][ // All properties list // Single property detail // Filtered properties
  ('properties', userId, 'assigned')
][ // User-specific properties
  // Session queries
  ('sessions', 'active')
][('sessions', sessionId)][('sessions', cleanerId, 'today')][ // Active sessions // Single session // Cleaner's today sessions
  // Realtime subscriptions
  ('realtime', 'sessions', sessionId)
][('realtime', 'updates', sessionId)]; // Realtime session updates // Realtime activity feed

// Invalidation patterns
queryClient.invalidateQueries(['properties']); // All properties
queryClient.invalidateQueries(['sessions', cleanerId]); // User sessions
```

**Key principles:**

- First element = entity type (`properties`, `sessions`, `team`)
- Specific before general (invalidate broadly, query specifically)
- Include user/filter context in keys for proper cache isolation

## Architecture (what goes where)

### Routing layer

- **Location:** `app/` (file-based routing via Expo Router)
- **Root setup:** `app/_layout.tsx` wires `AuthProvider`, `GluestackUIProvider`, and `AuthGuard`
- **Auth flow:** `AuthProvider` + `AuthGuard` handle redirects and demo mode
- **Modal routes:** `app/auth/` group for authentication screens
- **Navigation:** Use `router.push('/path')` from `expo-router` (never react-navigation directly)
- **New screens:** Add `app/<name>.tsx`; adjust Stack options in `_layout.tsx` only if custom headers needed

### UI layer

- **Location:** `components/` (reusable components)
- **Design system:** Gluestack UI with theme tokens from `gluestack-ui.config.ts`
- **Styling:** Use theme tokens (e.g., `$primary500`, `$textLight700`) over hard-coded colors
- **Component patterns:** Composition over inheritance; pass data down, callbacks up
- **Testing:** Wrap with `GluestackUIProvider` in tests (see `components/README.md`)

### Business logic layer

- **Location:** `services/` (domain logic + Supabase integration)
- **Key services:**
  - `cleaningSessionService.ts` — session lifecycle with validations
  - `propertyService.ts` — property CRUD operations
  - `realtimeService.ts` — Supabase channel management
  - `notificationService.ts` — push notifications
  - `photoProofService.ts` — photo uploads and validation
- **Export pattern:** Central hub via `services/index.ts` for clean imports
- **Error handling:** Throw structured errors with context; let UI handle display

### Data/Type layer

- **Location:** `types/index.ts` (all domain types)
- **Key types:** `CleaningSession`, `EnhancedProperty`, `DashboardMetadata`, `TeamMember`, `Profile`
- **Pattern:** Export all types from central file; import from `@/types`
- **Supabase types:** Mirror database schema; use Supabase-generated types when possible

### State management

- **Global state:** Lightweight contexts in `contexts/` (e.g., `AuthContext.tsx`)
- **Server state:** TanStack Query (preferred for fetch/cache when adding hooks)
- **Local state:** React `useState` for component-local data
- **Form state:** Consider React Hook Form for complex forms (not yet implemented)

### Utilities layer

- **Location:** `utils/` (cross-cutting utilities)
- **Key file:** `utils/supabase.ts` creates cross-platform Supabase client
- **Storage:** Switches between `AsyncStorage` (native) and `localStorage` (web)
- **Demo mode:** Safe fallbacks when env vars missing

### Data flow and navigation

```
User Interaction
       ↓
Screen Component (app/*.tsx)
       ↓
Custom Hook (TanStack Query) ← [cache/invalidation]
       ↓
Service (services/*.ts) ← [validation/transform]
       ↓
Supabase Client (utils/supabase.ts)
       ↓
Database/Storage
       ↓
Realtime Channel (realtimeService.ts)
       ↓
Event Callback → Component Update
```

**Navigation flow:** Use `router.push('/route')`, `router.replace('/auth/login')`, `router.back()` from `expo-router`.

## Tech Stack & Dependencies

### Core Framework

- **Expo SDK:** `54.0.13` — Universal React Native platform
- **React:** `19.2.0` — UI library
- **React Native:** `0.81.4` — Mobile framework
- **TypeScript:** `~5.9.2` — Type safety (target: ES2022)

### Routing & Navigation

- **Expo Router:** `~6.0.12` — File-based routing
- **React Navigation:** `^7.1.6` — Underlying navigation (used by Expo Router)

### UI & Styling

- **Gluestack UI:** `^1.1.63` — Component library
- **NativeWind:** `^4.1.23` — Tailwind CSS for React Native
- **Tailwind CSS:** `^3.4.17` — Utility-first CSS
- **React Native Reanimated:** `~4.1.0` — Animations
- **Moti:** `^0.29.0` — Declarative animations

### Backend & Data

- **Supabase JS:** `^2.49.4` — Backend-as-a-service client
- **TanStack Query:** `^5.64.2` — Server state management
- **Zustand:** `^5.0.2` — Client state management (if needed)

### Storage & Persistence

- **AsyncStorage:** `^2.2.0` — Async key-value storage
- **React Native MMKV:** `^3.1.0` — Fast key-value storage
- **Expo Secure Store:** `~14.0.5` — Encrypted storage (iOS/Android)

### Forms & Validation

- **React Hook Form:** `^7.54.2` — Form state management
- **Zod:** `^3.24.1` — Schema validation

### Development & Quality

- **ESLint:** `^8.56.0` — Linting
- **Prettier:** `^3.4.2` — Code formatting
- **TypeScript ESLint:** `^8.20.0` — TS-specific linting
- **Jest:** Via `jest-expo@^54.0.12` — Unit testing
- **Testing Library:** `^13.3.3` — Component testing
- **Detox:** `^20.29.1` — E2E testing

### Build & Deployment

- **EAS Build:** Via Expo — Cloud builds
- **EAS Submit:** Via Expo — App store submission

### Utilities

- **Date-fns:** `^4.1.0` — Date manipulation
- **Expo Image:** `~3.0.9` — Optimized image component
- **React Native SVG:** `^15.9.0` — SVG support

---

## Key Behaviors & Conventions

### Demo Mode

- If `EXPO_PUBLIC_SUPABASE_URL` or `EXPO_PUBLIC_SUPABASE_ANON_KEY` are missing/placeholder, app runs with mock data
- `AuthContext` sets `isDemoMode`, network errors are suppressed
- Build features to work both online and in demo

### Code Organization

- **Business logic** → `services/` (throw ServiceError, validate inputs)
- **UI components** → `components/` (Gluestack UI, theme tokens)
- **Screens** → `app/` (Expo Router file-based routing)
- **Types** → `types/index.ts` (centralized domain types)
- **Tests** → `__tests__/` or `*.test.ts(x)` (Jest + React Testing Library)

### Import Conventions

```typescript
// Use TypeScript path aliases
import { PropertyCard } from '@/components/PropertyCard';
import { propertyService } from '@/services';
import { EnhancedProperty } from '@/types';
import { supabase } from '@/utils/supabase';

// Prefer named exports
export const propertyService = { ... };
export function MyComponent() { ... }
```

### Realtime Patterns

```typescript
// Subscribe to updates
const unsubscribe = realtimeService.subscribe({
  onSessionUpdate: (session) => setSession(session),
});

// Always cleanup
useEffect(() => {
  return () => unsubscribe();
}, []);
```

## How to Add Features

### New Screen

1. Create `app/<feature>.tsx`
2. Compose UI from `components/`
3. Navigate with `router.push('/feature')`
4. Put heavy logic in `services/<feature>Service.ts`

### New Data Operation

1. Implement in service (validate, handle errors)
2. Export via `services/index.ts`
3. Create TanStack Query hook in `hooks/` (optional)
4. Use in component with proper error handling

### New Realtime Channel

1. Extend `realtimeService`
2. Keep exponential backoff pattern
3. Always provide cleanup/unsubscribe

## Developer Workflows

### Daily development

```bash
# Start dev server
npm start
# Or platform-specific
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### Quality checks

```bash
npm run type-check  # TypeScript
npm run lint        # ESLint
npm run format:check # Prettier
npm test            # Jest unit tests
npm run test:e2e    # Detox E2E tests
```

### Build & deploy

```bash
# Local build
npm run build

# EAS builds (see deployment.instructions.md)
npm run android:release
npm run ios:release

# Dependency repair (Windows)
npm run fix:dependencies:win
```

## Supabase Integration

### Environment setup

```bash
# Required public variables (client-side safe)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ... # RLS-protected, public

# ❌ Never expose service role key client-side
```

### Key tables

- `properties` — Rental properties
- `cleaning_sessions` — Cleaning job sessions with lifecycle
- `team_members` — User-property assignments
- `cleaning_updates` — Activity logs
- `linen_requirements` — Property-specific linen needs
- `profiles` — Extended user info

### Realtime channels

- `cleaning_sessions` — Session updates
- `cleaning_updates` — Activity feed

**💡 See database.instructions.md for schema details, RLS policies, and query patterns**

## Testing strategy and patterns

### Unit tests (Jest + React Testing Library)

```typescript
// Service tests (see services/__tests__/bannerStateService.test.ts)
import { propertyService } from '@/services';

describe('propertyService', () => {
  it('should fetch properties with filters', async () => {
    const result = await propertyService.getProperties({ status: 'active' });
    expect(result).toHaveLength(3);
  });
});

// Component tests
import { render, screen } from '@testing-library/react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '../gluestack-ui.config';

const wrapper = ({ children }) => (
  <GluestackUIProvider config={config}>{children}</GluestackUIProvider>
);

test('renders property card', () => {
  render(<PropertyCard property={mockProperty} />, { wrapper });
  expect(screen.getByText('Property Name')).toBeTruthy();
});
```

### Test organization

- **Location:** `**/__tests__/**` or `*.test.ts(x)` adjacent to source
- **Naming:** `<filename>.test.ts(x)` (e.g., `cleaningSessionService.test.ts`)
- **Coverage targets:** Services (high priority), complex components, utilities
- **Mock data:** Use fixtures from `data/` for consistency

### E2E tests (Detox)

- **Location:** `e2e/` directory
- **Config:** `e2e/config.json`
- **Run:** `npm run test:e2e:build` then `npm run test:e2e`
- **Focus:** Critical user flows (auth, session start/complete, property assignment)

### Test commands

- `npm test` — run all Jest tests
- `npm run test:watch` — watch mode
- `npm run test:coverage` — generate coverage report
- `npm run test:e2e` — run Detox E2E tests

### Testing gotchas

- **Provider wrapping:** Always wrap components with `GluestackUIProvider` and `config`
- **Async operations:** Use `waitFor` from testing-library for async state updates
- **Mock Supabase:** Services should gracefully handle demo mode (no real DB calls)
- **Transform issues:** Jest config already handles Expo/RN/Gluestack; if failing, clear cache

## Error handling patterns

### Service layer errors

```typescript
// Throw structured errors with context
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// In services
if (!propertyId) {
  throw new ServiceError('Property ID required', 'MISSING_PROPERTY_ID', {
    operation: 'startSession',
  });
}
```

### UI layer error handling

```typescript
// Screen components
try {
  await cleaningSessionService.startSession(propertyId);
  router.push('/session-active');
} catch (error) {
  if (error instanceof ServiceError) {
    // Show user-friendly message
    showToast({ title: error.message, status: 'error' });
  } else {
    // Generic error
    showToast({ title: 'Something went wrong', status: 'error' });
  }
}
```

### Demo mode behavior

- Network errors suppressed when `isDemoMode === true`
- Mock data returns immediately (no Supabase calls)
- Auth checks bypassed (see `AuthContext.tsx`)
- Build all features to work both online and in demo

## Common patterns and conventions

### Import paths

```typescript
// Use TypeScript path aliases (tsconfig.json)
import { EnhancedProperty } from '@/types';
import { supabase } from '@/utils/supabase';
import { propertyService } from '@/services';
import { PropertyCard } from '@/components/PropertyCard';
```

### Export patterns

```typescript
// Named exports (preferred)
export const propertyService = { ... };
export function startSession() { ... }

// Avoid default exports except for screens/components
export default function PropertiesScreen() { ... }
```

### Async/await patterns

```typescript
// Always use try-catch in UI
const handleSubmit = async () => {
  try {
    setLoading(true);
    await propertyService.updateProperty(id, data);
    showToast({ title: 'Saved!', status: 'success' });
  } catch (error) {
    console.error('Failed to update:', error);
    showToast({ title: 'Error saving', status: 'error' });
  } finally {
    setLoading(false);
  }
};
```

### Cleanup patterns

```typescript
// Always cleanup subscriptions
useEffect(() => {
  const unsubscribe = realtimeService.subscribe({
    onSessionUpdate: (session) => setSession(session),
  });

  return () => unsubscribe();
}, []);
```

## Gotchas and troubleshooting

### Navigation issues

- ❌ **Never** use react-navigation directly (`navigation.navigate`)
- ✅ **Always** use Expo Router: `router.push('/path')`
- Stack context: Navigation happens within Stack.Navigator in `_layout.tsx`
- Modal context: Auth screens use presentation: 'modal'

### Metro/Jest cache issues

- **Symptoms:** Weird import errors, stale transforms, "Cannot find module"
- **Fix:** `npm run fix:dependencies:win` (Windows) or clear caches manually
- **Manual:** Delete `node_modules/.cache`, `.expo`, and restart Metro

### TypeScript path resolution

- **Editor:** VS Code should auto-resolve `@/*` paths (check `tsconfig.json`)
- **Runtime:** Metro config handles path aliases via `babel-plugin-module-resolver`
- **Tests:** Jest moduleNameMapper maps `@/*` to `<rootDir>/*`

### Gluestack UI theme tokens

- ❌ **Avoid:** `color="#3B82F6"` (hard-coded)
- ✅ **Use:** `color="$primary500"` (theme token)
- **Reference:** See `gluestack-ui.config.ts` for all tokens
- **Custom tokens:** Add to config, regenerate types if needed

### Supabase realtime

- **Reconnection:** Built into `realtimeService` with exponential backoff
- **Cleanup:** Always unsubscribe in component cleanup (useEffect return)
- **Filters:** Use `assigned_cleaner_id` filters to reduce bandwidth
- **RLS:** Server-side Row Level Security enforced; test with different user roles

### Demo mode detection

- **Triggers:** Missing/placeholder `EXPO_PUBLIC_SUPABASE_URL` or `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Behavior:** `AuthContext.isDemoMode === true`, all services use mock data
- **Testing:** Explicitly test both demo and live modes for new features

### Screen headers

- **Current pattern:** Most screens hide header (see `_layout.tsx` Stack.Screen options)
- **Custom headers:** Use `headerShown: true` and `header` prop for custom components
- **Navigation title:** Set via `options` in `_layout.tsx` or `navigation.setOptions()` in screen

## Configuration files reference

### Core config files

| File                     | Purpose                                               | When to Modify                      |
| ------------------------ | ----------------------------------------------------- | ----------------------------------- |
| `app.json`               | Expo app manifest (name, version, splash, icons)      | App metadata, build settings        |
| `eas.json`               | EAS Build profiles (dev, preview, production)         | Build/submit configuration          |
| `tsconfig.json`          | TypeScript config + path aliases (@/\*)               | Adding path aliases, TS options     |
| `babel.config.js`        | Babel transpilation (Expo preset, module resolver)    | Adding Babel plugins                |
| `metro.config.js`        | Metro bundler config (asset extensions, transformers) | Custom asset types, bundler tuning  |
| `jest.config.js`         | Jest test runner config                               | Test patterns, coverage, transforms |
| `eslint.config.js`       | ESLint rules                                          | Code quality rules                  |
| `gluestack-ui.config.ts` | Gluestack UI theme tokens                             | Design system customization         |

### Environment variables

```bash
# Required for live mode (Supabase)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional (notifications, analytics, etc.)
EXPO_PUBLIC_ONESIGNAL_APP_ID=...
```

### Package.json scripts

```json
{
  "start": "expo start", // Dev server
  "android": "expo run:android", // Android dev build
  "ios": "expo run:ios", // iOS dev build
  "web": "expo start --web", // Web dev server
  "test": "jest", // Run tests
  "type-check": "tsc --noEmit", // Type checking
  "lint": "eslint .", // Lint check
  "format:check": "prettier --check .", // Format check
  "build": "expo export", // Static export
  "android:release": "eas build --platform android --profile production",
  "ios:release": "eas build --platform ios --profile production"
}
```

## Quick decision tree for AI agents

### "Where should this code go?"

```
Is it a new screen?
  → app/<name>.tsx (file = route)

Is it a reusable UI component?
  → components/<ComponentName>.tsx

Is it business logic or data fetching?
  → services/<domain>Service.ts

Is it a shared TypeScript type?
  → types/index.ts (add to exports)

Is it global state management?
  → contexts/<Name>Context.tsx

Is it a utility function (not domain-specific)?
  → utils/<utility>.ts

Is it a constant or configuration?
  → constants/<name>.ts

Is it mock data for demo mode?
  → data/mock<Entity>.ts
```

### "How should I fetch data?"

```
Is there an existing service?
  ✅ Use service method (e.g., propertyService.getProperties())

No service exists yet?
  → Create services/<domain>Service.ts
  → Add async methods with error handling
  → Export via services/index.ts

Need caching/invalidation?
  → Wrap service call in TanStack Query hook (hooks/ directory)
  → Use query keys pattern (see "Query key conventions")

Need realtime updates?
  → Use realtimeService.subscribe() with callbacks
  → Remember to unsubscribe in cleanup
```

### "How should I navigate?"

```
Go to a new screen?
  → router.push('/path')

Replace current screen (e.g., after login)?
  → router.replace('/home')

Go back?
  → router.back()

Pass parameters?
  → router.push('/properties/123')
  → Or router.push({ pathname: '/properties/[id]', params: { id: '123' } })

Open a modal?
  → Auth screens are already modals (app/auth/*)
  → For custom modals, use Gluestack Modal component
```

### "How should I handle errors?"

```
In service layer?
  → Throw ServiceError with code and context
  → Let caller handle display

In UI layer?
  → try-catch around async operations
  → Show user-friendly message (toast/alert)
  → Log to console for debugging

Network errors in demo mode?
  → Suppress (AuthContext.isDemoMode checks)
  → Return mock data instead
```

## Performance best practices

### Rendering optimization

- Use `React.memo` for expensive components
- Memoize callbacks with `useCallback`
- Memoize computed values with `useMemo`
- Avoid inline object/array creation in props

### List rendering

```typescript
// Use FlatList with proper keys
<FlatList
  data={properties}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <PropertyCard property={item} />}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>
```

### Image optimization

- Use Expo Image with caching: `expo-image`
- Provide width/height to prevent layout shifts
- Use appropriate formats (WebP for web, optimized PNGs for native)

### Bundle size

- Check with `npx expo-doctor`
- Avoid importing entire libraries (e.g., import specific lodash functions)
- Use dynamic imports for heavy screens: `const Screen = lazy(() => import('./Screen'))`

## Accessibility guidelines

### ARIA and semantic HTML (web)

- Use semantic elements: `<Button>`, `<Heading>`, `<Text>`
- Provide `accessibilityLabel` for icons/images
- Ensure color contrast meets WCAG AA (4.5:1 for text)

### React Native accessibility

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Submit form"
  accessibilityRole="button"
  accessibilityState={{ disabled: isLoading }}
>
  <Text>Submit</Text>
</TouchableOpacity>
```

### Gluestack UI components

- Built-in accessibility support
- Use semantic props: `role`, `aria-label`, `isDisabled`
- Test with screen readers (TalkBack on Android, VoiceOver on iOS)

---

If any of these sections feel incomplete for your task (e.g., missing hook patterns or specific table schemas), tell me which part you're extending and I'll add concrete, repo-aligned guidance.
