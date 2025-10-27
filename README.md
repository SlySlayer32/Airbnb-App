# Airbnb Property Manager

> **Mobile-First Architecture**: A production-grade React Native application built with Expo and NX
> monorepo for managing Airbnb properties, cleaning schedules, maintenance tasks, and team
> coordination.

## 🏗️ Architecture Overview

This project follows **NX monorepo best practices** with a **mobile-only architecture**. The
codebase is organized into a clear separation of concerns with strict module boundaries.

### Core Principles

- 🎯 **Mobile-First**: `apps/mobile` is the only runnable target (iOS & Android)
- 📦 **Modular Design**: All shared code lives in `libs/*` with clear boundaries
- 🔒 **Type Safety**: TypeScript with strict mode throughout
- ⚡ **Performance**: Optimized for mobile with best practices
- 🧪 **Testable**: Comprehensive testing strategy with Jest and Detox

## 🚀 Features

- **Property Management**: Complete property lifecycle management
- **Cleaning Coordination**: Schedule and track cleaning tasks
- **Maintenance Tracking**: Monitor and manage maintenance requests
- **Team Management**: Coordinate with cleaning staff and maintenance teams
- **Real-time Updates**: Live notifications and status updates via Supabase
- **Photo Documentation**: Capture and organize property photos
- **Customizable Dashboard**: Personalized views for different user roles

## 🛠 Tech Stack

### Core Technologies

- **React Native** (see `package.json` for current version) with Expo SDK (see `package.json`)
- **TypeScript** 5.8+ with ES2022 target
- **Expo Router** for file-based routing
- **NX** 22.0+ for monorepo orchestration
- **Gluestack UI** for universal component library
- **NativeWind** for styling

### State Management & Data

- **TanStack Query** for server state management
- **Zustand** for client state management
- **Supabase** for backend services (auth, database, realtime)
- **React Hook Form** + **Zod** for forms and validation

### Performance & Optimization

- **@shopify/flash-list** for high-performance lists
- **React Native Reanimated** for smooth animations
- **React Native MMKV** for fast local storage
- **Expo Secure Store** for sensitive data

### Development Tools

- **ESLint** + **Prettier** for code quality
- **Jest** + **React Native Testing Library** for unit/integration tests
- **Detox** for E2E testing
- **Husky** + **lint-staged** for pre-commit hooks

## 📁 Project Structure

```
/
├── apps/
│   └── mobile/                 # 📱 Main mobile application (iOS & Android)
│       ├── app/                # Expo Router file-based routing
│       │   ├── auth/          # Authentication screens
│       │   ├── _layout.tsx    # Root layout with navigation
│       │   └── index.tsx      # Home/Dashboard screen
│       ├── assets/            # Fonts, images, icons
│       ├── app.json           # Expo configuration
│       ├── eas.json           # EAS Build configuration
│       └── metro.config.js    # Metro bundler configuration
│
├── libs/
│   ├── core/                   # 🎯 Core business logic & models
│   │   ├── domain-models/     # TypeScript types, interfaces, domain entities
│   │   │   └── src/
│   │   │       ├── lib/
│   │   │       │   ├── models.ts       # Core domain models
│   │   │       │   ├── types.ts        # Shared type definitions
│   │   │       │   ├── mockData.ts     # Mock data for development
│   │   │       │   └── mockProfiles.ts # User profile mocks
│   │   │       └── index.ts
│   │   │
│   │   └── utils/             # Platform-agnostic utility functions
│   │       └── src/
│   │           ├── lib/utils.ts
│   │           └── index.ts
│   │
│   ├── data-access/            # 🔌 Backend integrations & services
│   │   ├── api/               # API clients and services
│   │   │   └── src/
│   │   │       ├── lib/
│   │   │       │   ├── propertyService.ts
│   │   │       │   ├── cleaningSessionService.ts
│   │   │       │   ├── photoProofService.ts
│   │   │       │   ├── dashboardLayoutService.ts
│   │   │       │   └── realtimeService.ts
│   │   │       └── index.ts
│   │   │
│   │   ├── auth/              # Authentication logic
│   │   │   └── src/
│   │   │       ├── lib/auth.tsx
│   │   │       └── index.ts
│   │   │
│   │   └── supabase/          # Supabase-specific integration
│   │       └── src/           # (Prepared for future expansion)
│   │
│   └── ui/                     # 🎨 Shared UI components & design system
│       ├── components/         # Reusable React Native components
│       │   └── src/
│       │       ├── lib/
│       │       │   ├── CustomizableDashboard.tsx
│       │       │   ├── PropertyCard.tsx
│       │       │   ├── CleanerDashboard.tsx
│       │       │   └── ... (30+ components)
│       │       └── index.ts
│       │
│       ├── theme/              # Design tokens, color palette (future)
│       └── hooks/              # UI-related custom hooks (future)
│
├── tools/                      # 🔧 NX workspace utilities
│   └── scripts/
│       └── eas-build-post-install.mjs
│
├── scripts/                    # 📜 CI/CD and maintenance scripts
│   ├── fix-dependencies.js
│   ├── precheck-docs.js
│   └── ...
│
├── docs/                       # 📚 Documentation
│   └── database-setup.sql      # Database schema and setup
│
├── config/                     # ⚙️ Configuration files
│   └── gluestack-ui.config.ts  # Gluestack UI theme configuration
│
├── e2e/                        # 🧪 End-to-end tests (Detox)
│   ├── config.json
│   └── init.js
│
├── android/                    # 🤖 Android native code (generated by expo prebuild)
│   ├── app/                   # Android app configuration & source
│   ├── build.gradle           # Gradle build configuration
│   └── settings.gradle        # Gradle settings
│
├── ios/                        # 🍎 iOS native code (generated by expo prebuild)
│   ├── AirbnbPropertyManager/ # iOS app configuration & source
│   ├── Podfile                # CocoaPods dependencies
│   └── AirbnbPropertyManager.xcodeproj/
│
├── shims/                      # 🔧 Polyfills & compatibility shims
│   └── node-fetch.js          # Fetch API polyfill
│
├── nx.json                     # NX workspace configuration
├── tsconfig.base.json          # TypeScript base configuration
├── package.json                # Root package.json
└── metro.config.js             # Root Metro configuration
│
└── [Generated/Ignored]         # Not committed to git:
    ├── dist/                  # Build artifacts
    ├── static/                # Web bundle output
    ├── node_modules/          # Dependencies
    └── .expo/                 # Expo cache
```

## 🎯 Module Architecture

### Path Aliases

TypeScript path aliases for clean imports:

```typescript
// Core
import { CleaningSession, Property } from '@airbnb/core-domain-models';
import { formatDate } from '@airbnb/core-utils';
// Data Access
import { propertyService } from '@airbnb/data-access-api';
import { useAuth } from '@airbnb/data-access-auth';
// UI
import { PropertyCard } from '@airbnb/ui-components';
```

### Module Boundaries

NX enforces strict module boundaries with tags:

- **Apps** (`type:app`, `scope:mobile`): Can import from any lib
- **Core** (`type:core`, `scope:shared`): No dependencies on other libs
- **Data Access** (`type:data-access`, `scope:shared`): Can depend on core
- **UI** (`type:ui`, `scope:shared`): Can depend on core and data-access

### Dependency Graph

```
apps/mobile
    ↓
    ├─→ libs/ui/components
    ├─→ libs/data-access/api
    ├─→ libs/data-access/auth
    ├─→ libs/core/domain-models
    └─→ libs/core/utils

libs/ui/components
    ↓
    ├─→ libs/core/domain-models
    └─→ libs/data-access/api

libs/data-access/*
    ↓
    └─→ libs/core/domain-models

libs/core/*
    (no dependencies)
```

## 📋 Prerequisites

- **Node.js** 18+ (check with `node --version`)
- **Yarn** 1.22+ (specified in package.json)
- **Expo CLI** (installed globally or via npx)
- **iOS**: Xcode 14+ and iOS Simulator (macOS only)
- **Android**: Android Studio with SDK 33+
- **Supabase**: Account and project for backend services

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/SlySlayer32/Airbnb-App.git
cd Airbnb-App
yarn install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your Supabase credentials:
# EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server

```bash
# Start Expo dev server
yarn dev

# Or use NX commands
nx serve mobile
```

### 4. Run on Devices

```bash
# iOS Simulator (macOS only)
yarn ios
# or: nx run mobile:run-ios

# Android Emulator
yarn android
# or: nx run mobile:run-android

# Expo Go app (scan QR code)
yarn start
```

## 🔧 Development

### Common Commands

```bash
# Development
yarn dev                 # Start with clean cache
yarn start               # Start Expo server
nx serve mobile          # NX serve command

# Building & Testing
yarn lint                # Run ESLint
yarn lint:fix            # Auto-fix linting issues
yarn type-check          # TypeScript type checking
yarn test                # Run Jest tests
yarn test:watch          # Watch mode
yarn test:coverage       # Generate coverage report
yarn test:e2e            # Run Detox E2E tests

# NX Commands
nx graph                 # View dependency graph
nx lint mobile           # Lint mobile app
nx test mobile           # Test mobile app
nx run-many -t lint      # Lint all projects
nx affected:test         # Test affected projects

# Production Builds
yarn build               # Export for all platforms
yarn prebuild            # Generate native code
nx build mobile          # NX build command

# EAS Builds (Expo Application Services)
eas build --platform ios --profile production
eas build --platform android --profile production
eas submit --platform ios
eas submit --platform android
```

### Code Quality

This project uses:

- **ESLint**: Enforces code style and catches errors
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality checks
- **lint-staged**: Run linters on staged files only

Before committing:

```bash
yarn validate   # Runs type-check + lint + format + tests
```

### Adding New Libraries

```bash
# Generate a new library
nx g @nx/react-native:lib my-lib --directory=libs/feature

# Generate a new component
nx g @nx/react-native:component Button --project=ui-components
```

## 📱 Mobile App Structure

### Screens Organization (Future)

The mobile app will be reorganized into:

```
apps/mobile/app/
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   ├── PropertyScreen.tsx
│   └── ...
├── components/       # App-specific components
├── navigation/       # Navigation configuration
├── hooks/           # App-level custom hooks
├── _layout.tsx      # Root layout
└── index.tsx        # Entry screen
```

### Navigation

Uses **Expo Router** for file-based routing:

- File structure determines routes
- Automatic deep linking
- Type-safe navigation
- Native navigation on iOS/Android

## 🗄️ Backend & Database

### Supabase Integration

Supabase provides:

- **Authentication**: Email/password, OAuth, magic links
- **PostgreSQL Database**: Realtime database with RLS
- **Storage**: File uploads and management
- **Realtime**: WebSocket subscriptions
- **Edge Functions**: Serverless functions

Database schema in: `docs/database-setup.sql`

### Environment Variables

```env
# Required
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional
EXPO_PUBLIC_APP_NAME=Airbnb Property Manager
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=false
```

## 🧪 Testing Strategy

### Unit & Integration Tests (Jest)

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# Coverage report
yarn test:coverage

# Test specific project
nx test core-domain-models
nx test ui-components
```

### E2E Tests (Detox)

```bash
# Build test app
yarn test:e2e:build

# Run E2E tests
yarn test:e2e

# iOS specific
detox test --configuration ios.sim.debug

# Android specific
detox test --configuration android.emu.debug
```

## 📦 Build & Deployment

### Development Builds

```bash
# iOS Development Build
eas build --profile development --platform ios

# Android Development Build
eas build --profile development --platform android
```

### Production Builds

```bash
# iOS Production
eas build --profile production --platform ios

# Android Production
eas build --profile production --platform android

# Both platforms
eas build --profile production --platform all
```

### App Store Submission

```bash
# Submit to App Store
eas submit --platform ios --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

## 🎨 Styling & Theming

### Gluestack UI

Configuration in `config/gluestack-ui.config.ts`:

- Custom color palette
- Typography scale
- Spacing system
- Component variants

### NativeWind

Tailwind CSS for React Native:

- Utility-first styling
- Responsive design
- Dark mode support

## 🔒 Security Best Practices

- **Environment Variables**: Never commit `.env` files
- **Secrets**: Use Expo Secure Store for sensitive data
- **Authentication**: Supabase with Row Level Security (RLS)
- **Input Validation**: Zod schemas for all forms
- **HTTPS Only**: All API calls over secure connections

## 📖 Additional Documentation

- [NX Documentation](https://nx.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the code style
4. Run tests and linting (`yarn validate`)
5. Commit your changes (commitlint enforces conventional commits)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new property filter
fix: resolve crash on Android
docs: update README with new structure
chore: update dependencies
test: add tests for cleaning service
refactor: reorganize mobile app structure
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the amazing development platform
- **NX Team**: For powerful monorepo tools
- **Gluestack UI**: For the universal component library
- **Supabase**: For the backend infrastructure
- **React Native Community**: For continuous improvements and support

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/SlySlayer32/Airbnb-App/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SlySlayer32/Airbnb-App/discussions)
- **Documentation**: See `/docs` folder for detailed guides

---

**Built with ❤️ using React Native, Expo, and NX**
