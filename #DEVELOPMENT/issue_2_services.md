# 🔧 Enhanced Property Services Implementation

**Epic**: Enhanced Property Management System  
**Phase**: 2 - Core API Services  
**Priority**: Critical  
**Estimated Time**: 3-4 days  
**Depends on**: Issue #1 (Database Schema)

## Overview
Replace mock data with real database operations that support both property owners and cleaners. Implement comprehensive services for property management, cleaning sessions, real-time updates, and notifications.

## Requirements

### Core Services to Implement
- [ ] **`propertyService`** - Role-based property management
- [ ] **`cleaningSessionService`** - Complete session lifecycle management
- [ ] **`cleaningUpdateService`** - Real-time communication between cleaners and owners
- [ ] **`notificationService`** - Multi-channel alert system
- [ ] **`linenService`** - Automated linen requirement calculations

### Property Service Features
- [ ] `getPropertiesForOwner()` - Load all properties with current/next sessions
- [ ] `getPropertiesForCleaner()` - Load only assigned properties with upcoming sessions
- [ ] `createProperty()` - Create with automatic linen requirement generation
- [ ] `updateProperty()` - Modify property details and access information
- [ ] `getLinenRequirements()` - Retrieve configurable linen needs
- [ ] `updateLinenRequirements()` - Modify linen calculations per guest count

### Cleaning Session Service Features
- [ ] `createSession()` - Schedule cleaning with automatic notifications
- [ ] `updateSessionStatus()` - Status changes with stakeholder alerts
- [ ] `cancelSession()` - Professional cancellation workflow with reason tracking
- [ ] `startCleaning()` - Cleaner check-in with owner notification
- [ ] `completeCleaning()` - Completion workflow with photo/note support
- [ ] `getCleanerSessions()` - Today, week, or all upcoming sessions

### Real-time Communication
- [ ] `addUpdate()` - Cleaner posts updates, photos, issues
- [ ] `getSessionUpdates()` - Chronological communication history
- [ ] Automatic owner notifications for issues requiring response
- [ ] Photo URL storage and retrieval
- [ ] Issue escalation workflow

## Acceptance Criteria

### Role-Based Data Access
- [ ] Property owners only see their properties and related sessions
- [ ] Cleaners only see properties with assigned cleaning sessions
- [ ] Sensitive information (access codes) properly handled
- [ ] Performance optimized for mobile users

### Session Management
- [ ] Complete lifecycle: schedule → confirm → start → complete
- [ ] Cancellation tracking with notice period calculation
- [ ] Real-time status updates to all stakeholders
- [ ] Automatic linen requirement attachment based on guest count
- [ ] Photo upload support for completion documentation

### Communication Features
- [ ] Real-time updates between cleaners and owners
- [ ] Issue reporting with escalation triggers
- [ ] Notification delivery to appropriate users
- [ ] Update history maintained chronologically
- [ ] Support for both text and photo updates

### Error Handling
- [ ] Graceful handling of network failures
- [ ] User-friendly error messages
- [ ] Retry logic for critical operations
- [ ] Offline capability for essential data
- [ ] Loading states for all async operations

## Implementation Details

### File Structure
```
services/
├── propertyService.ts      # Property CRUD and role-based loading
├── cleaningSessionService.ts # Session lifecycle management
├── cleaningUpdateService.ts  # Real-time communication
├── notificationService.ts   # Alert system
└── index.ts                # Service exports
```

### Key Functions
```typescript
// Property Service
propertyService.getPropertiesForOwner(): Promise<EnhancedProperty[]>
propertyService.getPropertiesForCleaner(): Promise<EnhancedProperty[]>
propertyService.createProperty(data): Promise<EnhancedProperty>
propertyService.createDefaultLinenRequirements(propertyId, maxOccupancy)

// Session Service  
cleaningSessionService.createSession(data): Promise<CleaningSession>
cleaningSessionService.cancelSession(id, cancellationData)
cleaningSessionService.startCleaning(sessionId): Promise<CleaningSession>
cleaningSessionService.completeCleaning(sessionId, completionData)

// Update Service
cleaningUpdateService.addUpdate(sessionId, updateData)
cleaningUpdateService.getSessionUpdates(sessionId): Promise<Update[]>

// Notification Service
notificationService.sendToUser(userId, type, title, message, data)
notificationService.getUnreadNotifications(): Promise<Notification[]>
```

### Integration Points
- Supabase database queries with proper RLS
- Real-time subscriptions for live updates
- File upload preparation for photo functionality
- Error boundary integration for robust error handling

## Testing Checklist

### Property Service
- [ ] Owner can load all their properties with session data
- [ ] Cleaner only sees assigned properties
- [ ] Property creation generates default linen requirements
- [ ] Linen requirements can be customized per guest count
- [ ] Sensitive data (access codes) properly secured

### Session Service
- [ ] Complete session lifecycle works end-to-end
- [ ] Cancellation tracks notice period and sends notifications
- [ ] Status changes notify appropriate stakeholders
- [ ] Cleaner can start/complete sessions with photo uploads
- [ ] Session filtering by date and status works correctly

### Communication Service
- [ ] Updates post in real-time
- [ ] Photos can be attached to updates
- [ ] Issues requiring response trigger notifications
- [ ] Update history maintains chronological order
- [ ] Emergency escalation works properly

### Performance Testing
- [ ] Property loading under 200ms for mobile
- [ ] Real-time updates delivered within 2 seconds
- [ ] Bulk operations (linen generation) complete quickly
- [ ] Database queries properly optimized with indexes
- [ ] Offline mode stores essential data locally

## Files Changed
```
services/propertyService.ts          # New file
services/cleaningSessionService.ts   # New file  
services/cleaningUpdateService.ts    # New file
services/notificationService.ts     # New file
services/index.ts                   # New file
types/index.ts                      # Updated interfaces
app/lib/supabase.ts                 # Connection verification
```

## Mock Data Migration
- [ ] Replace `data/mockData.ts` usage in existing screens
- [ ] Update existing property loading logic
- [ ] Migrate team member data structure
- [ ] Update invoice and maintenance mock data calls

## Dependencies
- Issue #1 (Database Schema) must be completed
- Supabase client properly configured
- User authentication working correctly
- Environment variables set up

## Risks & Mitigation
- **RLS policy conflicts**: Extensive testing with different user roles
- **Performance issues**: Implement proper caching and indexing
- **Real-time failures**: Graceful degradation to polling
- **Data consistency**: Proper transaction handling for multi-table operations

## Future Enhancements
- Offline mode with local storage
- Photo compression and optimization
- Push notification integration
- Email/SMS notification channels
- Advanced caching strategies

## Definition of Done
- [ ] All services implemented and tested
- [ ] Mock data completely replaced
- [ ] Role-based access working correctly
- [ ] Real-time communication functional
- [ ] Error handling robust and user-friendly
- [ ] Performance benchmarks met
- [ ] Integration tests passing
- [ ] Documentation updated