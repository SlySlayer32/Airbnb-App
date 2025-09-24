---
applyTo: '**'
---

# Feature Development Process

## New Feature Request Workflow

### 1. Identify Requirements

- Who will use this feature? (property_owner, cleaner, co_host)
- What permissions are needed? (read-only, modify, delete)  
- Where should it appear? (dashboard, dedicated screen, modal)

### 2. Check Existing Patterns

- Look for similar features in codebase
- Identify reusable components to adapt
- Find service methods handling similar data

### 3. Complete Implementation Checklist

- [ ] TypeScript types in `/types/index.ts`
- [ ] Service methods in `/services/[domain]Service.ts`
- [ ] Components in `/components/[RoleFeature]Component.tsx`
- [ ] Screen in `/app/[feature].tsx` if needed
- [ ] Navigation update in `_layout.tsx` if new route
- [ ] RoleBasedWrapper for access control
- [ ] Error handling and loading states
- [ ] Update CHANGELOG.md with business impact

### 4. Security & Permissions

- Validate user roles before operations
- Use RoleBasedWrapper for UI access control
- Never expose sensitive data to unauthorized roles
- Test permission enforcement

### 5. Performance Considerations

- Use FlatList for large lists (>10 items)
- Implement pagination for 50+ records
- Add loading indicators for >500ms operations
- Include pull-to-refresh functionality

### 6. Business Rules Validation

- Enforce 4-hour cleaning window (11 AM - 3 PM)
- Calculate cancellation notice periods
- Auto-calculate linen requirements from guest count
- Trigger appropriate notifications for status changes

## Success Criteria

Feature is complete when:

- [ ] Business need is solved in plain English terms
- [ ] Code follows all existing patterns consistently
- [ ] Error handling provides user-friendly messages
- [ ] Loading states are shown appropriately
- [ ] Role-based access is properly enforced
- [ ] Business impact is documented in CHANGELOG
