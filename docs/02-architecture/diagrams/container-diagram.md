# C4 Level 2: Container View

## Frontend Container: React Native Mobile App

### Technology
- **Framework**: React Native 18.3
- **Platform**: Expo SDK 54
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet

### Responsibilities
- User interface rendering
- User interaction handling
- State management (local and global)
- Navigation between screens
- Camera access for photo capture
- Offline data caching

### Components
- **18 UI Components**: Reusable building blocks
- **13 Screens**: Full-page views
- **1 Context**: AuthContext for global auth state

### Runs On
- iOS devices (via Expo Go or standalone build)
- Android devices (via Expo Go or standalone build)
- Web browsers (via Expo Web)

### Key Characteristics
- Mobile-first design
- Touch-optimized interface
- Fast refresh during development
- Cross-platform code sharing (95%+)

### Data Storage
- **Local**: AsyncStorage for auth tokens
- **Remote**: Supabase for all persistent data

### Communication
- **HTTP**: REST API calls to Supabase
- **WebSocket**: Real-time subscriptions via Supabase Realtime
- **Storage API**: Photo uploads to Supabase Storage

---

## Service Layer Container: TypeScript Services

### Technology
- **Language**: TypeScript (strict mode)
- **Pattern**: Plain object exports (not classes)
- **Error Handling**: Try/catch with user-friendly alerts

### Responsibilities
- Business logic abstraction
- Database query coordination
- Business rule enforcement
- Error handling and user feedback
- Service-to-service integration

### Services (8 Total)

#### 1. cleaningSessionService
**Purpose**: Session lifecycle management
**Methods**:
- `createSession()` - Create new cleaning session
- `getTodaySessions()` - Fetch today's sessions
- `startSession()` - Mark session as started
- `pauseSession()` - Pause time tracking
- `resumeSession()` - Resume time tracking
- `completeSession()` - Mark session complete
- `cancelSession()` - Cancel session with notice validation

**Business Rules Enforced**:
- Cleaning window (11 AM - 3 PM)
- Cancellation notice (24-hour minimum)
- Photo proof requirement (minimum 3 photos)

#### 2. cleaningUpdateService
**Purpose**: Real-time progress updates
**Methods**:
- `createUpdate()` - Log progress update
- `getLatestUpdate()` - Fetch most recent update
- `getUpdateHistory()` - Fetch all updates for session

**Integration**: Triggers real-time notifications

#### 3. propertyService
**Purpose**: Property data management
**Methods**:
- `getProperties()` - Fetch user's properties
- `getPropertyDetails()` - Fetch single property
- `createProperty()` - Add new property
- `updateProperty()` - Modify property details
- `deleteProperty()` - Remove property

**Role Filtering**: Returns different fields based on user role

#### 4. notificationService
**Purpose**: User notifications
**Methods**:
- `create()` - Create notification
- `getNotifications()` - Fetch user's notifications
- `markAsRead()` - Mark notification as read
- `deleteNotification()` - Remove notification

**Integration**: Called by other services to alert users

#### 5. photoProofService
**Purpose**: Photo validation and upload
**Methods**:
- `uploadPhoto()` - Upload photo to Supabase Storage
- `validatePhotoCount()` - Check minimum photo requirement
- `getPhotoUrls()` - Fetch photo URLs for session

**Storage**: Supabase Storage bucket `cleaning-photos`

#### 6. realtimeService
**Purpose**: Real-time subscription management
**Methods**:
- `subscribe()` - Subscribe to table changes
- `unsubscribe()` - Unsubscribe from channel

**Tables Monitored**:
- `cleaning_sessions` - Session status changes
- `cleaning_updates` - Progress updates
- `notifications` - New notifications

#### 7. bannerStateService
**Purpose**: Dashboard banner state logic
**Methods**:
- `getBannerState()` - Determine current banner state
- `getBannerMessage()` - Get appropriate message

**States**: Ready, Active, Break, Complete, Error

#### 8. notificationService
**Purpose**: Cross-service notification coordination
**Methods**:
- `create()` - Create notification
- `getNotifications()` - Fetch notifications
- `markAsRead()` - Mark as read

**Integration**: Called by cleaningSessionService, photoProofService

### Communication
- **To Frontend**: Returns typed data, throws errors
- **To Backend**: Queries Supabase, handles responses
- **To Services**: Direct function calls (no event bus)

### Error Handling
- Services show user-friendly alerts
- Services throw errors for component handling
- Dual alert pattern (service shows error, component shows success)

---

## Backend Container: Supabase

### Technology
- **Database**: PostgreSQL 15
- **Auth**: Supabase Auth (JWT-based)
- **Storage**: Supabase Storage (S3-compatible)
- **Realtime**: WebSocket subscriptions
- **API**: RESTful API with auto-generated endpoints

### Responsibilities
- Data persistence
- User authentication and authorization
- File storage (photos)
- Real-time change notifications
- Row Level Security (RLS) enforcement

### Database Tables

#### cleaning_sessions
**Purpose**: Session lifecycle tracking
**Key Fields**:
- `id`, `property_id`, `cleaner_id`, `scheduled_time`
- `status` (scheduled, in_progress, completed, cancelled)
- `started_at`, `completed_at`, `photo_urls`
- `effective_work_time`, `break_time`

**RLS Policies**:
- Owners can view all sessions for their properties
- Cleaners can view only assigned sessions
- Co-hosts can view sessions for assigned properties

#### cleaning_updates
**Purpose**: Real-time progress tracking
**Key Fields**:
- `id`, `session_id`, `update_type`, `message`
- `created_at`, `photo_url`

**RLS Policies**:
- Users can view updates for sessions they have access to

#### properties
**Purpose**: Property information
**Key Fields**:
- `id`, `owner_id`, `name`, `address`
- `access_code`, `wifi_password`, `special_instructions`
- `max_occupancy`, `property_type`

**RLS Policies**:
- Owners can manage their own properties
- Cleaners can view assigned properties (limited fields)
- Co-hosts can view assigned properties

#### profiles
**Purpose**: User profile data
**Key Fields**:
- `id`, `email`, `role` (property_owner, cleaner, co_host)
- `name`, `phone`, `avatar_url`

**RLS Policies**:
- Users can view their own profile
- Users can view profiles of team members

#### notifications
**Purpose**: User notifications
**Key Fields**:
- `id`, `user_id`, `type`, `title`, `message`
- `priority`, `read`, `created_at`

**RLS Policies**:
- Users can view their own notifications

### Storage Buckets

#### cleaning-photos
**Purpose**: Photo proof storage
**Structure**: `{session_id}/{photo_number}.jpg`
**Access**: Authenticated users only
**RLS**: Users can upload to assigned sessions, view session photos

### Auth System
- **Provider**: Supabase Auth
- **Method**: Email/password (JWT tokens)
- **Session**: Stored in AsyncStorage (mobile) or localStorage (web)
- **Roles**: Enforced via `profiles.role` field

### Realtime System
- **Transport**: WebSocket
- **Channels**: Per-table subscriptions
- **Events**: INSERT, UPDATE, DELETE
- **Filtering**: Client-side filtering by user permissions

### Communication
- **From Services**: HTTP requests (REST API)
- **To Frontend**: WebSocket notifications
- **Storage**: Direct uploads to Storage API

---

## Key Data Flows

### Session Creation Flow
```
Frontend → cleaningSessionService.createSession() →
  Validate 11 AM - 3 PM window →
  Supabase.insert('cleaning_sessions') →
  notificationService.create() →
  Supabase.insert('notifications') →
  Realtime broadcast →
  Frontend updates UI
```

### Photo Upload Flow
```
Frontend → photoProofService.uploadPhoto() →
  Supabase Storage.upload() →
  Get public URL →
  photoProofService.validatePhotoCount() →
  If >= 3 photos: enable completion →
  Frontend shows completion button
```

### Real-Time Update Flow
```
Database change → Supabase Realtime detects →
  WebSocket notification →
  realtimeService.subscribe() callback →
  Frontend state update →
  Component re-render
```

### Authentication Flow
```
Frontend → Supabase Auth.signIn() →
  JWT token returned →
  AuthContext stores session →
  Fetch profile from Supabase →
  Determine role →
  Route to appropriate dashboard
```

---

## Container Characteristics

### Frontend Container
- **Deployment**: iOS App Store, Google Play, Web
- **Scaling**: Client-side (no server scaling needed)
- **Technology Risk**: Low (mature React Native ecosystem)
- **Performance**: < 200ms property loading, < 2s real-time updates

### Service Layer Container
- **Deployment**: Bundled with frontend
- **Scaling**: Client-side (no server scaling needed)
- **Technology Risk**: Low (TypeScript provides type safety)
- **Performance**: Minimal overhead (< 10ms per call)

### Backend Container (Supabase)
- **Deployment**: Supabase cloud (managed)
- **Scaling**: Automatic (Supabase handles)
- **Technology Risk**: Low (Supabase is production-ready)
- **Performance**: < 100ms database queries, < 1s photo uploads

---

## Technology Decisions

### Why React Native + Expo?
- Cross-platform code sharing (95%+)
- Rapid development with Expo tooling
- Native performance for mobile
- Web support for desktop users
- Large ecosystem and community

### Why TypeScript?
- Type safety prevents bugs
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring
- Strict mode enforces quality

### Why Supabase?
- PostgreSQL (powerful and reliable)
- Built-in auth and RLS
- Real-time subscriptions out of the box
- Storage for photos
- Free tier sufficient for MVP
- Managed service (no DevOps overhead)

### Why Service Layer?
- Separation of concerns
- Reusable business logic
- Centralized error handling
- Easy to test
- Single source of truth for business rules

---

**Next Level**: [Component Diagram](./component-diagram.md) - Shows the internal structure of the frontend container

