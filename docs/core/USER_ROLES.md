# User Roles & Permissions

## Overview

Three distinct user roles with different permissions and access levels:
- **property_owner**: Full control (manages everything)
- **cleaner**: Limited access (executes work, no financial data)
- **co_host**: View-only coordination (helps owners, cannot modify billing)

---

## 🏢 property_owner (Full Access)

### Can Do

**Property Management**:
- ✅ Add new properties to platform
- ✅ Edit property details (address, access codes, WiFi, instructions)
- ✅ Set property status (active, maintenance, inactive)
- ✅ Upload property photos
- ✅ Configure linen requirements
- ✅ Archive/delete properties

**Team Management**:
- ✅ Invite cleaners and co-hosts to platform
- ✅ Assign cleaners to specific properties
- ✅ Remove team members from properties
- ✅ View cleaner performance metrics
- ✅ Access cleaner contact information

**Scheduling**:
- ✅ Create cleaning sessions for any owned property
- ✅ Assign sessions to cleaners
- ✅ Reschedule cleanings
- ✅ Cancel cleanings (with notice validation)
- ✅ Set recurring cleaning schedules

**Monitoring & Communication**:
- ✅ View real-time cleaning progress
- ✅ See cleaner arrival/completion timestamps
- ✅ Review completion photos
- ✅ Receive notifications for all session events
- ✅ Send messages to cleaners
- ✅ View cleaning history for any property

**Financial Access**:
- ✅ View all invoices and payments
- ✅ See pricing breakdowns by session
- ✅ Generate financial reports
- ✅ Set cleaner rates (if applicable)
- ✅ Track revenue per property
- ✅ Export financial data

**Issue Management**:
- ✅ View all reported maintenance issues
- ✅ Assign contractors to resolve issues
- ✅ Mark issues as resolved
- ✅ Track issue history by property

### Cannot Do
- ❌ Access properties owned by other users
- ❌ See other property owners' financial data
- ❌ Modify system-wide settings or configurations
- ❌ Impersonate other users

### Navigation Access
All screens accessible:
- `/` (Dashboard with stats)
- `/properties` (Full CRUD access)
- `/schedule` (Create, edit, cancel)
- `/team` (Add, edit, remove)
- `/invoices` (Full financial access)
- `/maintenance` (Full issue management)
- `/reports` (Analytics and trends)
- `/profile` (Edit own profile)

---

## 🧹 cleaner (Limited Operational Access)

### Can Do

**Job Access**:
- ✅ View assigned cleaning sessions only
- ✅ See today's job list with priorities
- ✅ Access property details (address, access codes, WiFi, instructions)
- ✅ View linen requirements
- ✅ See special cleaning instructions

**Session Management**:
- ✅ Mark session as started (arrival)
- ✅ Pause session (break tracking)
- ✅ Resume session (after breaks)
- ✅ Upload completion photos
- ✅ Mark session as complete
- ✅ Add completion notes

**Communication**:
- ✅ Report maintenance issues with photos
- ✅ Send progress updates to owners
- ✅ Mark issues as urgent
- ✅ View owner responses to issues
- ✅ Access emergency contact for property

**Personal Data**:
- ✅ View own work history
- ✅ See own completed job count
- ✅ View own performance ratings (aggregate only)
- ✅ Edit own profile (name, phone, photo)
- ✅ Update availability

### Cannot Do (SECURITY RESTRICTIONS)

**Financial Restrictions** (CRITICAL):
- ❌ See any pricing, rates, or financial amounts
- ❌ View invoices (neither property owner invoices nor own)
- ❌ Access payment information
- ❌ See property revenue or profitability
- ❌ View what owners charge guests
- ❌ Compare rates between properties

**Property Restrictions**:
- ❌ View properties they're not assigned to
- ❌ Edit property details or instructions
- ❌ Change access codes or WiFi passwords
- ❌ Delete or archive properties
- ❌ Assign other cleaners to properties

**Scheduling Restrictions**:
- ❌ Create new cleaning sessions
- ❌ Assign themselves to new properties
- ❌ Modify scheduled times
- ❌ Cancel sessions (must request owner cancellation)
- ❌ View other cleaners' schedules

**Team Restrictions**:
- ❌ See other cleaners' contact information
- ❌ View other cleaners' work history
- ❌ Access team management screen
- ❌ Invite new team members

### Navigation Access
Limited screens only:
- `/` (Cleaner dashboard with active jobs)
- `/properties` (Assigned properties only, no financial data)
- `/schedule` (Own schedule only, read-only)
- `/maintenance` (Report issues, view responses)
- `/profile` (Edit own profile)

**Hidden Screens**:
- ~~`/team`~~ (No access to team management)
- ~~`/invoices`~~ (No financial access)
- ~~`/reports`~~ (No analytics access)

### Technical Enforcement

**Component Level**:
```typescript
// Financial components wrapped
<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <InvoiceCard />
</RoleBasedWrapper>

// Cleaner dashboard shows different content
if (userRole === 'cleaner') {
  return <CleanerDashboard />;
} else {
  return <OwnerDashboard />;
}
```

**Service Level**:
```typescript
// Query filters by role
async getProperties(userRole: string) {
  if (userRole === 'cleaner') {
    // Only assigned properties, no financial fields
    return supabase
      .from('properties')
      .select('id, name, address, access_code')
      .in('id', assignedPropertyIds);
  } else {
    // All properties with full details
    return supabase
      .from('properties')
      .select('*')
      .eq('owner_id', userId);
  }
}
```

**Database Level (RLS)**:
```sql
-- Cleaners can only see assigned properties
CREATE POLICY "cleaners_view_assigned" ON properties
FOR SELECT USING (
  id IN (
    SELECT property_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'cleaner'
  )
);

-- Cleaners cannot see invoices at all
CREATE POLICY "cleaners_no_invoices" ON invoices
FOR ALL USING (
  auth.uid() NOT IN (SELECT id FROM profiles WHERE role = 'cleaner')
);
```

---

## 🤝 co_host (Coordination Access)

### Can Do

**Property Viewing**:
- ✅ View assigned properties (owner grants access)
- ✅ See property details and instructions
- ✅ Access property cleaning history
- ✅ View maintenance issues

**Schedule Viewing**:
- ✅ See cleaning schedules for assigned properties
- ✅ View cleaner assignments
- ✅ Monitor cleaning progress
- ✅ Receive notifications for assigned properties

**Communication**:
- ✅ Send messages to cleaners
- ✅ View cleaning updates
- ✅ Report issues on behalf of owner
- ✅ Coordinate with cleaners

**Limited Financial**:
- ✅ View invoice summaries (read-only)
- ✅ See property-level cost breakdown
- ❌ Cannot process payments
- ❌ Cannot modify pricing

### Cannot Do

**Property Restrictions**:
- ❌ Add new properties
- ❌ Delete properties
- ❌ Modify critical property details
- ❌ Change access codes (view only)

**Team Restrictions**:
- ❌ Add or remove cleaners
- ❌ Modify cleaner assignments (owner approval needed)
- ❌ Set cleaner rates

**Scheduling Restrictions**:
- ❌ Create new cleaning sessions (can request owner to create)
- ❌ Cancel sessions (can request cancellation)
- ❌ Modify scheduled times

**Financial Restrictions**:
- ❌ Process payments
- ❌ Modify invoice amounts
- ❌ Set pricing or rates
- ❌ Delete financial records

### Navigation Access
Most screens with read-only mode:
- `/` (Dashboard with limited stats)
- `/properties` (View assigned properties)
- `/schedule` (View schedules, cannot edit)
- `/maintenance` (View and report issues)
- `/invoices` (Read-only access)
- `/reports` (View analytics, cannot export financials)
- `/profile` (Edit own profile)

**Hidden Screens**:
- ~~`/team`~~ (Cannot manage team members)

---

## Role Comparison Matrix

| Feature | property_owner | cleaner | co_host |
|---------|---------------|---------|---------|
| **View properties** | All owned | Assigned only | Assigned only |
| **Edit properties** | Full access | No access | No access |
| **Create sessions** | Yes | No | No |
| **Start sessions** | No | Yes (assigned) | No |
| **Complete sessions** | No | Yes (assigned) | No |
| **View financials** | Full access | NO ACCESS | Read-only |
| **Process payments** | Yes | NO ACCESS | No |
| **Team management** | Full access | No access | No access |
| **Report issues** | Yes | Yes | Yes |
| **View analytics** | Full access | Own stats only | Assigned properties |

---

## Security Implementation Checklist

When building new features:
- [ ] Wrap financial components in `<RoleBasedWrapper allowedRoles={['property_owner']}>`
- [ ] Filter service queries by user role
- [ ] Verify RLS policies block unauthorized access
- [ ] Test with all three user roles
- [ ] Ensure cleaners cannot see any pricing data
- [ ] Co-hosts have read-only access where appropriate

## Common Access Control Patterns

```typescript
// Hide entire feature from role
<RoleBasedWrapper allowedRoles={['property_owner']}>
  <FinancialDashboard />
</RoleBasedWrapper>

// Show different content per role
function DashboardScreen() {
  const { profile } = useAuth();
  
  if (profile?.role === 'cleaner') {
    return <CleanerDashboard />;
  } else if (profile?.role === 'co_host') {
    return <CoHostDashboard />;
  } else {
    return <OwnerDashboard />;
  }
}

// Service method with role filtering
async getData(userId: string, userRole: string) {
  if (userRole === 'cleaner') {
    return this.getCleanerData(userId);
  } else {
    return this.getOwnerData(userId);
  }
}
```

---

**Remember**: Role-based access is a security feature. Always enforce at three levels: UI (components), API (services), and Database (RLS).

