# The 5 Critical Business Rules

## Rule 1: Cleaning Window (11 AM - 3 PM)

### Why It Matters
Airbnb guests typically checkout at 11 AM and checkin at 3 PM. This gives exactly 4 hours for turnover cleaning. Late cleanings mean guest conflicts, negative reviews, and lost revenue.

### Technical Implementation
```typescript
// Validation function
function isWithinCleaningWindow(scheduledTime: Date): boolean {
  const hour = scheduledTime.getHours();
  return hour >= 11 && hour < 15; // 11 AM to 3 PM
}

// Used in scheduling
if (!isWithinCleaningWindow(scheduledTime)) {
  throw new Error('Cleanings must be scheduled between 11 AM and 3 PM');
}
```

### Where Enforced
- **Schedule Creation**: `/services/cleaningSessionService.ts` - createSession()
- **Session Update**: Validates time before allowing changes
- **Dashboard Display**: Shows warning if session outside window

### User Experience
- ❌ **Blocked**: User cannot save cleaning outside 11 AM - 3 PM
- ⚠️ **Warning**: Yellow alert if scheduling near window edges
- ✅ **Validated**: Green indicator when time is optimal (12 PM - 2 PM)

---

## Rule 2: 24-Hour Cancellation Notice

### Why It Matters
Cleaners plan their schedules around assigned jobs. Last-minute cancellations waste their time and income. 24-hour notice gives cleaners time to find replacement work.

### Technical Implementation
```typescript
// Calculate notice period
function calculateCancellationNotice(scheduledTime: Date): number {
  const now = new Date();
  const scheduled = new Date(scheduledTime);
  const diffMs = scheduled.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  return Math.max(0, hours);
}

// Check if short notice
function isShortNotice(hours: number): boolean {
  return hours < 24;
}

// Block if too close
function canCancelSession(hours: number): boolean {
  return hours >= 1; // Must be at least 1 hour before
}
```

### Where Enforced
- **Cancel Button**: `/services/cleaningSessionService.ts` - cancelSession()
- **Schedule Screen**: Shows notice hours next to cancel button
- **Notifications**: Alerts cleaner immediately when cancellation occurs

### User Experience
- ⏱️ **> 24 hours**: Green "Cancel" button, no penalty
- ⚠️ **< 24 hours**: Red "SHORT NOTICE" warning, requires confirmation
- ❌ **< 1 hour**: Cancel button disabled, must contact cleaner directly

### Display Examples
```
48 hours notice: "Cancel (2 days notice)" [Green]
12 hours notice: "Cancel - SHORT NOTICE" [Red]
30 minutes notice: "Cannot cancel - contact cleaner" [Disabled]
```

---

## Rule 3: Financial Privacy for Cleaners

### Why It Matters
Cleaners should focus on quality work, not shopping for highest-paying jobs. Financial transparency creates rate competition and relationship problems. Professional boundaries maintain trust.

### What Cleaners NEVER See
- ❌ Hourly rates or per-job pricing
- ❌ Property owner revenue or guest rates
- ❌ Invoice totals or payment amounts
- ❌ Other cleaners' compensation
- ❌ Property profitability metrics

### What Cleaners CAN See
- ✅ Job assignment (property, time, guest count)
- ✅ Property details (address, access codes, instructions)
- ✅ Their own work history (jobs completed, hours worked)
- ✅ Performance feedback (ratings, reviews)
- ✅ Issue reports and responses

### Technical Implementation
```typescript
// Role-based access wrapper
<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <InvoiceComponent /> {/* Cleaners never see this */}
</RoleBasedWrapper>

// Database RLS policies
CREATE POLICY "Cleaners cannot see invoices"
ON invoices
FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'property_owner'));

// Service layer filtering
async getPropertyDetails(propertyId: string, userRole: string) {
  const fields = userRole === 'cleaner'
    ? 'id, name, address, access_code, special_instructions' // No financial fields
    : '*'; // Everything for owners
  
  return supabase.from('properties').select(fields).eq('id', propertyId);
}
```

### Where Enforced
- **Component Level**: `<RoleBasedWrapper>` hides financial UI
- **Service Layer**: Queries filter fields by role
- **Database Level**: Row Level Security (RLS) policies
- **Screen Access**: Invoice screen not in cleaner navigation

---

## Rule 4: Photo Proof Requirement

### Why It Matters
Photos eliminate "he said, she said" quality disputes. Visual proof protects cleaners from false complaints and gives owners confidence. Timestamped photos create audit trail.

### Minimum Requirements
**Standard Cleaning**: 3 photos required
- Kitchen (counters, sink, appliances)
- Bathroom (toilet, shower, sink)
- Living area (floors, furniture, general tidiness)

**Deep Cleaning**: 5 photos required
- Above 3 + bedrooms + outdoor areas

**Property-Specific**: Additional photos for special features
- Pool area (if property has pool)
- Hot tub (if property has hot tub)
- Balcony/patio (if listed in property features)

### Technical Implementation
```typescript
// Photo requirement generation
function generatePhotoRequirements(session: CleaningSession): PhotoRequirement[] {
  const requirements = [
    { area: 'kitchen', required: true },
    { area: 'bathroom', required: true },
    { area: 'living_area', required: true }
  ];
  
  if (session.session_type === 'deep_clean') {
    requirements.push(
      { area: 'bedroom', required: true },
      { area: 'outdoor', required: true }
    );
  }
  
  if (session.property.has_pool) {
    requirements.push({ area: 'pool', required: true });
  }
  
  return requirements;
}

// Validation before completion
function canCompleteSession(photos: Photo[], requirements: PhotoRequirement[]): boolean {
  const requiredAreas = requirements.filter(r => r.required).map(r => r.area);
  const providedAreas = photos.map(p => p.area);
  
  return requiredAreas.every(area => providedAreas.includes(area));
}
```

### Where Enforced
- **Completion Flow**: `PhotoProofGate` component blocks completion
- **Service Layer**: `cleaningSessionService.completeCleaning()` validates photos
- **UI Feedback**: Shows "3/5 photos" progress indicator
- **Database**: Stores photo_urls before allowing status change to 'completed'

### User Experience
```
Scenario 1 - Photos Complete:
"3/3 photos uploaded ✓"
[Mark Complete] button enabled

Scenario 2 - Photos Incomplete:
"1/3 photos uploaded"
[Mark Complete] button disabled
"Upload 2 more photos to complete"

Scenario 3 - No Photos:
"No photos uploaded"
[Mark Complete] button disabled
"Take 3 photos of kitchen, bathroom, and living area"
```

---

## Rule 5: Linen Auto-Calculation

### Why It Matters
Cleaners need to know exactly what to bring before arriving at property. Wrong quantities waste time or look unprofessional. System removes guesswork by auto-calculating based on guest count and property type.

### Calculation Formula
```typescript
function calculateLinenRequirements(
  guestCount: number, 
  propertyType: string
): LinenRequirements {
  return {
    // Scale with guest count
    bath_towels: guestCount * 1,        // 1 per guest
    hand_towels: guestCount * 1,        // 1 per guest
    pillow_cases: guestCount * 2,       // 2 per guest
    washcloths: guestCount * 2,         // 2 per guest
    
    // Fixed quantities
    kitchen_towels: 2,                  // Always 2
    bath_mats: 1,                       // Base 1
    
    // Property-specific additions
    pool_towels: propertyHas('pool') ? guestCount : 0,
    extra_bath_mats: (propertyType === 'villa' && guestCount > 4) ? 1 : 0
  };
}
```

### Examples

**2 Guests in Studio Apartment**:
- 2 bath towels
- 2 hand towels  
- 4 pillow cases
- 4 washcloths
- 2 kitchen towels
- 1 bath mat

**6 Guests in Villa with Pool**:
- 6 bath towels
- 6 hand towels
- 12 pillow cases
- 12 washcloths
- 2 kitchen towels
- 2 bath mats (extra for size)
- 6 pool towels (property has pool)

### Where Enforced
- **Property Details**: Displayed on property card for cleaners
- **Session Start**: Shown in job details before arrival
- **Linen Shortage Report**: Cleaner can flag if insufficient

### Technical Implementation
```typescript
// Display in component
<CleanerPropertyCard property={property}>
  <LinenRequirements linens={calculateLinenRequirements(property.max_occupancy, property.property_type)} />
</CleanerPropertyCard>

// Service layer
async getPropertyWithLinens(propertyId: string) {
  const property = await getProperty(propertyId);
  property.linen_requirements = calculateLinenRequirements(
    property.max_occupancy,
    property.property_type
  );
  return property;
}
```

---

## Rule Interaction Matrix

### How Rules Work Together

**Scheduling Flow**:
1. **Rule 1**: Validate 11 AM - 3 PM window ✓
2. **Rule 5**: Calculate linens for guest count ✓
3. Assign cleaner → Send notification with requirements

**Cancellation Flow**:
1. **Rule 2**: Calculate notice hours ✓
2. If < 24 hours → Show "SHORT NOTICE" warning
3. If < 1 hour → Block cancellation

**Completion Flow**:
1. **Rule 4**: Validate photos uploaded ✓
2. If photos complete → Allow completion
3. **Rule 3**: Cleaner doesn't see invoice amount ✓
4. Owner gets notification with photos

## Enforcement Checklist

When building new features, verify:
- [ ] Cleaning window validated (Rule 1)
- [ ] Cancellation notice calculated (Rule 2)
- [ ] Financial data hidden from cleaners (Rule 3)
- [ ] Photo requirements enforced (Rule 4)
- [ ] Linen quantities auto-calculated (Rule 5)

## Common Violations to Avoid

❌ **DON'T**: Allow scheduling at 4 PM "just this once"  
✅ **DO**: Validate all times against 11 AM - 3 PM rule

❌ **DON'T**: Show invoice totals in cleaner views  
✅ **DO**: Use RoleBasedWrapper to hide financial components

❌ **DON'T**: Allow completion without photos  
✅ **DO**: Use PhotoProofGate component to enforce

❌ **DON'T**: Let cleaners manually enter linen quantities  
✅ **DO**: Auto-calculate and display calculated amounts

❌ **DON'T**: Process cancellation without notice check  
✅ **DO**: Calculate hours and show appropriate warning

