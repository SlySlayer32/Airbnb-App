# Validation Patterns

> How to validate AI-generated code and suggestions

## Code Quality Checklist

### Before Accepting Code

**TypeScript**:
- [ ] No 'any' types
- [ ] All functions have explicit return types
- [ ] All props are typed
- [ ] No type errors (`npm run lint` passes)

**Architecture**:
- [ ] Follows service layer pattern (components → services → database)
- [ ] No direct Supabase calls from components
- [ ] Proper error handling in try/catch
- [ ] Loading/error/empty states implemented

**Business Rules**:
- [ ] Cleaning window validated (11 AM - 3 PM)
- [ ] Cancellation notice calculated (24 hours)
- [ ] Financial data hidden from cleaners
- [ ] Photo proof requirements enforced
- [ ] Linen quantities auto-calculated

**Code Style**:
- [ ] Follows existing patterns
- [ ] Uses design system values (colors, spacing)
- [ ] No console.log statements
- [ ] Proper import order

## Feature Validation Checklist

### Functional Testing
- [ ] Feature works as intended
- [ ] All user roles tested (property_owner, cleaner, co_host)
- [ ] Loading states display correctly
- [ ] Error messages are user-friendly
- [ ] Empty states show helpful text

### Technical Testing
- [ ] TypeScript compiles with no errors
- [ ] No console.log statements in code
- [ ] All business rules enforced
- [ ] Role-based access working
- [ ] Mobile responsive

### Edge Case Testing
- [ ] Works with no data
- [ ] Works with API failure
- [ ] Works offline (graceful degradation)
- [ ] Works with slow connection
- [ ] Handles invalid user input

## Documentation Validation

### After New Feature
- [ ] `CHANGELOG.md` updated
- [ ] Relevant manifest file updated (if new component/service)
- [ ] `docs/07-project-management/phase-status.md` updated
- [ ] Feature spec created (if major feature)

### After Bug Fix
- [ ] `CHANGELOG.md` updated with fix details
- [ ] `docs/03-development/troubleshooting.md` updated (if recurring issue)
- [ ] Related GitHub issue closed

## Pattern Validation

### Component Pattern
```typescript
✅ Has proper TypeScript types
✅ Uses useState for local state
✅ Has loading state
✅ Has error handling
✅ Uses design system values
✅ Follows StyleSheet pattern
✅ No console.log statements
```

### Service Pattern
```typescript
✅ Has proper TypeScript types
✅ Uses try/catch for errors
✅ Shows user-friendly alerts
✅ Logs technical errors
✅ Returns typed data
✅ Follows existing patterns
```

## Red Flags to Watch For

### Architecture Violations
❌ Direct Supabase calls from components
❌ 'any' types in code
❌ Missing error handling
❌ No loading states
❌ Hardcoded values instead of design system

### Business Rule Violations
❌ No cleaning window validation
❌ Cleaners can see financial data
❌ No photo proof enforcement
❌ Manual linen calculation
❌ No cancellation notice check

### Code Quality Issues
❌ console.log statements
❌ Unused imports
❌ Inconsistent naming
❌ Magic numbers
❌ No comments for complex logic

## Validation Workflow

### Step 1: Code Review
1. Read the code
2. Check against quality checklist
3. Identify any red flags
4. Test in development environment

### Step 2: Documentation Review
1. Check if documentation updated
2. Verify CHANGELOG updated
3. Check manifest files updated
4. Verify phase status updated

### Step 3: Testing
1. Run type check (`npm run lint`)
2. Start app (`npm start`)
3. Test all user roles
4. Test edge cases
5. Verify business rules enforced

### Step 4: Approval
1. All checklists complete
2. No red flags
3. Documentation updated
4. Ready to commit

---

**Last Updated**: January 2025

