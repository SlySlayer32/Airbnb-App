---
applyTo: '**'
description: 'Code review guidelines, quality standards, and what to look for in PRs'
---

# Code Review Guidelines

## Review Philosophy

- **Be kind and constructive** - Suggest improvements, don't demand
- **Assume good intent** - Author is doing their best
- **Educate, don't criticize** - Explain _why_, not just _what_
- **Praise good work** - Call out clever solutions and improvements
- **Focus on code, not person** - "This function could be..." not "You should..."

## What to Review

### 1. Correctness

- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] No logic errors or bugs introduced
- [ ] Error handling is appropriate
- [ ] Business rules are correctly implemented

### 2. Architecture & Design

- [ ] Follows project structure (services, components, etc.)
- [ ] Business logic in services, not UI components
- [ ] Proper separation of concerns
- [ ] Reuses existing patterns and utilities
- [ ] No unnecessary abstraction or over-engineering

### 3. Code Quality

- [ ] TypeScript types are properly defined
- [ ] No `any` types without justification
- [ ] Functions are small and focused
- [ ] Clear and descriptive naming
- [ ] No magic numbers or hard-coded values
- [ ] Follows project conventions

### 4. Performance

- [ ] No unnecessary re-renders
- [ ] Expensive operations are memoized
- [ ] Lists use FlatList, not map
- [ ] Images are optimized
- [ ] No N+1 queries
- [ ] Database queries are efficient

### 5. Security

- [ ] Input is validated
- [ ] No sensitive data logged
- [ ] Authentication/authorization checked
- [ ] RLS policies respected
- [ ] No credentials in code
- [ ] SQL injection prevented

### 6. Testing

- [ ] Tests added for new functionality
- [ ] Tests cover edge cases
- [ ] Tests are meaningful (not just for coverage)
- [ ] E2E tests for critical flows
- [ ] Tests pass locally

### 7. Documentation

- [ ] Complex logic has comments
- [ ] Public APIs have JSDoc
- [ ] README updated if needed
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)

### 8. UI/UX

- [ ] Uses Gluestack UI components
- [ ] Theme tokens used (not hard-coded colors)
- [ ] Responsive on different screen sizes
- [ ] Accessible (labels, roles, contrast)
- [ ] Loading and error states handled
- [ ] Consistent with existing UI patterns

## Review Process

### 1. Initial scan

- Read PR description
- Understand the problem being solved
- Check CI status (tests, lint, type-check)
- Review file changes list
- Note anything that stands out

### 2. Deep review

- Review code file by file
- Check logic and implementation
- Look for potential bugs
- Consider edge cases
- Think about performance
- Check security implications

### 3. Testing

- Pull branch locally
- Run the app
- Test functionality manually
- Try to break it
- Test on different platforms (if needed)
- Check for console warnings

### 4. Provide feedback

- Add inline comments on specific lines
- Add general comments in PR discussion
- Suggest improvements with examples
- Ask questions if unclear
- Approve or request changes

## Comment Guidelines

### Types of comments

**Critical (must fix):**

```
⚠️ This will cause a crash if `user` is null. Add null check:
if (!user) return null;
```

**Suggestion (nice to have):**

```
💡 Consider extracting this into a separate hook for reusability:
const { isLoading, error } = useProperties(filters);
```

**Question (seeking clarification):**

```
❓ Why are we using setTimeout here instead of the async pattern?
```

**Praise (good work):**

```
👍 Nice use of memoization here! This will prevent unnecessary re-renders.
```

**Nitpick (optional improvement):**

```
nit: Could use destructuring here for cleaner code:
const { name, address } = property;
```

### Good comment examples

**❌ Not helpful:**

```
This is wrong.
Bad code.
Why did you do this?
```

**✅ Helpful:**

```
This could cause a memory leak because the subscription isn't cleaned up.
Consider adding a cleanup function:

useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

## Common Review Patterns

### Service layer review

```typescript
// ❌ Needs changes
export async function getProperties() {
  const response = await supabase.from('properties').select('*');
  return response; // Returns raw Supabase response
}

// ✅ Approved
export async function getProperties(): Promise<EnhancedProperty[]> {
  const { data, error } = await supabase.from('properties').select('*');

  if (error) {
    throw new ServiceError('Failed to fetch properties', 'FETCH_ERROR', { error });
  }

  return data || [];
}
```

**Review comment:**

```
The service should handle errors and return typed data, not raw Supabase responses.
Also, add input validation if filters are added later.
```

### Component review

```typescript
// ❌ Needs changes
export function PropertyCard({ property }: any) {
  return (
    <View style={{ backgroundColor: '#3B82F6', padding: 16 }}>
      <Text>{property.name}</Text>
    </View>
  );
}

// ✅ Approved
export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Box bg="$primary500" p="$4" borderRadius="$lg">
      <Text fontSize="$md" fontWeight="$bold">
        {property.name}
      </Text>
    </Box>
  );
}
```

**Review comment:**

```
Please use:
1. Proper TypeScript types (PropertyCardProps, not any)
2. Gluestack UI components and theme tokens
3. Accessible components with proper semantic structure
```

### Navigation review

```typescript
// ❌ Needs changes

// ✅ Approved
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

function handlePress() {
  navigation.navigate('PropertyDetail', { id: property.id });
}

function handlePress() {
  router.push(`/properties/${property.id}`);
}
```

**Review comment:**

```
Use Expo Router APIs (router.push) instead of react-navigation directly.
This ensures type-safe routing and consistency across the app.
```

### Error handling review

```typescript
// ❌ Needs changes
try {
  await startSession(propertyId);
} catch (error) {
  alert('Error!');
}

// ✅ Approved
try {
  await cleaningSessionService.startSession(propertyId);
  router.push('/session-active');
} catch (error) {
  if (error instanceof ServiceError) {
    showToast({ title: error.message, status: 'error' });
  } else {
    logger.error('Unexpected error starting session', error);
    showToast({ title: 'Something went wrong', status: 'error' });
  }
}
```

**Review comment:**

```
Error handling should:
1. Differentiate between expected (ServiceError) and unexpected errors
2. Show user-friendly messages
3. Log unexpected errors for debugging
4. Not use alert() - use the toast system
```

## Security Review Checklist

- [ ] No hardcoded secrets or API keys
- [ ] Environment variables properly prefixed
- [ ] User input is validated and sanitized
- [ ] Authentication required for protected routes
- [ ] RLS policies tested
- [ ] No SQL injection vulnerabilities
- [ ] File uploads validated (type, size)
- [ ] Sensitive data not logged
- [ ] Error messages don't leak system info
- [ ] Dependencies have no known vulnerabilities

## Performance Review Checklist

- [ ] No unnecessary re-renders (use React DevTools)
- [ ] Expensive computations memoized
- [ ] Lists use FlatList with proper keys
- [ ] Images optimized and cached
- [ ] No blocking operations on main thread
- [ ] Database queries optimized (indexes, joins)
- [ ] Bundle size impact considered
- [ ] Lazy loading for heavy components

## Accessibility Review Checklist

- [ ] accessibilityLabel on interactive elements
- [ ] accessibilityRole set appropriately
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Keyboard navigation works (web)
- [ ] Screen reader friendly
- [ ] Focus management correct
- [ ] Error messages are accessible

## Approval Criteria

### Approve when:

- Code is correct and complete
- Tests pass and cover new functionality
- No major issues or security concerns
- Minor suggestions can be addressed in follow-up
- Documentation is adequate
- Follows project conventions

### Request changes when:

- Bugs or logic errors exist
- Security vulnerabilities present
- Tests are missing or failing
- Breaking changes without migration guide
- Code quality is significantly below standards
- Performance issues not addressed

### Comment (no approval) when:

- Need clarification
- Suggesting optional improvements
- Want to discuss approach
- Not familiar enough with code to approve

## Review Turnaround

- **Routine PRs:** Within 24 hours
- **Urgent PRs:** Within 2-4 hours
- **Small PRs (<100 lines):** Prioritize for quick review
- **Large PRs (>500 lines):** May need multiple reviewers

## Self-Review Checklist

Before requesting review:

- [ ] Reviewed your own diff
- [ ] Removed console.logs and commented code
- [ ] Tests added and passing
- [ ] Type check passes (`npm run type-check`)
- [ ] Linter passes (`npm run lint`)
- [ ] No merge conflicts
- [ ] PR description is clear
- [ ] Breaking changes documented
- [ ] Screenshots/videos added (for UI changes)
- [ ] Tested on target platforms

## Handling Review Feedback

### As an author:

- **Don't take it personally** - Feedback is about code, not you
- **Ask questions** - If unclear, ask for clarification
- **Push back respectfully** - If you disagree, explain why
- **Acknowledge feedback** - Even if you don't implement it
- **Mark conversations resolved** - After addressing comments
- **Thank reviewers** - Appreciate their time

### As a reviewer:

- **Be timely** - Don't let PRs sit for days
- **Be thorough but pragmatic** - Don't nitpick everything
- **Approve when ready** - Don't hold PRs hostage for minor issues
- **Follow up** - If you requested changes, re-review promptly
- **Mentor** - Help less experienced developers improve

## Large PR Guidelines

For PRs with 500+ lines changed:

- Consider breaking into smaller PRs
- Provide detailed description and context
- Add diagrams or screenshots if helpful
- Highlight critical sections for review
- Consider pair programming for complex changes
- Allow more time for thorough review

## Emergency/Hotfix Reviews

For critical production fixes:

- Smaller, focused changes only
- Clear description of issue and fix
- Manual testing required
- Expedited review (< 2 hours)
- Can merge with single approval
- Plan follow-up improvements if needed

## Review Metrics to Avoid

❌ Don't optimize for:

- Number of comments left
- Percent of lines commented on
- Time spent in review

✅ Do optimize for:

- Code quality improvement
- Knowledge sharing
- Catching bugs early
- Building team culture
