# Services Directory

This directory contains the **business logic and API integration layer** for the Airbnb property management app. Services handle data operations, external API calls, and complex business logic.

## Available Services

### Core Services
- `cleaningSessionService.ts` - Session state management for cleaning operations
- `photoProofService.ts` - Photo upload and validation for cleaning proof
- `propertyService.ts` - Property CRUD operations and management
- `realtimeService.ts` - Supabase realtime subscriptions and live updates
- `notificationService.ts` - Push notifications and in-app messaging

### Utility Services
- `bannerStateService.ts` - Banner/notification state management
- `cleaningUpdateService.ts` - Cleaning status updates and progress tracking
- `dashboardLayoutService.ts` - Dashboard layout configuration and customization

## Service Architecture

### Base Service Pattern
```typescript
import { supabase } from '../utils/supabase';

export class BaseService {
  protected supabase = supabase;

  protected async handleError(error: any) {
    console.error('Service error:', error);
    throw new Error(error.message || 'An error occurred');
  }
}
```

### Property Service Example
```typescript
import { supabase } from '../utils/supabase';
import { Property, CreatePropertyData, UpdatePropertyData } from '../types';

export class PropertyService {
  async getProperties(userId: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async createProperty(data: CreatePropertyData): Promise<Property> {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return property;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async updateProperty(id: string, data: UpdatePropertyData): Promise<Property> {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return property;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async deleteProperty(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
}

export const propertyService = new PropertyService();
```

### Realtime Service Pattern
```typescript
import { supabase } from '../utils/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToPropertyUpdates(
    propertyId: string,
    onUpdate: (payload: any) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`property:${propertyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: `id=eq.${propertyId}`,
        },
        onUpdate
      )
      .subscribe();

    this.channels.set(`property:${propertyId}`, channel);
    return channel;
  }

  unsubscribeFromPropertyUpdates(propertyId: string): void {
    const channel = this.channels.get(`property:${propertyId}`);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(`property:${propertyId}`);
    }
  }

  cleanup(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export const realtimeService = new RealtimeService();
```

## Integration with TanStack Query

Services are used with custom hooks that integrate with TanStack Query:

```typescript
// hooks/useProperties.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';

export function useProperties(userId: string) {
  return useQuery({
    queryKey: ['properties', userId],
    queryFn: () => propertyService.getProperties(userId),
    enabled: !!userId,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyData }) =>
      propertyService.updateProperty(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    },
  });
}
```

## Service Guidelines

1. **Use Supabase client** from `utils/supabase.ts` for all database operations
2. **Return promises** - Services should be async and return promises
3. **Handle errors consistently** - Log errors and re-throw with meaningful messages
4. **Use TypeScript interfaces** for all data types and parameters
5. **Follow RESTful patterns** - GET, POST, PUT, DELETE operations
6. **Implement proper error handling** - Don't let errors bubble up unhandled
7. **Use transactions** for complex operations that need to be atomic
8. **Implement caching strategies** - Work with TanStack Query for optimal caching
9. **Use realtime subscriptions** for live data updates
10. **Follow security best practices** - Validate inputs, use RLS policies

## Testing Services

```typescript
import { propertyService } from './propertyService';
import { supabase } from '../utils/supabase';

// Mock Supabase
jest.mock('../utils/supabase');

describe('PropertyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch properties for a user', async () => {
    const mockProperties = [{ id: '1', name: 'Test Property' }];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockProperties, error: null }),
        }),
      }),
    });

    const result = await propertyService.getProperties('user-123');
    expect(result).toEqual(mockProperties);
  });
});
```

## Service Dependencies

All services depend on:
- `utils/supabase.ts` - Supabase client configuration
- `types/index.ts` - TypeScript type definitions
- Environment variables for API keys and configuration

## Error Handling Pattern

```typescript
export class ServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// In service methods
async someOperation() {
  try {
    const { data, error } = await supabase.from('table').select('*');
    
    if (error) {
      throw new ServiceError(error.message, error.code, error.status);
    }
    
    return data;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError('Unexpected error occurred');
  }
}
```
