# 🧩 Component Manifest

> Complete inventory of all 18 reusable UI components

## 📋 Table of Contents
- [Overview](#overview)
- [Cleaner-Specific Components](#cleaner-specific-components)
- [Owner-Specific Components](#owner-specific-components)
- [Shared Components](#shared-components)
- [Usage Patterns](#usage-patterns)

## 📊 Overview

### Component Categories
```
Total Components: 18

By User Role:
├── Cleaner-specific: 7 components
├── Owner-specific: 2 components
└── Shared/Generic: 9 components

By Purpose:
├── Data Display: 10 components (cards, lists)
├── User Interaction: 4 components (modals, actions)
├── State Management: 2 components (dashboards, banners)
└── Access Control: 2 components (wrappers, gates)
```

### Import Pattern
```typescript
import ComponentName from '@/components/ComponentName';
```

---

## 🧹 Cleaner-Specific Components

### CleanerDashboard.tsx
**Path**: `/components/CleanerDashboard.tsx`  
**Purpose**: Main dashboard view for cleaners showing active jobs, next jobs, and status banner  
**Used By**: `app/index.tsx` (when user role is 'cleaner')  
**Props**: None (self-contained, uses auth context)  
**Features**:
- Displays active cleaning session card
- Shows next scheduled job card
- Status banner for connection/notifications
- Quick action buttons for common tasks
- Auto-refreshes with real-time data

**Example Usage**:
```typescript
import CleanerDashboard from '@/components/CleanerDashboard';

<CleanerDashboard />
```

---

### CleanerActiveSessionCard.tsx
**Path**: `/components/CleanerActiveSessionCard.tsx`  
**Purpose**: Displays currently in-progress cleaning session with action buttons  
**Used By**: `CleanerDashboard.tsx`  
**Props**:
```typescript
interface CleanerActiveSessionCardProps {
  session: CleaningSession;
  property: EnhancedProperty;
  onUpdateProgress: (sessionId: string) => void;
  onCompleteSession: (sessionId: string) => void;
}
```
**Features**:
- Property name and address
- Current status (arrived, in-progress)
- Time elapsed indicator
- Action buttons (mark arrived, complete, report issue)
- Guest count and linen requirements
- Access codes and instructions

**Example Usage**:
```typescript
<CleanerActiveSessionCard
  session={activeSession}
  property={property}
  onUpdateProgress={handleProgressUpdate}
  onCompleteSession={handleComplete}
/>
```

---

### CleanerNextJobCard.tsx
**Path**: `/components/CleanerNextJobCard.tsx`  
**Purpose**: Displays next upcoming cleaning job for cleaner  
**Used By**: `CleanerDashboard.tsx`  
**Props**:
```typescript
interface CleanerNextJobCardProps {
  session: CleaningSession;
  property: EnhancedProperty;
  onStartSession: (sessionId: string) => void;
}
```
**Features**:
- Property preview image
- Scheduled time with countdown
- Guest count and property details
- Quick start button
- Distance/location information

**Example Usage**:
```typescript
<CleanerNextJobCard
  session={nextSession}
  property={property}
  onStartSession={handleStartSession}
/>
```

---

### CleanerPropertyCard.tsx
**Path**: `/components/CleanerPropertyCard.tsx`  
**Purpose**: Property card optimized for cleaner workflow (access codes, supplies, etc.)  
**Used By**: `app/properties.tsx` (cleaner view)  
**Props**:
```typescript
interface CleanerPropertyCardProps {
  property: EnhancedProperty;
  onPress: () => void;
}
```
**Features**:
- Property name and address
- Access method and codes (prominently displayed)
- WiFi credentials
- Cleaning supply locations
- Emergency contact information
- Special cleaning areas highlighted
- Linen requirements

**Example Usage**:
```typescript
<CleanerPropertyCard
  property={property}
  onPress={() => router.push(`/properties/${property.id}`)}
/>
```

---

### CleanerStatusBanner.tsx
**Path**: `/components/CleanerStatusBanner.tsx`  
**Purpose**: Status banner showing connection status and important alerts  
**Used By**: `CleanerDashboard.tsx`  
**Props**:
```typescript
interface CleanerStatusBannerProps {
  realtimeConnected: boolean;
  hasUnreadNotifications: boolean;
  onNotificationsPress: () => void;
}
```
**Features**:
- Real-time connection indicator
- Unread notifications count
- Urgent alert highlighting
- Tap to view notifications

**Example Usage**:
```typescript
<CleanerStatusBanner
  realtimeConnected={true}
  hasUnreadNotifications={true}
  onNotificationsPress={handleNotificationsPress}
/>
```

---

### CleanerTopBar.tsx
**Path**: `/components/CleanerTopBar.tsx`  
**Purpose**: Top navigation bar for cleaner screens  
**Used By**: `CleanerDashboard.tsx`, cleaner-specific screens  
**Props**:
```typescript
interface CleanerTopBarProps {
  realtimeConnected?: boolean;
}
```
**Features**:
- Displays cleaner name
- Connection status indicator
- Profile/settings access
- Notification bell icon

**Example Usage**:
```typescript
<CleanerTopBar realtimeConnected={isConnected} />
```

---

### PhotoProofGate.tsx
**Path**: `/components/PhotoProofGate.tsx`  
**Purpose**: Enforces photo upload before session completion  
**Used By**: Cleaning session completion flow  
**Props**:
```typescript
interface PhotoProofGateProps {
  sessionId: string;
  requiredPhotos: number;
  onPhotosUploaded: (photoUrls: string[]) => void;
  onCancel: () => void;
}
```
**Features**:
- Camera/gallery photo picker
- Upload progress indicator
- Minimum photo requirement enforcement
- Photo preview thumbnails
- Retry on upload failure

**Example Usage**:
```typescript
<PhotoProofGate
  sessionId={session.id}
  requiredPhotos={3}
  onPhotosUploaded={handlePhotosUploaded}
  onCancel={handleCancel}
/>
```

---

## 🏢 Owner-Specific Components

### OwnerPropertyCard.tsx
**Path**: `/components/OwnerPropertyCard.tsx`  
**Purpose**: Property card optimized for owner management (schedules, stats, financials)  
**Used By**: `app/properties.tsx` (owner view), dashboard  
**Props**:
```typescript
interface OwnerPropertyCardProps {
  property: Property;
  onPress: () => void;
  onSchedule?: (propertyId: string) => void;
  onEdit?: (propertyId: string) => void;
}
```
**Features**:
- Property image and basic info
- Next cleaning schedule
- Assigned cleaner names
- Quick action buttons (schedule, edit, view)
- Revenue/booking metrics
- Maintenance status indicators

**Example Usage**:
```typescript
<OwnerPropertyCard
  property={property}
  onPress={() => router.push(`/properties/${property.id}`)}
  onSchedule={handleSchedulePress}
  onEdit={handleEditPress}
/>
```

---

### PropertyCard.tsx
**Path**: `/components/PropertyCard.tsx`  
**Purpose**: Generic property card for basic display (used in multiple contexts)  
**Used By**: Various screens for property selection/display  
**Props**:
```typescript
interface PropertyCardProps {
  property: Property;
  onPress: () => void;
}
```
**Features**:
- Property image
- Name and address
- Basic stats (rooms, bathrooms)
- Status indicator
- Next clean date

**Example Usage**:
```typescript
<PropertyCard
  property={property}
  onPress={() => handlePropertySelect(property.id)}
/>
```

---

## 🔄 Shared Components

### CleaningUpdates.tsx
**Path**: `/components/CleaningUpdates.tsx`  
**Purpose**: Real-time communication modal for cleaning session updates  
**Used By**: All roles during active cleaning sessions  
**Props**:
```typescript
interface CleaningUpdatesProps {
  sessionId: string;
  onClose: () => void;
}
```
**Features**:
- Real-time update feed
- Send text messages/notes
- Upload photos
- Mark issues as urgent
- Require response flag
- Auto-refresh with new updates

**Example Usage**:
```typescript
<CleaningUpdates
  sessionId={session.id}
  onClose={() => setShowUpdates(false)}
/>
```

---

### NotificationBadge.tsx
**Path**: `/components/NotificationBadge.tsx`  
**Purpose**: Displays notification count badge with real-time updates  
**Used By**: All navigation headers, dashboard  
**Props**:
```typescript
interface NotificationBadgeProps {
  userId: string;
  onPress: () => void;
}
```
**Features**:
- Unread count badge
- Real-time Supabase subscription
- Auto-updates on new notifications
- Urgent notification highlighting
- Sound/vibration alerts

**Example Usage**:
```typescript
<NotificationBadge
  userId={user.id}
  onPress={() => router.push('/notifications')}
/>
```

---

### RoleBasedWrapper.tsx
**Path**: `/components/RoleBasedWrapper.tsx`  
**Purpose**: Access control wrapper to hide/show content based on user role  
**Used By**: Throughout app for role-based feature access  
**Props**:
```typescript
interface RoleBasedWrapperProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```
**Features**:
- Shows children only if user role matches
- Optional fallback content
- Uses auth context for role checking
- Handles loading states

**Example Usage**:
```typescript
<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <FinancialDataComponent />
</RoleBasedWrapper>

<RoleBasedWrapper 
  allowedRoles={['property_owner']} 
  fallback={<Text>Access Denied</Text>}
>
  <AdminPanel />
</RoleBasedWrapper>
```

---

### DashboardStats.tsx
**Path**: `/components/DashboardStats.tsx`  
**Purpose**: Displays statistical cards on dashboard  
**Used By**: `app/index.tsx` (owner/co-host dashboards)  
**Props**:
```typescript
interface DashboardStatsProps {
  stats: {
    totalProperties: number;
    activeCleanings: number;
    completedToday: number;
    upcomingThisWeek: number;
  };
}
```
**Features**:
- Color-coded stat cards
- Icon indicators
- Trend arrows (up/down)
- Tap to drill down

**Example Usage**:
```typescript
<DashboardStats stats={dashboardStats} />
```

---

### QuickActions.tsx
**Path**: `/components/QuickActions.tsx`  
**Purpose**: Grid of quick action buttons for common tasks  
**Used By**: Dashboard screens for all roles  
**Props**:
```typescript
interface QuickActionsProps {
  actions: ActionButton[];
}

interface ActionButton {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}
```
**Features**:
- Customizable action buttons
- Icon + label display
- Color coding by action type
- Responsive grid layout

**Example Usage**:
```typescript
<QuickActions
  actions={[
    { title: 'Schedule Cleaning', icon: 'calendar', color: '#007AFF', onPress: handleSchedule },
    { title: 'Add Property', icon: 'add-circle', color: '#10b981', onPress: handleAddProperty },
  ]}
/>
```

---

### ScheduleCard.tsx
**Path**: `/components/ScheduleCard.tsx`  
**Purpose**: Displays individual cleaning schedule item  
**Used By**: `app/schedule.tsx`, calendar views  
**Props**:
```typescript
interface ScheduleCardProps {
  session: CleaningSession;
  property: Property;
  onPress: () => void;
  onCancel?: (sessionId: string) => void;
}
```
**Features**:
- Property name and image
- Scheduled date/time
- Assigned cleaner
- Session status indicator
- Quick cancel button
- Short notice warning (if < 24 hrs)

**Example Usage**:
```typescript
<ScheduleCard
  session={scheduledSession}
  property={property}
  onPress={() => router.push(`/schedule/${session.id}`)}
  onCancel={handleCancelSession}
/>
```

---

### TeamMemberCard.tsx
**Path**: `/components/TeamMemberCard.tsx`  
**Purpose**: Displays team member information card  
**Used By**: `app/team.tsx`, assignment screens  
**Props**:
```typescript
interface TeamMemberCardProps {
  member: TeamMember;
  onPress: () => void;
}
```
**Features**:
- Member photo/avatar
- Name and role
- Contact information
- Assigned property count
- Performance rating
- Availability status

**Example Usage**:
```typescript
<TeamMemberCard
  member={teamMember}
  onPress={() => router.push(`/team/${member.id}`)}
/>
```

---

### InvoiceCard.tsx
**Path**: `/components/InvoiceCard.tsx`  
**Purpose**: Displays invoice summary card  
**Used By**: `app/invoices.tsx`  
**Props**:
```typescript
interface InvoiceCardProps {
  invoice: Invoice;
  onPress: () => void;
  onPay?: (invoiceId: string) => void;
}
```
**Features**:
- Invoice number and date
- Amount due
- Payment status (paid, pending, overdue)
- Due date with countdown
- Quick pay button
- Download PDF option

**Example Usage**:
```typescript
<InvoiceCard
  invoice={invoice}
  onPress={() => router.push(`/invoices/${invoice.id}`)}
  onPay={handlePayInvoice}
/>
```

---

### MaintenanceCard.tsx
**Path**: `/components/MaintenanceCard.tsx`  
**Purpose**: Displays maintenance ticket card  
**Used By**: `app/maintenance.tsx`, property detail screens  
**Props**:
```typescript
interface MaintenanceCardProps {
  ticket: MaintenanceTicket;
  onPress: () => void;
  onResolve?: (ticketId: string) => void;
}
```
**Features**:
- Issue title and description
- Priority indicator (urgent, high, normal)
- Reported by (with photo)
- Property affected
- Status (open, in-progress, resolved)
- Attached photos
- Quick resolve button

**Example Usage**:
```typescript
<MaintenanceCard
  ticket={maintenanceTicket}
  onPress={() => router.push(`/maintenance/${ticket.id}`)}
  onResolve={handleResolveTicket}
/>
```

---

## 🔧 Usage Patterns

### Standard Component Structure
All components follow this pattern:
```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ComponentProps {
  // Props definition
}

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  const [loading, setLoading] = useState(false);
  
  return (
    <TouchableOpacity style={styles.container}>
      {/* Component JSX */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

### Error Handling
```typescript
try {
  setLoading(true);
  await someService.doSomething();
} catch (error) {
  Alert.alert('Error', 'User-friendly message');
} finally {
  setLoading(false);
}
```

### Loading States
```typescript
{loading ? (
  <ActivityIndicator size="small" color="#007AFF" />
) : (
  <Text>Content</Text>
)}
```

---

**Last Updated**: January 2025  
**Total Components**: 18  
**Maintenance**: Auto-generated from codebase (see `scripts/update-manifests.js`)
