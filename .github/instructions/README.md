# Instruction Files Overview

This project uses a **modular instruction system** that automatically applies context-specific guidance to AI coding assistants based on the files being edited.

## 📁 Instruction Files Created

### 1. **security.instructions.md** (`applyTo: '**'`)

**Purpose:** Security best practices for all code

**Key Topics:**

- Authentication & authorization patterns
- Row Level Security (RLS) implementation
- Input validation & sanitization
- File upload validation
- API security & rate limiting
- Secure data storage
- XSS prevention
- Dependency security
- Security checklist

**When Applied:** Always (all files)

---

### 2. **database.instructions.md** (`applyTo: '{services/**,supabase/**,types/**}'`)

**Purpose:** Database schema and query patterns

**Key Topics:**

- Complete schema overview (properties, sessions, team_members, etc.)
- Table relationships and ER diagram
- Row Level Security policies
- Efficient query patterns
- Supabase realtime subscriptions
- Performance best practices
- Type safety with database
- Transaction patterns

**When Applied:** When editing services, supabase files, or type definitions

---

### 3. **testing.instructions.md** (`applyTo: '{**/__tests__/**,**/*.test.ts,**/*.test.tsx,jest.config.js,jest.setup.js,e2e/**}'`)

**Purpose:** Testing strategies and patterns

**Key Topics:**

- Unit testing services and components
- Mocking strategies (Supabase, contexts, navigation)
- Test coverage requirements
- E2E testing with Detox
- Snapshot testing
- Testing async operations
- Testing checklist

**When Applied:** When editing test files or test configuration

---

### 4. **components.instructions.md** (`applyTo: 'components/**'`)

**Purpose:** UI component development guidelines

**Key Topics:**

- Gluestack UI patterns and theme tokens
- Component structure and types
- Component composition patterns
- Performance optimization (memo, useCallback, useMemo)
- Accessibility (ARIA labels, roles)
- Error boundaries
- Loading/empty states
- Testing components
- Anti-patterns to avoid

**When Applied:** When editing component files

---

### 5. **navigation-routing.instructions.md** (`applyTo: 'app/**'`)

**Purpose:** Expo Router navigation patterns

**Key Topics:**

- File-based routing fundamentals
- Navigation API (router.push, replace, back)
- Layout patterns (root, nested, tabs, drawer)
- Modal screens
- Navigation guards (auth, role-based)
- Dynamic screen options
- Deep linking
- Platform-specific navigation
- Testing navigation

**When Applied:** When editing app/ screen files

---

### 6. **services-layer.instructions.md** (`applyTo: 'services/**'`)

**Purpose:** Service layer architecture and patterns

**Key Topics:**

- Service structure template
- Structured error handling (ServiceError)
- Input validation patterns
- Business rule validation
- Data transformation (DB ↔ domain models)
- TanStack Query integration
- Optimistic updates
- Service testing
- Best practices and anti-patterns

**When Applied:** When editing service files

---

### 7. **git-workflow.instructions.md** (`applyTo: '**'`)

**Purpose:** Git conventions and workflows

**Key Topics:**

- Branch strategy and naming
- Commit message conventions
- Common workflows (features, fixes, hotfixes)
- Pull request guidelines
- PR review checklist
- Merge strategies
- Conflict resolution
- Versioning and tagging
- CI/CD integration

**When Applied:** Always (especially for commits and PRs)

---

### 8. **debugging.instructions.md** (`applyTo: '**'`)

**Purpose:** Debugging strategies and troubleshooting

**Key Topics:**

- Development tools (React Native Debugger, Flipper, VS Code)
- Logging strategies
- Common issues and solutions:
  - Metro bundler issues
  - TypeScript path resolution
  - Navigation issues
  - Supabase connection
  - State updates
  - Performance
  - Platform-specific
- Debugging workflows
- Error tracking (Sentry)

**When Applied:** Always (when troubleshooting)

---

### 9. **platform-specific.instructions.md** (`applyTo: '**'`)

**Purpose:** iOS, Android, and Web platform differences

**Key Topics:**

- Platform detection
- iOS-specific (Safe Area, permissions, keyboard, navigation)
- Android-specific (back button, permissions, elevation, ripple)
- Web-specific (layouts, SEO, interactions, accessibility)
- Storage differences
- Responsive design
- Testing across platforms
- Build differences
- Performance considerations
- Platform checklist

**When Applied:** Always (for cross-platform awareness)

---

### 10. **code-review.instructions.md** (`applyTo: '**'`)

**Purpose:** Code review standards and guidelines

**Key Topics:**

- Review philosophy
- What to review (correctness, architecture, quality, performance, security, testing, documentation, UI/UX)
- Review process
- Comment guidelines (critical, suggestion, question, praise)
- Common review patterns
- Security/performance/accessibility checklists
- Approval criteria
- Self-review checklist
- Handling feedback
- Emergency/hotfix reviews

**When Applied:** Always (for both reviewers and authors)

---

### 11. **deployment.instructions.md** (`applyTo: '{eas.json,app.json,package.json,.github/workflows/**}'`)

**Purpose:** Build and deployment processes

**Key Topics:**

- Build environments (dev, staging, production)
- Environment variables and secrets
- EAS build configuration
- Build commands (iOS, Android, Web)
- Pre-deployment checklist
- Version bumping
- Release process (prepare, test, build, submit, monitor)
- Rollback strategy
- CI/CD automation
- Post-deployment monitoring
- Hotfix procedures
- Beta testing

**When Applied:** When editing build configuration files

---

## 🎯 How the System Works

### 1. **Automatic Context**

When you edit a file, GitHub Copilot automatically loads the relevant instruction files based on the `applyTo` glob pattern.

### 2. **Layered Instructions**

- **Main copilot-instructions.md** provides high-level overview
- **Specialized files** provide deep, context-specific guidance
- Multiple instruction files can apply simultaneously

### 3. **Example Scenarios**

**Editing `services/propertyService.ts`:**

- ✅ security.instructions.md (applies to all)
- ✅ database.instructions.md (applies to services/\*\*)
- ✅ services-layer.instructions.md (applies to services/\*\*)
- ✅ git-workflow.instructions.md (applies to all)
- ✅ debugging.instructions.md (applies to all)
- ✅ platform-specific.instructions.md (applies to all)
- ✅ code-review.instructions.md (applies to all)

**Editing `components/PropertyCard.tsx`:**

- ✅ security.instructions.md
- ✅ components.instructions.md (applies to components/\*\*)
- ✅ git-workflow.instructions.md
- ✅ debugging.instructions.md
- ✅ platform-specific.instructions.md
- ✅ code-review.instructions.md

**Editing `app/properties.tsx`:**

- ✅ security.instructions.md
- ✅ navigation-routing.instructions.md (applies to app/\*\*)
- ✅ git-workflow.instructions.md
- ✅ debugging.instructions.md
- ✅ platform-specific.instructions.md
- ✅ code-review.instructions.md

**Editing `services/__tests__/propertyService.test.ts`:**

- ✅ security.instructions.md
- ✅ database.instructions.md (applies to services/\*\*)
- ✅ services-layer.instructions.md (applies to services/\*\*)
- ✅ testing.instructions.md (applies to **/**tests**/**)
- ✅ git-workflow.instructions.md
- ✅ debugging.instructions.md
- ✅ code-review.instructions.md

## 📊 Benefits of This System

### ✅ **Context-Aware**

AI gets only the relevant instructions for the task at hand, reducing noise and improving accuracy.

### ✅ **Maintainable**

Each concern is separated into its own file, making updates easier.

### ✅ **Scalable**

Easy to add new instruction files as the project grows.

### ✅ **Comprehensive**

Covers all aspects: security, database, testing, UI, navigation, services, git, debugging, platforms, reviews, deployment.

### ✅ **Automatic**

No manual loading needed - instructions apply based on file patterns.

## 🛠️ Maintaining the Instructions

### Adding New Instructions

```markdown
---
applyTo: 'specific/pattern/**'
description: 'What this file covers'
---

# Instruction Title

Content here...
```

### Updating Existing Instructions

Edit the relevant `.instructions.md` file in `.github/instructions/`

### Testing Instructions

1. Open a file matching the `applyTo` pattern
2. Ask Copilot a question related to the instruction topic
3. Verify it references the instruction content

## 📖 Quick Reference

When working on...

- **Security concerns** → security.instructions.md
- **Database queries** → database.instructions.md
- **Writing tests** → testing.instructions.md
- **UI components** → components.instructions.md
- **Navigation** → navigation-routing.instructions.md
- **Service layer** → services-layer.instructions.md
- **Git commits/PRs** → git-workflow.instructions.md
- **Debugging issues** → debugging.instructions.md
- **Platform differences** → platform-specific.instructions.md
- **Code reviews** → code-review.instructions.md
- **Deployments** → deployment.instructions.md

---

**💡 Pro Tip:** The main `copilot-instructions.md` file now serves as a high-level overview and quick reference, while specialized files provide deep, actionable guidance for specific contexts.
