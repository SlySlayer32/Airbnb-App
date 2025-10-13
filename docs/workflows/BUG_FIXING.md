# 🐛 Bug Fixing Workflow

> Systematic approach to identifying and resolving issues

## 📋 Table of Contents
- [Bug Report Template](#bug-report-template)
- [Debugging Process](#debugging-process)
- [Common Bug Categories](#common-bug-categories)
- [Fix Verification](#fix-verification)

---

## 📝 Bug Report Template

### Step 1: Document the Bug
```
**Bug**: [One sentence description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Observe problem]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**User Role Affected**:
[property_owner / cleaner / co_host / all]

**Error Messages**:
[Console errors or UI error text]

**When This Occurs**:
[Always / Sometimes / Specific conditions]

**Impact**:
[How many users affected, business impact]
```

---

## 🔍 Debugging Process

### Step 1: Reproduce the Issue
1. Follow reproduction steps exactly
2. Test in development environment
3. Check browser/metro console for errors
4. Verify expected vs actual behavior
5. Test with different user roles if applicable

### Step 2: Locate the Bug
```bash
# Search for relevant code
grep -r "function_name" services/ components/

# Check recent changes
git log --oneline -10

# Look at file history
git log --follow -- path/to/file.tsx
```

### Step 3: Identify Root Cause
Common root causes:
- **Type error**: Wrong type used, null/undefined access
- **Logic error**: Incorrect conditional, wrong calculation
- **State error**: Component not re-rendering, stale state
- **API error**: Wrong endpoint, missing params, RLS blocking
- **Race condition**: Async operations in wrong order

### Step 4: Fix with Minimal Change
1. Make smallest change to fix issue
2. Don't refactor unrelated code
3. Follow existing patterns
4. Add comments if logic is complex

### Step 5: Test Thoroughly
1. Verify fix resolves issue
2. Test related features (regression check)
3. Test with all affected user roles
4. Test edge cases

---

## 🔍 Common Bug Categories

### Category 1: Type Errors
**Symptom**: "Cannot read property 'X' of undefined"

**Causes**:
- Accessing nested property before data loads
- Missing null checks
- Wrong type assumptions

**Fix Pattern**:
```typescript
// ❌ Before
const name = user.profile.name; // Crashes if undefined

// ✅ After
const name = user?.profile?.name ?? 'Unknown';
```

---

### Category 2: State Not Updating
**Symptom**: UI doesn't reflect data changes

**Causes**:
- State mutation instead of setState
- Missing dependency in useEffect
- Async state updates not awaited

**Fix Pattern**:
```typescript
// ❌ Before
data.push(newItem); // Mutates state

// ✅ After
setData([...data, newItem]); // Creates new array
```

---

### Category 3: API Errors
**Symptom**: Network requests fail or return wrong data

**Causes**:
- Wrong table name
- Missing RLS permissions
- Incorrect query filters
- Missing await on async call

**Fix Pattern**:
```typescript
// ❌ Before
const data = await supabase.from('table_name').select('*');
// Returns { data, error } object, not data directly!

// ✅ After
const { data, error } = await supabase.from('table_name').select('*');
if (error) throw error;
```

---

### Category 4: Navigation Issues
**Symptom**: Screen doesn't navigate or shows blank

**Causes**:
- Wrong route path
- Auth guard redirecting
- Missing screen file
- Infinite redirect loop

**Fix Pattern**:
```typescript
// Check route matches file name
// app/properties.tsx → /properties ✓

// Add navigation debugging
console.log('Navigating to:', route);
router.push(route);
```

---

## 🧪 Fix Verification

### Testing Checklist
- [ ] Bug no longer reproduces
- [ ] No new errors in console
- [ ] Related features still work
- [ ] All user roles tested
- [ ] Edge cases handled
- [ ] No TypeScript errors

### Commit the Fix
```bash
git add .
git commit -m "FIX: Brief description of bug fixed (affects: role)

- Root cause explanation
- What was changed
- How it was tested

Fixes: #issue-number"
```

---

## 🚨 Emergency Hotfix Process

For critical production bugs:

1. **Create hotfix branch**
```bash
git checkout -b hotfix/critical-issue-description
```

2. **Make minimal fix**
- Change only what's necessary
- Don't refactor or add features
- Focus on restoring functionality

3. **Test thoroughly**
- Verify fix works
- Check no new issues created
- Test with production-like data

4. **Deploy immediately**
```bash
git add .
git commit -m "HOTFIX: Description"
git push origin hotfix/issue-description
# Merge to main immediately
```

---

## 📋 Post-Fix Tasks

After fixing bug:
- [ ] Update `docs/reference/TROUBLESHOOTING.md` if recurring issue
- [ ] Update `CHANGELOG.md` with fix details
- [ ] Close related GitHub issue
- [ ] Notify affected users if production bug
- [ ] Consider adding test to prevent regression

---

**Remember**: Fix root cause, not symptoms. If you find yourself fixing the same issue multiple times, there's a deeper problem to address.

