# Banner State Machine Feature

**Status**: ✅ Implemented (Phase 1)  
**User Role**: cleaner  
**Priority**: High (UX improvement)  

---

## What This Feature Does

Intelligently determines which status banner to show cleaners based on current time, session state, and work context. Provides context-aware guidance throughout the workday with 7 distinct states.

---

## User Story

**As a cleaner**, I want clear guidance on what I should be doing right now, so that I don't have to figure out priorities or worry about what's next.

---

## The 7 States

### 1. Relax (Morning / No Jobs)
**When**: No jobs scheduled today, or early morning before jobs

**Banner**:
- Color: Gray
- Icon: Coffee cup
- Message: "No cleanings scheduled today. Enjoy your day off!"
- Action: None

**Purpose**: Reduces stress, sets expectation for day off

---

### 2. Scheduled (Jobs Exist, Not Ready Yet)
**When**: Jobs scheduled but >30 min until next one

**Banner**:
- Color: Blue
- Icon: Calendar
- Message: "2 cleanings scheduled today"
- Subtext: "Next at 12:30 PM (2h 15m)"
- Action: "View Schedule"

**Purpose**: Awareness of upcoming work, allows prep time

---

### 3. Ready (Starting Soon)
**When**: Within 30 min of next job start time

**Banner**:
- Color: Orange
- Icon: Clock alert
- Message: "Ready to start - Sunset Villa"
- Subtext: "Scheduled for 12:30 PM (in 15 minutes)"
- Action: "Start Cleaning" (button)

**Purpose**: Prompts action, prevents late starts

---

### 4. Active (Currently Cleaning)
**When**: Session status = 'in_progress', not paused

**Banner**:
- Color: Green
- Icon: Checkmark circle
- Message: "In Progress - Sunset Villa"
- Subtext: "45 minutes elapsed"
- Action: "Pause" button

**Purpose**: Confirms active work, shows progress

---

### 5. Break (Paused)
**When**: Session paused (`is_currently_paused = true`)

**Banner**:
- Color: Yellow
- Icon: Pause circle
- Message: "On Break"
- Subtext: "Break time: 12 minutes"
- Action: "Resume" (button)

**Purpose**: Acknowledges break, easy to resume

---

### 6. Awaiting Photos (Cleaning Done, No Photos)
**When**: Work time complete but photos not uploaded

**Banner**:
- Color: Purple
- Icon: Camera
- Message: "Upload completion photos"
- Subtext: "0/3 photos uploaded"
- Action: "Upload Photos" (button)

**Purpose**: Reminds about photos, prevents forgetting

---

### 7. Day Wrap (All Complete)
**When**: All jobs for day completed

**Banner**:
- Color: Green
- Icon: Star
- Message: "Great work today! All cleanings complete"
- Subtext: "3 properties cleaned, 4h 25m worked"
- Action: None

**Purpose**: Positive reinforcement, summary of day

---

## State Machine Logic

### Priority-Based Transitions
States evaluated in priority order:
1. **Active** (highest priority if session in_progress)
2. **Break** (if currently paused)
3. **Awaiting Photos** (if work done but no photos)
4. **Ready** (if <30 min to start)
5. **Scheduled** (if jobs exist later)
6. **Day Wrap** (if all complete)
7. **Relax** (default/fallback)

### Time-Based Auto-Transitions
- **7 AM - 10:30 AM**: Relax → Scheduled (if jobs exist)
- **30 min before job**: Scheduled → Ready
- **Job start**: Ready → Active (when cleaner starts)
- **12 PM - 1 PM**: Active → Break prompt (if working >2 hours)
- **After last job**: Active → Day Wrap

---

## Technical Implementation

### BannerStateService
Pure logic service (no database calls):

```typescript
BannerStateService.determineState(context: BannerStateContext): BannerStateResult

// Input:
context = {
  sessions: CleaningSession[],
  currentTime: Date,
  activeSession?: CleaningSession,
  nextSession?: CleaningSession,
  userRole: 'cleaner',
  isOnline: boolean
}

// Output:
result = {
  status: BannerState,
  message: string,
  timeRemaining?: number,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  actionRequired?: boolean,
  nextAction?: string
}
```

### Component Integration
```typescript
// In CleanerStatusBanner
const bannerState = BannerStateService.determineState({
  sessions,
  currentTime: new Date(),
  activeSession,
  nextSession,
  userRole: 'cleaner',
  isOnline: realtimeConnected
});

// Render based on state
<Banner 
  color={getColorForState(bannerState.status)}
  message={bannerState.message}
  action={bannerState.nextAction}
  onActionPress={handleAction}
/>
```

---

## Unit Tests

### Test Coverage
- ✅ All 7 states can be reached
- ✅ Priority-based evaluation works correctly
- ✅ Time-based transitions accurate
- ✅ Edge cases handled (no jobs, all complete, etc.)

### Test File
`services/__tests__/bannerStateService.test.ts`

Sample tests:
- No jobs → Relax state
- Job in 2 hours → Scheduled state
- Job in 20 minutes → Ready state
- Active session → Active state
- Paused session → Break state
- Work done, no photos → Awaiting Photos state
- All complete → Day Wrap state

---

## Business Value

**For Cleaners**:
- Reduces cognitive load ("What should I do now?")
- Prevents missing job start times
- Encourages photo compliance
- Positive reinforcement when day complete

**For Platform**:
- Professional feel (like Uber driver app)
- Reduces support calls ("What's my next job?")
- Improves on-time performance
- Increases photo compliance rate

**Measured Impact**:
- On-time start rate: Target 95%+
- Photo compliance: Target 100%
- Cleaner satisfaction: Target 4.5/5

---

## Edge Cases

### Multiple Jobs Same Time
- Show most urgent one
- Badge shows "3 more jobs"

### Job Cancelled While Viewing
- Real-time update removes from list
- Banner updates to next relevant state

### All Jobs Late
- Banner shows "Overdue" in red
- Priority escalation to owner

### Offline
- Banner shows cached state
- Connection indicator shows offline
- Updates queue for when online

---

## Future Enhancements (Phase 2)

- Push notifications when state changes (e.g., "Ready to start in 15 min")
- Voice guidance option for hands-free
- Custom messages per property owner
- Achievement badges ("5 days on time!")

---

**Implementation**: `services/bannerStateService.ts`, `components/CleanerStatusBanner.tsx`  
**Tests**: `services/__tests__/bannerStateService.test.ts`  
**Dependencies**: Session state, current time, real-time connection

