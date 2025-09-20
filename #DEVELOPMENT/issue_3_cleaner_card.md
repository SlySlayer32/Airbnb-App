# 🧹 Cleaner Property Card Component

**Epic**: Enhanced Property Management System  
**Phase**: 3 - Enhanced UI Components  
**Priority**: High  
**Estimated Time**: 2-3 days  
**Depends on**: Issue #1 (Database Schema), Issue #2 (Services)

## Overview
Create a comprehensive property card specifically designed for cleaners that displays all critical information needed for successful property cleaning. This addresses the core problem of cleaners not having essential details readily available.

## Problem Statement
Cleaners currently struggle with:
- Missing or unclear access instructions (lockbox codes, smart lock codes)
- Incorrect guest counts leading to wrong linen preparation
- Hidden special requests that should be prominent
- Last-minute cancellations not clearly communicated
- Emergency contact information buried or missing
- Property-specific requirements not visible

## Requirements

### Critical Information Display
- [ ] **Guest count prominently displayed** - Primary factor for linen calculation
- [ ] **Check-in/Check-out times** - Essential for scheduling
- [ ] **Scheduled cleaning time** - When cleaner should arrive
- [ ] **Access method and codes** - Lockbox, smart lock, doorman instructions
- [ ] **Linen requirements breakdown** - Exact quantities based on guest count
- [ ] **Special areas to clean** - Pool, hot tub, BBQ area, balcony
- [ ] **WiFi credentials** - For cleaner's mobile access if needed

### Cancellation Handling
- [ ] **Cancellation overlay** - Unmistakable visual indicator
- [ ] **Cancellation timestamp** - When notice was given
- [ ] **Cancellation reason** - Why the session was cancelled
- [ ] **Short notice warning** - Less than 24 hours highlighted
- [ ] **Compensation tracking** - Future feature preparation

### Real-time Status Updates
- [ ] **Current session status** - Scheduled, confirmed, in-progress, completed
- [ ] **Today indicator** - Special highlighting for same-day sessions
- [ ] **Duration estimate** - Expected cleaning time
- [ ] **Special requests** - Owner's specific requirements
- [ ] **Guest notes** - Allergies, preferences, special needs

### Action Capabilities
- [ ] **Start cleaning button** - Begin session with confirmation
- [ ] **Report issue button** - Quick access to problem reporting
- [ ] **View details** - Access full property information
- [ ] **Emergency contact** - One-tap calling for urgent issues

## Acceptance Criteria

### Visual Design
- [ ] Mobile-first responsive design
- [ ] High contrast for outdoor visibility
- [ ] Large tap targets for work gloves
- [ ] Clear typography hierarchy
- [ ] Color coding for urgency (today, cancelled, urgent)

### Information Architecture
- [ ] Most critical info visible without scrolling
- [ ] Guest count and linen requirements prominently displayed
- [ ] Access information easily scannable
- [ ] Special requests and notes clearly differentiated
- [ ] Emergency actions readily accessible

### Interaction Design
- [ ] Smooth animations for status changes
- [ ] Loading states for all async actions
- [ ] Confirmation dialogs for critical actions
- [ ] Swipe gestures for additional actions
- [ ] Haptic feedback for important interactions

### Cancellation UX
- [ ] Cancelled sessions immediately obvious
- [ ] Cancellation details accessible but not overwhelming
- [ ] Different treatment for short-notice vs advance notice
- [ ] Clear next steps after cancellation
- [ ] Compensation information if applicable

## Component Props Interface
```typescript
interface CleanerPropertyCardProps {
  property: EnhancedProperty;
  onPress: () => void;
  onStartCleaning?: (sessionId: string) => void;
  onReportIssue?: (propertyId: string) => void;
  onEmergencyContact?: (contactInfo: string) => void;
}

interface EnhancedProperty {
  // Core property info
  id: string;
  name: string;
  address: string;
  image_url: string;
  
  // Access information
  access_method: 'key_lockbox' | 'smart_lock' | 'doorman' | 'owner_present';
  access_code?: string;
  access_instructions?: string;
  wifi_name?: string;
  wifi_password?: string;
  
  // Property features
  has_pool: boolean;
  has_hot_tub: boolean;
  has_bbq: boolean;
  has_balcony: boolean;
  special_areas?: string[];
  
  // Current session details
  current_session?: {
    guest_count: number;
    checkin_time: string;
    checkout_time: string;
    scheduled_cleaning_time: string;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    special_requests?: string;
    cancellation_reason?: string;
    cancelled_at?: string;
    linen_requirements: LinenRequirement;
  };
}
```

## Design Specifications

### Layout Hierarchy
1. **Property image** with cancellation overlay if applicable
2. **Header section** - Name, today badge, status
3. **Critical info row** - Guests, times, duration
4. **Linen requirements** - Visual breakdown of needed items
5. **Access information** - Prominent display with security
6. **Special areas/features** - Tagged list
7. **Special requests** - Highlighted if present
8. **Action buttons** - Start cleaning, report issue

### Color Coding
- **Today sessions**: Red accent for urgency
- **Confirmed sessions**: Blue for ready-to-start
- **In-progress**: Purple for active
- **Completed**: Green for finished
- **Cancelled**: Red overlay with high contrast

### Typography Scale
- Property name: 18pt bold
- Critical info: 14pt medium
- Details: 12pt regular
- Labels: 11pt medium, muted color

## Implementation Details

### File Location
```
components/CleanerPropertyCard.tsx
```

### Key Features
- Responsive card layout with shadow elevation
- Image with overlay capability for cancellations
- Sectioned information with clear visual hierarchy
- Interactive elements with proper loading states
- Accessibility support with screen reader labels

### Critical Sections
1. **Critical Info Grid** - Guest count, times in scannable format
2. **Linen Counter** - Total items needed with breakdown
3. **Access Security** - Codes shown only when needed
4. **Feature Tags** - Visual indicators for special areas
5. **Action Bar** - Primary and secondary actions

## Testing Checklist

### Visual Testing
- [ ] Renders correctly on various screen sizes
- [ ] High contrast readable in bright sunlight
- [ ] Color coding clearly distinguishable
- [ ] Typography hierarchy clear and scannable
- [ ] Interactive elements have proper touch targets

### Functional Testing
- [ ] All session statuses display correctly
- [ ] Cancellation overlay appears for cancelled sessions
- [ ] Linen requirements calculate correctly based on guest count
- [ ] Access codes display securely but clearly
- [ ] Special requests and notes prominently visible
- [ ] Action buttons trigger correct functions

### Edge Case Testing
- [ ] Properties without current sessions
- [ ] Sessions cancelled with short notice
- [ ] Properties with no special features
- [ ] Very long property names or addresses
- [ ] Missing or incomplete session data

### Accessibility Testing
- [ ] Screen reader announces all critical information
- [ ] High contrast mode compatibility
- [ ] Large text scaling support
- [ ] Voice control accessibility
- [ ] Color blind friendly design

## Files Changed
```
components/CleanerPropertyCard.tsx    # New component
types/index.ts                       # Enhanced interfaces if needed
styles/                              # Component styles
```

## Dependencies
- Enhanced property interfaces from Issue #2
- Service functions for starting cleaning and reporting issues
- Image handling for property photos
- Icon library for feature indicators

## User Stories

### Primary User Story
> "As a cleaner arriving at a property, I want to see all essential information on one card so I can prepare properly and access the property without confusion or delays."

### Specific Scenarios
- **Morning routine**: Cleaner reviews today's properties, sees guest counts, prepares appropriate linen quantities
- **Property arrival**: Cleaner sees access code clearly, follows specific instructions, connects to WiFi if needed
- **Issue discovery**: Cleaner taps report issue button, can immediately contact emergency contact if serious
- **Cancellation handling**: Cleaner sees cancellation immediately with reason, knows whether compensation applies

## Success Metrics
- [ ] Reduce property access issues by 80%
- [ ] Eliminate linen preparation errors
- [ ] Improve cleaner satisfaction scores
- [ ] Reduce coordination phone calls
- [ ] Faster issue resolution times

## Definition of Done
- [ ] Component renders all required information correctly
- [ ] Responsive design works on all target devices
- [ ] All interaction states properly implemented
- [ ] Accessibility requirements met
- [ ] Error handling for missing data
- [ ] Loading states for async operations
- [ ] Integration with service functions complete
- [ ] Unit tests passing
- [ ] Visual regression tests passing