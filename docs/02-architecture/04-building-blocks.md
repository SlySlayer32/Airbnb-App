# Building Blocks

> C4 Model Level 2-3: System containers and key components

## Overview

This document describes the major building blocks (containers and components) of the Airbnb Cleaning Management Platform, following C4 Model principles.

## System Containers

### 1. Frontend Container (React Native + Expo)

**Technology**: React Native 18.3, Expo SDK 54
**Platforms**: iOS, Android, Web
**Purpose**: User interface and mobile application

#### Key Responsibilities
- Render UI components (18 components)
- Handle user interactions
- Manage local state with React hooks
- Navigate between screens (13 screens)
- Display real-time updates
- Capture and upload photos
- Handle authentication flow

#### Key Technologies
- React Native for cross-platform UI
- Expo Router for file-based routing
- Expo SDK for native features (camera, storage)
- React Context for global auth state
- TypeScript for type safety

#### Components (18 total)

**Cleaner Components** (7):
- `CleanerDashboard.tsx` - Main cleaner interface
- `CleanerTopBar.tsx` - Time and status display
- `CleanerStatusBanner.tsx` - Session state indicator
- `CleanerActiveSessionCard.tsx` - Current work details
- `CleanerNextJobCard.tsx` - Upcoming job preview
- `CleanerPropertyCard.tsx` - Property information
- `CleanerActiveSessionCard.tsx` - Active session details

**Owner Components** (3):
- `OwnerPropertyCard.tsx` - Property management
- `DashboardStats.tsx` - Performance metrics
- `InvoiceCard.tsx` - Financial data

**Shared Components** (8):
- `PropertyCard.tsx` - Generic property display
- `ScheduleCard.tsx` - Schedule visualization
- `TeamMemberCard.tsx` - Team member info
- `MaintenanceCard.tsx` - Issue tracking
- `NotificationBadge.tsx` - Alert indicator
- `PhotoProofGate.tsx` - Photo validation
- `RoleBasedWrapper.tsx` - Access control
- `ErrorBoundary.tsx` - Error handling

#### Screens (13 total)

**Main Screens** (10):
- `index.tsx` - Dashboard (role-based)
- `properties.tsx` - Property list
- `schedule.tsx` - Schedule calendar
- `team.tsx` - Team management
- `invoices.tsx` - Financial records
- `maintenance.tsx` - Issue tracking
- `reports.tsx` - Analytics
- `profile.tsx` - User profile
- `onboarding.tsx` - First-time setup

**Auth Screens** (3):
- `auth/login.tsx` - User login
- `auth/register.tsx` - New user signup
- `auth/forgot-password.tsx` - Password reset

#### Communication with Other Containers
- **To Service Layer**: Calls service methods for all data operations
- **To Backend**: Never directly - always through services
- **From Backend**: Receives real-time updates via WebSocket subscriptions

---

### 2. Service Layer Container

**Technology**: TypeScript
**Purpose**: Business logic abstraction and data orchestration
**Location**: `/services/`

#### Key Responsibilities
- Encapsulate business rules
- Coordinate database operations
- Handle cross-cutting concerns (notifications, real-time)
- Provide typed interfaces to components
- Centralize error handling
- Enforce security policies

#### Services (8 total)

**Core Services** (4):
- `propertyService.ts` - Property CRUD operations
- `cleaningSessionService.ts` - Session lifecycle management
- `cleaningUpdateService.ts` - Real-time progress tracking
- `notificationService.ts` - User notifications

**Specialized Services** (4):
- `photoProofService.ts` - Photo validation and storage
- `realtimeService.ts` - WebSocket subscription management
- `bannerStateService.ts` - Dashboard banner logic
- `index.ts` - Barrel export for all services

#### Service Communication Pattern

```
Component → Service → Supabase
                ↓
         Notification Service (if needed)
                ↓
         Realtime Service (broadcast update)
```

#### Key Design Patterns

**1. Service-to-Service Integration**
```typescript
// cleaningSessionService calls notificationService
async completeSession(sessionId: string) {
  const session = await this.updateSession(sessionId, { status: 'completed' });

  // Trigger notification
  await notificationService.create({
    user_id: session.property.owner_id,
    type: 'session_completed',
    title: 'Cleaning Completed',
    message: `${session.property.name} has been cleaned`,
  });

  return session;
}
```

**2. Business Rule Enforcement**
```typescript
// Enforce cleaning window (11 AM - 3 PM)
function validateCleaningWindow(scheduledTime: Date): void {
  const hour = scheduledTime.getHours();
  if (hour < 11 || hour >= 15) {
    throw new Error('Cleanings must be scheduled between 11 AM and 3 PM');
  }
}
```

**3. Role-Based Data Filtering**
```typescript
async getPropertyDetails(propertyId: string, userRole: string) {
  const fields = userRole === 'cleaner'
    ? 'id, name, address, access_code, special_instructions' // No financial fields
    : '*'; // Everything for owners

  return supabase.from('properties').select(fields).eq('id', propertyId);
}
```

#### Communication with Other Containers
- **From Frontend**: Receives method calls from components
- **To Backend**: Executes Supabase queries
- **To Notification Service**: Triggers alerts
- **To Realtime Service**: Broadcasts updates

---

### 3. Backend Container (Supabase)

**Technology**: PostgreSQL, Supabase Auth, Supabase Storage, Supabase Realtime
**Purpose**: Data persistence, authentication, file storage, real-time updates

#### Key Responsibilities
- Store application data (properties, sessions, users)
- Authenticate users (email/password, social login)
- Store cleaning photos (Supabase Storage)
- Provide real-time updates (WebSocket subscriptions)
- Enforce Row Level Security (RLS) policies
- Handle file uploads and downloads

#### Database Schema

**Core Tables** (8):
- `profiles` - User profiles with roles
- `properties` - Property information
- `cleaning_sessions` - Session lifecycle
- `cleaning_updates` - Real-time progress
- `notifications` - User alerts
- `team_members` - Team relationships
- `maintenance_issues` - Issue tracking
- `invoices` - Financial records

**Security**:
- Row Level Security (RLS) enabled on all tables
- Policies enforce role-based access
- Cleaners cannot see financial data
- Owners see only their properties

#### Authentication

**Methods**:
- Email/password authentication
- Social login (Google, Apple) - planned
- Session management
- Password reset flow

**User Roles**:
- `property_owner` - Full access
- `cleaner` - Limited access (no financial data)
- `co_host` - Limited management access

#### Storage

**Buckets**:
- `cleaning-photos` - Session photo proof
- Public access with RLS policies
- Automatic URL generation

#### Real-time

**Subscriptions**:
- `cleaning_sessions` - Session status changes
- `cleaning_updates` - Progress updates
- `notifications` - New alerts

**WebSocket Connection**:
- Automatic reconnection
- Connection status tracking
- Efficient change detection

#### Communication with Other Containers
- **From Service Layer**: Receives database queries
- **To Service Layer**: Returns query results
- **To Frontend**: Sends real-time updates via WebSocket

---

## Component Relationships

### Cleaner Dashboard Flow

```
CleanerDashboard
  ├── CleanerTopBar (time, status)
  ├── CleanerStatusBanner (session state)
  ├── CleanerActiveSessionCard (current work)
  │   ├── PhotoProofGate (photo validation)
  │   └── CleaningUpdates (progress tracking)
  ├── CleanerNextJobCard (upcoming)
  └── CleanerPropertyCard (property details)
```

### Session Lifecycle Flow

```
1. Schedule Created
   cleaningSessionService.createSession()
   → Supabase insert
   → notificationService.create()
   → realtimeService.broadcast()

2. Cleaner Arrives
   cleaningUpdateService.recordArrival()
   → Supabase update
   → Banner state changes
   → Real-time update to owner

3. Cleaner Completes
   photoProofService.validatePhotos()
   → cleaningSessionService.completeSession()
   → Supabase update
   → notificationService.create()
   → Real-time update to owner
```

### Photo Upload Flow

```
PhotoProofGate
  → PhotoProofService.uploadPhoto()
    → Supabase Storage upload
    → Get public URL
    → Update session.photo_urls
    → Validate minimum photos
    → Enable completion button
```

### Real-time Update Flow

```
Database Change
  → Supabase WebSocket notification
    → realtimeService callback
      → Component state update
        → UI re-render
```

## Cross-Cutting Concerns

### 1. Error Handling

**Pattern**: Services show alerts, components handle state

```typescript
// In service
catch (error) {
  console.error('[ServiceName.method]', error);
  Alert.alert('Error', 'User-friendly message');
  throw error;
}

// In component
try {
  await service.doSomething();
  Alert.alert('Success', 'Action completed');
} catch (error) {
  // Error already shown by service
  setLoading(false);
}
```

### 2. State Management

**Global State**: AuthContext (user, profile, session)
**Local State**: useState for component-level UI state
**Real-time State**: Supabase subscriptions for multi-user data

### 3. Security

**Component Level**: RoleBasedWrapper hides UI elements
**Service Level**: Queries filter by role
**Database Level**: RLS policies enforce access control

### 4. Performance

**Optimizations**:
- FlatList for long lists (virtualization)
- Debounced search inputs (500ms)
- Lazy loading for images
- Efficient WebSocket subscriptions

## Technology Decisions

### Why React Native + Expo?
- **Cross-platform**: Single codebase for iOS, Android, Web
- **Rapid development**: Expo SDK provides native features
- **Type safety**: TypeScript catches errors early
- **Community**: Large ecosystem, active development

### Why Supabase?
- **PostgreSQL**: Robust relational database
- **Auth**: Built-in authentication
- **Storage**: File storage for photos
- **Realtime**: WebSocket subscriptions
- **RLS**: Row-level security policies
- **Free tier**: Generous for MVP

### Why Service Layer?
- **Separation of concerns**: Business logic separate from UI
- **Reusability**: Same logic across multiple components
- **Testability**: Easy to mock and test
- **Maintainability**: Single source of truth for business rules

## Deployment Architecture

### Development
- Frontend: Expo Go app (iOS/Android) or web browser
- Backend: Supabase cloud (development project)
- Storage: Supabase Storage (development bucket)

### Production (Planned)
- Frontend: Expo EAS Build (native apps) + Expo Hosting (web)
- Backend: Supabase cloud (production project)
- Storage: Supabase Storage (production bucket)
- CDN: Expo CDN for static assets

## Scalability Considerations

### Current Capacity
- **Users**: Designed for 10-100 properties
- **Cleanings**: ~20-50 per day
- **Photos**: ~100-200 per day
- **Real-time**: < 50 concurrent connections

### Future Scaling Needs
- **Database**: Supabase scales to millions of rows
- **Storage**: Supabase Storage scales to TB
- **Real-time**: Supabase Realtime handles 1000+ concurrent connections
- **CDN**: Expo CDN for global asset delivery

### Monitoring (Planned)
- Supabase Dashboard for database metrics
- Expo Analytics for app usage
- Sentry for error tracking
- LogRocket for session replay

---

**Last Updated**: January 2025
**Maintenance**: Update as new components and services are added

