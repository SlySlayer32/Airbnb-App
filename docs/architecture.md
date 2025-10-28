# Airbnb Property Manager - Architecture

## Mobile-First NX Monorepo Architecture

This document provides additional architectural details for the Airbnb Property Manager application.

## Architecture Principles

### 1. Mobile-Only Focus

- **Single Target**: Only `apps/mobile` is a runnable application
- **Platform**: iOS and Android via React Native/Expo
- **No Web**: Static web artifacts are build outputs, not source code
- **Native Builds**: Use EAS Build for production deployments

### 2. Module Boundaries

#### Dependency Flow

```
┌─────────────────────────────────────────────────────────┐
│                    apps/mobile                          │
│              (type:app, scope:mobile)                   │
│                                                          │
│  Can import from: ALL libs                              │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┬─────────────┬──────────┐
        │                     │             │          │
        ▼                     ▼             ▼          ▼
┌──────────────┐    ┌──────────────┐  ┌─────────┐  ┌────────┐
│ libs/ui/     │    │ libs/data-   │  │ libs/   │  │ libs/  │
│ components   │    │ access/*     │  │ core/   │  │ core/  │
│              │    │              │  │ domain- │  │ utils  │
│ (type:ui)    │    │ (type:data-  │  │ models  │  │        │
│              │    │  access)     │  │         │  │        │
└──────┬───────┘    └──────┬───────┘  │(type:   │  │(type:  │
       │                   │          │ core)   │  │ core)  │
       │                   │          │         │  │        │
       └───────────────────┴──────────►         │  │        │
                                      │No deps  │  │No deps │
                                      └─────────┘  └────────┘
```

#### Tag-Based Enforcement

NX enforces these rules via tags in `project.json`:

```json
{
  "tags": ["type:app", "scope:mobile"]      // Can depend on anything
  "tags": ["type:ui", "scope:shared"]       // Can depend on core, data-access
  "tags": ["type:data-access", "scope:shared"] // Can depend on core only
  "tags": ["type:core", "scope:shared"]     // No dependencies
}
```

### 3. Import Patterns

#### Barrel Exports

Each library exports through `src/index.ts`:

```typescript
// libs/core/domain-models/src/index.ts
export * from './lib/models';
export * from './lib/types';
export * from './lib/mockData';
```

#### Path Aliases

TypeScript path mappings provide clean imports:

```typescript
// tsconfig.base.json
{
  "paths": {
    "@airbnb/core-domain-models": ["libs/core/domain-models/src/index.ts"],
    "@airbnb/core-utils": ["libs/core/utils/src/index.ts"],
    "@airbnb/ui-components": ["libs/ui/components/src/index.ts"],
    "@airbnb/data-access-api": ["libs/data-access/api/src/index.ts"],
    "@airbnb/data-access-auth": ["libs/data-access/auth/src/index.ts"]
  }
}
```

#### Usage in Code

```typescript
// ✅ CORRECT: Use path aliases
import { Property } from '@airbnb/core-domain-models';
import { PropertyCard } from '@airbnb/ui-components';
// ❌ WRONG: Don't use relative paths across libs
import { Property } from '../../../libs/core/domain-models/src/lib/models';
```

## Library Details

### libs/core/domain-models

**Purpose**: Domain entities, types, and interfaces

**Contents**:

- Core business entities (Property, CleaningSession, User, etc.)
- TypeScript type definitions
- Mock data for development and testing
- Shared constants

**Dependencies**: None (foundation layer)

**Naming**: Previously `libs/core/models`, renamed for clarity

### libs/core/utils

**Purpose**: Platform-agnostic utility functions

**Contents**:

- Date/time formatting
- String manipulation
- Data transformations
- Validation helpers

**Dependencies**:

- May import from `@airbnb/core-domain-models` for type safety
- No UI or data-access dependencies

**Guidelines**:

- Keep platform-agnostic (Node.js compatible)
- Pure functions preferred
- No React or React Native specific code

### libs/data-access/api

**Purpose**: API clients and backend service integrations

**Contents**:

- Property service
- Cleaning session service
- Photo proof service
- Dashboard layout service
- Realtime service (Supabase subscriptions)

**Dependencies**:

- `@airbnb/core-domain-models` for types
- Supabase client
- TanStack Query hooks

**Pattern**:

```typescript
// Service exports query hooks
export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyService.getAll(),
  });
}
```

### libs/data-access/auth

**Purpose**: Authentication logic and user session management

**Contents**:

- AuthContext provider
- Login/logout/register functions
- Session management
- User profile access

**Dependencies**:

- `@airbnb/core-domain-models` for User types
- Supabase auth client

### libs/data-access/supabase

**Purpose**: Supabase-specific integration (future)

**Status**: Directory created, not yet implemented

**Planned Contents**:

- Supabase client configuration
- Database schema types
- Storage helpers
- Realtime subscription utilities

### libs/ui/components

**Purpose**: Reusable React Native UI components

**Contents**:

- Dashboard components
- Property cards
- Cleaning session components
- Form components
- Modal and overlay components

**Dependencies**:

- `@airbnb/core-domain-models` for props types
- `@airbnb/data-access-api` for data hooks
- Gluestack UI components
- NativeWind for styling

**Guidelines**:

- Components should be reusable
- Accept data via props, not fetch directly
- Use TypeScript for prop types
- Include stories/examples (future)

### libs/ui/theme

**Purpose**: Design system and theme configuration (future)

**Status**: Directory created, not yet implemented

**Planned Contents**:

- Color palette
- Typography scale
- Spacing system
- Border radius values
- Shadow definitions

### libs/ui/hooks

**Purpose**: UI-related custom React hooks (future)

**Status**: Directory created, not yet implemented

**Planned Contents**:

- useTheme
- useResponsive
- useAnimation
- usePlatform

## App Structure

### apps/mobile

**Purpose**: Main mobile application

**Key Files**:

- `app/_layout.tsx`: Root layout with navigation setup
- `app/index.tsx`: Home/Dashboard screen
- `app/auth/`: Authentication screens
- `app.json`: Expo configuration
- `eas.json`: EAS Build configuration

**Routing**: Uses Expo Router for file-based routing

- File structure determines routes
- `_layout.tsx` files define nested layouts
- `index.tsx` is the default route

**Navigation Flow**:

```
_layout.tsx (Root)
├── index.tsx (Dashboard)
├── properties.tsx
├── maintenance.tsx
├── schedule.tsx
├── team.tsx
├── invoices.tsx
├── reports.tsx
├── profile.tsx
└── auth/
    ├── login.tsx
    ├── register.tsx
    └── forgot-password.tsx
```

## Future Reorganization

### Planned: apps/mobile/app Structure

Current structure will be enhanced with:

```
apps/mobile/app/
├── screens/           # Screen components
│   ├── HomeScreen.tsx
│   ├── PropertyScreen.tsx
│   └── ProfileScreen.tsx
├── components/        # App-specific components
│   ├── Header.tsx
│   └── TabBar.tsx
├── navigation/        # Navigation config
│   └── types.ts
├── hooks/            # App-level hooks
│   └── useAppState.ts
├── _layout.tsx       # Root layout
└── index.tsx         # Entry
```

This will:

- Separate concerns more clearly
- Make screens easily discoverable
- Isolate app-specific from shared components
- Improve maintainability

## Build & Deployment

### Development Workflow

```
┌────────────────┐
│  Local Dev     │
│  (Expo Go)     │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Development   │
│  Build (EAS)   │
│  Internal Test │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Preview       │
│  Build (EAS)   │
│  Stakeholders  │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Production    │
│  Build (EAS)   │
│  App Stores    │
└────────────────┘
```

### EAS Build Profiles

Configured in `apps/mobile/eas.json`:

- **development**: For internal testing, includes debug symbols
- **preview**: For stakeholder review, optimized but debuggable
- **production**: For app store submission, fully optimized

## Testing Strategy

### Unit Tests (Jest)

**Location**: Next to source files as `*.spec.ts` or `*.test.ts`

**Coverage**:

- Domain models and types
- Utility functions
- Service functions
- React hooks

**Run**: `yarn test` or `nx test <project>`

### Integration Tests (Jest + React Native Testing Library)

**Location**: In `src/__tests__/` or next to components

**Coverage**:

- Component rendering
- User interactions
- Data flow
- Context providers

**Run**: `yarn test` with appropriate setup

### E2E Tests (Detox)

**Location**: `/e2e/` directory

**Coverage**:

- Complete user flows
- Authentication
- CRUD operations
- Navigation

**Run**: `yarn test:e2e` after `yarn test:e2e:build`

## Security Considerations

### Environment Variables

- **Never commit**: `.env` files to version control
- **Use Expo Secrets**: For EAS builds
- **Prefix with EXPO*PUBLIC***: For client-side env vars
- **Keep sensitive server-side**: Backend API keys

### Supabase Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Authenticated requests**: All API calls include user token
- **Anon key is safe**: Designed for client-side use
- **Service key protected**: Never expose in client code

### Data Validation

- **Zod schemas**: For all form inputs
- **Type guards**: For external data
- **Sanitization**: Before displaying user content

## Performance Optimization

### List Rendering

- **Use FlashList**: For long lists (replaces FlatList)
- **Pagination**: Load data in chunks
- **Virtualization**: Only render visible items

### State Management

- **TanStack Query**: For server state (automatic caching)
- **Zustand**: For global client state (minimal)
- **Local state**: For component-specific data

### Bundle Size

- **Code splitting**: Via Expo Router
- **Tree shaking**: Automatic with Metro
- **Asset optimization**: Compressed images, WebP format

## Monitoring & Analytics

### Error Tracking

- **Sentry**: Crash reporting and error tracking (configured)
- **Source maps**: For production error debugging

### Performance

- **React Native Performance**: Built-in profiling
- **Flipper**: For debugging during development

### User Analytics (Optional)

- **Expo Analytics**: Basic usage tracking
- **Custom events**: Track user flows
- **Privacy first**: GDPR/CCPA compliant

---

This architecture provides a solid foundation for a scalable, maintainable mobile-first application
using modern React Native and NX best practices.
