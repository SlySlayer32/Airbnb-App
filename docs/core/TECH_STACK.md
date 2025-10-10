# Technology Stack & Architecture

## Core Technologies

### Frontend: React Native + Expo SDK 54
**Why**: Cross-platform mobile development (iOS, Android, Web) with single codebase  
**Benefits**:
- Write once, deploy everywhere
- Fast development iteration
- Hot reload during development
- Large ecosystem of libraries
- Over-the-air updates (no app store delays)

**Key Expo Packages**:
- `expo-router`: File-based routing system
- `expo-camera`: Photo capture for proof system
- `expo-image-picker`: Gallery access
- `@expo/vector-icons`: Ionicons for UI

### Backend: Supabase
**Why**: PostgreSQL + Auth + Realtime + Storage in one platform  
**Benefits**:
- Rapid backend development (no server code needed)
- Built-in authentication and user management
- Real-time subscriptions out of the box
- File storage for photos
- Row Level Security (RLS) for data protection
- Auto-generated TypeScript types

**Supabase Features Used**:
- **Database**: PostgreSQL with type-safe queries
- **Auth**: Email/password authentication with JWT
- **Realtime**: Live dashboard updates via WebSockets
- **Storage**: Photo upload and retrieval
- **RLS**: Role-based data access policies

### Language: TypeScript (Strict Mode)
**Why**: Type safety prevents bugs and improves developer experience  
**Benefits**:
- Catch errors at compile time, not runtime
- IntelliSense autocomplete in editors
- Refactoring is safer
- Documentation through types
- Team collaboration easier

**TypeScript Config**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Navigation: Expo Router
**Why**: File-based routing matches web development patterns  
**Benefits**:
- File = Route (intuitive)
- Deep linking support
- Type-safe navigation
- Nested layouts
- Modal presentations

**Route Examples**:
```
app/index.tsx         → / (Dashboard)
app/properties.tsx    → /properties
app/auth/login.tsx    → /auth/login (Modal)
```

### Styling: React Native StyleSheet
**Why**: Native performance, no external dependencies  
**Benefits**:
- Optimized for mobile
- Type-safe styles
- No CSS learning curve
- Consistent across platforms

**No External CSS Libraries**: Avoids bundle bloat and complexity

### Icons: Ionicons Only
**Why**: Consistent icon family, included with Expo  
**Benefits**:
- Professional looking
- Wide variety (1000+ icons)
- No additional dependencies
- Works on all platforms

---

## Architecture Patterns

### Service Layer Architecture
All business logic lives in `/services/` folder. Components never call Supabase directly.

```
Component → Service → Supabase
```

**Benefits**:
- Reusable business logic
- Easier testing
- Centralized error handling
- Consistent data access patterns

**Example**:
```typescript
// ❌ Bad: Component calls Supabase directly
function Component() {
  const { data } = await supabase.from('properties').select('*');
}

// ✅ Good: Component uses service
function Component() {
  const properties = await propertyService.getPropertiesForOwner();
}
```

### Component Organization
Components organized by user role or feature:

```
components/
├── CleanerDashboard.tsx       → Cleaner-specific main view
├── CleanerPropertyCard.tsx    → Cleaner-focused property card
├── OwnerPropertyCard.tsx      → Owner-focused property card
├── RoleBasedWrapper.tsx       → Access control utility
└── NotificationBadge.tsx      → Shared across roles
```

**Naming Convention**: `[Role][Feature]Component.tsx`

### State Management
**Global State**: React Context (auth only)  
**Local State**: useState for UI

**Why no Redux/Zustand**: Keep it simple. Context for auth, local state for everything else. Add state management library only if complexity demands it.

**Auth Context**:
```typescript
const { user, profile, loading } = useAuth();
// user: Supabase auth user
// profile: User profile with role
// loading: Initial auth check
```

### File-Based Routing
Screen file location determines route:

```
app/
├── _layout.tsx              → Root layout (auth guard)
├── index.tsx                → / (Dashboard)
├── properties.tsx           → /properties
├── schedule.tsx             → /schedule
└── auth/
    ├── login.tsx            → /auth/login (Modal)
    └── register.tsx         → /auth/register (Modal)
```

---

## Project Structure

```
/
├── app/                       → Screens (13 files)
│   ├── _layout.tsx            → Root with auth guard
│   ├── index.tsx              → Dashboard (role-specific)
│   ├── properties.tsx         → Property management
│   ├── schedule.tsx           → Cleaning schedules
│   ├── team.tsx               → Team management
│   ├── invoices.tsx           → Financial management
│   ├── maintenance.tsx        → Issue tracking
│   ├── reports.tsx            → Analytics
│   ├── profile.tsx            → User settings
│   ├── onboarding.tsx         → First-time setup
│   └── auth/                  → Authentication screens
│
├── components/                → UI Components (18 files)
│   ├── Cleaner*.tsx           → Cleaner-specific (7 components)
│   ├── Owner*.tsx             → Owner-specific (2 components)
│   └── [Shared].tsx           → Role-agnostic (9 components)
│
├── services/                  → Business Logic (8 files)
│   ├── cleaningSessionService.ts
│   ├── propertyService.ts
│   ├── notificationService.ts
│   ├── photoProofService.ts
│   ├── realtimeService.ts
│   ├── bannerStateService.ts
│   ├── cleaningUpdateService.ts
│   └── index.ts               → Barrel exports
│
├── types/                     → TypeScript Definitions
│   └── index.ts               → All interfaces and types
│
├── contexts/                  → Global State
│   └── AuthContext.tsx        → User authentication
│
├── utils/                     → Utilities
│   └── supabase.ts            → Supabase client config
│
└── docs/                      → Documentation
    └── [This system]
```

---

## Development Environment

### Required Software
- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node)
- **Git**: For version control
- **VS Code**: Recommended editor (or Cursor)

### Optional Tools
- **Xcode**: For iOS development (Mac only)
- **Android Studio**: For Android development
- **Expo Go**: Mobile app for testing

### Environment Variables
Required in `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Prefix with `EXPO_PUBLIC_` for client-side access

---

## Development Commands

### Starting Development
```bash
npm start                  # Start Expo dev server
npm run android           # Launch Android emulator
npm run ios               # Launch iOS simulator  
npm run web               # Launch in browser
```

### Quality Checks
```bash
npm run lint              # TypeScript type checking
npx tsc --noEmit          # Explicit type check
```

### Useful Commands
```bash
npm install               # Install dependencies
npm start -- --clear      # Clear cache and start
npx expo install          # Add Expo-compatible package
```

---

## Key Packages & Dependencies

### Core Dependencies
```json
{
  "expo": "~54.0.13",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "typescript": "^5.3.3",
  "@supabase/supabase-js": "^2.46.1",
  "expo-router": "~6.0.11"
}
```

### UI Libraries
```json
{
  "@expo/vector-icons": "^15.0.3",
  "react-native-gesture-handler": "~2.20.2",
  "react-native-safe-area-context": "4.14.0",
  "react-native-screens": "~4.4.0"
}
```

### Development Tools
```json
{
  "@types/react": "~18.3.18",
  "eslint": "^9.16.0",
  "@typescript-eslint/parser": "^8.18.0"
}
```

---

## Architecture Decisions

### Why React Native over Native iOS/Android?
**Decision**: Use React Native + Expo  
**Reason**: Faster development, single codebase, easier maintenance  
**Tradeoff**: Slightly larger app size, but acceptable for our use case

### Why Supabase over Custom Backend?
**Decision**: Use Supabase  
**Reason**: Rapid development, built-in features, scales well  
**Tradeoff**: Vendor lock-in, but migration possible if needed  
**Cost**: Free tier covers MVP, $25/month for production

### Why TypeScript over JavaScript?
**Decision**: TypeScript only, strict mode  
**Reason**: Prevents bugs, better developer experience, easier refactoring  
**Tradeoff**: More upfront typing work, but saves debugging time

### Why File-Based Routing over React Navigation?
**Decision**: Expo Router (file-based)  
**Reason**: More intuitive, better deep linking, type-safe  
**Tradeoff**: Newer library, but well-supported by Expo team

### Why No Redux/MobX?
**Decision**: React Context + local state only  
**Reason**: App complexity doesn't justify state management library yet  
**When to Add**: If state sharing becomes complex (>5 contexts, prop drilling >3 levels deep)

---

## Database Design

### Supabase PostgreSQL Schema

**Core Tables**:
- `profiles` - User accounts with roles
- `properties` - Property listings
- `cleaning_sessions` - Scheduled and completed cleanings
- `cleaning_updates` - Real-time progress updates
- `team_members` - Cleaner-property assignments
- `notifications` - User alert system
- `photo_proof_requirements` - Required photos per session
- `linen_requirements` - Property linen specifications

**Relationships**:
```sql
properties (1) → (many) cleaning_sessions
cleaning_sessions (1) → (many) cleaning_updates
profiles (1) → (many) team_members → (many) properties
cleaning_sessions (1) → (many) photo_proof_requirements
```

**Row Level Security (RLS)**:
- Owners see only their properties
- Cleaners see only assigned properties
- Cleaners cannot see financial tables
- All queries filtered by auth.uid()

---

## Performance Considerations

### Current Optimizations
- Minimal re-renders with proper useState/useEffect
- Targeted database queries (select specific fields)
- Image compression for photos (future Phase 2)
- Real-time subscription filtering by user

### Future Optimizations (When Needed)
- **Caching**: Add React Query for server state caching
- **Virtualization**: FlatList for long property lists
- **Code Splitting**: Lazy load screens
- **CDN**: Serve photos from CDN (Supabase Storage + CDN)

**When to Optimize**:
- Property list > 100 items → Add virtualization
- Database queries slow (>1s) → Add caching
- Photo loading slow → Add CDN
- Bundle size > 5MB → Code splitting

---

## Why These Choices Work for This Project

✅ **Mobile-First**: Cleaners work on phones, not desktops  
✅ **Real-Time**: Status updates need to be instant  
✅ **Type-Safe**: Financial data requires zero errors  
✅ **Scalable**: Supabase handles 10 → 10,000 users easily  
✅ **Maintainable**: Clear patterns, service layer, TypeScript  
✅ **Cost-Effective**: Supabase free tier covers development + early customers  

---

**Last Updated**: January 2025  
**Next Review**: When adding new major dependencies or considering architecture changes

