# C4 Level 1: System Context

## Actors

### Property Owner
**Role**: Manages properties, schedules cleanings, views reports
**Goals**: Reliable coordination, quality assurance, cost tracking
**Key Interactions**:
- Schedules cleaning sessions
- Monitors cleaning progress in real-time
- Reviews completion photos
- Manages team members
- Views financial reports

### Cleaner
**Role**: Performs cleanings, tracks time, reports issues
**Goals**: Clear job information, fair time tracking, easy reporting
**Key Interactions**:
- Views assigned jobs
- Starts/pauses/completes sessions
- Uploads completion photos
- Reports maintenance issues
- Tracks work history

### Co-Host
**Role**: Coordinates properties, assists owner
**Goals**: Visibility into operations, issue coordination
**Key Interactions**:
- Views property schedules
- Monitors cleaning progress
- Reports issues
- Coordinates with cleaners

## System

### Airbnb Cleaning Management Platform
**Purpose**: Coordinate cleaning operations in the critical 4-hour turnover window

**Core Capabilities**:
- Real-time session tracking
- Photo proof validation
- Time tracking with break isolation
- Issue reporting and escalation
- Team coordination
- Financial management (owner-only)

**Key Constraints**:
- 11 AM - 3 PM cleaning window
- 24-hour cancellation notice
- Financial privacy for cleaners
- Minimum 3 photos per session

## External Systems

### Supabase (Backend Services)
**Components**:
- **PostgreSQL Database**: Stores all application data
- **Auth Service**: User authentication and authorization
- **Storage Service**: Photo storage and retrieval
- **Realtime Service**: WebSocket-based live updates

**Key Interactions**:
- User authentication and session management
- Data persistence (properties, sessions, users)
- Photo upload and retrieval
- Real-time notifications and updates
- Row Level Security (RLS) enforcement

### Expo (Mobile Platform)
**Components**:
- **Expo SDK**: React Native framework
- **Expo Go**: Development client
- **Expo Router**: File-based navigation

**Key Interactions**:
- App builds and distribution
- Native module access (camera, storage)
- Cross-platform compatibility (iOS, Android, Web)
- Development tooling

### User Devices
**Types**:
- **iOS Devices**: iPhones, iPads
- **Android Devices**: Phones, tablets
- **Web Browsers**: Desktop and mobile browsers

**Key Interactions**:
- App installation and updates
- Camera access for photo capture
- Location services (future)
- Push notifications

## Key Interactions

### Authentication Flow
```
User → Mobile App → Supabase Auth → Profile Fetch → Role-Based Routing
```

### Session Creation Flow
```
Property Owner → Create Session → Validate Window (11 AM - 3 PM) →
Assign Cleaner → Save to Database → Notify Cleaner
```

### Session Execution Flow
```
Cleaner → Start Session → Track Time → Upload Photos →
Validate Photo Count → Complete Session → Notify Owner
```

### Real-Time Updates Flow
```
Database Change → Supabase Realtime → WebSocket Notification →
Service Layer → Component Update → UI Re-render
```

## Data Flows

### Primary Data Flow (Owner → Cleaner)
1. Owner creates cleaning session
2. System validates 11 AM - 3 PM window
3. System assigns cleaner
4. Cleaner receives notification
5. Cleaner views job details
6. Cleaner starts session
7. System tracks time
8. Cleaner uploads photos
9. System validates photo count
10. Cleaner completes session
11. Owner receives notification with photos

### Real-Time Updates Flow
1. Database change occurs (e.g., session status update)
2. Supabase Realtime detects change
3. WebSocket sends notification to subscribed clients
4. Service layer receives update
5. Component state updates
6. UI re-renders with new data

### Photo Upload Flow
1. Cleaner captures photo with device camera
2. Photo compressed and validated
3. Photo uploaded to Supabase Storage
4. Storage URL returned
5. URL stored in session record
6. Photo displayed in UI

## System Boundaries

### What's Inside
- Mobile application (iOS, Android, Web)
- Service layer (business logic)
- Supabase backend (database, auth, storage, realtime)
- Real-time notification system
- Photo proof validation
- Time tracking system

### What's Outside
- External calendar systems (Airbnb, VRBO)
- Payment processing (future)
- Third-party analytics (future)
- Email/SMS services (future)
- GPS tracking (future)

## Key Assumptions

1. **Internet Connectivity**: App works offline but requires connection for real-time features
2. **Device Capabilities**: All devices have camera and storage
3. **User Behavior**: Cleaners work primarily on mobile devices
4. **Business Rules**: 4-hour window and 24-hour notice are non-negotiable
5. **Demo Mode**: App must function without Supabase for development

## Success Criteria

### For Property Owners
- Can schedule cleanings in < 2 minutes
- Receive real-time updates on cleaning progress
- View completion photos within 1 minute of completion
- Reduce coordination time from 30 min to < 5 min

### For Cleaners
- Can start session in < 30 seconds
- Upload photos in < 5 seconds each
- Report issues in < 1 minute
- View all job details before arriving at property

### For System
- 99.9% uptime target
- < 200ms property loading time
- < 2 second real-time update latency
- Zero data loss during network interruptions

---

**Next Level**: [Container Diagram](./container-diagram.md) - Shows the high-level technical building blocks

