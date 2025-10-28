---
applyTo: 'services/**'
description: 'Service layer patterns, error handling, and data operation best practices'
---

# Service Layer Guidelines

## Service Architecture

Services are the business logic layer between UI and data:

- Encapsulate Supabase interactions
- Implement validation and business rules
- Transform data between DB and domain models
- Throw structured errors
- No direct UI concerns (no navigation, no React state)

## Service Structure

### Standard service template

```typescript
// services/propertyService.ts
import type { EnhancedProperty, PropertyFilters } from '@/types';
import { supabase } from '@/utils/supabase';

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

/**
 * Property management service
 * Handles CRUD operations for properties
 */
export const propertyService = {
  /**
   * Fetch properties with optional filters
   */
  async getProperties(filters?: PropertyFilters): Promise<EnhancedProperty[]> {
    try {
      let query = supabase.from('properties').select(`
          *,
          team_members(user_id, role),
          linen_requirements(*)
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.ownerId) {
        query = query.eq('owner_id', filters.ownerId);
      }

      const { data, error } = await query;

      if (error) {
        throw new ServiceError('Failed to fetch properties', 'FETCH_PROPERTIES_ERROR', {
          filters,
          supabaseError: error,
        });
      }

      return data || [];
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Unexpected error fetching properties', 'UNKNOWN_ERROR', {
        originalError: error,
      });
    }
  },

  /**
   * Get single property by ID
   */
  async getPropertyById(id: string): Promise<EnhancedProperty | null> {
    if (!id) {
      throw new ServiceError('Property ID is required', 'MISSING_PROPERTY_ID');
    }

    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new ServiceError('Failed to fetch property', 'FETCH_PROPERTY_ERROR', {
        propertyId: id,
        supabaseError: error,
      });
    }

    return data;
  },

  /**
   * Create new property
   */
  async createProperty(
    propertyData: Omit<EnhancedProperty, 'id' | 'created_at' | 'updated_at'>
  ): Promise<EnhancedProperty> {
    // Validation
    if (!propertyData.name || !propertyData.address) {
      throw new ServiceError('Property name and address are required', 'VALIDATION_ERROR', {
        missingFields: ['name', 'address'],
      });
    }

    // Sanitization
    const sanitized = {
      ...propertyData,
      name: propertyData.name.trim().slice(0, 200),
      address: propertyData.address.trim().slice(0, 500),
    };

    const { data, error } = await supabase.from('properties').insert(sanitized).select().single();

    if (error) {
      throw new ServiceError('Failed to create property', 'CREATE_PROPERTY_ERROR', {
        supabaseError: error,
      });
    }

    return data;
  },

  /**
   * Update existing property
   */
  async updateProperty(id: string, updates: Partial<EnhancedProperty>): Promise<EnhancedProperty> {
    if (!id) {
      throw new ServiceError('Property ID is required', 'MISSING_PROPERTY_ID');
    }

    // Remove fields that shouldn't be updated
    const { id: _, created_at, updated_at, ...allowedUpdates } = updates as any;

    const { data, error } = await supabase
      .from('properties')
      .update({
        ...allowedUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new ServiceError('Failed to update property', 'UPDATE_PROPERTY_ERROR', {
        propertyId: id,
        supabaseError: error,
      });
    }

    return data;
  },

  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<void> {
    if (!id) {
      throw new ServiceError('Property ID is required', 'MISSING_PROPERTY_ID');
    }

    const { error } = await supabase.from('properties').delete().eq('id', id);

    if (error) {
      throw new ServiceError('Failed to delete property', 'DELETE_PROPERTY_ERROR', {
        propertyId: id,
        supabaseError: error,
      });
    }
  },
};

// Central export
export default propertyService;
```

## Error Handling

### Structured errors

```typescript
// Define error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// Custom error class
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: keyof typeof ERROR_CODES,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ServiceError';
  }

  // Helper methods
  isValidationError(): boolean {
    return this.code === 'VALIDATION_ERROR';
  }

  isNotFoundError(): boolean {
    return this.code === 'NOT_FOUND';
  }
}
```

### Error handling patterns

```typescript
// In service
async function getSession(id: string) {
  try {
    const { data, error } = await supabase
      .from('cleaning_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new ServiceError('Session not found', 'NOT_FOUND', { id });
      }
      throw new ServiceError('Database error', 'NETWORK_ERROR', { error });
    }

    return data;
  } catch (error) {
    // Re-throw ServiceErrors
    if (error instanceof ServiceError) throw error;

    // Wrap unexpected errors
    throw new ServiceError('Unexpected error', 'UNKNOWN_ERROR', { originalError: error });
  }
}

// In UI
async function handleLoadSession() {
  try {
    const session = await sessionService.getSession(id);
    setSession(session);
  } catch (error) {
    if (error instanceof ServiceError) {
      if (error.isNotFoundError()) {
        showToast({ title: 'Session not found', status: 'warning' });
        router.back();
      } else {
        showToast({ title: error.message, status: 'error' });
      }
    } else {
      showToast({ title: 'Something went wrong', status: 'error' });
    }
  }
}
```

## Validation Patterns

### Input validation

```typescript
export function validatePropertyInput(data: any): PropertyInput {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Property name is required');
  }

  if (!data.address || typeof data.address !== 'string') {
    errors.push('Property address is required');
  }

  if (data.bedrooms !== undefined && typeof data.bedrooms !== 'number') {
    errors.push('Bedrooms must be a number');
  }

  if (data.bedrooms < 0) {
    errors.push('Bedrooms must be positive');
  }

  if (errors.length > 0) {
    throw new ServiceError('Validation failed', 'VALIDATION_ERROR', { errors });
  }

  return {
    name: data.name.trim(),
    address: data.address.trim(),
    bedrooms: data.bedrooms || 1,
    bathrooms: data.bathrooms || 1,
  };
}
```

### Business rule validation

```typescript
export async function validateSessionStart(
  propertyId: string,
  scheduledStart: Date
): Promise<void> {
  // Check property exists
  const property = await propertyService.getPropertyById(propertyId);
  if (!property) {
    throw new ServiceError('Property not found', 'NOT_FOUND', { propertyId });
  }

  // Check property is active
  if (property.status !== 'active') {
    throw new ServiceError('Property is not active', 'VALIDATION_ERROR', {
      propertyId,
      status: property.status,
    });
  }

  // Check no overlapping sessions
  const { data: existingSessions } = await supabase
    .from('cleaning_sessions')
    .select('id, scheduled_start, scheduled_end')
    .eq('property_id', propertyId)
    .eq('status', 'in_progress');

  if (existingSessions && existingSessions.length > 0) {
    throw new ServiceError('Property already has an active session', 'VALIDATION_ERROR', {
      propertyId,
      activeSessionId: existingSessions[0].id,
    });
  }

  // Check time window (e.g., between 8 AM and 6 PM)
  const hour = scheduledStart.getHours();
  if (hour < 8 || hour >= 18) {
    throw new ServiceError('Sessions must start between 8 AM and 6 PM', 'VALIDATION_ERROR', {
      scheduledStart,
    });
  }
}
```

## Data Transformation

### DB to domain model

```typescript
// Transform database row to domain model
function mapToEnhancedProperty(dbRow: any): EnhancedProperty {
  return {
    id: dbRow.id,
    name: dbRow.name,
    address: dbRow.address,
    bedrooms: dbRow.bedrooms,
    bathrooms: dbRow.bathrooms,
    status: dbRow.status,
    owner_id: dbRow.owner_id,
    // Computed fields
    displayName: `${dbRow.name} - ${dbRow.bedrooms}BR`,
    teamCount: dbRow.team_members?.length || 0,
    // Nested relations
    linenRequirements: dbRow.linen_requirements || [],
    // Timestamps
    created_at: new Date(dbRow.created_at),
    updated_at: new Date(dbRow.updated_at),
  };
}
```

### Domain model to DB

```typescript
function mapToDatabaseRow(property: EnhancedProperty): any {
  return {
    name: property.name,
    address: property.address,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    status: property.status,
    owner_id: property.owner_id,
    // Omit computed fields
    // Don't include: displayName, teamCount, etc.
  };
}
```

## TanStack Query Integration

### Query patterns

```typescript
// hooks/useProperties.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { propertyService } from '@/services';

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => propertyService.getPropertyById(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: (newProperty) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['properties'] });

      // Or optimistically update
      queryClient.setQueryData(['properties', newProperty.id], newProperty);
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EnhancedProperty> }) =>
      propertyService.updateProperty(id, updates),
    onSuccess: (updatedProperty) => {
      // Update specific property in cache
      queryClient.setQueryData(['properties', updatedProperty.id], updatedProperty);

      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
```

### Optimistic updates

```typescript
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyService.deleteProperty,
    onMutate: async (propertyId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['properties'] });

      // Snapshot previous value
      const previousProperties = queryClient.getQueryData(['properties']);

      // Optimistically update
      queryClient.setQueryData(['properties'], (old: EnhancedProperty[]) =>
        old?.filter((p) => p.id !== propertyId)
      );

      return { previousProperties };
    },
    onError: (err, propertyId, context) => {
      // Rollback on error
      queryClient.setQueryData(['properties'], context?.previousProperties);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
```

## Service Testing

### Unit test pattern

```typescript
import { supabase } from '@/utils/supabase';

import { propertyService } from '../propertyService';

jest.mock('@/utils/supabase');

describe('propertyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProperties', () => {
    it('should fetch properties successfully', async () => {
      const mockData = [{ id: '1', name: 'Property 1' }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await propertyService.getProperties();

      expect(result).toEqual(mockData);
      expect(supabase.from).toHaveBeenCalledWith('properties');
    });

    it('should throw ServiceError on database error', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'DB error' },
        }),
      });

      await expect(propertyService.getProperties()).rejects.toThrow('Failed to fetch properties');
    });
  });
});
```

## Service Best Practices

### ✅ Do this

```typescript
// Single responsibility
export const propertyService = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};

// Validate inputs
if (!id || typeof id !== 'string') {
  throw new ServiceError('Invalid ID', 'VALIDATION_ERROR');
}

// Structured errors
throw new ServiceError('Not found', 'NOT_FOUND', { id });

// Transform data
return data.map(mapToEnhancedProperty);

// Document public methods
/**
 * Fetch properties with optional filters
 * @param filters - Optional filters for status, owner, etc.
 * @returns Array of enhanced properties
 */
```

### ❌ Avoid this

```typescript
// Don't mix UI concerns
async function getProperties() {
  const data = await fetch();
  router.push('/properties'); // NO!
  showToast('Loaded'); // NO!
  return data;
}

// Don't return raw errors
catch (error) {
  throw error; // Lost context
}

// Don't mutate inputs
function updateProperty(property) {
  property.updated_at = new Date(); // Mutation!
  return supabase.update(property);
}

// Don't expose implementation details
return { supabaseResponse }; // Too coupled
```

## Service Checklist

- [ ] Methods are async with proper error handling
- [ ] Input validation before DB operations
- [ ] Structured ServiceError thrown with context
- [ ] Data transformed between DB and domain models
- [ ] No UI concerns (navigation, toasts, etc.)
- [ ] Methods documented with JSDoc
- [ ] Unit tests cover happy path and errors
- [ ] Proper TypeScript types for inputs/outputs
- [ ] Demo mode handled (mock data fallback)
- [ ] Exported via services/index.ts
