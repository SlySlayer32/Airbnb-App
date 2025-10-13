# Validation Guide for New .cursor/rules

## How to Test the New Rules

### Step 1: Start Fresh Chat
Open a new Cursor chat window to ensure rules are loaded fresh.

### Step 2: Test Documentation-First Behavior
Try this prompt:
```
"Add a notification count badge to the cleaner dashboard"
```

**Expected AI Behavior** (Documentation-First):
1. ✅ Reads `docs/AI-README.md` for context
2. ✅ Checks `docs/manifests/COMPONENTS.md` for existing notification components
3. ✅ Reviews `docs/core/BUSINESS_RULES.md` for applicable rules
4. ✅ Confirms in plain language what will be built
5. ✅ Provides complete working code (no TODOs)
6. ✅ Uses exact design system values from rules
7. ✅ Follows existing component patterns
8. ✅ Suggests next logical step

### Step 3: Test Architecture Understanding
Try this prompt:
```
"Explain how photo uploads work in this app"
```

**Expected AI Response** (from architecture.mdc):
1. ✅ Describes three-layer architecture
2. ✅ Explains PhotoProofService role
3. ✅ Shows integration with cleaningSessionService
4. ✅ Mentions Supabase Storage specifics
5. ✅ References PhotoProofGate component
6. ✅ Explains validation logic (minimum 3 photos)

### Step 4: Test Workflow Knowledge
Try this prompt:
```
"The app won't start - how do I debug this?"
```

**Expected AI Response** (from workflows.mdc):
1. ✅ Suggests `npm run dev:clean` first
2. ✅ Mentions nuclear option (rm -rf node_modules)
3. ✅ Lists common causes (cache, env vars)
4. ✅ Provides specific commands to run
5. ✅ References demo mode fallback

### Step 5: Test Integration Knowledge
Try this prompt:
```
"How do services communicate with each other?"
```

**Expected AI Response** (from integrations.mdc):
1. ✅ Explains service-to-service calls
2. ✅ Gives examples (cleaningSessionService → notificationService)
3. ✅ Shows import patterns
4. ✅ Mentions real-time broadcasting
5. ✅ Describes error propagation

### Step 6: Test Convention Awareness
Try this prompt:
```
"Should I use Redux for state management?"
```

**Expected AI Response** (from conventions.mdc):
1. ✅ Says NO - explains project uses Context + useState
2. ✅ Explains why (simplicity, local state nature)
3. ✅ Shows when to use what (auth → Context, UI → useState)
4. ✅ References demo mode pattern
5. ✅ Matches existing codebase approach

## What Good Behavior Looks Like

### Documentation Citations
AI should reference specific docs:
```
"According to docs/core/BUSINESS_RULES.md, cleaners cannot see financial data..."
"I checked docs/manifests/COMPONENTS.md and found CleanerDashboard component..."
"The docs/workflows/FEATURE_DEVELOPMENT.md workflow suggests..."
```

### Pattern Following
AI should use exact project patterns:
```typescript
// Uses project convention (not standard practice)
export const newService = {
  async getData() { }
};

// Not this (standard but not project pattern):
class NewService {
  async getData() { }
}
```

### Complete Code Delivery
AI should provide:
- ✅ All imports
- ✅ Full component/service implementation
- ✅ Type definitions if needed
- ✅ StyleSheet definitions
- ✅ Error handling
- ✅ Loading states
- ✅ Empty states
- ✅ NO TODOs or placeholders

### Business Rule Enforcement
AI should automatically apply:
- ✅ 4-hour cleaning window validation
- ✅ Financial data hiding from cleaners
- ✅ Photo proof requirements
- ✅ Role-based access control
- ✅ 24-hour cancellation notice checking

## What Bad Behavior Looks Like

### 🚫 Ignoring Documentation
```
AI: "Let's create a new component..."
(Without checking docs/manifests/COMPONENTS.md first)
```

### 🚫 Wrong Patterns
```typescript
// Using class-based service (not project pattern)
class PropertyService {
  async getProperties() { }
}
```

### 🚫 Incomplete Code
```typescript
// TODO: Add error handling
// TODO: Add loading state
// TODO: Add empty state
```

### 🚫 Generic Advice
```
"You should add tests for this feature"
(Without noting project uses manual testing primarily)
```

### 🚫 Wrong Tech Choices
```
"Let's add Redux for state management"
(Project explicitly uses Context + useState)
```

## Quick Validation Checklist

When AI completes a task, verify:
- [ ] AI read relevant documentation first
- [ ] AI cited specific doc files
- [ ] Code follows project conventions (not standard practices)
- [ ] All TypeScript types defined (no 'any')
- [ ] Design system values used (no magic numbers)
- [ ] Error handling included
- [ ] Loading/empty states included
- [ ] Business rules enforced
- [ ] Role-based access correct
- [ ] No TODOs or placeholders
- [ ] Testing steps provided
- [ ] Next step suggested

## Troubleshooting

### If AI Isn't Following Rules

**Symptom**: AI provides generic code without checking docs

**Solutions**:
1. Restart Cursor completely
2. Start fresh chat window
3. Explicitly ask: "Did you read docs/AI-README.md first?"
4. Check `.cursor/rules/` files have `alwaysApply: true`

### If AI Doesn't Know Project Patterns

**Symptom**: AI suggests Redux, class-based services, ESLint

**Solutions**:
1. Point to conventions.mdc: "Check .cursor/rules/conventions.mdc"
2. Explicitly state: "This project uses X pattern (see conventions.mdc)"
3. Verify conventions.mdc file exists and is readable

### If AI Doesn't Know Commands

**Symptom**: AI suggests wrong build/test commands

**Solutions**:
1. Point to workflows.mdc: "Check .cursor/rules/workflows.mdc"
2. Reference package.json: "Check npm scripts in package.json"
3. Explicitly provide correct command

## Success Metrics

**Excellent Rule Application**:
- AI reads docs 90%+ of tasks
- AI cites specific files 80%+ of responses
- AI follows project patterns 95%+ of code
- Zero 'any' types in generated code
- Complete implementations (no TODOs)
- Business rules always enforced

**Good Rule Application**:
- AI reads docs 70%+ of tasks
- AI follows patterns 85%+ of code
- Minimal TODOs (only for complex unknowns)
- Business rules enforced with reminders

**Needs Improvement**:
- AI rarely reads docs
- AI suggests wrong patterns frequently
- Code incomplete or generic
- Business rules missed

## Feedback Loop

After testing, consider:
1. What worked well?
2. What patterns were missed?
3. What documentation should be added?
4. What rules need clarification?
5. What examples would help?

Update rules based on real usage patterns to continually improve AI behavior.
