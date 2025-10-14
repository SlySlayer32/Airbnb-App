# Solution Strategy

## Technology Choices

### Frontend: React Native + Expo SDK 54

**Why This Choice**:
- Cross-platform mobile development (iOS, Android, Web) with single codebase
- Fast development iteration with hot reload
- Large ecosystem of libraries
- Over-the-air updates (no app store delays)
- Expo tooling simplifies native module access

**Key Packages**:
- `expo-router`: File-based routing system
- `expo-camera`: Photo capture for proof system
- `expo-image-picker`: Gallery access
- `@expo/vector-icons`: Ionicons for UI

**Tradeoffs**:
- Slightly larger app size (~5MB vs ~2MB native)
- Some native features require custom native code
- **Acceptable**: Performance is excellent, bundle size reasonable

### Backend: Supabase

**Why This Choice**:
- PostgreSQL + Auth + Realtime + Storage in one platform
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

**Tradeoffs**:
- Vendor lock-in (but migration possible if needed)
- Free tier: 500MB database, 1GB storage, 50K monthly active users
- **Acceptable**: Free tier covers MVP, $25/month for production

### Language: TypeScript (Strict Mode)

**Why This Choice**:
- Type safety prevents bugs and improves developer experience
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

**Tradeoffs**:
- More upfront typing work
- **Acceptable**: Saves debugging time, prevents production bugs

### Navigation: Expo Router

**Why This Choice**:
- File-based routing matches web development patterns
- File = Route (intuitive)
- Deep linking support
- Type-safe navigation
- Nested layouts
- Modal presentations

**Tradeoffs**:
- Newer library (but well-supported by Expo team)
- **Acceptable**: Better DX than React Navigation, actively maintained

### Styling: React Native StyleSheet

**Why This Choice**:
- Native performance, no external dependencies
- Optimized for mobile
- Type-safe styles
- No CSS learning curve
- Consistent across platforms

**Tradeoffs**:
- No CSS-in-JS features (but not needed)
- **Acceptable**: StyleSheet is sufficient for our needs

### Icons: Ionicons Only

**Why This Choice**:
- Consistent icon family, included with Expo
- Professional looking
- Wide variety (1000+ icons)
- No additional dependencies
- Works on all platforms

**Tradeoffs**:
- Limited to Ionicons (but covers all our needs)
- **Acceptable**: Consistent design, no bundle bloat

## Architecture Patterns

### Service Layer Architecture

**Pattern**: All business logic lives in `/services/` folder. Components never call Supabase directly.

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

**Pattern**: Components organized by user role or feature

```
components/
├── CleanerDashboard.tsx       → Cleaner-specific main view
├── CleanerPropertyCard.tsx    → Cleaner-focused property card
├── OwnerPropertyCard.tsx      → Owner-focused property card
├── RoleBasedWrapper.tsx       → Access control utility
└── NotificationBadge.tsx      → Shared across roles
```

**Naming Convention**: `[Role][Feature]Component.tsx`

**Benefits**:
- Instantly know who uses what
- Easier maintenance
- Clear permissions

### State Management

**Pattern**: React Context for auth, useState for UI

**Global State**: React Context (auth only)
```typescript
const { user, profile, loading } = useAuth();
```

**Local State**: useState for UI
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Why no Redux/Zustand**: Keep it simple. Context for auth, local state for everything else. Add state management library only if complexity demands it.

**When to Add State Library**:
- If state sharing becomes complex (>5 contexts, prop drilling >3 levels deep)
- If performance issues arise from context re-renders
- If undo/redo functionality needed

### File-Based Routing

**Pattern**: Screen file location determines route

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

**Benefits**:
- Intuitive (file = route)
- Type-safe navigation
- Deep linking support
- Less configuration

## Key Architectural Decisions

### 1. Three-Layer Architecture

**Decision**: UI Layer → Service Layer → Database Layer

**Why**:
- Clear separation of concerns
- Reusable business logic
- Centralized error handling
- Easier testing

**Enforcement**: Components NEVER call Supabase directly - always through services

### 2. Service Layer Boundaries

**Decision**: Each service owns one domain

```
propertyService      → Properties CRUD, filtering
cleaningSessionService → Session lifecycle, scheduling
cleaningUpdateService → Real-time progress updates
notificationService   → Cross-user alerts
realtimeService       → Supabase subscription management
photoProofService     → Photo validation, storage
bannerStateService    → Dashboard banner logic
```

**Integration**: Services can call each other (e.g., cleaningSessionService → notificationService)

### 3. Demo Mode Built-In

**Decision**: App works without Supabase using mock data

**Why**:
- Faster onboarding
- Easier to demo
- Development without backend access
- Graceful degradation

**Implementation**:
```typescript
import { isDemoMode } from '@/utils/supabase';

if (isDemoMode()) {
  return mockData;
}
// Otherwise query Supabase
```

### 4. Real-Time for Multi-User Data Only

**Decision**: Real-time subscriptions only for:
- cleaning_sessions (status changes)
- cleaning_updates (progress updates)
- notifications (new alerts)

**Why**:
- Reduces WebSocket overhead
- Prevents unnecessary re-renders
- Improves performance
- Reduces Supabase costs

### 5. Context Only for Auth

**Decision**: No Redux/Zustand - Context only for auth

**Why**:
- Simplicity (app state is local, not global)
- Performance (no prop drilling but minimal re-renders)
- Learning curve (easier for non-technical founder to understand)
- Future-proof (can add state library if needed)

## Design System

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

### Border Radius
```typescript
const borderRadius = {
  small: 6, medium: 8, large: 12, round: 999
};
```

### Shadows
```typescript
// Small shadow (subtle)
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.05,
shadowRadius: 2,
elevation: 1,

// Medium shadow (cards)
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,

// Large shadow (modals)
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.15,
shadowRadius: 8,
elevation: 5,
```

**Enforcement**: No hardcoded values - always use design system constants

## Performance Strategy

### Current Optimizations
- Minimal re-renders with proper useState/useEffect
- Targeted database queries (select specific fields)
- Real-time subscription filtering by user
- StyleSheet.create for styles (optimized)

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

## Security Strategy

### Multi-Layer Security

**1. UI Layer**: RoleBasedWrapper hides components
```typescript
<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <InvoiceCard />
</RoleBasedWrapper>
```

**2. Service Layer**: Queries filter by role
```typescript
async getPropertyDetails(propertyId: string, userRole: string) {
  const fields = userRole === 'cleaner'
    ? 'id, name, address, access_code' // No financial fields
    : '*'; // Everything for owners

  return supabase.from('properties').select(fields).eq('id', propertyId);
}
```

**3. Database Layer**: Row Level Security (RLS)
```sql
-- Cleaners can only see assigned properties
CREATE POLICY "cleaners_view_assigned" ON properties
FOR SELECT USING (
  id IN (
    SELECT property_id FROM team_members
    WHERE user_id = auth.uid() AND role = 'cleaner'
  )
);
```

**Critical Rule**: Cleaners NEVER see financial data at any layer

## Testing Strategy

### Current State: Manual Testing Primary

**Why**:
- Small team (1-3 developers)
- Non-technical founder
- Rapid iteration
- Feature completeness over test coverage

**Manual Testing Checklist**:
- Test as property_owner
- Test as cleaner
- Test as co_host
- Test in demo mode
- Test with real Supabase
- Test on iOS, Android, Web
- Test edge cases (empty states, errors, slow network)

### Future: Automated Testing

**When to Add**:
- Team grows beyond 3 developers
- Critical features need regression testing
- CI/CD pipeline needs automated checks

**What to Test**:
- Unit tests for services (business logic)
- Integration tests for critical flows
- E2E tests for user journeys
- Visual regression tests for UI

## Deployment Strategy

### Development
- Local development with Expo Go
- Hot reload for fast iteration
- Demo mode for testing without Supabase

### Staging
- Expo Preview builds
- TestFlight (iOS) and Internal Testing (Android)
- Staging Supabase project

### Production
- App Store (iOS) and Play Store (Android)
- Web deployment (Expo Web)
- Production Supabase project
- Over-the-air updates (Expo Updates)

## Why These Choices Work

✅ **Mobile-First**: Cleaners work on phones, not desktops
✅ **Real-Time**: Status updates need to be instant
✅ **Type-Safe**: Financial data requires zero errors
✅ **Scalable**: Supabase handles 10 → 10,000 users easily
✅ **Maintainable**: Clear patterns, service layer, TypeScript
✅ **Cost-Effective**: Supabase free tier covers development + early customers
✅ **Rapid Development**: Expo + Supabase = fast iteration
✅ **Future-Proof**: Can scale architecture as needed

---

**Last Updated**: January 2025
**Next Review**: When adding new major dependencies or considering architecture changes

