# Components Directory

This directory contains **reusable UI components** built with Gluestack UI primitives and following the project's design patterns.

## Component Categories

### Dashboard Components
- `CleanerDashboard.tsx` - Dashboard for cleaning staff
- `OwnerDashboard.tsx` - Dashboard for property owners
- `CustomizableDashboard.tsx` - Configurable dashboard layout
- `DashboardStats.tsx` - Statistics display component

### Card Components
- `PropertyCard.tsx` - Property information display
- `CleanerPropertyCard.tsx` - Property card for cleaners
- `OwnerPropertyCard.tsx` - Property card for owners
- `InvoiceCard.tsx` - Invoice information display
- `MaintenanceCard.tsx` - Maintenance request card
- `ScheduleCard.tsx` - Schedule item display
- `TeamMemberCard.tsx` - Team member information
- `TodayJobCard.tsx` - Today's job display

### Feature Components
- `PhotoProofGate.tsx` - Photo verification component
- `SwipeGestureHandler.tsx` - Swipe gesture handling
- `CleaningUpdates.tsx` - Cleaning status updates
- `CleanerStatusBanner.tsx` - Status banner for cleaners
- `CleanerActiveSessionCard.tsx` - Active session display
- `TodayJobsSection.tsx` - Today's jobs list
- `TodoTasksSection.tsx` - Todo tasks management
- `TodoTaskItem.tsx` - Individual todo item

### Layout Components
- `NavigationSidebar.tsx` - Main navigation sidebar
- `ErrorBoundary.tsx` - Error boundary wrapper
- `ComponentLibraryModal.tsx` - Component showcase modal
- `DebugPanel.tsx` - Development debug panel
- `HamburgerMenuButton.tsx` - Mobile menu button
- `NotificationBadge.tsx` - Notification indicator
- `QuickActions.tsx` - Quick action buttons
- `RoleBasedWrapper.tsx` - Role-based access control

## Component Patterns

### Base Component Structure
```typescript
import React from 'react';
import { VStack, HStack, Box, Text } from '@gluestack-ui/themed';

interface ComponentProps {
  // Define props with TypeScript
  title: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export function ComponentName({ title, onPress, children }: ComponentProps) {
  return (
    <Box>
      <Text>{title}</Text>
      {children}
    </Box>
  );
}
```

### Card Component Pattern
```typescript
import { Card, CardHeader, CardBody, CardFooter } from '@gluestack-ui/themed';

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card>
      <CardHeader>
        <Heading>{property.name}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{property.description}</Text>
      </CardBody>
      <CardFooter>
        <Button onPress={() => {}}>
          <ButtonText>View Details</ButtonText>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Form Component Pattern
```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
} from '@gluestack-ui/themed';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export function PropertyForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <VStack space="md">
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <FormControl isInvalid={!!errors.name}>
            <FormControlLabel>
              <FormControlLabelText>Property Name</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Enter property name"
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
      />
    </VStack>
  );
}
```

## Naming Conventions

- **PascalCase** for component names
- **Descriptive names** that indicate purpose
- **Consistent suffixes**:
  - `Card` for display components
  - `Form` for form components
  - `Modal` for modal dialogs
  - `Button` for button variants
  - `Section` for grouped content

## Component Guidelines

1. **Use Gluestack UI primitives** - Build from Box, VStack, HStack, Text, etc.
2. **Implement proper TypeScript interfaces** for all props
3. **Follow the established patterns** from `.cursor/rules/gluestack.mdc`
4. **Use FormControl** for all form inputs with proper labels and error states
5. **Implement loading and error states** where appropriate
6. **Use semantic button actions** - `action="primary"`, `action="secondary"`, etc.
7. **Provide accessibility props** - labels, hints, roles
8. **Use theme tokens** - `$primary500`, `$gray200`, etc. instead of hardcoded colors
9. **Memoize expensive components** with `React.memo` when needed
10. **Export as named exports** for better tree-shaking

## Testing Components

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '../gluestack-ui.config';

function renderWithProviders(component: React.ReactElement) {
  return render(
    <GluestackUIProvider config={config}>
      {component}
    </GluestackUIProvider>
  );
}

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    const property = { id: '1', name: 'Test Property' };
    const { getByText } = renderWithProviders(<PropertyCard property={property} />);
    expect(getByText('Test Property')).toBeTruthy();
  });
});
```

## Integration with Services

Components should use custom hooks that integrate with services:

```typescript
import { useProperty } from '../hooks/useProperty';

export function PropertyCard({ propertyId }: { propertyId: string }) {
  const { data: property, isLoading, error } = useProperty(propertyId);

  if (isLoading) return <Skeleton />;
  if (error) return <Text>Error loading property</Text>;

  return (
    <Card>
      <Text>{property?.name}</Text>
    </Card>
  );
}
```
