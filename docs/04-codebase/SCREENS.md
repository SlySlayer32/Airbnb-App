# 📱 Screen Manifest

> Complete directory of all 13 screens with routes and purposes

## 📋 Table of Contents
- [Overview](#overview)
- [Main Screens](#main-screens)
- [Authentication Screens](#authentication-screens)
- [Route Hierarchy](#route-hierarchy)

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

**Content by Role**:
- **property_owner**: Property overview, active cleanings, stats, quick actions
- **cleaner**: Active session card, next job card, status banner
- **co_host**: Property list, schedule overview, coordination tools

**Components Used**:
- `CleanerDashboard` (for cleaners)
- `DashboardStats` (for owners/co-hosts)
- `OwnerPropertyCard` (for owners)
- `QuickActions` (all roles)

---

### properties.tsx
**Route**: `/properties`  
**Purpose**: Property management and listing  
**Access**: All roles (filtered by permission)

**Content by Role**:
- **property_owner**: Full property list with edit/delete, add new property
- **cleaner**: Assigned properties with access codes and instructions
- **co_host**: View properties they coordinate (no edit/delete)

**Components Used**:
- `OwnerPropertyCard` (owner/co-host)
- `CleanerPropertyCard` (cleaner)
- `RoleBasedWrapper` (for add/edit buttons)

---

### schedule.tsx
**Route**: `/schedule`  
**Purpose**: Calendar view of all cleaning schedules  
**Access**: All roles (filtered by permission)

**Features**:
- Calendar/list view toggle
- Filter by property, date range, status
- Create new cleaning schedule (owner)
- Cancel with notice period warning
- View session details

**Components Used**:
- `ScheduleCard`
- `RoleBasedWrapper`

**Business Rules**:
- Shows cancellation notice countdown
- Flags short notice (< 24 hrs) in red
- Validates cleaning window (11 AM - 3 PM)

---

### team.tsx
**Route**: `/team`  
**Purpose**: Team member management  
**Access**: property_owner, co_host (read-only)

**Components Used**:
- `TeamMemberCard`
- `RoleBasedWrapper`

---

### invoices.tsx
**Route**: `/invoices`  
**Purpose**: Financial management and billing  
**Access**: property_owner only

**Security**: 
- Cleaners NEVER have access (enforced at layout level)
- Co-hosts can view but not modify (read-only)

**Components Used**:
- `InvoiceCard`
- `RoleBasedWrapper` (entire screen)

---

### maintenance.tsx
**Route**: `/maintenance`  
**Purpose**: Maintenance ticket tracking  
**Access**: All roles

**Components Used**:
- `MaintenanceCard`
- `RoleBasedWrapper`

---

### reports.tsx
**Route**: `/reports`  
**Purpose**: Performance analytics and reporting  
**Access**: property_owner, co_host (read-only)

---

### profile.tsx
**Route**: `/profile`  
**Purpose**: User account settings and preferences  
**Access**: All authenticated users

---

### onboarding.tsx
**Route**: `/onboarding`  
**Purpose**: First-time user setup wizard  
**Access**: New authenticated users only

---

## 🔐 Authentication Screens

### auth/login.tsx
**Route**: `/auth/login`  
**Purpose**: User authentication  
**Access**: Public (unauthenticated)  
**Presentation**: Modal

---

### auth/register.tsx
**Route**: `/auth/register`  
**Purpose**: New user registration  
**Access**: Public (unauthenticated)  
**Presentation**: Modal

---

### auth/forgot-password.tsx
**Route**: `/auth/forgot-password`  
**Purpose**: Password reset flow  
**Access**: Public (unauthenticated)  
**Presentation**: Modal

---

## 🗺️ Route Hierarchy

```
/ (Root Layout with AuthGuard)
├── / (index.tsx) - Dashboard
├── /properties - Property management
├── /schedule - Cleaning schedule
├── /team - Team management
├── /invoices - Financial management (owner only)
├── /maintenance - Ticket tracking
├── /reports - Analytics
├── /profile - User settings
├── /onboarding - First-time setup
└── /auth (Modal Group)
    ├── /auth/login - Authentication
    ├── /auth/register - New account
    └── /auth/forgot-password - Password reset
```

---

**Last Updated**: January 2025  
**Total Screens**: 13  
**Navigation**: Expo Router (file-based)

