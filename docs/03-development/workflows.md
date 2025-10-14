# Development Workflows

> Complete guide to feature development, bug fixing, and Git workflow

## Table of Contents
- [Feature Development](#feature-development-workflow)
- [Bug Fixing](#bug-fixing-workflow)
- [Git Workflow](#git-workflow)
- [Testing Checklist](#testing-checklist)

---

## Feature Development Workflow

### Before You Start

**Define Requirements**:
- **Who** will use this feature? (property_owner, cleaner, co_host)
- **What** permissions are needed? (read-only, modify, delete)
- **Where** should it appear? (dashboard, dedicated screen, modal)
- **When** is it needed? (critical path vs nice-to-have)
- **Why** does this feature matter? (business value)

**Check Existing Patterns**:
1. Search `docs/04-codebase/COMPONENTS.md` for reusable components
2. Search `docs/04-codebase/SERVICES.md` for similar service methods
3. Review `docs/06-patterns/` for code templates
4. Check `.cursorrules` for code standards

### Implementation Steps

**1. Define TypeScript Types** (`/types/index.ts`)
```typescript
export interface NewFeature {
  id: string;
  property_id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;

  // Relations
  property?: Property;
  user?: Profile;
}
```

**2. Create Service Layer** (`/services/newFeatureService.ts`)
```typescript
import { supabase } from '@/utils/supabase';
import { Alert } from 'react-native';
import { NewFeature } from '@/types';
import { notificationService } from './notificationService';

export const newFeatureService = {

  async getData(filters?: any): Promise<NewFeature[]> {
    try {
      const { data, error } = await supabase
        .from('new_feature_table')
        .select(`*, property (name), user (name)`)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[newFeatureService.getData]', error);
      Alert.alert('Error', 'Could not load data. Please check your connection.');
      throw error;
    }
  },

  async createItem(itemData: Omit<NewFeature, 'id'>): Promise<NewFeature> {
    try {
      // Validate business rules
      if (!itemData.required_field) {
        throw new Error('Required field is missing');
      }

      const { data, error } = await supabase
        .from('new_feature_table')
        .insert({ ...itemData, created_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;

      // Send notification
      await notificationService.sendToUser(affectedUserId, {
        title: 'Feature Created',
        message: 'Description of what happened',
        type: 'info',
        priority: 'normal',
      });

      return data;
    } catch (error) {
      console.error('[newFeatureService.createItem]', error);
      Alert.alert('Error', 'Could not create item. Please try again.');
      throw error;
    }
  },
};
```

**3. Create Component** (`/components/NewFeatureCard.tsx`)
```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewFeature } from '@/types';
import { newFeatureService } from '@/services';

interface NewFeatureCardProps {
  feature: NewFeature;
  onPress: () => void;
  onUpdate?: (id: string) => void;
}

export default function NewFeatureCard({
  feature,
  onPress,
  onUpdate
}: NewFeatureCardProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await newFeatureService.updateItem(feature.id, { /* updates */ });
      onUpdate?.(feature.id);
    } catch (error) {
      // Error already shown by service
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Component content */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

**4. Add Role-Based Access** (if needed)
```typescript
import RoleBasedWrapper from '@/components/RoleBasedWrapper';

<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <NewFeatureComponent />
</RoleBasedWrapper>
```

**5. Test Implementation**
1. Type check: `npm run lint`
2. Run app: `npm start`
3. Test all states (loading, success, error, empty)
4. Test all roles (property_owner, cleaner, co_host)
5. Test edge cases (no internet, invalid data, permission denied)

### Documentation Updates

After implementing a new feature:
- [ ] `CHANGELOG.md` - Feature details and business impact
- [ ] `docs/04-codebase/COMPONENTS.md` - If new component
- [ ] `docs/04-codebase/SERVICES.md` - If new service
- [ ] `docs/07-project-management/PHASE_STATUS.md` - Update progress

---

## Bug Fixing Workflow

### Bug Report Template

```
**Bug**: [One sentence description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Observe problem]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**User Role Affected**: [property_owner / cleaner / co_host / all]

**Error Messages**: [Console errors or UI error text]

**When This Occurs**: [Always / Sometimes / Specific conditions]

**Impact**: [How many users affected, business impact]
```

### Debugging Process

**Step 1: Reproduce the Issue**
1. Follow reproduction steps exactly
2. Test in development environment
3. Check browser/metro console for errors
4. Verify expected vs actual behavior
5. Test with different user roles if applicable

**Step 2: Locate the Bug**
```bash
# Search for relevant code
grep -r "function_name" services/ components/

# Check recent changes
git log --oneline -10

# Look at file history
git log --follow -- path/to/file.tsx
```

**Step 3: Identify Root Cause**

Common root causes:
- **Type error**: Wrong type used, null/undefined access
- **Logic error**: Incorrect conditional, wrong calculation
- **State error**: Component not re-rendering, stale state
- **API error**: Wrong endpoint, missing params, RLS blocking
- **Race condition**: Async operations in wrong order

**Step 4: Fix with Minimal Change**
1. Make smallest change to fix issue
2. Don't refactor unrelated code
3. Follow existing patterns
4. Add comments if logic is complex

**Step 5: Test Thoroughly**
1. Verify fix resolves issue
2. Test related features (regression check)
3. Test with all affected user roles
4. Test edge cases

### Common Bug Categories

**Category 1: Type Errors**
```typescript
// ❌ Before
const name = user.profile.name; // Crashes if undefined

// ✅ After
const name = user?.profile?.name ?? 'Unknown';
```

**Category 2: State Not Updating**
```typescript
// ❌ Before
data.push(newItem); // Mutates state

// ✅ After
setData([...data, newItem]); // Creates new array
```

**Category 3: API Errors**
```typescript
// ❌ Before
const data = await supabase.from('table_name').select('*');

// ✅ After
const { data, error } = await supabase.from('table_name').select('*');
if (error) throw error;
```

### Emergency Hotfix Process

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

## Git Workflow

### Branching Strategy

**GitHub Flow** - Simple, branch-based workflow:

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Make changes, then push
git add .
git commit -m "feat: Description"
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# After merge, clean up:
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

**Branch Types**:
- **`main`** - Production code (always deployable)
- **`feature/*`** - New features (e.g., `feature/photo-proof`)
- **`bugfix/*`** - Bug fixes (e.g., `bugfix/auth-error`)
- **`hotfix/*`** - Emergency fixes (e.g., `hotfix/critical-crash`)

### Commit Message Standards

**Standard Format**:
```
[TYPE]: Brief description (affects: user_role)

- Specific change 1
- Specific change 2
- Business impact/value

Docs updated: file1.md, file2.md
```

**Commit Types**:

| Type | When to Use | Example |
|------|-------------|---------|
| **FEATURE** | New functionality added | Added photo proof for cleanings |
| **FIX** | Bug fixed | Fixed linen calculation error |
| **REFACTOR** | Code improved (no new features) | Simplified property service |
| **DOCS** | Documentation only | Updated README setup steps |
| **PERF** | Performance improvement | Optimized property list loading |

**Good Commit Examples**:

```bash
git commit -m "FEATURE: Add real-time cleaning notifications (affects: property_owner, cleaner)

- Implemented Supabase real-time subscriptions for cleaning_sessions table
- Added notification badge component with unread count
- Created notification service with push notification support
- Business impact: Reduces communication delays by 90%

Docs updated: CHANGELOG.md, docs/04-codebase/COMPONENTS.md"
```

```bash
git commit -m "FIX: Resolve linen calculation for properties >6 guests (affects: cleaner)

- Fixed multiplier logic in calculateLinenRequirements function
- Added boundary condition handling for large groups
- Updated CleanerPropertyCard to display correct quantities
- Business impact: Prevents cleaner preparation errors

Docs updated: CHANGELOG.md"
```

### Pre-Push Checklist

**Phase 1: Code Verification**
```bash
# 1. Type check (must pass with no errors)
npm run lint

# 2. Start app and test
npm start
# Test key features work correctly

# 3. Check for leftover debug code
# Remove any console.log statements
```

- [ ] TypeScript compiles with no errors
- [ ] App runs without crashing
- [ ] Key features tested and work
- [ ] No console.log statements left in code

**Phase 2: Documentation Updates**

For New Features:
- [ ] `CHANGELOG.md` - Add feature details
- [ ] Relevant manifest file (if new component/service/screen)

For Bug Fixes:
- [ ] `CHANGELOG.md` - Document fix

**Phase 3: Git Workflow**
```bash
# 1. Check what changed
git status

# 2. Review your changes
git --no-pager diff

# 3. Stage all changes
git add .

# 4. Commit with proper message
git commit -m "[TYPE]: Description (affects: roles)

- Change 1
- Change 2
- Impact

Docs updated: files.md"

# 5. Push to GitHub
git push origin main
```

### Common Git Issues

**Issue 1: "Your branch is behind 'origin/main'"**

```bash
# Save your local changes first
git stash

# Get latest changes
git pull origin main

# Restore your changes
git stash pop

# If conflicts, resolve them and commit
```

**Issue 2: "Merge Conflict"**

```bash
# Git will mark conflicts in files like this:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# 1. Open the file
# 2. Choose which version to keep (or combine both)
# 3. Remove the conflict markers (<<<, ===, >>>)
# 4. Save the file
# 5. Stage and commit

git add .
git commit -m "Resolved merge conflict in [filename]"
```

---

## Testing Checklist

### Functional Testing
- [ ] Feature works as intended
- [ ] All user roles tested
- [ ] Loading states display correctly
- [ ] Error messages are user-friendly
- [ ] Empty states show helpful text
- [ ] Navigation works correctly

### Technical Testing
- [ ] TypeScript compiles with no errors
- [ ] No console.log statements in code
- [ ] All business rules enforced
- [ ] Role-based access working
- [ ] Mobile responsive on different screen sizes
- [ ] Pull-to-refresh works (if applicable)

### Edge Case Testing
- [ ] Works with no data
- [ ] Works with API failure
- [ ] Works offline (graceful degradation)
- [ ] Works with slow connection
- [ ] Handles invalid user input

---

**Last Updated**: January 2025
**Maintenance**: Update as workflows evolve

