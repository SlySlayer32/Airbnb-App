# Real-Time Updates Feature

**Status**: ✅ Implemented (Phase 1)  
**User Role**: All roles  
**Priority**: High  

---

## What This Feature Does

Provides live dashboard updates via Supabase real-time subscriptions. Cleaners and owners see instant status changes without manual refresh. Creates professional platform experience similar to Uber or DoorDash.

---

## User Story

**As a property owner**, I want to see cleaning progress update instantly, so that I don't have to keep refreshing the app or calling the cleaner.

**As a cleaner**, I want my status changes to immediately notify the owner, so that communication is seamless and professional.

---

## How It Works

### Subscription Setup
When dashboard loads:
1. Component subscribes to real-time channels
2. Listens for changes to:
   - `cleaning_sessions` table (session updates)
   - `cleaning_updates` table (progress messages)
   - `notifications` table (alerts)
3. Connection status tracked and displayed

### Live Update Flow

**Cleaner starts session**:
1. Cleaner taps "Start Cleaning" → Service updates database
2. Supabase broadcasts change via WebSocket
3. Owner's dashboard receives update (< 1 second)
4. Owner sees "In Progress" status update automatically
5. Notification appears: "Maria started cleaning Sunset Villa"

**Cleaner pauses for break**:
1. Pause button tapped → Database updated
2. Real-time broadcast sent
3. Owner sees "On Break" status
4. Timer stops on owner's view

**Cleaner completes cleaning**:
1. Photos uploaded → Session completed
2. Real-time broadcast
3. Owner sees "Completed" status
4. Notification with photo links

---

## Technical Implementation

### Service: realtimeService.ts
**Class-based service** with subscription management:

```typescript
const realtimeService = new RealtimeService();

await realtimeService.subscribe({
  onSessionUpdate: (session) => {
    // Update session in state
    refreshDashboard();
  },
  onUpdateInsert: (update) => {
    // Show new message/update
    addToUpdateFeed(update);
  },
});

// Cleanup on unmount
realtimeService.unsubscribe();
```

### Connection Status Tracking
```typescript
interface RealtimeConnectionState {
  isConnected: boolean;
  lastConnected?: Date;
  connectionError?: string;
  reconnectAttempts: number;
}
```

### Automatic Reconnection
- Exponential backoff strategy
- Max 5 reconnect attempts
- Start with 1 second delay, double each attempt
- Reset on successful connection

---

## Integration Points

### CleanerDashboard
- Subscribes on mount
- Unsubscribes on unmount
- Shows connection status in top bar
- Auto-refreshes when updates received

### CleanerTopBar
- Displays connection indicator:
  - Green dot: Connected
  - Gray dot: Disconnected
  - Yellow dot: Reconnecting

### Owner Dashboard (Future Phase 2)
- Same subscription pattern
- Shows live cleaner locations (future)
- Updates cleaning progress in real-time

---

## Business Rules

### Real-Time Filtering
- Cleaners only see their assigned sessions
- Owners only see their properties
- Co-hosts see assigned properties
- Enforced via RLS policies

### Offline Graceful Degradation
- If connection lost:
  - Show offline indicator
  - Cache last known state
  - Queue updates for when online
  - Allow viewing cached data
  - Prevent modifications until reconnected

---

## Error Handling

### Connection Failed
**Error**: Initial connection fails

**Handling**:
- Show "Connecting..." indicator
- Retry with exponential backoff
- After 5 attempts, show "Offline" status
- Allow viewing cached data

### Connection Dropped
**Error**: Connected but then disconnected

**Handling**:
- Detect disconnection
- Show "Reconnecting..." indicator
- Attempt automatic reconnection
- Resume subscription when reconnected

### Permission Denied
**Error**: RLS blocks subscription

**Handling**:
- Log error to console
- Show offline indicator
- Fall back to manual refresh (pull-to-refresh)

---

## Performance Considerations

### Subscription Filtering
- Subscribe only to relevant rows (filter by user)
- Reduces bandwidth and processing
- Example: Cleaners subscribe to `assigned_cleaner_id = auth.uid()`

### Cleanup on Unmount
- Always unsubscribe when component unmounts
- Prevents memory leaks
- Prevents ghost subscriptions

### Battery Impact
- WebSocket connection is lightweight
- No polling (server pushes updates)
- Minimal battery drain compared to HTTP polling

---

## Testing Scenarios

### Scenario 1: Two Devices, Live Updates
1. Open owner dashboard on device 1
2. Open cleaner dashboard on device 2
3. Cleaner starts session on device 2
4. Owner sees update on device 1 within 1 second ✓

### Scenario 2: Connection Lost & Recovered
1. Cleaner working on session
2. Turn off WiFi → connection indicator turns gray
3. Make changes (paused, worked more)
4. Turn WiFi back on → reconnects automatically
5. Updates sync to owner ✓

### Scenario 3: Multiple Concurrent Updates
1. Cleaner sends message
2. Cleaner uploads photo
3. Cleaner completes session
4. All updates appear in owner feed in correct order ✓

---

## Success Criteria

Feature succeeds when:
- ✅ Updates appear in < 1 second
- ✅ Connection status visible to users
- ✅ Automatic reconnection works reliably
- ✅ No duplicate subscriptions (memory leaks)
- ✅ Offline mode doesn't crash app
- ✅ RLS prevents unauthorized data access

---

**Implementation**: `services/realtimeService.ts`  
**Dependencies**: `@supabase/supabase-js` (real-time client)  
**Database**: Supabase real-time enabled on key tables

