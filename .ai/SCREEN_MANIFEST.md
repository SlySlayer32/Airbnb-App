# 📱 Screen Manifest

> Complete directory of all 13 screens with routes and purposes

## 📋 Table of Contents
- [Overview](#overview)
- [Main Screens](#main-screens)
- [Authentication Screens](#authentication-screens)
- [Route Hierarchy](#route-hierarchy)
- [Screen Patterns](#screen-patterns)

## 📊 Overview

### Screen Structure
```
Total Screens: 13

By Category:
├── Dashboard: 1 screen
├── Main Features: 8 screens
├── Authentication: 3 screens
└── Special Purpose: 1 screen

Navigation Type:
├── Expo Router (file-based routing)
├── Stack navigation for auth (modals)
└── Tabs for main features
```

### Navigation Pattern
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/screen-name');
```

---

## 🏠 Main Screens

### index.tsx (Dashboard)
**Route**: `/`  
**Purpose**: Role-specific dashboard landing page  
**Access**: All authenticated users  
**Layout**: Root layout with auth guard

**Content by Role**:
- **property_owner**: Property overview, active cleanings, stats, quick actions
- **cleaner**: Active session card, next job card, status banner
- **co_host**: Property list, schedule overview, coordination tools

**Components Used**:
- `CleanerDashboard` (for cleaners)
- `DashboardStats` (for owners/co-hosts)
- `OwnerPropertyCard` (for owners)
- `QuickActions` (all roles)

**Data Fetched**:
```typescript
// Cleaner
- Active cleaning sessions
- Next scheduled jobs
- Today's completed count

// Owner/Co-host
- All properties with status
- Active cleanings count
- Today's completed count
- Upcoming this week count
```

**Example**:
```typescript
// In app/index.tsx
export default function Dashboard() {
  const { profile } = useAuth();
  
  if (profile?.role === 'cleaner') {
    return <CleanerDashboard />;
  }
  
  return <OwnerDashboard />;
}
```

---

### properties.tsx
**Route**: `/properties`  
**Purpose**: Property management and listing  
**Access**: All roles (filtered by permission)

**Content by Role**:
- **property_owner**: Full property list with edit/delete, add new property
- **cleaner**: Assigned properties with access codes and instructions
- **co_host**: View properties they coordinate (no edit/delete)

**Features**:
- Search/filter properties
- Sort by status, name, location
- Add new property (owner only)
- View property details
- Quick schedule cleaning (owner)

**Components Used**:
- `OwnerPropertyCard` (owner/co-host)
- `CleanerPropertyCard` (cleaner)
- `RoleBasedWrapper` (for add/edit buttons)

**Navigation**:
```typescript
// View property detail
router.push(`/properties/${propertyId}`);

// Add new property (owner only)
router.push('/properties/new');
```

---

### schedule.tsx
**Route**: `/schedule`  
**Purpose**: Calendar view of all cleaning schedules  
**Access**: All roles (filtered by permission)

**Content by Role**:
- **property_owner**: All scheduled cleanings, create new, cancel
- **cleaner**: Personal schedule, assigned jobs only
- **co_host**: View schedules, limited coordination

**Features**:
- Calendar/list view toggle
- Filter by property, date range, status
- Create new cleaning schedule (owner)
- Cancel with notice period warning
- View session details

**Components Used**:
- `ScheduleCard` (session display)
- `RoleBasedWrapper` (for create/cancel)

**Business Rules**:
- Shows cancellation notice countdown
- Flags short notice (< 24 hrs) in red
- Validates cleaning window (11 AM - 3 PM)

**Data Displayed**:
```typescript
{
  property_name: string;
  scheduled_time: Date;
  assigned_cleaner: string;
  guest_count: number;
  status: SessionStatus;
  cancellation_notice_hours?: number;
}
```

---

### team.tsx
**Route**: `/team`  
**Purpose**: Team member management  
**Access**: property_owner, co_host (read-only)

**Content**:
- List all team members (cleaners, co-hosts)
- View member details and performance
- Add new team members (owner only)
- Assign to properties
- Remove from team (owner only)

**Features**:
- Search team members
- Filter by role (cleaner, co-host)
- View performance ratings
- Contact information
- Assigned property count

**Components Used**:
- `TeamMemberCard`
- `RoleBasedWrapper` (for add/remove)

**Navigation**:
```typescript
// View member detail
router.push(`/team/${memberId}`);

// Add new member
router.push('/team/new');
```

---

### invoices.tsx
**Route**: `/invoices`  
**Purpose**: Financial management and billing  
**Access**: property_owner only

**Security**: 
- Cleaners NEVER have access (enforced at layout level)
- Co-hosts can view but not modify (read-only)

**Features**:
- List all invoices
- Filter by status (paid, pending, overdue)
- Generate new invoice
- Mark as paid
- Download PDF
- Payment history

**Components Used**:
- `InvoiceCard`
- `RoleBasedWrapper` (entire screen)

**Data Displayed**:
```typescript
{
  invoice_number: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date: Date;
  property_name?: string;
  cleaner_name?: string;
}
```

**Navigation**:
```typescript
// View invoice detail
router.push(`/invoices/${invoiceId}`);
```

---

### maintenance.tsx
**Route**: `/maintenance`  
**Purpose**: Maintenance ticket tracking system  
**Access**: All roles

**Content by Role**:
- **property_owner**: All tickets, create, assign, resolve
- **cleaner**: Report new issues with photos, view responses
- **co_host**: View tickets, coordinate resolution

**Features**:
- List all tickets
- Filter by status (open, in-progress, resolved)
- Filter by priority (urgent, high, normal)
- Create new ticket with photos
- Assign to contractors
- Add comments/updates
- Mark as resolved

**Components Used**:
- `MaintenanceCard`
- `RoleBasedWrapper` (for resolution actions)

**Priority Indicators**:
- **Urgent**: Red banner, immediate notification
- **High**: Orange border, notification
- **Normal**: Standard display

**Data Displayed**:
```typescript
{
  title: string;
  description: string;
  property_name: string;
  reported_by: string;
  priority: 'urgent' | 'high' | 'normal';
  status: 'open' | 'in_progress' | 'resolved';
  photo_urls: string[];
  created_at: Date;
}
```

---

### reports.tsx
**Route**: `/reports`  
**Purpose**: Performance analytics and reporting  
**Access**: property_owner, co_host (read-only)

**Features**:
- Cleaning completion trends
- Cleaner performance metrics
- Property utilization rates
- Average cleaning duration
- Issue frequency by property
- Financial summaries (owner only)

**Report Types**:
- Daily/weekly/monthly views
- Export to PDF/CSV
- Custom date ranges
- Filter by property or cleaner

**Charts/Visualizations**:
- Completion rate line chart
- Issue type pie chart
- Cleaner performance bar chart
- Property status overview

**Navigation**:
```typescript
// View detailed report
router.push(`/reports/${reportType}`);
```

---

### profile.tsx
**Route**: `/profile`  
**Purpose**: User account settings and preferences  
**Access**: All authenticated users

**Features**:
- View/edit profile information
- Update contact details
- Change password
- Notification preferences
- Language settings (future)
- Dark mode toggle (future)
- Logout

**Data Editable**:
```typescript
{
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  notification_preferences: {
    push_enabled: boolean;
    email_enabled: boolean;
    sms_enabled: boolean;
  };
}
```

**Actions**:
```typescript
// Update profile
await updateProfile(updates);

// Change password
await changePassword(oldPassword, newPassword);

// Logout
await signOut();
router.replace('/auth/login');
```

---

### onboarding.tsx
**Route**: `/onboarding`  
**Purpose**: First-time user setup wizard  
**Access**: New authenticated users only

**Redirect Logic**:
- Triggered after first login
- Skipped if `profile.onboarded === true`
- Redirects to dashboard on completion

**Steps**:
1. Welcome and role confirmation
2. Profile completion (name, phone, avatar)
3. Notification preferences setup
4. Quick tutorial (role-specific)
5. (Owner) Add first property
6. (Cleaner) Review assigned properties

**Navigation**:
```typescript
// Complete onboarding
await updateProfile({ onboarded: true });
router.replace('/');
```

---

## 🔐 Authentication Screens

### auth/login.tsx
**Route**: `/auth/login`  
**Purpose**: User authentication  
**Access**: Public (unauthenticated)  
**Presentation**: Modal

**Features**:
- Email/password login
- "Remember me" checkbox
- Error handling (invalid credentials, network)
- Link to register and forgot password
- Demo mode access (for testing)

**Form Fields**:
```typescript
{
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

**Success Flow**:
```typescript
await signIn(email, password);
// If not onboarded → router.replace('/onboarding')
// Else → router.replace('/')
```

**Links**:
- "Don't have an account? Register" → `/auth/register`
- "Forgot password?" → `/auth/forgot-password`

---

### auth/register.tsx
**Route**: `/auth/register`  
**Purpose**: New user registration  
**Access**: Public (unauthenticated)  
**Presentation**: Modal

**Features**:
- Email/password registration
- Name and phone collection
- Role selection (property_owner, cleaner, co_host)
- Password strength indicator
- Terms of service acceptance
- Email verification (optional)

**Form Fields**:
```typescript
{
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  acceptTerms: boolean;
}
```

**Validation**:
- Email format check
- Password minimum length (8 chars)
- Password match confirmation
- Required terms acceptance

**Success Flow**:
```typescript
await signUp(email, password, profile);
// → router.replace('/onboarding')
```

---

### auth/forgot-password.tsx
**Route**: `/auth/forgot-password`  
**Purpose**: Password reset flow  
**Access**: Public (unauthenticated)  
**Presentation**: Modal

**Features**:
- Email address input
- Send reset link to email
- Success confirmation message
- Return to login link

**Form Fields**:
```typescript
{
  email: string;
}
```

**Flow**:
1. User enters email
2. System sends reset link to email
3. User clicks link (opens in browser)
4. User enters new password
5. Redirect to login

---

## 🗺️ Route Hierarchy

```
/ (Root Layout with AuthGuard)
├── / (index.tsx) - Dashboard
├── /properties - Property management
│   └── /properties/[id] - Property detail (future)
├── /schedule - Cleaning schedule
│   └── /schedule/[id] - Session detail (future)
├── /team - Team management
│   └── /team/[id] - Member detail (future)
├── /invoices - Financial management (owner only)
│   └── /invoices/[id] - Invoice detail (future)
├── /maintenance - Ticket tracking
│   └── /maintenance/[id] - Ticket detail (future)
├── /reports - Analytics
│   └── /reports/[type] - Specific report (future)
├── /profile - User settings
├── /onboarding - First-time setup
└── /auth (Modal Group)
    ├── /auth/login - Authentication
    ├── /auth/register - New account
    └── /auth/forgot-password - Password reset
```

---

## 🔄 Screen Patterns

### Standard Screen Structure
```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function ScreenName() {
  const { profile } = useAuth();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await someService.getData();
      setData(result);
    } catch (error) {
      console.error('Load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Screen content */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
```

### Auth Guard Pattern (in _layout.tsx)
```typescript
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/properties') {
        router.replace('/auth/login');
      } else if (user && profile && !profile.onboarded) {
        router.replace('/onboarding');
      }
    }
  }, [user, profile, loading, pathname]);

  if (loading) return <LoadingScreen />;
  return <>{children}</>;
}
```

### Role-Based Content Pattern
```typescript
export default function ScreenName() {
  const { profile } = useAuth();
  
  if (profile?.role === 'cleaner') {
    return <CleanerView />;
  }
  
  if (profile?.role === 'property_owner') {
    return <OwnerView />;
  }
  
  return <CoHostView />;
}
```

### Pull-to-Refresh Pattern
```typescript
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await loadData();
  setRefreshing(false);
};

<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
  }
>
```

---

## 🎯 Screen Development Checklist

When creating new screens:
- [ ] Add to `app/` directory with proper naming
- [ ] Implement role-based access control
- [ ] Add pull-to-refresh functionality
- [ ] Handle loading states
- [ ] Handle empty states (no data)
- [ ] Handle error states
- [ ] Test on different screen sizes
- [ ] Add to this manifest
- [ ] Update navigation in `_layout.tsx` if needed

---

**Last Updated**: January 2025  
**Total Screens**: 13  
**Navigation**: Expo Router (file-based)
