# Session Lifecycle Management Feature

**Status**: ✅ Implemented (Phase 1)  
**User Role**: cleaner, property_owner  
**Priority**: Critical  

---

## What This Feature Does

Tracks cleaning sessions from creation through completion with accurate time tracking, break isolation, and comprehensive audit trails. Handles start, pause, resume, and complete operations with business rule enforcement.

---

## User Story

**As a cleaner**, I want to track my work time accurately including breaks, so that I get paid fairly and can prove exactly when I worked.

**As a property owner**, I want to see exactly when cleaning started and finished, so that I can verify work was completed and bill accurately.

---

## State Flow

```
scheduled → confirmed → in_progress → completed
         ↘ cancelled
         ↘ no_show
         
in_progress ←→ paused (break tracking)
```

---

## Operations

### Start Cleaning
**Trigger**: Cleaner taps "Start Cleaning" button  
**Validations**:
- Session must be in 'scheduled' status
- Current time must be within cleaning window (11 AM - 3 PM)
- Cannot start more than 30 min before scheduled time

**What Happens**:
1. Set `cleaner_arrived_at` timestamp
2. Set `cleaner_started_at` timestamp
3. Update status to 'in_progress'
4. Create 'session_start' update record
5. Notify property owner "Cleaning started"

**Result**: Timer starts, session active

---

### Pause Session (Break Tracking)
**Trigger**: Cleaner taps "Pause" button  
**Validations**:
- Session must be 'in_progress'
- Session must not already be paused

**What Happens**:
1. Set `cleaner_paused_at` timestamp
2. Set `is_currently_paused` = true
3. Create 'session_pause' update record
4. Stop timer display (but keep running in background)

**Result**: Break time tracked separately, won't be billed

---

### Resume Session
**Trigger**: Cleaner taps "Resume" button  
**Validations**:
- Session must be currently paused

**What Happens**:
1. Calculate time since pause: `now - cleaner_paused_at`
2. Add to `total_break_minutes`
3. Clear `cleaner_paused_at`
4. Set `cleaner_resumed_at` timestamp
5. Set `is_currently_paused` = false
6. Create 'session_resume' update record
7. Resume timer display

**Result**: Work time tracking resumes, break time recorded

---

### Complete Session
**Trigger**: Cleaner taps "Complete" button  
**Validations**:
- Session must be 'in_progress'
- Photo proof requirements must be met (minimum 3 photos)
- Session cannot be paused

**What Happens**:
1. If paused, show error "Resume session before completing"
2. If photos incomplete, show PhotoProofGate
3. Once photos uploaded:
   - Set `cleaner_completed_at` timestamp
   - Calculate effective working time (total - breaks)
   - Update status to 'completed'
   - Store `completion_photos` array
   - Create 'session_complete' update record
   - Notify owner with completion summary and photos

**Result**: Session complete, ready for invoicing

---

## Time Calculations

### Effective Working Time
```typescript
function calculateEffectiveWorkingMinutes(session: CleaningSession): number {
  if (!session.cleaner_started_at || !session.cleaner_completed_at) {
    return 0;
  }
  
  const started = new Date(session.cleaner_started_at);
  const completed = new Date(session.cleaner_completed_at);
  
  // Total time in minutes
  const totalMinutes = (completed.getTime() - started.getTime()) / (1000 * 60);
  
  // Subtract break time
  const breakMinutes = session.total_break_minutes || 0;
  
  // Add current pause time if session completed while paused
  let currentPauseMinutes = 0;
  if (session.is_currently_paused && session.cleaner_paused_at) {
    const pausedAt = new Date(session.cleaner_paused_at);
    currentPauseMinutes = (completed.getTime() - pausedAt.getTime()) / (1000 * 60);
  }
  
  return Math.max(0, Math.floor(totalMinutes - breakMinutes - currentPauseMinutes));
}
```

### Live Timer Display
```typescript
function getElapsedTime(session: CleaningSession): number {
  if (!session.cleaner_started_at) return 0;
  
  const started = new Date(session.cleaner_started_at);
  const now = new Date();
  
  let totalSeconds = (now.getTime() - started.getTime()) / 1000;
  
  // Subtract accumulated breaks
  const breakSeconds = (session.total_break_minutes || 0) * 60;
  totalSeconds -= breakSeconds;
  
  // Subtract current pause if paused
  if (session.is_currently_paused && session.cleaner_paused_at) {
    const pausedAt = new Date(session.cleaner_paused_at);
    const currentPauseSeconds = (now.getTime() - pausedAt.getTime()) / 1000;
    totalSeconds -= currentPauseSeconds;
  }
  
  return Math.max(0, totalSeconds);
}
```

---

## Business Rules Enforced

### Cleaning Window Validation
- Cannot start session outside 11 AM - 3 PM window
- Shows error: "Cleanings can only be started between 11 AM and 3 PM"

### Photo Proof Requirement
- Complete button disabled until photos uploaded
- Shows: "Upload 3 photos to complete session"

### Break Time Fairness
- Multiple pause/resume cycles supported
- All break time accurately tracked
- Cannot complete while paused (must resume first)

---

## Error Handling

### Common Errors

**"Only scheduled sessions can be started"**  
- Cause: Trying to start session that's already in progress or completed
- Solution: Refresh dashboard to get latest status

**"Session is already paused"**  
- Cause: Tapping pause when already paused
- Solution: UI disables pause button when paused

**"Only paused sessions can be resumed"**  
- Cause: Trying to resume session that's not paused
- Solution: UI shows resume button only when paused

---

## Testing Scenarios

### Scenario 1: Normal Flow
1. Start session at 11:30 AM ✓
2. Work for 45 minutes ✓
3. Pause for 15-minute lunch break ✓
4. Resume at 12:30 PM ✓
5. Work for 30 more minutes ✓
6. Complete at 1:00 PM ✓

**Expected**: 
- Total time: 1h 30min
- Break time: 15min
- Effective work time: 1h 15min

---

### Scenario 2: Multiple Breaks
1. Start session ✓
2. Work 30 min ✓
3. Pause 10 min (phone call) ✓
4. Resume ✓
5. Work 20 min ✓
6. Pause 15 min (lunch) ✓
7. Resume ✓
8. Work 30 min ✓
9. Complete ✓

**Expected**: 
- Total time: 1h 45min
- Break time: 25min
- Effective work time: 1h 20min

---

### Scenario 3: Try to Complete Without Photos
1. Start session ✓
2. Work for 1 hour ✓
3. Tap "Complete" ✗

**Expected**: 
- PhotoProofGate modal appears
- Shows "0/3 photos uploaded"
- Cannot proceed until photos uploaded

---

## Success Criteria

Feature succeeds when:
- ✅ Accurate time tracking within 1-minute precision
- ✅ Break time properly isolated from billing
- ✅ All state transitions validated and prevented when invalid
- ✅ Complete audit trail of all events
- ✅ Photo proof enforced consistently
- ✅ Real-time updates to owner
- ✅ No disputes about work time

---

**Implementation**: `services/cleaningSessionService.ts`  
**UI**: `components/CleanerActiveSessionCard.tsx`  
**Tests**: Manual testing + unit tests for time calculations

