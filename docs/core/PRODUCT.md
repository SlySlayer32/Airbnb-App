# Product Vision

## What Problem Does This Solve?

Property owners managing Airbnb rentals face a **critical 4-hour window** between guest checkout (11 AM) and checkin (3 PM). Missing this window means unhappy guests, negative reviews, and lost revenue. Current solutions rely on texting, calls, and manual coordination - leading to miscommunication, forgotten tasks, and no proof of work quality.

## Who Is This For?

### Primary Users
**Property Owners** - People managing 1-50 Airbnb properties who need reliable, coordinated cleaning between guests

**Cleaners** - Professional cleaners who want clear job information, easy time tracking, and professional tools

**Co-Hosts** - Property managers who coordinate multiple properties and need visibility without full owner access

### User Pain Points

**Property Owners**:
- "Did the cleaner arrive? Did they finish? I don't know until I text them"
- "No way to prove quality when guests complain about cleanliness"
- "Cleaners show up late or forget access codes - kills my ratings"
- "I'm texting 5 different cleaners trying to coordinate turnover day"

**Cleaners**:
- "I drive to a property and don't have the access code"
- "Property owner disputes how long I worked - it's my word vs theirs"
- "I report issues via text and they get lost in message history"
- "No clear system for breaks - get accused of taking too long"

## Core Features (MVP - Phase 1 Complete)

### 1. Cleaner Dashboard
**What It Does**: Real-time view of today's cleaning jobs with smart guidance  
**User Value**: Cleaners know exactly what to do next, no confusion  
**Key Features**:
- Live status banner (7 intelligent states)
- Next job card with countdown timer
- Active session tracking with pause/resume
- Priority-coded job cards (urgent/high/medium/normal)

### 2. Session Lifecycle Management
**What It Does**: Complete time tracking from start to finish  
**User Value**: Accurate billing, dispute prevention, professional audit trail  
**Key Features**:
- Start cleaning (arrival timestamp)
- Pause/resume (break time isolation)
- Complete cleaning (finish timestamp)
- Effective working time calculation (excludes breaks)

### 3. Photo Proof System
**What It Does**: Requires photo evidence before completing cleaning  
**User Value**: Eliminates "he said, she said" quality disputes  
**Key Features**:
- Minimum 3 photos required (kitchen, bathroom, living area)
- Cannot mark complete without photos
- Timestamped photo metadata
- Visual quality verification for owners

### 4. Real-time Coordination
**What It Does**: Live updates between cleaners and property owners  
**User Value**: Reduces communication overhead, instant status visibility  
**Key Features**:
- Automatic status notifications
- Connection status tracking
- Real-time dashboard updates
- Offline graceful degradation

## Future Features (Post-Launch - Phase 2)

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

### Maintenance Integration
- Issue ticket workflow
- Contractor coordination
- Supply inventory tracking
- Lost & found logging

## Business Model

**Phase 1 (Current)**: Internal tool for property management businesses  
**Phase 2 (Future)**: Marketplace model ("Uber for Home Services")

### Revenue Streams (Future)
- **Subscription**: Monthly fee per property owner
- **Commission**: 5-15% per cleaning job (tiered based on subscription)
- **Add-ons**: Premium features (analytics, integrations, priority support)

## User Flows

### How Property Owners Schedule a Cleaning

1. Owner logs in to dashboard
2. Clicks "Schedule Cleaning" from properties screen
3. Selects property from list
4. Picks date and time (validated to 11 AM - 3 PM window)
5. Enters guest count (auto-calculates linen needs)
6. Assigns cleaner from team list
7. Adds special instructions (optional)
8. Clicks "Confirm" → cleaner gets notification

**Result**: Cleaning scheduled, cleaner notified, owner can track progress in real-time

### How Cleaners Complete a Job

1. Cleaner opens app → sees next job card with countdown
2. Reviews property details (address, access code, special instructions)
3. Drives to property
4. Taps "Start Cleaning" → starts time tracking
5. Works through cleaning (can pause for breaks)
6. Taps "Mark Complete" → photo proof gate appears
7. Takes 3+ photos (kitchen, bathroom, living area)
8. Adds completion notes (optional)
9. Confirms completion → owner gets notification with photos

**Result**: Time tracked accurately, proof delivered, owner satisfied, cleaner paid fairly

### How Owners Verify Quality

1. Owner gets notification "Cleaning completed"
2. Opens app → sees completion summary
3. Reviews timestamped photos (before/after if available)
4. Checks completion time (was it on schedule?)
5. Views cleaner notes
6. Can report issues if needed
7. Approves completion

**Result**: Visual proof of quality, dispute prevention, confidence for next guest

## Design Preferences

**Visual Style**: Clean, professional, minimal (like Linear or Notion)  
**Primary Color**: Blue (#007AFF) - trust, professionalism  
**Typography**: System fonts (San Francisco on iOS, Roboto on Android)  
**Spacing**: Generous white space, not cramped  
**Mobile-First**: Optimized for phone screens (cleaners work on mobile)

**User Experience Principles**:
- **Fast**: Actions complete in 1-2 taps maximum
- **Clear**: Always obvious what to do next
- **Forgiving**: Easy to undo/correct mistakes  
- **Honest**: Loading and error states clearly communicated
- **Helpful**: Context-aware guidance (smart banner system)

## Critical Business Rules

### 1. Cleaning Window (11 AM - 3 PM)
All cleanings MUST be scheduled within this window. Late cleanings cause guest conflicts and negative reviews. System validates time before saving.

### 2. 24-Hour Cancellation Notice
Cancellations with less than 24 hours notice are flagged as "SHORT NOTICE" in red. Helps cleaners plan schedules and reduces last-minute chaos.

### 3. Financial Privacy for Cleaners
Cleaners NEVER see rates, pricing, or owner revenue. This prevents rate shopping and maintains professional boundaries.

### 4. Photo Proof Requirement
Sessions cannot be marked complete without minimum photos. Protects both parties from disputes and ensures quality standards.

### 5. Linen Auto-Calculation
System automatically calculates linen requirements based on guest count and property type. Prevents preparation errors and ensures cleaner arrives ready.

## Success Metrics

**For Cleaners**:
- Time from app open → session start: < 30 seconds
- Sessions with complete photo sets: 100%
- Issues reported vs resolved: track issue resolution rate
- On-time arrival rate: sessions started within 15 min of checkout

**For Property Owners**:
- Dispute rate: < 1% (photo proof system should eliminate most)
- Cleaner no-show rate: < 2%
- Average coordination time: reduce from 30 min → 5 min
- Owner satisfaction score: > 4.5/5

**For Business**:
- Monthly active users (MAU) growth
- Sessions completed per month
- Average revenue per property
- Customer churn rate: < 5% monthly

## Market Opportunity

**Current Market**: $2.3B property management software market  
**Future Market**: $500B+ home services marketplace (expanding beyond cleaning)

**Competitive Advantage**:
- First platform with real-time GPS tracking for home services
- Lower commission structure than TaskRabbit (20%) or Handy (20%)
- Built specifically for Airbnb turnover window (not general cleaning)
- Integrated time tracking and proof systems (not bolt-on features)

## Vision Statement

**Phase 1**: Replace texts, calls, and spreadsheets with professional coordination platform  
**Phase 2**: Become the "Uber for Home Services" - on-demand, GPS-tracked, quality-guaranteed marketplace

We're building trust through transparency. Every cleaning tracked, every issue logged, every job proven with photos. Property owners sleep easy. Cleaners work professionally. Guests arrive to spotless properties. Everyone wins.

