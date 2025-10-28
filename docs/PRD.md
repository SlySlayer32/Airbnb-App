# Janitorial Management Platform PRD
## Cleaner-First Open Source Platform

## 1. Overview
**Project Name**: CleanFlow OS
**Vision**: Open-source, modular janitorial management platform with mobile-first cleaner experience
**Target Users**: Cleaning companies, independent cleaners, facility managers
**Core Differentiator**: Cleaner-focused UX with Odoo-like modular architecture
**License**: AGPLv3 (open source) + Commercial License for proprietary modules

## 2. Technical Architecture

### 2.1 Monorepo Structure (Nx + TypeScript)
```
apps/
├── mobile/                 # React Native (Android priority)
├── web-admin/              # Manager dashboard
├── web-portal/            # Client portal
packages/
├── ui/                    # GlueStack UI component library
├── auth/                  # Supabase auth utilities
├── database/              # Supabase schema & types
├── core/                  # Shared business logic
├── modules/
│   ├── scheduling/        # Scheduling module
│   ├── task-management/   # Task system
│   ├── messaging/         # Chat module
│   ├── billing/           # Invoicing & payments
│   └── analytics/         # Reporting module
tools/                     # Shared scripts & utilities
```

### 2.2 Tech Stack
- **Monorepo Tool**: Nx
- **Mobile**: React Native + TypeScript (Android priority)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **UI Framework**: GlueStack UI + NativeWind
- **State Management**: Zustand
- **Offline Support**: WatermelonDB
- **Deployment**: Vercel (web), EAS (mobile), Supabase (backend)

## 3. Core Features (MVP)

### 3.1 Mobile App (Cleaner Experience)
```typescript
// apps/mobile feature structure
features/
├── auth/                  # Supabase authentication
├── dashboard/            # Daily overview
├── tasks/               # Visual task management
├── time-tracking/       # One-tap clock in/out
├── properties/          # Property details & instructions
├── chat/               # Real-time messaging
└── profile/            # Cleaner profile & settings
```

**Key Mobile Screens**:
- One-tap clock in/out with GPS verification
- Visual daily task board (Todo → In Progress → Done)
- Property details with photos and special instructions
- Real-time chat with managers/clients
- Offline-capable task completion

### 3.2 Core Modules Architecture
```typescript
// packages/modules/core structure
interface IModule {
  name: string;
  version: string;
  dependencies: string[];
  install(): Promise<void>;
  routes: Route[];
  components: Record<string, Component>;
}

// Example module definition
class TaskManagementModule implements IModule {
  name = 'task-management';
  dependencies = ['auth', 'scheduling'];
  // ... implementation
}
```

## 4. Development Phases

### Phase 1: Foundation (Month 1-2)
- [ ] Nx monorepo setup with TypeScript
- [ ] Supabase project & database schema
- [ ] Authentication system (Supabase Auth)
- [ ] Basic UI component library (GlueStack UI)
- [ ] Mobile app shell with navigation

### Phase 2: Core Modules (Month 3-4)
- [ ] Task management module
- [ ] Time tracking with GPS
- [ ] Property management
- [ ] Real-time chat
- [ ] Offline synchronization

### Phase 3: Business Features (Month 5-6)
- [ ] Scheduling module
- [ ] Basic reporting
- [ ] Client portal
- [ ] Manager dashboard

## 5. Database Schema (Supabase)

```sql
-- Core tables
cleaners (id, name, email, phone, avatar_url)
clients (id, name, email, phone)
properties (id, client_id, address, instructions, photos)
tasks (id, property_id, title, description, frequency, estimated_duration)
schedules (id, cleaner_id, property_id, date, time_slot)
time_entries (id, cleaner_id, task_id, clock_in, clock_out, location)
messages (id, sender_id, receiver_id, content, timestamp)

-- Module-specific tables (extensible)
billing_invoices (id, client_id, amount, status)
inventory_items (id, property_id, name, quantity)
```

## 6. Mobile-Specific Requirements

### 6.1 Android Priority Features
```typescript
// apps/mobile/app.json
{
  "expo": {
    "name": "CleanFlow",
    "slug": "cleanflow-mobile",
    "android": {
      "package": "com.cleanflow.mobile",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    }
  }
}
```

**Key Android Considerations**:
- Background location for time tracking
- Offline-first data synchronization
- Push notifications (FCM)
- Camera integration for task verification
- Battery optimization

### 6.2 GlueStack UI Implementation
```typescript
// packages/ui/src/components/CleanerTaskCard.tsx
import { Box, Text, Button } from '@gluestack-ui/themed';

interface CleanerTaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

export const CleanerTaskCard: React.FC<CleanerTaskCardProps> = ({
  task,
  onComplete
}) => {
  return (
    <Box bg="$white" p="$4" rounded="$md" shadow="$1">
      <Text size="lg" fontWeight="bold">{task.title}</Text>
      <Text color="$textLight500">{task.description}</Text>
      <Button onPress={() => onComplete(task.id)}>
        <Text color="$white">Complete</Text>
      </Button>
    </Box>
  );
};
```

## 7. Module System Design

### 7.1 Module Registry
```typescript
// packages/core/src/modules/ModuleRegistry.ts
class ModuleRegistry {
  private modules: Map<string, IModule> = new Map();

  register(module: IModule): void {
    this.modules.set(module.name, module);
  }

  getModule(name: string): IModule | undefined {
    return this.modules.get(name);
  }

  async installAll(): Promise<void> {
    for (const module of this.modules.values()) {
      await module.install();
    }
  }
}

export const moduleRegistry = new ModuleRegistry();
```

### 7.2 Example Module Implementation
```typescript
// packages/modules/task-management/src/TaskManagementModule.ts
export class TaskManagementModule implements IModule {
  name = 'task-management';
  dependencies = ['auth'];

  async install(): Promise<void> {
    // Create database tables
    await this.createTables();
    // Register routes
    this.registerRoutes();
    // Register components
    this.registerComponents();
  }

  private async createTables(): Promise<void> {
    // Supabase migration for task management
  }

  private registerRoutes(): void {
    // Register API routes and mobile screens
  }

  private registerComponents(): void {
    // Register UI components
  }
}
```

## 8. Open Source Strategy

### 8.1 Licensing Model
- **Core Platform**: AGPLv3
- **Commercial Modules**: Proprietary license
- **Partner Modules**: Revenue sharing
- **Community Modules**: MIT licensed

### 8.2 Cost-Effective Infrastructure
- **Supabase**: Free tier + pay-as-you-go
- **Vercel**: Free for OSS + hobby tier
- **EAS Build**: Free for OSS builds
- **CloudFlare**: Free CDN & DNS

## 9. Development Setup

### 9.1 Prerequisites
```bash
node --version  # v18+
npm --version   # v9+
nx --version    # v17+
```

### 9.2 Local Development
```bash
# Clone and setup
git clone <repository>
npm install

# Start development servers
nx serve mobile    # React Native dev server
nx serve web-admin # Admin dashboard
nx serve supabase # Local Supabase

# Build for production
nx build mobile
nx build web-admin
```

## 10. Roadmap & Milestones

### Q1 2024: MVP Launch
- [ ] Core mobile app (Android)
- [ ] Basic task management
- [ ] Time tracking
- [ ] Open source release

### Q2 2024: Ecosystem Growth
- [ ] Module marketplace
- [ ] Web admin dashboard
- [ ] Community contributions

### Q3 2024: Monetization
- [ ] Commercial modules
- [ ] White-label solutions
- [ ] Enterprise features

## 11. Success Metrics

- **Community**: 100+ GitHub stars, 20+ contributors
- **Adoption**: 50+ companies using platform
- **Modules**: 10+ community modules
- **Mobile**: 4.5+ rating on Play Store

This PRD provides a solid foundation for building an open-source, modular janitorial platform that prioritizes mobile experience while maintaining Odoo-like extensibility. The AGPLv3 license ensures openness while allowing commercial opportunities through proprietary modules.
