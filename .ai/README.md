# 🏠 Airbnb Cleaning Management Platform - AI Context Hub

> **Single source of truth for AI-assisted development**  
> Version 1.3.0 | Last Updated: January 2025

## 📋 Table of Contents
- [Quick Links](#quick-links)
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [User Roles & Permissions](#user-roles--permissions)
- [Critical Business Rules](#critical-business-rules)
- [Project Structure](#project-structure)
- [Current Status](#current-status)
- [Getting Started](#getting-started)

## 🔗 Quick Links

**Fast Reference:**
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Commands, imports, styling system
- [COMPONENT_MANIFEST.md](./COMPONENT_MANIFEST.md) - All 18 components documented
- [SERVICE_MANIFEST.md](./SERVICE_MANIFEST.md) - All 8 services with methods
- [SCREEN_MANIFEST.md](./SCREEN_MANIFEST.md) - All 13 screens with routes

**Development Workflows:**
- [WORKFLOWS.md](./WORKFLOWS.md) - Daily development processes
- [PROMPTING_GUIDE.md](./PROMPTING_GUIDE.md) - How to work with AI effectively
- [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md) - Git commands & commit standards

**Technical Standards:**
- [CONVENTIONS.md](./CONVENTIONS.md) - Code patterns and design system
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues & solutions

## 📖 Project Overview

### What This Platform Does
**Airbnb Cleaning Management Platform** connects property owners with cleaning teams for scheduling, communication, quality control, and workflow management between guest stays.

### Business Model Evolution
- **Phase 1 (Current)**: MVP for Airbnb cleaning coordination
- **Phase 2 (Planned)**: Home service marketplace (landscaping, pool service, maintenance)
- **Market Opportunity**: $500B+ home services market

### Why This Matters
Property owners managing multiple Airbnb rentals face a critical 4-hour window between guest checkout (11 AM) and checkin (3 PM). This platform ensures cleanings are coordinated, tracked, and completed with photo proof, protecting guest ratings and owner reputation.

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: React Native with Expo SDK 54 (iOS, Android, Web)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Language**: TypeScript (strict mode, no `any` types)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet (no external CSS libraries)
- **Icons**: @expo/vector-icons (Ionicons only)
- **State Management**: React Context for auth, useState for UI

### Development Environment
- **Node.js**: v18 or higher
- **Package Manager**: npm
- **Dev Server**: `npm start` (Expo CLI)
- **Type Checking**: `npm run lint` (runs `tsc --noEmit`)

### Environment Variables Required
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 👥 User Roles & Permissions

### 🏢 property_owner (Primary Revenue Generator)
**Can Do:**
- Manage multiple properties (add, edit, archive)
- Schedule cleanings between guest stays
- View cleaning reports and photos
- Handle billing and payments
- Set property-specific cleaning requirements
- Assign cleaners to properties
- Receive real-time notifications about issues
- View team performance analytics

**Cannot Do:**
- Access other owners' properties
- See individual cleaner compensation rates (only invoices)

### 🧹 cleaner (Service Provider)
**Can Do:**
- View assigned cleaning jobs
- Access property details (codes, WiFi, instructions)
- Update cleaning progress in real-time
- Report maintenance issues with photos
- Mark sessions as arrived/in-progress/completed
- Upload completion photos as proof
- Communicate with property owners via updates

**Cannot Do:**
- See any financial information (rates, invoices, payments)
- Access unassigned properties
- Modify property details or requirements
- View owner contact information (except emergency contacts)

### 🤝 co_host (Limited Management)
**Can Do:**
- View assigned properties and schedules
- Coordinate cleaning schedules
- View cleaning reports and history
- Communicate with cleaners
- Report issues on behalf of owners

**Cannot Do:**
- Modify billing or payment information
- Add/remove team members
- Change property ownership
- Access financial dashboards

## 🎯 Critical Business Rules

### 1. Cleaning Window Constraints (Non-Negotiable)
```
Checkout: 11:00 AM
Cleaning Window: 11:00 AM - 3:00 PM (4 hours)
Checkin: 3:00 PM
```
- All cleanings MUST be scheduled within this window
- Violations cause guest conflicts and negative reviews
- System should prevent scheduling outside this window
- Late arrivals trigger automatic notifications

### 2. Cancellation Notice Policy
```
Standard Notice: 24+ hours before scheduled time
Short Notice: Less than 24 hours (flagged in RED)
```
- Calculate notice period in hours, not days
- Short notice may incur cancellation fees
- System displays countdown until cancellation penalty
- Formula: `Math.floor((scheduled_time - now) / 3600000)` hours

### 3. Linen Requirements Scaling
```typescript
Base calculation per guest:
- Bath towels: 1 per guest
- Hand towels: 1 per guest
- Pillow cases: 2 per guest
- Kitchen towels: 2 (fixed)
- Bath mats: 1 (+ 1 if villa with >4 guests)
```
- Auto-calculated based on `guest_count` property
- Adjusts for property type (villa, apartment, etc.)
- Displayed to cleaners for preparation

### 4. Financial Privacy (Security Rule)
```
Cleaners NEVER see:
- Hourly rates or total compensation
- Property pricing or revenue
- Owner profit margins
- Payment processing details
```
- Enforced at UI level with `RoleBasedWrapper`
- Enforced at API level with Row Level Security (RLS)
- Database queries must filter by role

### 5. Urgent Issue Escalation
```
Priority Levels:
- urgent: Broken locks, flooding, safety hazards
- high: Cleaner cancellation, maintenance issues
- normal: General updates, completion notifications
```
- Urgent issues trigger immediate push notifications
- Property owners get real-time alerts
- Escalation pathway: Cleaner → Owner → Emergency Contact

## 📁 Project Structure

```
Airbnb-App/
├── .ai/                          # 📚 AI Context System (this directory)
│   ├── README.md                 # Project overview (you are here)
│   ├── QUICK_REFERENCE.md        # Fast lookup sheet
│   ├── COMPONENT_MANIFEST.md     # Component inventory
│   ├── SERVICE_MANIFEST.md       # Service layer API reference
│   ├── SCREEN_MANIFEST.md        # Screen directory with routes
│   ├── CONVENTIONS.md            # Code patterns & design system
│   ├── WORKFLOWS.md              # Development processes
│   ├── PROMPTING_GUIDE.md        # AI communication templates
│   ├── GITHUB_WORKFLOW.md        # Git operations guide
│   └── TROUBLESHOOTING.md        # Common issues & fixes
│
├── app/                          # 📱 Screens (Expo Router)
│   ├── _layout.tsx               # Root layout with auth guard
│   ├── index.tsx                 # Dashboard (role-specific)
│   ├── properties.tsx            # Property management
│   ├── schedule.tsx              # Cleaning schedules
│   ├── team.tsx                  # Team member management
│   ├── invoices.tsx              # Financial management
│   ├── maintenance.tsx           # Maintenance tickets
│   ├── reports.tsx               # Performance reports
│   ├── profile.tsx               # User profile settings
│   ├── onboarding.tsx            # First-time user setup
│   └── auth/                     # Authentication screens
│       ├── login.tsx
│       ├── register.tsx
│       └── forgot-password.tsx
│
├── components/                   # 🧩 Reusable UI Components (18 total)
│   ├── CleanerDashboard.tsx      # Cleaner-specific dashboard
│   ├── CleanerPropertyCard.tsx   # Property view for cleaners
│   ├── OwnerPropertyCard.tsx     # Property view for owners
│   ├── RoleBasedWrapper.tsx      # Access control component
│   ├── NotificationBadge.tsx     # Real-time notification badge
│   ├── CleaningUpdates.tsx       # Real-time communication modal
│   ├── PhotoProofGate.tsx        # Photo upload enforcement
│   └── ...14 more (see COMPONENT_MANIFEST.md)
│
├── services/                     # 🔧 Business Logic (8 services)
│   ├── propertyService.ts        # Property CRUD operations
│   ├── cleaningSessionService.ts # Session lifecycle management
│   ├── cleaningUpdateService.ts  # Real-time update handling
│   ├── notificationService.ts    # Alert system
│   ├── photoProofService.ts      # Photo upload & validation
│   ├── bannerStateService.ts     # Dashboard banner logic
│   ├── realtimeService.ts        # Supabase realtime subscriptions
│   └── index.ts                  # Service exports
│
├── types/                        # 📝 TypeScript Definitions
│   └── index.ts                  # All interfaces & types
│
├── contexts/                     # 🌍 Global State
│   └── AuthContext.tsx           # User authentication state
│
├── lib/                          # 🛠️ Utilities
│   └── supabase.ts               # Supabase client configuration
│
└── docs/                         # 📄 Legacy Documentation
    ├── business/                 # Business strategy docs
    ├── technical/                # Technical implementation history
    ├── process/                  # Contribution guidelines
    └── archive/                  # Historical roadmaps & analysis

```

## 📊 Current Status

### Phase 1 Completion: 60% Complete
✅ **Completed:**
- User authentication with role-based access
- Property management (CRUD operations)
- Cleaning session lifecycle
- Real-time notifications and updates
- Photo proof upload system
- Cleaner dashboard with active jobs
- Owner dashboard with property overview
- Basic scheduling system

🚧 **In Progress:**
- Advanced scheduling with calendar view
- Team performance analytics
- Invoice generation and payment tracking
- Maintenance ticket workflow
- Historical reporting and trends

📋 **Planned:**
- Integration with calendar systems (Airbnb, VRBO)
- Automated cleaning recommendations
- Quality control scoring system
- Multi-language support
- Expansion to other home services

### Key Metrics
- **18 Components** built following consistent patterns
- **8 Services** handling all business logic
- **13 Screens** with role-based access control
- **3 User Roles** with distinct workflows
- **Zero TypeScript errors** (strict mode enabled)
- **100% mobile responsive** (iOS, Android, Web)

## 🚀 Getting Started

### For AI Assistants
1. **Read this file first** to understand project context
2. **Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** for common patterns
3. **Review relevant manifests** (components, services, screens)
4. **Follow [CONVENTIONS.md](./CONVENTIONS.md)** for code standards
5. **Use [PROMPTING_GUIDE.md](./PROMPTING_GUIDE.md)** for effective communication

### For Developers
1. **Clone repository**: `git clone https://github.com/SlySlayer32/Airbnb-App.git`
2. **Install dependencies**: `npm install`
3. **Setup environment**: Copy `.env.local` to `.env` and add Supabase credentials
4. **Start dev server**: `npm start`
5. **Review [WORKFLOWS.md](./WORKFLOWS.md)** for development processes

### For Non-Technical Founders (Like J)
You can describe features in plain English:
- "I want cleaners to see which properties they're assigned to"
- "Property owners need to cancel cleanings with proper notice"
- "Add a notification when a cleaner reports an urgent issue"

The AI will handle all technical implementation following established patterns.

## 🎯 Success Criteria

This documentation system succeeds when:
1. ✅ AI assistants find all context in one `.ai/` directory
2. ✅ New developers onboard in < 30 minutes
3. ✅ No need to search multiple files for information
4. ✅ Manifests provide complete component/service inventory
5. ✅ Business rules are clear and enforceable
6. ✅ Development workflows are repeatable

## 📞 Support & Resources

- **GitHub Repository**: https://github.com/SlySlayer32/Airbnb-App
- **Documentation Hub**: See `.ai/` directory (this folder)
- **Issue Tracking**: GitHub Issues with templates
- **Version History**: See `CHANGELOG.md` in root directory
- **Contributing**: See [WORKFLOWS.md](./WORKFLOWS.md) and [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md)

---

**Remember**: This platform is built 100% through natural language conversations with AI. Focus on describing what users need, and let AI handle the technical complexity.
