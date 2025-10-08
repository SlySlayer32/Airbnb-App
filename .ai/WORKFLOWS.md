# 🔄 Development Workflows

> Daily development processes and repeatable procedures

## 📋 Table of Contents
- [Starting New Feature](#starting-new-feature)
- [Fixing Bugs](#fixing-bugs)
- [Testing Changes](#testing-changes)
- [Pre-Push Checklist](#pre-push-checklist)
- [Emergency Rollback](#emergency-rollback)
- [Documentation Updates](#documentation-updates)

---

## 🚀 Starting New Feature

### Step 1: Identify Requirements
Ask these questions first:
- **Who** will use this feature? (property_owner, cleaner, co_host)
- **What** permissions are needed? (read-only, modify, delete)
- **Where** should it appear? (dashboard, dedicated screen, modal)
- **When** is it needed? (critical path vs nice-to-have)
- **Why** does this feature matter? (business value)

**Example**:
```
Feature: Photo Proof for Cleaning Completion
- Who: Cleaners (upload), Owners (view)
- What: Cleaners upload photos, owners view and approve
- Where: Completion flow (modal after session complete)
- When: Critical - required before completion
- Why: Protects both parties, prevents disputes
```

---

### Step 2: Check Existing Patterns
Before writing new code:
1. **Search for similar features**
   ```bash
   # Search components
   ls components/ | grep -i "keyword"
   
   # Search services
   grep -r "similar_function" services/
   ```

2. **Review relevant manifests**
   - [COMPONENT_MANIFEST.md](./COMPONENT_MANIFEST.md) - Find reusable components
   - [SERVICE_MANIFEST.md](./SERVICE_MANIFEST.md) - Find similar service methods
   - [SCREEN_MANIFEST.md](./SCREEN_MANIFEST.md) - Find similar screen patterns

3. **Identify dependencies**
   - What data types are needed? (check `types/index.ts`)
   - What services exist? (check `/services/`)
   - What components can be reused?

---

### Step 3: Implement in Order

#### 3.1 Define TypeScript Types
**File**: `/types/index.ts`

```typescript
// Add new interface
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

// Add to existing types if extending
export interface Property {
  // ... existing fields
  new_feature_count?: number; // Add optional field
}
```

---

#### 3.2 Create Service Layer
**File**: `/services/newFeatureService.ts`

```typescript
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { NewFeature } from '@/types';
import { notificationService } from './notificationService';

/**
 * New Feature Service
 * 
 * Manages [description of what this service does].
 * 
 * Database Tables: new_feature_table
 * RLS: [describe access rules]
 */
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

**Don't forget to export**:
```typescript
// In services/index.ts
export * from './newFeatureService';
```

---

#### 3.3 Create Component
**File**: `/components/NewFeatureCard.tsx`

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

---

#### 3.4 Add Screen (if needed)
**File**: `/app/new-feature.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { newFeatureService } from '@/services';
import { NewFeature } from '@/types';
import NewFeatureCard from '@/components/NewFeatureCard';

export default function NewFeatureScreen() {
  const { profile } = useAuth();
  const [data, setData] = useState<NewFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await newFeatureService.getData();
      setData(result);
    } catch (error) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {data.map(item => (
        <NewFeatureCard key={item.id} feature={item} onPress={() => {}} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
```

---

#### 3.5 Add Role-Based Access
```typescript
// In component or screen
import RoleBasedWrapper from '@/components/RoleBasedWrapper';

<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <NewFeatureComponent />
</RoleBasedWrapper>
```

---

#### 3.6 Update Navigation (if new screen)
**File**: `/app/_layout.tsx`

Add route to navigation if needed. File-based routing handles most cases automatically.

---

### Step 4: Test Implementation
1. **Type check**: `npm run lint`
2. **Run app**: `npm start`
3. **Test all states**:
   - Loading state
   - Success state
   - Error state
   - Empty state
4. **Test all roles**: Switch between property_owner, cleaner, co_host
5. **Test edge cases**:
   - No internet connection
   - Invalid data
   - Permission denied

---

### Step 5: Document Changes
Update these files:
- [ ] `CHANGELOG.md` - Add entry with business impact
- [ ] `.ai/COMPONENT_MANIFEST.md` - If new component added
- [ ] `.ai/SERVICE_MANIFEST.md` - If new service added
- [ ] `.ai/SCREEN_MANIFEST.md` - If new screen added

**Example CHANGELOG entry**:
```markdown
## [v1.4.0] - 2025-01-20 - Photo Proof System

### 🏠 New Features
- **Photo Proof for Cleanings**: Cleaners must upload photos before completing sessions
  - Enforces minimum photo requirements (3 photos: kitchen, bathroom, living area)
  - Property owners can review photos with timestamps
  - Prevents completion disputes

### 🔧 Technical Improvements
- Created `PhotoProofGate` component for photo upload enforcement
- Added `photoProofService` for photo validation and storage
- Integrated with Supabase storage for image hosting

**Business Impact**: Reduces disputes by 80%, increases owner confidence

**Pull Request**: #123
```

---

## 🐛 Fixing Bugs

### Step 1: Reproduce Issue
1. **Get reproduction steps** from user/tester
2. **Test in development** environment
3. **Check console** for errors
4. **Verify expected** vs actual behavior

### Step 2: Identify Root Cause
```bash
# Check recent changes
git log --oneline -10

# Search for related code
grep -r "function_name" .

# Check service logs
# Look for error messages in console
```

### Step 3: Fix and Test
1. **Make minimal change** to fix issue
2. **Test fix** thoroughly
3. **Test related features** (regression check)
4. **Document the fix** in commit message

### Step 4: Commit Fix
```bash
git add .
git commit -m "FIX: Brief description of bug fixed (affects: role)

- Root cause explanation
- What was changed
- How it was tested

Issue: #123"
```

---

## 🧪 Testing Changes

### Local Testing Workflow
```bash
# 1. Type check
npm run lint

# 2. Start development server
npm start

# 3. Test on device
# - Press 'a' for Android
# - Press 'i' for iOS
# - Press 'w' for web

# 4. Test all user flows
# - Login as different roles
# - Navigate through app
# - Test new feature
# - Test error scenarios
```

### Testing Checklist
- [ ] TypeScript compiles with no errors
- [ ] No console.log statements in code
- [ ] All user roles tested
- [ ] Loading states work
- [ ] Error messages are user-friendly
- [ ] Empty states display correctly
- [ ] Pull-to-refresh works
- [ ] Navigation works correctly
- [ ] App doesn't crash

---

## ✅ Pre-Push Checklist

**Complete this before every `git push`**:

### Phase 1: Code Verification
- [ ] Run `npm run lint` → No TypeScript errors
- [ ] Test app works: `npm start` → All features functional
- [ ] No console.log statements in code
- [ ] Test on actual device (not just simulator)

### Phase 2: Documentation Updates
- [ ] Update `CHANGELOG.md` with changes
- [ ] Update relevant `.ai/` manifest files
- [ ] Update `README.md` if setup changed
- [ ] Add inline comments for complex business logic

### Phase 3: Git Workflow
```bash
# 1. Check status
git status

# 2. Review changes
git --no-pager diff

# 3. Stage all changes
git add .

# 4. Commit with proper format
git commit -m "[TYPE]: Description (affects: roles)

- Change 1
- Change 2
- Business impact

Docs updated: file1.md, file2.md"

# 5. Push to GitHub
git push origin main
```

### Commit Message Format
```
[TYPE]: Brief description (affects: user_role)

- Specific change 1
- Specific change 2  
- Business impact/value

Docs updated: List of documentation files updated
```

**Types**: FEATURE, FIX, REFACTOR, DOCS, PERF, SETUP

---

## 🚨 Emergency Rollback

If something breaks in production:

### Option 1: Revert Last Commit
```bash
# See recent commits
git log --oneline -5

# Revert specific commit (creates new commit)
git revert <commit-hash>

# Push revert
git push origin main
```

### Option 2: Reset to Previous Commit (Local Only)
```bash
# Find good commit
git log --oneline -10

# Reset to that commit (DANGER: loses changes)
git reset --hard <commit-hash>

# Force push (use with caution)
# git push origin main --force
```

### Option 3: Create Hotfix
```bash
# Create hotfix branch
git checkout -b hotfix/issue-description

# Make minimal fix
# ... edit files ...

# Commit and push
git add .
git commit -m "HOTFIX: Brief description"
git push origin hotfix/issue-description

# Create PR for review
```

---

## 📝 Documentation Updates

### When to Update Documentation

**After New Feature**:
- [ ] `CHANGELOG.md` - Feature details and business impact
- [ ] `.ai/COMPONENT_MANIFEST.md` - If new component
- [ ] `.ai/SERVICE_MANIFEST.md` - If new service
- [ ] `.ai/SCREEN_MANIFEST.md` - If new screen
- [ ] `README.md` - If setup process changed

**After Bug Fix**:
- [ ] `CHANGELOG.md` - Bug description and fix
- [ ] `.ai/TROUBLESHOOTING.md` - Add to common issues if recurring

**After Refactor**:
- [ ] `CHANGELOG.md` - What was improved
- [ ] `.ai/CONVENTIONS.md` - If patterns changed

### Documentation Update Template
```markdown
## What Changed
[Brief description of changes]

## Why It Matters
[Business value or technical benefit]

## How to Use
[Usage examples or updated workflows]

## Migration Notes
[If breaking changes, how to adapt]
```

---

## 🎯 Workflow Success Criteria

These workflows succeed when:
1. ✅ New features follow established patterns automatically
2. ✅ Bug fixes are reproducible and testable
3. ✅ Testing catches issues before push
4. ✅ Pre-push checklist prevents broken code
5. ✅ Rollback procedures are quick and safe
6. ✅ Documentation stays current with code

---

**Last Updated**: January 2025  
**Maintenance**: Update workflows as processes evolve
