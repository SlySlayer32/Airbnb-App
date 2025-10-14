# Prompting Guide

> How to communicate effectively with AI assistants

## Effective Prompt Structure

### Good Prompts Include

1. **Context**: What you're working on
2. **Goal**: What you want to achieve
3. **Constraints**: Any limitations or requirements
4. **Examples**: Similar patterns or existing code

### Example Good Prompt

```
I'm working on the cleaner dashboard and need to add a "Report Issue" button.
The button should:
- Appear on the CleanerPropertyCard component
- Open a modal with issue type selection
- Send notification to property owner
- Follow existing error handling patterns

Similar pattern: PhotoProofGate component
```

### Bad Prompts to Avoid

❌ **Too vague**: "Add a button"
❌ **No context**: "Fix this"
❌ **Assumes knowledge**: "Make it work like the other one"

## Feature Request Template

```
**Feature**: [Brief description]

**User Story**: As a [role], I want to [action], so that [benefit]

**Current Behavior**: [What happens now]

**Desired Behavior**: [What should happen]

**Business Rules to Enforce**:
- [ ] Rule 1
- [ ] Rule 2

**Technical Constraints**:
- Must work with existing service layer
- Must follow component patterns
- Must be mobile responsive

**Similar Features**: [Existing features to reference]
```

## Bug Report Template

```
**Bug**: [One sentence description]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Observe problem]

**Expected**: [What should happen]
**Actual**: [What actually happens]

**Environment**:
- Platform: iOS/Android/Web
- User Role: property_owner/cleaner/co_host
- Supabase: Connected/Demo mode

**Error Messages**: [Console errors or UI text]
```

## Code Review Template

```
**Change**: [What was changed]

**Files Modified**:
- [File 1]
- [File 2]

**Business Rules Enforced**:
- [ ] Rule 1
- [ ] Rule 2

**Testing Done**:
- [ ] Tested as property_owner
- [ ] Tested as cleaner
- [ ] Tested edge cases

**Documentation Updated**:
- [ ] CHANGELOG.md
- [ ] Relevant manifest files
```

## Questions to Ask

### Before Starting
- "What's the current priority according to phase-status.md?"
- "Are there similar features I should reference?"
- "Which business rules apply to this feature?"

### During Development
- "Should this follow the same pattern as [existing feature]?"
- "Is this the right place to add this logic?"
- "Do I need to update any documentation?"

### Before Completing
- "Have I enforced all relevant business rules?"
- "Have I tested all user roles?"
- "Have I updated all necessary documentation?"

## Common Misunderstandings

### "Make it like the other one"
❌ **Problem**: Which "other one"? What specifically?
✅ **Better**: "Use the same pattern as PhotoProofGate component, specifically the photo validation logic"

### "It should be simple"
❌ **Problem**: "Simple" means different things to different people
✅ **Better**: "Add a button that opens a modal with 3 options"

### "Just fix it"
❌ **Problem**: No context about what's broken or what "fixed" looks like
✅ **Better**: "The session completion button doesn't enable even with 3 photos. Expected: button enables when photo count >= 3"

## Tips for Better Results

1. **Be specific**: "Add a button" → "Add a 'Report Issue' button to CleanerPropertyCard"
2. **Provide context**: "Fix this" → "The photo upload fails with error X in scenario Y"
3. **Include examples**: "Like the other one" → "Use the same pattern as PhotoProofGate validation"
4. **Specify constraints**: "Add a button" → "Add a button that works on mobile and follows design system"
5. **Ask for clarification**: "I'm not sure about X, should I do Y or Z?"

---

**Last Updated**: January 2025

