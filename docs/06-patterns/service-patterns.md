# Service Patterns

> Reusable service layer templates

## Standard GET Method

```typescript
async getData(filters?: FilterType): Promise<EntityType[]> {
  try {
    let query = supabase
      .from('table_name')
      .select(`
        *,
        related_table (
          field1,
          field2
        )
      `);

    // Apply filters if provided
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];

  } catch (error) {
    console.error('[serviceName.getData]', error);
    Alert.alert('Error', 'Could not load data. Please check your connection.');
    throw error;
  }
}
```

## Standard CREATE Method

```typescript
async createItem(itemData: Omit<EntityType, 'id'>): Promise<EntityType> {
  try {
    // 1. Validate business rules
    this.validateItemData(itemData);

    // 2. Insert into database
    const { data, error } = await supabase
      .from('table_name')
      .insert({
        ...itemData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // 3. Trigger notifications for important actions
    await notificationService.sendToUser(affectedUserId, {
      title: 'Item Created',
      message: 'Description of what happened',
      type: 'info',
      priority: 'normal',
    });

    return data;

  } catch (error) {
    console.error('[serviceName.createItem]', error);
    Alert.alert('Error', 'Could not create item. Please try again.');
    throw error;
  }
}
```

## Standard UPDATE Method

```typescript
async updateItem(id: string, updates: Partial<EntityType>): Promise<EntityType> {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('[serviceName.updateItem]', error);
    Alert.alert('Error', 'Could not save changes. Please try again.');
    throw error;
  }
}
```

## Standard DELETE Method

```typescript
async deleteItem(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('table_name')
      .delete()
      .eq('id', id);

    if (error) throw error;

    Alert.alert('Success', 'Item deleted successfully');

  } catch (error) {
    console.error('[serviceName.deleteItem]', error);
    Alert.alert('Error', 'Could not delete item. Please try again.');
    throw error;
  }
}
```

## Business Logic Patterns

### Cleaning Window Validation

```typescript
function validateCleaningWindow(scheduledTime: Date): void {
  const hour = scheduledTime.getHours();

  if (hour < 11 || hour >= 15) {
    throw new Error('Cleanings must be scheduled between 11 AM and 3 PM');
  }
}

function isWithinCleaningWindow(scheduledTime: Date): boolean {
  const hour = scheduledTime.getHours();
  return hour >= 11 && hour < 15;
}
```

### Cancellation Notice Calculation

```typescript
function calculateCancellationNotice(scheduledTime: Date): {
  hours: number;
  isShortNotice: boolean;
  canCancel: boolean;
} {
  const now = new Date();
  const scheduled = new Date(scheduledTime);
  const diffMs = scheduled.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  return {
    hours: Math.max(0, hours),
    isShortNotice: hours < 24,
    canCancel: hours >= 1,
  };
}
```

### Linen Requirements Calculation

```typescript
function calculateLinenRequirements(
  guestCount: number,
  propertyType: string,
  hasPool: boolean = false
): LinenRequirement {
  return {
    guest_count: guestCount,
    towels_bath: guestCount * 1,
    towels_hand: guestCount * 1,
    pillow_cases: guestCount * 2,
    kitchen_towels: 2, // Fixed
    bath_mats: 1 + (propertyType === 'villa' && guestCount > 4 ? 1 : 0),
    towels_pool: hasPool ? guestCount : 0,
  };
}
```

## Role-Based Access Patterns

### Service-Level Role Filtering

```typescript
async getDataForUser(userId: string, userRole: string): Promise<EntityType[]> {
  let query = supabase.from('table_name').select('*');

  if (userRole === 'cleaner') {
    // Cleaners see only assigned items
    query = query.in('property_id', assignedPropertyIds);
  } else if (userRole === 'property_owner') {
    // Owners see only their items
    query = query.eq('owner_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
```

## Error Handling Pattern

```typescript
try {
  // Perform operation
  const result = await someService.doSomething();

  // Success feedback (for important actions)
  Alert.alert('Success', 'Action completed successfully');

  // Update UI
  onSuccess(result);

} catch (error) {
  // Log technical details
  console.error('[ComponentName.handleAction]', error);

  // User-friendly message
  const userMessage = error instanceof Error && error.message.includes('network')
    ? 'Please check your internet connection'
    : 'Something went wrong. Please try again.';

  // Show error to user
  Alert.alert('Error', userMessage);
  setError(userMessage);

} finally {
  // Always cleanup
  setLoading(false);
}
```

---

**Last Updated**: January 2025

