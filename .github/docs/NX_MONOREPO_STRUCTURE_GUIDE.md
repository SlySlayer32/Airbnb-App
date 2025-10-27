# Nx Monorepo Structure Guide

**Project:** Airbnb Property Manager **Framework:** Nx + Expo + React Native **Last Updated:**
October 27, 2025

---

## Table of Contents

1. [Nx Monorepo Architecture Principles](#nx-monorepo-architecture-principles)
2. [Folder Structure Standards](#folder-structure-standards)
3. [Library Types & Naming Conventions](#library-types--naming-conventions)
4. [Module Boundary Rules](#module-boundary-rules)
5. [Project Configuration Standards](#project-configuration-standards)
6. [Import Path Conventions](#import-path-conventions)
7. [File Organization Within Libraries](#file-organization-within-libraries)
8. [Testing Structure](#testing-structure)
9. [Common Patterns & Anti-Patterns](#common-patterns--anti-patterns)
10. [Nx Workspace Configuration](#nx-workspace-configuration)

---

## Nx Monorepo Architecture Principles

### Core Concepts

Nx enforces a **strict separation of concerns** through:

1. **Applications** (`apps/`) - Deployable artifacts that compose libraries
2. **Libraries** (`libs/`) - Isolated, reusable code organized by domain and type
3. **Module Boundaries** - Enforced dependency rules between library types
4. **Computation Caching** - Smart builds that only rebuild what changed
5. **Dependency Graph** - Visual representation of how code connects

### The Five Layer Architecture

```
┌─────────────────────────────────────┐
│  apps/                (Layer 5)     │  ← Orchestration layer
├─────────────────────────────────────┤
│  libs/features/       (Layer 4)     │  ← Business logic (smart components)
├─────────────────────────────────────┤
│  libs/ui/             (Layer 3)     │  ← Presentation (dumb components)
│  libs/data-access/    (Layer 2)     │  ← External interactions
├─────────────────────────────────────┤
│  libs/core/           (Layer 1)     │  ← Foundation (no dependencies)
└─────────────────────────────────────┘
```

**Dependency Flow Rule:** Higher layers can import from lower layers, but NEVER the reverse.

---

## Folder Structure Standards

### Ideal Nx Monorepo Structure

```
workspace-root/
│
├── apps/                           # Deployable applications
│   ├── mobile/                     # Expo/React Native mobile app
│   │   ├── app/                    # Expo Router screens (file-based routing)
│   │   ├── assets/                 # App-specific assets (fonts, images)
│   │   ├── src/                    # App-specific code (optional)
│   │   ├── .babelrc.js             # Babel configuration
│   │   ├── app.json                # Expo configuration
│   │   ├── metro.config.js         # Metro bundler config
│   │   ├── project.json            # Nx targets and metadata
│   │   ├── tsconfig.json           # TypeScript config extends base
│   │   └── index.js                # Entry point
│   │
│   ├── admin-web/                  # Next.js admin dashboard (future)
│   ├── api/                        # NestJS backend API (future)
│   └── web/                        # Customer-facing web app (future)
│
├── libs/                           # Shared libraries (organized by type)
│   │
│   ├── core/                       # Foundation layer (NO external dependencies)
│   │   ├── models/                 # @airbnb/core-models
│   │   │   ├── src/
│   │   │   │   ├── index.ts        # Barrel export
│   │   │   │   └── lib/
│   │   │   │       ├── types.ts    # TypeScript interfaces/types
│   │   │   │       ├── mockData.ts # Mock data for development
│   │   │   │       └── models.ts   # Class-based models (optional)
│   │   │   ├── project.json        # Nx project config
│   │   │   ├── tsconfig.json       # Extends base
│   │   │   ├── tsconfig.lib.json   # Library-specific TS config
│   │   │   └── README.md           # Library documentation
│   │   │
│   │   ├── utils/                  # @airbnb/core-utils
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   └── lib/
│   │   │   │       ├── date-utils.ts
│   │   │   │       ├── validation.ts
│   │   │   │       ├── formatters.ts
│   │   │   │       └── constants.ts
│   │   │   ├── project.json
│   │   │   └── tsconfig.json
│   │   │
│   │   └── hooks/                  # @airbnb/core-hooks (React-specific)
│   │       ├── src/
│   │       │   ├── index.ts
│   │       │   └── lib/
│   │       │       ├── useDebounce.ts
│   │       │       ├── useAsync.ts
│   │       │       └── usePrevious.ts
│   │       └── project.json
│   │
│   ├── data-access/                # External interactions layer
│   │   ├── api/                    # @airbnb/data-access-api
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   └── lib/
│   │   │   │       ├── api.ts                    # Supabase client
│   │   │   │       ├── cleaningSessionService.ts
│   │   │   │       ├── propertyService.ts
│   │   │   │       ├── notificationService.ts
│   │   │   │       └── realtimeService.ts
│   │   │   └── project.json
│   │   │
│   │   ├── auth/                   # @airbnb/data-access-auth
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   └── lib/
│   │   │   │       ├── auth.tsx              # AuthContext provider
│   │   │   │       ├── useAuth.ts            # Auth hook
│   │   │   │       └── authService.ts        # Auth utilities
│   │   │   └── project.json
│   │   │
│   │   └── cache/                  # @airbnb/data-access-cache (future)
│   │       └── src/
│   │           └── lib/
│   │               ├── react-query-config.ts
│   │               └── cache-utils.ts
│   │
│   ├── ui/                         # Presentational layer (dumb components)
│   │   ├── components/             # @airbnb/ui-components
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   └── lib/
│   │   │   │       ├── Button/
│   │   │   │       │   ├── Button.tsx
│   │   │   │       │   ├── Button.test.tsx
│   │   │   │       │   └── index.ts
│   │   │   │       ├── Card/
│   │   │   │       ├── Modal/
│   │   │   │       ├── Input/
│   │   │   │       └── ...
│   │   │   └── project.json
│   │   │
│   │   ├── layouts/                # @airbnb/ui-layouts
│   │   │   └── src/
│   │   │       └── lib/
│   │   │           ├── DashboardLayout.tsx
│   │   │           ├── AuthLayout.tsx
│   │   │           └── MainLayout.tsx
│   │   │
│   │   └── theme/                  # @airbnb/ui-theme
│   │       └── src/
│   │           └── lib/
│   │               ├── colors.ts
│   │               ├── typography.ts
│   │               ├── spacing.ts
│   │               └── theme.ts
│   │
│   └── features/                   # Business logic layer (smart components)
│       ├── property/               # @airbnb/features-property
│       │   ├── src/
│       │   │   ├── index.ts
│       │   │   └── lib/
│       │   │       ├── PropertyList.tsx
│       │   │       ├── PropertyDetail.tsx
│       │   │       ├── AddPropertyForm.tsx
│       │   │       └── useProperties.ts
│       │   └── project.json
│       │
│       ├── cleaning/               # @airbnb/features-cleaning
│       │   └── src/
│       │       └── lib/
│       │           ├── CleaningDashboard.tsx
│       │           ├── SessionCard.tsx
│       │           └── useCleaningSessions.ts
│       │
│       ├── booking/                # @airbnb/features-booking (future)
│       ├── payments/               # @airbnb/features-payments (future)
│       └── auth/                   # @airbnb/features-auth (future)
│
├── tools/                          # Workspace tooling
│   ├── generators/                 # Custom Nx generators
│   └── scripts/                    # Build/deployment scripts
│
├── .github/                        # GitHub configuration
│   ├── docs/                       # Project documentation
│   ├── workflows/                  # CI/CD workflows
│   └── chatmodes/                  # AI assistant modes
│
├── nx.json                         # Nx workspace configuration
├── tsconfig.base.json              # Shared TypeScript config
├── package.json                    # Root package.json
├── .eslintrc.js                    # ESLint configuration
├── jest.config.js                  # Jest root config
├── jest.preset.js                  # Jest preset for libs
└── README.md                       # Workspace documentation
```

---

## Library Types & Naming Conventions

### Library Type Classification

| Type            | Purpose                                | Can Import From                   | Tags               | Example                     |
| --------------- | -------------------------------------- | --------------------------------- | ------------------ | --------------------------- |
| **Core**        | Foundation utilities, types, constants | Nothing                           | `type:core`        | `@airbnb/core-models`       |
| **Data Access** | API clients, external services         | `core/*` only                     | `type:data-access` | `@airbnb/data-access-api`   |
| **UI**          | Presentational components              | `core/*` only                     | `type:ui`          | `@airbnb/ui-components`     |
| **Features**    | Business logic, smart components       | `core/*`, `data-access/*`, `ui/*` | `type:feature`     | `@airbnb/features-property` |
| **Apps**        | Deployable applications                | All libs                          | `type:app`         | `mobile`                    |

### Naming Conventions

#### Library Names (in `project.json`)

```json
{
  "name": "core-models", // ✅ Correct: kebab-case
  "name": "ui-components", // ✅ Correct
  "name": "features-property", // ✅ Correct

  "name": "coreModels", // ❌ Wrong: camelCase
  "name": "UI_Components" // ❌ Wrong: mixed case
}
```

#### Import Path Aliases (in `tsconfig.base.json`)

```json
{
  "paths": {
    "@airbnb/core-models": ["libs/core/models/src/index.ts"], // ✅ Correct
    "@airbnb/ui-components": ["libs/ui/components/src/index.ts"], // ✅ Correct
    "@airbnb/features-property": ["libs/features/property/src/index.ts"], // ✅ Correct

    "@airbnb/models": ["..."], // ❌ Wrong: too generic
    "@core/models": ["..."], // ❌ Wrong: inconsistent prefix
    "@airbnb/PropertyFeature": ["..."] // ❌ Wrong: PascalCase
  }
}
```

**Pattern:** `@{org-name}/{type}-{domain}`

- **org-name:** Your organization/project name (e.g., `airbnb`, `mycompany`)
- **type:** Library type (`core`, `ui`, `data-access`, `features`)
- **domain:** Specific domain/feature (e.g., `models`, `utils`, `property`, `auth`)

#### File Naming

```typescript
// ✅ Correct: PascalCase for components
PropertyCard.tsx;
UserProfile.tsx;
AuthLayout.tsx;

// ✅ Correct: camelCase for utilities
dateUtils.ts;
validationHelpers.ts;
useProperties.ts;

// ✅ Correct: kebab-case for multi-word utilities (alternative)
date - utils.ts;
validation - helpers.ts;

// ❌ Wrong: snake_case
property_card.tsx;
user_profile.tsx;
```

---

## Module Boundary Rules

### Dependency Constraints

Configure in `.eslintrc.js`:

```javascript
{
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
              // Apps can use everything
              {
                "sourceTag": "type:app",
                "onlyDependOnLibsWithTags": [
                  "type:feature",
                  "type:ui",
                  "type:data-access",
                  "type:core"
                ]
              },
              // Features can use ui, data-access, and core
              {
                "sourceTag": "type:feature",
                "onlyDependOnLibsWithTags": [
                  "type:ui",
                  "type:data-access",
                  "type:core"
                ]
              },
              // UI can ONLY use core
              {
                "sourceTag": "type:ui",
                "onlyDependOnLibsWithTags": ["type:core"]
              },
              // Data Access can ONLY use core
              {
                "sourceTag": "type:data-access",
                "onlyDependOnLibsWithTags": ["type:core"]
              },
              // Core cannot use anything (foundation)
              {
                "sourceTag": "type:core",
                "onlyDependOnLibsWithTags": []
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### Visual Dependency Flow

```
┌──────────────────────────────────────────────┐
│  apps/mobile (type:app)                      │
│  ✓ Can import: features, ui, data-access, core│
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  libs/features/* (type:feature)              │
│  ✓ Can import: ui, data-access, core        │
│  ✗ Cannot import: other features, apps      │
└──────────────────────────────────────────────┘
        ↙                              ↘
┌─────────────────────┐    ┌──────────────────────┐
│  libs/ui/*          │    │  libs/data-access/*  │
│  (type:ui)          │    │  (type:data-access)  │
│  ✓ Can import: core │    │  ✓ Can import: core  │
│  ✗ Cannot cross     │    │  ✗ Cannot cross      │
└─────────────────────┘    └──────────────────────┘
        ↘                              ↙
         ┌──────────────────────────┐
         │  libs/core/*             │
         │  (type:core)             │
         │  ✗ Cannot import anything│
         └──────────────────────────┘
```

### Scope-Based Boundaries (Optional)

Add scope tags for domain isolation:

```javascript
{
  "sourceTag": "scope:property",
  "onlyDependOnLibsWithTags": [
    "scope:property",
    "scope:shared",
    "type:core",
    "type:ui",
    "type:data-access"
  ]
}
```

**Tags in `project.json`:**

```json
{
  "name": "features-property",
  "tags": ["type:feature", "scope:property"]
}

{
  "name": "features-cleaning",
  "tags": ["type:feature", "scope:cleaning"]
}

{
  "name": "ui-components",
  "tags": ["type:ui", "scope:shared"]
}
```

This prevents `features-property` from importing `features-cleaning` code.

---

## Project Configuration Standards

### Minimal `project.json` Structure

Every library should have:

```json
{
  "name": "core-models",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/core/models/src",
  "projectType": "library",
  "tags": ["type:core", "scope:shared"],
  "targets": {
    "lint": {
      "executor": "@nx/eslint:lint"
    },
    "test": {
      "executor": "@nx/jest:jest",
      "options": {
        "jestConfig": "libs/core/models/jest.config.ts"
      }
    }
  }
}
```

### TypeScript Configuration Pattern

**`libs/{type}/{domain}/tsconfig.json`:**

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node"
  },
  "files": [],
  "include": [],
  "references": [
    {
      "path": "./tsconfig.lib.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ]
}
```

**`libs/{type}/{domain}/tsconfig.lib.json`:**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../../dist/out-tsc",
    "declaration": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["jest.config.ts", "src/**/*.spec.ts", "src/**/*.test.ts"]
}
```

---

## Import Path Conventions

### Barrel Exports (index.ts)

Every library must have a barrel export at `src/index.ts`:

```typescript
// libs/core/models/src/index.ts
export * from './lib/types';
export * from './lib/models';
export * from './lib/mockData';
```

```typescript
// libs/ui/components/src/index.ts
export { default as Button } from './lib/Button/Button';
export { default as Card } from './lib/Card/Card';
export { default as Modal } from './lib/Modal/Modal';
export * from './lib/types'; // Component prop types
```

### Import Examples

```typescript
// ✅ Correct: Import from barrel
import { CleaningSession, Property, User } from '@airbnb/core-models';
// ❌ Wrong: Deep imports bypass barrel
import { Property } from '@airbnb/core-models/lib/types';
import { supabase, useProperties } from '@airbnb/data-access-api';
import { Button, Card } from '@airbnb/ui-components';
// ⚠️ Acceptable for optimization (tree-shaking)
import { Button } from '@airbnb/ui-components/lib/Button';
import { Button } from '@airbnb/ui-components/lib/Button/Button';
```

### Path Mapping in `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // Core libraries
      "@airbnb/core-models": ["libs/core/models/src/index.ts"],
      "@airbnb/core-utils": ["libs/core/utils/src/index.ts"],
      "@airbnb/core-hooks": ["libs/core/hooks/src/index.ts"],

      // Data Access libraries
      "@airbnb/data-access-api": ["libs/data-access/api/src/index.ts"],
      "@airbnb/data-access-auth": ["libs/data-access/auth/src/index.ts"],
      "@airbnb/data-access-cache": ["libs/data-access/cache/src/index.ts"],

      // UI libraries
      "@airbnb/ui-components": ["libs/ui/components/src/index.ts"],
      "@airbnb/ui-layouts": ["libs/ui/layouts/src/index.ts"],
      "@airbnb/ui-theme": ["libs/ui/theme/src/index.ts"],

      // Feature libraries
      "@airbnb/features-property": ["libs/features/property/src/index.ts"],
      "@airbnb/features-cleaning": ["libs/features/cleaning/src/index.ts"],
      "@airbnb/features-booking": ["libs/features/booking/src/index.ts"],
      "@airbnb/features-payments": ["libs/features/payments/src/index.ts"],
      "@airbnb/features-auth": ["libs/features/auth/src/index.ts"]
    }
  }
}
```

---

## File Organization Within Libraries

### Component Library Structure

```
libs/ui/components/
└── src/
    ├── index.ts                    # Barrel export
    └── lib/
        ├── Button/
        │   ├── Button.tsx          # Component implementation
        │   ├── Button.test.tsx     # Component tests
        │   ├── Button.stories.tsx  # Storybook stories (optional)
        │   ├── types.ts            # Button-specific types
        │   └── index.ts            # Component barrel
        │
        ├── Card/
        │   ├── Card.tsx
        │   ├── Card.test.tsx
        │   └── index.ts
        │
        └── shared/                 # Shared utilities for components
            ├── hooks/
            └── utils/
```

### Feature Library Structure

```
libs/features/property/
└── src/
    ├── index.ts
    └── lib/
        ├── components/             # Feature-specific components
        │   ├── PropertyList.tsx
        │   ├── PropertyDetail.tsx
        │   └── AddPropertyForm.tsx
        │
        ├── hooks/                  # Feature-specific hooks
        │   ├── useProperties.ts
        │   ├── usePropertyDetail.ts
        │   └── usePropertyMutation.ts
        │
        ├── utils/                  # Feature-specific utilities
        │   └── propertyHelpers.ts
        │
        └── types.ts                # Feature-specific types
```

### Data Access Library Structure

```
libs/data-access/api/
└── src/
    ├── index.ts
    └── lib/
        ├── api.ts                          # Base API client (Supabase)
        ├── cleaningSessionService.ts       # Service files
        ├── propertyService.ts
        ├── notificationService.ts
        ├── realtimeService.ts
        │
        ├── hooks/                          # React Query hooks
        │   ├── useCleaningSessions.ts
        │   ├── useProperties.ts
        │   └── useNotifications.ts
        │
        └── types/                          # API-specific types
            ├── requests.ts
            └── responses.ts
```

---

## Testing Structure

### Test File Placement

```typescript
// ✅ Correct: Co-located with source
libs / ui / components / src / lib / Button / Button.tsx;
libs / ui / components / src / lib / Button / Button.test.tsx;

libs / core / utils / src / lib / dateUtils.ts;
libs / core / utils / src / lib / dateUtils.spec.ts;

// ❌ Wrong: Separate test directory
libs / ui / components / src / lib / Button / Button.tsx;
libs / ui / components / tests / Button.test.tsx;
```

### Jest Configuration

**Root `jest.preset.js`:**

```javascript
const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testEnvironment: 'node',
  coverageReporters: ['html', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/index.ts',
  ],
};
```

**Library-specific `jest.config.ts`:**

```typescript
export default {
  displayName: 'core-models',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/core/models',
};
```

---

## Common Patterns & Anti-Patterns

### ✅ Good Patterns

#### 1. Clear Separation of Concerns

```typescript
// ✅ Dumb component in libs/ui/components
export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ✅ Smart component in libs/features/property
export function PropertyCard({ propertyId }: PropertyCardProps) {
  const { data: property } = useProperty(propertyId);
  const { mutate: deleteProperty } = useDeleteProperty();

  return (
    <Card>
      <Button label="Delete" onClick={() => deleteProperty(propertyId)} />
    </Card>
  );
}
```

#### 2. Proper Barrel Exports

```typescript
// libs/core/models/src/index.ts
export * from './lib/types';
export * from './lib/models';

// libs/core/models/src/lib/types.ts
export interface Property { ... }
export interface User { ... }
```

#### 3. Domain-Driven Features

```
libs/features/
├── property/        # Everything property-related
├── cleaning/        # Everything cleaning-related
└── booking/         # Everything booking-related
```

### ❌ Anti-Patterns

#### 1. Mixing Smart and Dumb Components

```typescript
// ❌ Wrong: API call in UI library
// libs/ui/components/src/lib/PropertyCard.tsx
export function PropertyCard() {
  const { data } = useQuery(['property'], fetchProperty); // ❌ API logic in UI
  return <Card>{data.name}</Card>;
}

// ✅ Correct: Move to feature
// libs/features/property/src/lib/PropertyCard.tsx
```

#### 2. Circular Dependencies

```typescript
// ❌ Wrong: Circular dependency
// libs/features/property → libs/features/cleaning → libs/features/property

// ✅ Correct: Extract shared code to core or data-access
// libs/features/property → libs/core/models
// libs/features/cleaning → libs/core/models
```

#### 3. Deep Imports

```typescript
// ❌ Wrong: Bypassing barrel exports

// ✅ Correct: Use barrel
import { Property } from '@airbnb/core-models';
import { Property } from '@airbnb/core-models/lib/types';
```

#### 4. Monolithic Libraries

```typescript
// ❌ Wrong: One giant "shared" library
libs/shared/
└── everything.ts  // 5000 lines

// ✅ Correct: Granular, purpose-specific libraries
libs/core/models/
libs/core/utils/
libs/ui/components/
```

---

## Nx Workspace Configuration

### Essential `nx.json` Settings

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "targetDefaults": {
    "build": {
      "cache": true
    },
    "lint": {
      "cache": true
    },
    "test": {
      "cache": true
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "production": ["!{projectRoot}/**/*.spec.ts", "!{projectRoot}/**/*.test.ts"]
  },
  "generators": {
    "@nx/react": {
      "library": {
        "style": "none",
        "unitTestRunner": "jest",
        "bundler": "none"
      },
      "component": {
        "style": "none"
      }
    }
  },
  "plugins": ["@nx/expo/plugin", "@nx/eslint/plugin", "@nx/jest/plugin"]
}
```

### Generator Defaults

Set sensible defaults for library generation:

```json
{
  "generators": {
    "@nx/react": {
      "library": {
        "style": "none", // No CSS modules
        "unitTestRunner": "jest", // Use Jest
        "bundler": "none", // No bundler for libs
        "linter": "eslint",
        "strict": true,
        "pascalCaseFiles": false, // kebab-case files
        "routing": false
      }
    },
    "@nx/js": {
      "library": {
        "unitTestRunner": "jest",
        "strict": true
      }
    }
  }
}
```

---

## Summary Checklist

### Structural Requirements

- [ ] All applications in `apps/` directory
- [ ] All libraries in `libs/` organized by type (`core/`, `ui/`, `data-access/`, `features/`)
- [ ] Every library has `project.json` with proper tags
- [ ] Every library has barrel export (`src/index.ts`)
- [ ] TypeScript path mappings in `tsconfig.base.json` follow `@{org}/{type}-{domain}` pattern

### Configuration Requirements

- [ ] `nx.json` configured with caching and plugins
- [ ] `.eslintrc.js` has `@nx/enforce-module-boundaries` rule enabled
- [ ] Dependency constraints match layer architecture
- [ ] All libraries have proper TypeScript configuration
- [ ] Jest preset configured for testing

### Code Organization Requirements

- [ ] No business logic in UI libraries
- [ ] No external dependencies in core libraries
- [ ] Features don't cross-import each other
- [ ] Tests are co-located with source files
- [ ] Barrel exports are comprehensive and up-to-date

### Best Practices

- [ ] Dependency graph is acyclic (no circular dependencies)
- [ ] Library names follow kebab-case convention
- [ ] Import paths use `@{org}/*` aliases, not relative paths
- [ ] Each library has a single, focused purpose
- [ ] Documentation exists for each library (`README.md`)

---

## Quick Reference Commands

```bash
# Generate a new library
nx g @nx/react:lib {name} --directory=libs/{type}/{name} --tags=type:{type},scope:{scope}

# Visualize dependencies
nx graph

# Check affected projects
nx affected:graph

# Lint all projects
nx run-many -t lint

# Test all projects
nx run-many -t test

# Build specific project
nx build {project-name}

# Clear cache
nx reset
```

---

**For detailed Nx documentation, visit:** [https://nx.dev](https://nx.dev)

**For React Native + Nx integration:** [https://nx.dev/nx-api/expo](https://nx.dev/nx-api/expo)
