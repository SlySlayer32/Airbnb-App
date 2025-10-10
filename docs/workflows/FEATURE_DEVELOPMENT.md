# 🚀 Feature Development Workflow

> Step-by-step process for adding new features to the platform

## 📋 Table of Contents
- [Before You Start](#before-you-start)
- [Implementation Steps](#implementation-steps)
- [Testing Checklist](#testing-checklist)
- [Documentation Updates](#documentation-updates)

---

## 📝 Before You Start

### Step 1: Define Requirements
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
   - Check `docs/manifests/COMPONENTS.md` for reusable components
   - Check `docs/manifests/SERVICES.md` for similar service methods
   - Look at existing code in relevant folders

2. **Review patterns**
   - `docs/reference/API_PATTERNS.md` - Service templates
   - `docs/reference/QUICK_REFERENCE.md` - Import patterns
   - `.cursorrules` - Code standards

3. **Identify dependencies**
   - What data types needed? (`types/index.ts`)
   - What services exist? (`/services/`)
   - What components can be reused? (`/components/`)

---

## 🔨 Implementation Steps

### Step 1: Define TypeScript Types
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
```

---

### Step 2: Create Service Layer
**File**: `/services/newFeatureService.ts`

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

**Don't forget to export** in `services/index.ts`

---

### Step 3: Create Component
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

### Step 4: Add Role-Based Access (if needed)
```typescript
import RoleBasedWrapper from '@/components/RoleBasedWrapper';

<RoleBasedWrapper allowedRoles={['property_owner', 'co_host']}>
  <NewFeatureComponent />
</RoleBasedWrapper>
```

---

### Step 5: Test Implementation
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

## ✅ Testing Checklist

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

## 📝 Documentation Updates

### After New Feature
Update these files:
- [ ] `CHANGELOG.md` - Feature details and business impact
- [ ] `docs/manifests/COMPONENTS.md` - If new component
- [ ] `docs/manifests/SERVICES.md` - If new service
- [ ] `docs/phase-tracking/PHASE_STATUS.md` - Update progress

**CHANGELOG Template**:
```markdown
## [v1.x.0] - 2025-XX-XX - Feature Name

### New Features
- **Feature Title**: Description of what users can now do
  - Detail 1
  - Detail 2
  - Business impact: [How this helps users]

### Technical Improvements
- Created X component
- Added Y service method
- Integrated with Z system

**Pull Request**: #XXX
```

---

## 🎯 Success Criteria

Feature is complete when:
1. ✅ Code works immediately without debugging
2. ✅ TypeScript compiles with zero errors
3. ✅ All user roles tested
4. ✅ Error handling covers all edge cases
5. ✅ Documentation updated
6. ✅ Follows existing patterns
7. ✅ Business rules enforced
8. ✅ Mobile responsive

---

**Quick Reference**: See `docs/reference/API_PATTERNS.md` for copy-paste templates

