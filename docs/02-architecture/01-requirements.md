# Requirements & Constraints

## Product Vision

A mobile-first platform connecting property owners with cleaners for Airbnb turnovers. Coordinates cleanings in the critical 4-hour window between guest checkout (11 AM) and checkin (3 PM). Tracks time, requires photo proof, and handles real-time communication.

### Problem Statement

Property owners managing Airbnb rentals face a **critical 4-hour window** between guest checkout (11 AM) and checkin (3 PM). Missing this window means unhappy guests, negative reviews, and lost revenue. Current solutions rely on texting, calls, and manual coordination - leading to miscommunication, forgotten tasks, and no proof of work quality.

### Target Users

**Property Owners** - People managing 1-50 Airbnb properties who need reliable, coordinated cleaning between guests

**Cleaners** - Professional cleaners who want clear job information, easy time tracking, and professional tools

**Co-Hosts** - Property managers who coordinate multiple properties and need visibility without full owner access

## Stakeholders

### Primary Users

#### Property Owners
**Goals**:
- Reliable cleaning coordination without constant texting
- Proof of work quality to prevent disputes
- Real-time visibility into cleaning progress
- Professional management tools

**Pain Points**:
- "Did the cleaner arrive? Did they finish? I don't know until I text them"
- "No way to prove quality when guests complain about cleanliness"
- "Cleaners show up late or forget access codes - kills my ratings"
- "I'm texting 5 different cleaners trying to coordinate turnover day"

#### Cleaners
**Goals**:
- Clear job information before arriving at property
- Fair time tracking for accurate billing
- Professional tools for quality work
- Easy issue reporting

**Pain Points**:
- "I drive to a property and don't have the access code"
- "Property owner disputes how long I worked - it's my word vs theirs"
- "I report issues via text and they get lost in message history"
- "No clear system for breaks - get accused of taking too long"

#### Co-Hosts
**Goals**:
- Visibility into property operations
- Ability to coordinate without full owner access
- Monitor cleaning quality
- Report issues on behalf of owner

**Pain Points**:
- "I need to see what's happening but don't need to manage everything"
- "Can't help coordinate without bothering the owner constantly"

## Business Rules

### Rule 1: Cleaning Window (11 AM - 3 PM)

**Why**: Airbnb guests typically checkout at 11 AM and checkin at 3 PM. This gives exactly 4 hours for turnover cleaning. Late cleanings mean guest conflicts, negative reviews, and lost revenue.

**Implementation**:
```typescript
function isWithinCleaningWindow(scheduledTime: Date): boolean {
  const hour = scheduledTime.getHours();
  return hour >= 11 && hour < 15; // 11 AM to 3 PM
}
```

**Enforcement**:
- Schedule Creation: Validates time before saving
- Session Update: Blocks changes outside window
- Dashboard Display: Shows warning if session outside window

**User Experience**:
- ❌ **Blocked**: User cannot save cleaning outside 11 AM - 3 PM
- ⚠️ **Warning**: Yellow alert if scheduling near window edges
- ✅ **Validated**: Green indicator when time is optimal (12 PM - 2 PM)

### Rule 2: 24-Hour Cancellation Notice

**Why**: Cleaners plan their schedules around assigned jobs. Last-minute cancellations waste their time and income. 24-hour notice gives cleaners time to find replacement work.

**Implementation**:
```typescript
function calculateCancellationNotice(scheduledTime: Date): number {
  const now = new Date();
  const scheduled = new Date(scheduledTime);
  const diffMs = scheduled.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  return Math.max(0, hours);
}

function canCancelSession(hours: number): boolean {
  return hours >= 1; // Must be at least 1 hour before
}
```

**Enforcement**:
- Cancel Button: Validates notice period
- Schedule Screen: Shows notice hours next to cancel button
- Notifications: Alerts cleaner immediately when cancellation occurs

**User Experience**:
- ⏱️ **> 24 hours**: Green "Cancel" button, no penalty
- ⚠️ **< 24 hours**: Red "SHORT NOTICE" warning, requires confirmation
- ❌ **< 1 hour**: Cancel button disabled, must contact cleaner directly

### Rule 3: Financial Privacy for Cleaners

**Why**: Cleaners should focus on quality work, not shopping for highest-paying jobs. Financial transparency creates rate competition and relationship problems. Professional boundaries maintain trust.

**What Cleaners NEVER See**:
- ❌ Hourly rates or per-job pricing
- ❌ Property owner revenue or guest rates
- ❌ Invoice totals or payment amounts
- ❌ Other cleaners' compensation
- ❌ Property profitability metrics

**What Cleaners CAN See**:
- ✅ Job assignment (property, time, guest count)
- ✅ Property details (address, access codes, instructions)
- ✅ Their own work history (jobs completed, hours worked)
- ✅ Performance feedback (ratings, reviews)
- ✅ Issue reports and responses

**Enforcement**:
- Component Level: `<RoleBasedWrapper>` hides financial UI
- Service Layer: Queries filter fields by role
- Database Level: Row Level Security (RLS) policies
- Screen Access: Invoice screen not in cleaner navigation

### Rule 4: Photo Proof Requirement

**Why**: Photos eliminate "he said, she said" quality disputes. Visual proof protects cleaners from false complaints and gives owners confidence. Timestamped photos create audit trail.

**Minimum Requirements**:
- **Standard Cleaning**: 3 photos required
  - Kitchen (counters, sink, appliances)
  - Bathroom (toilet, shower, sink)
  - Living area (floors, furniture, general tidiness)
- **Deep Cleaning**: 5 photos required (above 3 + bedrooms + outdoor areas)

**Implementation**:
```typescript
function canCompleteSession(photos: Photo[], requirements: PhotoRequirement[]): boolean {
  const requiredAreas = requirements.filter(r => r.required).map(r => r.area);
  const providedAreas = photos.map(p => p.area);

  return requiredAreas.every(area => providedAreas.includes(area));
}
```

**Enforcement**:
- Completion Flow: `PhotoProofGate` component blocks completion
- Service Layer: `cleaningSessionService.completeCleaning()` validates photos
- UI Feedback: Shows "3/5 photos" progress indicator
- Database: Stores photo_urls before allowing status change to 'completed'

### Rule 5: Linen Auto-Calculation

**Why**: Cleaners need to know exactly what to bring before arriving at property. Wrong quantities waste time or look unprofessional. System removes guesswork by auto-calculating based on guest count and property type.

**Calculation Formula**:
```typescript
function calculateLinenRequirements(
  guestCount: number,
  propertyType: string
): LinenRequirements {
  return {
    bath_towels: guestCount * 1,        // 1 per guest
    hand_towels: guestCount * 1,        // 1 per guest
    pillow_cases: guestCount * 2,       // 2 per guest
    washcloths: guestCount * 2,         // 2 per guest
    kitchen_towels: 2,                  // Always 2
    bath_mats: 1,                       // Base 1
    pool_towels: propertyHas('pool') ? guestCount : 0,
    extra_bath_mats: (propertyType === 'villa' && guestCount > 4) ? 1 : 0
  };
}
```

**Enforcement**:
- Property Details: Displayed on property card for cleaners
- Session Start: Shown in job details before arrival
- Linen Shortage Report: Cleaner can flag if insufficient

## Quality Goals

### Performance
- Property loading: < 200ms
- Real-time updates: < 2 second latency
- Photo upload: < 5 seconds per photo
- App startup: < 3 seconds

### Reliability
- 99.9% uptime target
- Graceful degradation when offline
- Demo mode fallback when Supabase unavailable
- Error recovery without data loss

### Usability
- Actions complete in 1-2 taps maximum
- Clear error messages (no technical jargon)
- Loading states for all async operations
- Empty states with helpful guidance

### Security
- Role-based access control (3 levels: UI, Service, Database)
- Financial data hidden from cleaners
- Row Level Security (RLS) on all tables
- Secure photo storage with access control

## Constraints

### Technical Constraints
- **Mobile-First**: Must work on iOS, Android, and Web
- **Offline Capable**: Core features work without internet
- **TypeScript Strict**: No 'any' types allowed
- **React Native**: Expo SDK 54 required
- **Supabase**: PostgreSQL database with RLS

### Business Constraints
- **4-Hour Window**: Cleanings must fit in 11 AM - 3 PM
- **24-Hour Notice**: Cancellations require minimum notice
- **Photo Proof**: Minimum 3 photos required
- **Financial Privacy**: Cleaners never see pricing
- **Demo Mode**: App must work without Supabase configured

### Resource Constraints
- **Team Size**: Small team (1-3 developers)
- **Budget**: Limited infrastructure costs
- **Timeline**: Rapid iteration required
- **Maintenance**: Minimal ongoing maintenance

## Success Metrics

### For Cleaners
- Time from app open → session start: < 30 seconds
- Sessions with complete photo sets: 100%
- Issues reported vs resolved: track issue resolution rate
- On-time arrival rate: sessions started within 15 min of checkout

### For Property Owners
- Dispute rate: < 1% (photo proof system should eliminate most)
- Cleaner no-show rate: < 2%
- Average coordination time: reduce from 30 min → 5 min
- Owner satisfaction score: > 4.5/5

### For Business
- Monthly active users (MAU) growth
- Sessions completed per month
- Average revenue per property
- Customer churn rate: < 5% monthly

## Future Requirements (Phase 2+)

### Advanced Scheduling
- Calendar integration (Airbnb, VRBO, Google Calendar)
- Multi-property route optimization
- Automatic scheduling based on checkout times
- Recurring cleaning schedules

### Performance Analytics
- Cleaner efficiency metrics
- Property cleaning history
- Issue frequency tracking
- Cost analysis and trends

### Team Management
- Multiple cleaner assignment
- Performance ratings and reviews
- Availability management
- Training and certification tracking

### Financial Automation
- Automated invoice generation
- Payment processing integration
- Cleaner payout automation
- Cost breakdown by property

---

**Remember**: These requirements form the foundation of all technical decisions. Every feature must align with these business rules and quality goals.

