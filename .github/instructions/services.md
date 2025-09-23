---
applyTo: 'services/**/*.ts'
---

# Service Layer Patterns

## Service Creation Rules

- One service per business domain (property, cleaning, notifications)
- All Supabase queries go through services (never direct in components)
- Always handle errors and return typed data
- Include notification triggers for important actions

## Standard Service Template

```typescript
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { SomeType } from '@/types';

export const domainService = {
  async getData(filters?: any): Promise<SomeType[]> {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .select(`*, related_table (name, field)`)
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Service error:', error);
      Alert.alert('Error', 'Could not load data. Please check your connection.');
      throw error;
    }
  },

  async createItem(itemData: Omit<SomeType, 'id'>): Promise<SomeType> {
    try {
      if (!itemData.required_field) {
        throw new Error('Required field is missing');
      }

      const { data, error } = await supabase
        .from('table_name')
        .insert({ ...itemData, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      await this.notifyStakeholders(data);
      return data;
    } catch (error) {
      console.error('Create error:', error);
      Alert.alert('Error', 'Could not create item. Please try again.');
      throw error;
    }
  },

  async updateItem(id: string, updates: Partial<SomeType>): Promise<SomeType> {
    try {
      const { data, error } = await supabase
        .from('table_name')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Could not save changes. Please try again.');
      throw error;
    }
  }
};
```

## Business Logic Examples

```typescript
// Cancellation notice calculation
const calculateCancellationNotice = (scheduledTime: string): number => {
  const scheduled = new Date(scheduledTime);
  const now = new Date();
  const diffInMs = scheduled.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60)));
};

// Linen requirements calculation
const calculateLinenRequirements = (guestCount: number): LinenRequirement => ({
  towels_bath: guestCount,
  towels_hand: guestCount,
  pillow_cases: guestCount * 2,
  kitchen_towels: 2,
  bath_mats: 1,
});
```

## Notification Integration

Always trigger notifications for:

- Session status changes
- Urgent maintenance issues
- Cancellations (especially short notice)
- Completion confirmations
