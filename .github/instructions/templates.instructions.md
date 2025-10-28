---
applyTo: '**'
description: 'Starter templates for common development tasks based on actual project patterns'
---

# Code Templates

## New Service Template

**Location:** `services/myFeatureService.ts`

```typescript
import { MyType } from '@/types';

import { supabase } from '../utils/supabase';

export const myFeatureService = {
  /**
   * Get all items for the authenticated user
   */
  async getItems(): Promise<MyType[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('my_table')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get single item by ID
   */
  async getItemById(id: string): Promise<MyType | null> {
    const { data, error } = await supabase.from('my_table').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  },

  /**
   * Create a new item
   */
  async createItem(itemData: Omit<MyType, 'id' | 'created_at'>): Promise<MyType> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('my_table')
      .insert({
        ...itemData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing item
   */
  async updateItem(id: string, updates: Partial<MyType>): Promise<MyType> {
    const { data, error } = await supabase
      .from('my_table')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete an item
   */
  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase.from('my_table').delete().eq('id', id);

    if (error) throw error;
  },
};
```

**Then add to `services/index.ts`:**

```typescript
export { myFeatureService } from './myFeatureService';
```

---

## New Screen Template

**Location:** `app/my-feature.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Box, Heading, Text, Button, Spinner } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { myFeatureService } from '@/services';
import { MyType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function MyFeatureScreen() {
  const { profile } = useAuth();
  const [items, setItems] = useState<MyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setError(null);
      const data = await myFeatureService.getItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load items:', err);
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }

  function handleItemPress(item: MyType) {
    router.push(`/my-feature/${item.id}`);
  }

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" p="$4">
        <Text color="$error500">{error}</Text>
        <Button mt="$4" onPress={loadItems}>
          <Text>Try Again</Text>
        </Button>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="$backgroundLight0">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MyItemCard item={item} onPress={() => handleItemPress(item)} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Box p="$8" alignItems="center">
            <Text color="$textLight400">No items found</Text>
          </Box>
        }
      />
    </Box>
  );
}
```

---

## New Component Template

**Location:** `components/MyItemCard.tsx`

```typescript
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Heading, Text } from '@gluestack-ui/themed';
import { MyType } from '@/types';

interface MyItemCardProps {
  item: MyType;
  onPress: () => void;
}

export function MyItemCard({ item, onPress }: MyItemCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        bg="$backgroundLight0"
        p="$4"
        m="$2"
        borderRadius="$lg"
        shadowColor="$backgroundLight900"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        $web={{
          cursor: 'pointer',
          _hover: {
            bg: '$backgroundLight50',
          },
        }}
      >
        <Heading size="sm" mb="$2">
          {item.name}
        </Heading>
        <Text fontSize="$sm" color="$textLight600">
          {item.description}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}
```

---

## Service Test Template

**Location:** `services/__tests__/myFeatureService.test.ts`

```typescript
import { supabase } from '@/utils/supabase';

import { myFeatureService } from '../myFeatureService';

// Mock Supabase
jest.mock('@/utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('myFeatureService', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  const mockItems = [
    { id: '1', name: 'Item 1', user_id: 'user-123' },
    { id: '2', name: 'Item 2', user_id: 'user-123' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
  });

  describe('getItems', () => {
    it('should fetch items for authenticated user', async () => {
      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockItems, error: null }),
      };
      (supabase.from as jest.Mock).mockReturnValue(mockFrom);

      const result = await myFeatureService.getItems();

      expect(supabase.from).toHaveBeenCalledWith('my_table');
      expect(mockFrom.eq).toHaveBeenCalledWith('user_id', mockUser.id);
      expect(result).toEqual(mockItems);
    });

    it('should throw error if user not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(myFeatureService.getItems()).rejects.toThrow('User not authenticated');
    });

    it('should throw error if database query fails', async () => {
      const mockError = { message: 'Database error' };
      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };
      (supabase.from as jest.Mock).mockReturnValue(mockFrom);

      await expect(myFeatureService.getItems()).rejects.toThrow();
    });
  });

  describe('createItem', () => {
    it('should create a new item', async () => {
      const newItem = { name: 'New Item', description: 'Test' };
      const createdItem = { id: '3', ...newItem, user_id: mockUser.id };

      const mockFrom = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: createdItem, error: null }),
      };
      (supabase.from as jest.Mock).mockReturnValue(mockFrom);

      const result = await myFeatureService.createItem(newItem);

      expect(mockFrom.insert).toHaveBeenCalledWith({
        ...newItem,
        user_id: mockUser.id,
      });
      expect(result).toEqual(createdItem);
    });
  });
});
```

---

## Component Test Template

**Location:** `components/__tests__/MyItemCard.test.tsx`

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '../../gluestack-ui.config';
import { MyItemCard } from '../MyItemCard';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GluestackUIProvider config={config}>{children}</GluestackUIProvider>
);

describe('MyItemCard', () => {
  const mockItem = {
    id: '1',
    name: 'Test Item',
    description: 'Test Description',
  };
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render item details', () => {
    const { getByText } = render(
      <MyItemCard item={mockItem} onPress={mockOnPress} />,
      { wrapper }
    );

    expect(getByText('Test Item')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByText } = render(
      <MyItemCard item={mockItem} onPress={mockOnPress} />,
      { wrapper }
    );

    fireEvent.press(getByText('Test Item'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

---

## New Type Template

**Add to `types/index.ts`:**

```typescript
export interface MyType {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface MyTypeFilters {
  status?: 'active' | 'inactive';
  search?: string;
}
```

---

## Database Migration Template

**Location:** `supabase/migrations/001_create_my_table.sql`

```sql
-- Create table
CREATE TABLE my_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own items" ON my_table
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items" ON my_table
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" ON my_table
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items" ON my_table
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_my_table_user_id ON my_table(user_id);
CREATE INDEX idx_my_table_status ON my_table(status);

-- Updated_at trigger
CREATE TRIGGER update_my_table_updated_at
  BEFORE UPDATE ON my_table
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## TanStack Query Hook Template

**Location:** `hooks/useMyFeature.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MyType } from '@/types';
import { myFeatureService } from '@/services';

// Query keys
export const myFeatureKeys = {
  all: ['my-feature'] as const,
  lists: () => [...myFeatureKeys.all, 'list'] as const,
  list: (filters: any) => [...myFeatureKeys.lists(), filters] as const,
  details: () => [...myFeatureKeys.all, 'detail'] as const,
  detail: (id: string) => [...myFeatureKeys.details(), id] as const,
};

// Fetch items
export function useItems() {
  return useQuery({
    queryKey: myFeatureKeys.lists(),
    queryFn: () => myFeatureService.getItems(),
  });
}

// Fetch single item
export function useItem(id: string) {
  return useQuery({
    queryKey: myFeatureKeys.detail(id),
    queryFn: () => myFeatureService.getItemById(id),
    enabled: !!id,
  });
}

// Create item mutation
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemData: Omit<MyType, 'id' | 'created_at'>) =>
      myFeatureService.createItem(itemData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: myFeatureKeys.lists() });
    },
  });
}

// Update item mutation
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MyType> }) =>
      myFeatureService.updateItem(id, updates),
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(myFeatureKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: myFeatureKeys.lists() });
    },
  });
}

// Delete item mutation
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => myFeatureService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myFeatureKeys.lists() });
    },
  });
}
```

**Usage in component:**

```typescript
import { useCreateItem, useItems } from '@/hooks/useMyFeature';

function MyComponent() {
  const { data: items, isLoading, error } = useItems();
  const createMutation = useCreateItem();

  async function handleCreate() {
    await createMutation.mutateAsync({
      name: 'New Item',
      description: 'Description',
    });
  }

  // ...
}
```

---

## Context Template

**Location:** `contexts/MyFeatureContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MyType } from '@/types';
import { myFeatureService } from '@/services';

interface MyFeatureContextType {
  items: MyType[];
  loading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
}

const MyFeatureContext = createContext<MyFeatureContextType | undefined>(undefined);

export function MyFeatureProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setError(null);
      const data = await myFeatureService.getItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load items:', err);
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  }

  async function refreshItems() {
    await loadItems();
  }

  return (
    <MyFeatureContext.Provider value={{ items, loading, error, refreshItems }}>
      {children}
    </MyFeatureContext.Provider>
  );
}

export function useMyFeature() {
  const context = useContext(MyFeatureContext);
  if (!context) {
    throw new Error('useMyFeature must be used within MyFeatureProvider');
  }
  return context;
}
```

---

## Quick Start Checklist

When adding a new feature:

- [ ] Define types in `types/index.ts`
- [ ] Create service in `services/myFeatureService.ts`
- [ ] Export service in `services/index.ts`
- [ ] Write service tests in `services/__tests__/`
- [ ] Create database migration if needed
- [ ] Create screen in `app/my-feature.tsx`
- [ ] Create components in `components/`
- [ ] Write component tests
- [ ] (Optional) Create TanStack Query hooks in `hooks/`
- [ ] (Optional) Create context if global state needed
- [ ] Update navigation in `app/_layout.tsx` if needed
- [ ] Add to navigation sidebar if needed
