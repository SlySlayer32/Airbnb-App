---
applyTo: 'components/**'
description: 'UI component patterns, Gluestack UI usage, and component composition guidelines'
---

# Component Development Guidelines

## Component Architecture

### Component types

1. **Presentational Components** - Pure UI, no business logic
2. **Container Components** - Connect to data, handle logic
3. **Layout Components** - Structure and positioning
4. **Composite Components** - Combine multiple components

## Gluestack UI Patterns

### Using theme tokens

```typescript
import { Box, Text, Button } from '@gluestack-ui/themed';

// ✅ Use theme tokens
<Box bg="$primary500" p="$4" borderRadius="$lg">
  <Text color="$textLight0" fontSize="$md">
    Property Name
  </Text>
</Box>

// ❌ Avoid hard-coded values
<Box style={{ backgroundColor: '#3B82F6', padding: 16 }}>
  <Text style={{ color: 'white' }}>Property Name</Text>
</Box>
```

### Common token categories

```typescript
// Colors
($primary500, $primary600);
$secondary500;
($success500, $error500, $warning500);
($textLight0, $textLight700, $textLight900);
($backgroundLight0, $backgroundLight50);

// Spacing
($0, $1, $2, $3, $4, $5, $6, $8, $10, $12, $16, $20);
// Use: p="$4" (padding), m="$2" (margin), gap="$3"

// Typography
($xs, $sm, $md, $lg, $xl, $2xl, $3xl);

// Border radius
($none, $sm, $md, $lg, $xl, $2xl, $full);

// Shadows
($sm, $md, $lg, $xl);
```

### Responsive design

```typescript
// ✅ Platform-specific styles
<Box
  p="$4"
  sx={{
    '@md': { p: '$6' },    // Medium screens
    '@lg': { p: '$8' },    // Large screens
  }}
>

// ✅ Platform-specific components
import { Platform } from 'react-native';

{Platform.OS === 'web' ? (
  <WebSpecificComponent />
) : (
  <NativeComponent />
)}
```

## Component Structure

### Standard component template

```typescript
import React from 'react';
import { Box, Text, Pressable } from '@gluestack-ui/themed';
import type { PropertyCardProps } from './PropertyCard.types';

/**
 * PropertyCard displays property information in a card format
 *
 * @param property - Property object with name, address, etc.
 * @param onPress - Callback when card is pressed
 * @param testID - Test identifier for E2E tests
 */
export function PropertyCard({
  property,
  onPress,
  variant = 'default',
  testID = 'property-card',
}: PropertyCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(property)}
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Property: ${property.name}`}
    >
      <Box
        bg="$backgroundLight0"
        borderRadius="$lg"
        p="$4"
        borderWidth="$1"
        borderColor="$borderLight200"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius="$md"
      >
        <Text fontSize="$lg" fontWeight="$bold" color="$textLight900">
          {property.name}
        </Text>
        <Text fontSize="$sm" color="$textLight700" mt="$1">
          {property.address}
        </Text>
        {property.bedrooms && (
          <Text fontSize="$sm" color="$textLight600" mt="$2">
            {property.bedrooms} bed, {property.bathrooms} bath
          </Text>
        )}
      </Box>
    </Pressable>
  );
}

// Named export for consistency
export default PropertyCard;
```

### Type definitions

```typescript
// PropertyCard.types.ts
import type { EnhancedProperty } from '@/types';

export interface PropertyCardProps {
  property: EnhancedProperty;
  onPress?: (property: EnhancedProperty) => void;
  variant?: 'default' | 'compact' | 'detailed';
  testID?: string;
}
```

## Component Composition

### Build small, reusable components

```typescript
// ✅ Composable components
export function PropertyCard({ property, onPress }: PropertyCardProps) {
  return (
    <Card onPress={onPress}>
      <PropertyHeader property={property} />
      <PropertyDetails property={property} />
      <PropertyStatus status={property.status} />
    </Card>
  );
}

// ❌ Monolithic component
export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Box>
      {/* 200+ lines of complex JSX */}
    </Box>
  );
}
```

### Use children for flexibility

```typescript
// ✅ Flexible card component
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined';
}

export function Card({ children, onPress, variant = 'elevated' }: CardProps) {
  return (
    <Pressable onPress={onPress}>
      <Box
        bg={variant === 'elevated' ? '$backgroundLight0' : 'transparent'}
        borderWidth={variant === 'outlined' ? '$1' : '$0'}
        borderRadius="$lg"
        p="$4"
      >
        {children}
      </Box>
    </Pressable>
  );
}

// Usage
<Card>
  <CustomContent />
</Card>
```

## Performance Optimization

### Memoization

```typescript
import React, { memo, useCallback, useMemo } from 'react';

// ✅ Memoize expensive components
export const PropertyCard = memo(function PropertyCard({
  property,
  onPress,
}: PropertyCardProps) {
  return (
    // Component JSX
  );
});

// ✅ Memoize callbacks
function PropertyList({ properties }: PropertyListProps) {
  const handlePress = useCallback((property: EnhancedProperty) => {
    router.push(`/properties/${property.id}`);
  }, []); // Empty deps - callback never changes

  return properties.map(property => (
    <PropertyCard
      key={property.id}
      property={property}
      onPress={handlePress}
    />
  ));
}

// ✅ Memoize computed values
const sortedProperties = useMemo(
  () => properties.sort((a, b) => a.name.localeCompare(b.name)),
  [properties]
);
```

### List rendering

```typescript
import { FlatList } from 'react-native';

// ✅ Use FlatList for long lists
<FlatList
  data={properties}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <PropertyCard property={item} />}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>

// ❌ Avoid map for long lists
{properties.map(property => (
  <PropertyCard key={property.id} property={property} />
))}
```

## Styling Patterns

### Conditional styles

```typescript
// ✅ Use sx prop for conditional styles
<Box
  bg={isActive ? '$success500' : '$backgroundLight50'}
  sx={{
    _pressed: {
      bg: '$primary600',
    },
    _disabled: {
      opacity: 0.5,
    },
  }}
>

// ✅ Use variants for common patterns
<Button
  variant={isPrimary ? 'solid' : 'outline'}
  colorScheme={isDestructive ? 'error' : 'primary'}
>
  {label}
</Button>
```

### Layout patterns

```typescript
// Flexbox layouts
<Box flexDirection="row" justifyContent="space-between" alignItems="center">
  <Text>Label</Text>
  <Icon name="chevron-right" />
</Box>

// Grid layouts
<Box
  flexDirection="row"
  flexWrap="wrap"
  gap="$4"
>
  {items.map(item => (
    <Box key={item.id} width="48%">
      <ItemCard item={item} />
    </Box>
  ))}
</Box>

// Absolute positioning
<Box position="relative">
  <Image source={imageUrl} />
  <Box
    position="absolute"
    top="$2"
    right="$2"
    bg="$primary500"
    borderRadius="$full"
    p="$2"
  >
    <Icon name="star" color="white" />
  </Box>
</Box>
```

## Accessibility

### ARIA labels and roles

```typescript
<Pressable
  accessible={true}
  accessibilityLabel="View property details for Sunset Villa"
  accessibilityRole="button"
  accessibilityHint="Double tap to open property details"
  accessibilityState={{ disabled: isLoading }}
>
  <PropertyCard property={property} />
</Pressable>

// Form inputs
<Input
  accessibilityLabel="Property name"
  accessibilityRequired={true}
  placeholder="Enter property name"
/>

// Images
<Image
  source={imageUrl}
  alt="Property exterior photo"
  accessibilityIgnoresInvertColors={true}
/>
```

### Focus management

```typescript
import { useRef, useEffect } from 'react';

function SearchInput() {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-focus on mount
    inputRef.current?.focus();
  }, []);

  return <Input ref={inputRef} />;
}
```

## Error Boundaries

### Component-level error handling

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <PropertyList properties={properties} />
</ErrorBoundary>

// ErrorFallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <Box p="$4" alignItems="center">
      <Text color="$error500">Something went wrong</Text>
      <Button onPress={() => window.location.reload()}>
        Reload
      </Button>
    </Box>
  );
}
```

## Testing Components

### Test IDs

```typescript
// ✅ Add testID for E2E tests
<Button testID="start-session-button" onPress={handleStart}>
  Start Session
</Button>

<PropertyCard
  property={property}
  testID={`property-card-${property.id}`}
/>
```

### Wrapper for tests

```typescript
// Test setup
import { render } from '@testing-library/react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@/gluestack-ui.config';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GluestackUIProvider config={config}>
    {children}
  </GluestackUIProvider>
);

// Usage
render(<PropertyCard property={mockProperty} />, { wrapper });
```

## Common Component Patterns

### Loading states

```typescript
function PropertyCard({ property, isLoading }: PropertyCardProps) {
  if (isLoading) {
    return (
      <Box p="$4">
        <Skeleton height="$20" borderRadius="$md" />
        <Skeleton height="$4" mt="$2" width="80%" />
      </Box>
    );
  }

  return <ActualCard property={property} />;
}
```

### Empty states

```typescript
function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" p="$8">
        <Icon name="home" size={48} color="$textLight400" />
        <Text fontSize="$lg" color="$textLight600" mt="$4">
          No properties found
        </Text>
        <Button mt="$4" onPress={handleAddProperty}>
          Add Property
        </Button>
      </Box>
    );
  }

  return <FlatList data={properties} ... />;
}
```

### Modal patterns

```typescript
import { Modal, ModalBackdrop, ModalContent } from '@gluestack-ui/themed';

function ConfirmDialog({ isOpen, onClose, onConfirm }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <Heading>Confirm Action</Heading>
        <Text>Are you sure you want to proceed?</Text>
        <Box flexDirection="row" gap="$2" mt="$4">
          <Button variant="outline" onPress={onClose}>
            Cancel
          </Button>
          <Button onPress={onConfirm}>
            Confirm
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
}
```

## Anti-Patterns to Avoid

### ❌ Don't do this

```typescript
// Inline styles instead of theme tokens
<Box style={{ backgroundColor: '#3B82F6' }}>

// Business logic in components
function PropertyCard() {
  const { data } = await supabase.from('properties').select();
  // Components should receive data via props
}

// Deeply nested components
<Box>
  <Box>
    <Box>
      <Box>
        <Text>Too deep!</Text>
      </Box>
    </Box>
  </Box>
</Box>

// Direct DOM manipulation
document.getElementById('myElement').style.color = 'red';
```

### ✅ Do this instead

```typescript
// Theme tokens
<Box bg="$primary500">

// Props-based components
function PropertyCard({ property }: PropertyCardProps) {
  return <>{/* Pure UI */}</>;
}

// Flat component structure
<PropertyCard>
  <PropertyHeader />
  <PropertyBody />
</PropertyCard>

// React Native/Gluestack APIs
<Box ref={boxRef} bg="$error500">
```

## Component Checklist

Before committing a new component:

- [ ] Uses Gluestack UI components and theme tokens
- [ ] Proper TypeScript types defined
- [ ] Accessibility props added (accessibilityLabel, role)
- [ ] Test IDs for important elements
- [ ] Memoized if expensive to render
- [ ] Props documented with JSDoc comments
- [ ] Responsive on different screen sizes
- [ ] Handles loading and error states
- [ ] Tests written for key interactions
- [ ] No console warnings in development
