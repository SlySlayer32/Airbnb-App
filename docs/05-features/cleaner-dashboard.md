# Cleaner Dashboard Feature

**Status**: ✅ Implemented (Phase 1)  
**User Role**: cleaner  
**Priority**: Critical (core workflow)

---

## What This Feature Does

Provides cleaners with a real-time view of today's cleaning jobs, intelligent status guidance, and quick access to job details. The dashboard is the cleaner's command center for their entire workday.

---

## User Story

**As a cleaner**, I want to see all my jobs for today in one place with clear priorities, so that I know exactly what to do next without calling or texting the property owner.

---

## User Flow

### Morning (7 AM - 11 AM)
1. Cleaner opens app
2. Sees "Relax" banner if no jobs, or "2 cleanings scheduled" if jobs exist
3. Views next job card with:
   - Property name and address
   - Scheduled time (e.g., "12:30 PM")
   - Countdown timer ("Starting in 5h 30m")
   - Guest count and linen requirements
   - Access code (prominently displayed)

**Action**: Cleaner prepares linens, plans route

---

### Starting Cleaning (11 AM - 3 PM)
1. Banner changes to "Ready to Start" (yellow) when within 30 min of scheduled time
2. "Start Cleaning" button appears on job card
3. Cleaner taps "Start Cleaning"
4. Card moves from "Next Job" to "Active Session"
5. Timer starts counting elapsed time
6. Banner changes to "Active" (green)

**Action**: Cleaner works through property

---

### During Cleaning
1. Active session card shows:
   - Elapsed time (live updating every second)
   - Property name
   - Pause/Resume button
   - Complete button (grayed out until photos uploaded)
2. Cleaner can pause for breaks (time excluded from billing)
3. Banner shows "Break" status when paused

**Action**: Cleaner completes cleaning, can take breaks as needed

---

### Completing Cleaning
1. Cleaner taps "Complete Session"
2. Photo Proof Gate appears (modal)
3. Cleaner must upload 3+ photos (kitchen, bathroom, living area)
4. Progress indicator shows "2/3 photos"
5. Once complete, "Finish" button enables
6. Tap "Finish" → session marked complete
7. Banner changes to "Day Wrap" if no more jobs

**Action**: Session complete, owner receives notification with photos

---

## Components Involved

- `CleanerDashboard.tsx` - Main container
- `CleanerTopBar.tsx` - Header with time and connection status
- `CleanerStatusBanner.tsx` - Dynamic status and guidance
- `CleanerNextJobCard.tsx` - Upcoming job display
- `CleanerActiveSessionCard.tsx` - In-progress job tracking
- `PhotoProofGate.tsx` - Completion photo requirement

---

## Business Rules Enforced

### 1. Cleaning Window (11 AM - 3 PM)
- Dashboard shows warning if job scheduled outside window
- Cannot start cleaning before 11 AM or after 3 PM
- Visual indicators for time compliance

### 2. Photo Proof Requirement
- Cannot complete session without photos
- Minimum 3 photos enforced
- PhotoProofGate blocks completion

### 3. Break Time Tracking
- Pause/resume functionality isolates break time
- Break time excluded from billing calculations
- Accurate work time = total time - break time

---

## API Endpoints Used

### GET /cleaning_sessions (via getTodaySessions)
Fetches today's sessions with metadata:
```typescript
const sessions = await cleaningSessionService.getTodaySessions();
// Returns: CleaningSession[] with dashboard_metadata
```

### POST /cleaning_sessions/:id/start
Starts session:
```typescript
await cleaningSessionService.startCleaning(sessionId);
```

### POST /cleaning_sessions/:id/pause
Pauses session:
```typescript
await cleaningSessionService.pauseSession(sessionId, reason);
```

### POST /cleaning_sessions/:id/resume
Resumes session:
```typescript
await cleaningSessionService.resumeSession(sessionId);
```

### POST /cleaning_sessions/:id/complete
Completes session:
```typescript
await cleaningSessionService.completeCleaning(sessionId, {
  completion_notes: 'Notes here',
  photo_urls: ['url1', 'url2', 'url3']
});
```

---

## Design Notes

**Color Coding**:
- Urgent: Red (#ef4444)
- High: Orange (#f59e0b)
- Medium: Blue (#3b82f6)
- Normal: Gray (#6b7280)

**Status Colors**:
- Relax: Gray (#6b7280)
- Scheduled: Blue (#3b82f6)
- Ready: Orange (#f59e0b)
- Active: Green (#10b981)
- Break: Yellow (#facc15)
- Awaiting Photos: Purple (#8b5cf6)
- Day Wrap: Green (#10b981)

**Layout**:
- Mobile-first (optimized for phone screens)
- Cards with generous padding (16px)
- Large touch targets (44px minimum)
- Clear visual hierarchy
- Consistent spacing (design system)

---

## Edge Cases Handled

### No Jobs Today
- Shows "Relax" banner with message: "No cleanings scheduled today. Enjoy your day off!"
- Empty state with illustration
- Link to schedule screen to see future jobs

### Multiple Jobs
- Shows only next job in card
- Badge indicates total job count ("3 cleanings today")
- Tap to see full list

### Offline
- Shows offline indicator in top bar
- Data cached from last load
- Actions queued for when connection restored

### Late Running
- Banner turns red if past expected completion time
- Shows "Running late" warning
- Owner receives automatic notification

---

## Testing Scenarios

### Happy Path
1. Cleaner with 2 jobs scheduled
2. Start first job on time
3. Take break during cleaning
4. Resume from break
5. Complete with photos
6. Move to second job
7. Complete day

### Edge Cases
- Start cleaning early (should show warning)
- Try to complete without photos (should block)
- Lose connection during cleaning (should cache state)
- Pause multiple times (should track all break time)
- No jobs scheduled (should show relax banner)

---

## Success Criteria

Feature succeeds when:
- ✅ Cleaners can see all jobs at a glance
- ✅ Clear guidance on what to do next
- ✅ Accurate time tracking with break isolation
- ✅ Photo proof enforced consistently
- ✅ Real-time updates work reliably
- ✅ Intuitive mobile interface
- ✅ Reduces need for calls/texts

---

**Implementation Date**: September 28, 2025  
**Current Status**: Production ready  
**User Feedback**: Pending (not yet deployed to real users)

