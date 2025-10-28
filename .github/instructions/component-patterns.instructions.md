---
applyTo: 'components/**'
description: 'Real-world component usage patterns from the actual codebase'
---

# Component Usage Patterns

## Gluestack UI Component Patterns

### Box (Container/Layout)

**Basic usage:**

```typescript
import { Box } from '@gluestack-ui/themed';

// Simple container
<Box bg="$backgroundLight0" p="$4" borderRadius="$lg">
  <Text>Content</Text>
</Box>

// Flex layout
<Box flex={1} flexDirection="row" justifyContent="space-between" alignItems="center">
  <Text>Left</Text>
  <Text>Right</Text>
</Box>

// Responsive layout
<Box
  p="$4"
  sx={{
    '@sm': { p: '$6' },
    '@md': { p: '$8' },
    '@lg': { p: '$12' }
  }}
>
  <Content />
</Box>
```

**Shadow/elevation:**

```typescript
<Box
  bg="$backgroundLight0"
  shadowColor="$backgroundLight900"
  shadowOffset={{ width: 0, height: 2 }}
  shadowOpacity={0.1}
  shadowRadius={4}
  elevation={3} // Android
>
  <Card />
</Box>
```

---

### Button

**Basic patterns:**

```typescript
import { Button, ButtonText } from '@gluestack-ui/themed';

// Primary button
<Button onPress={handlePress}>
  <ButtonText>Submit</ButtonText>
</Button>

// Variants
<Button variant="outline" onPress={handlePress}>
  <ButtonText>Cancel</ButtonText>
</Button>

// With loading state
<Button isDisabled={isLoading}>
  {isLoading ? <Spinner /> : <ButtonText>Save</ButtonText>}
</Button>

// Full width
<Button width="$full">
  <ButtonText>Continue</ButtonText>
</Button>
```

---

### Text & Headings

```typescript
import { Text, Heading } from '@gluestack-ui/themed';

// Headings
<Heading size="xl" mb="$2">Title</Heading>
<Heading size="md">Subtitle</Heading>

// Text with theme tokens
<Text fontSize="$sm" color="$textLight600" lineHeight="$md">
  Body text with proper line height
</Text>

// Truncated text
<Text numberOfLines={2} ellipsizeMode="tail">
  Long text that will be truncated after two lines...
</Text>
```

---

### Spinner (Loading State)

```typescript
import { Spinner } from '@gluestack-ui/themed';

// Centered loading
<Box flex={1} justifyContent="center" alignItems="center">
  <Spinner size="large" />
</Box>

// Inline loading
<Button>
  {isLoading && <Spinner size="small" mr="$2" />}
  <ButtonText>Submit</ButtonText>
</Button>
```

---

## Real Component Examples from Codebase

### PropertyCard Pattern

**File:** `components/PropertyCard.tsx`

```typescript
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Heading, Text } from '@gluestack-ui/themed';
import { Property, EnhancedProperty } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface PropertyCardProps {
  property: Property | EnhancedProperty;
  onPress: () => void;
}

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  const { profile } = useAuth();

  // Conditional rendering based on role
  if (profile?.role === 'cleaner' && 'current_session' in property) {
    return <CleanerPropertyCard property={property as EnhancedProperty} onPress={onPress} />;
  }

  // Owner/manager view
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'occupied': return '#f59e0b';
      case 'maintenance': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        bg="$backgroundLight0"
        borderRadius="$lg"
        mb="$4"
        shadowColor="$backgroundLight900"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
      >
        <Image source={{ uri: property.image_url }} style={styles.image} />
        <Box p="$4">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" mb="$2">
            <Heading size="sm" flex={1}>{property.name}</Heading>
            <Box bg={getStatusColor(property.status)} px="$2" py="$1" borderRadius="$full">
              <Text fontSize="$xs" color="$white" fontWeight="$semibold">
                {property.status}
              </Text>
            </Box>
          </Box>
          <Text fontSize="$sm" color="$textLight600" mb="$2">
            {property.address}
          </Text>
          <Text fontSize="$sm" color="$textLight700">
            {property.rooms} bed • {property.bathrooms} bath
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
```

**Key Patterns:**

- TouchableOpacity for press handling (better than Pressable for simple cards)
- Conditional component rendering based on user role
- Theme tokens for colors (`$backgroundLight0`, `$textLight600`)
- Spacing tokens (`$4`, `$2`, `$lg`)
- Shadow properties for elevation
- Flex layout for header with status badge

---

### CleanerPropertyCard Variant

**Enhanced card with session context:**

```typescript
export function CleanerPropertyCard({ property, onPress }: CleanerPropertyCardProps) {
  const session = property.current_session;
  const meta = session?.dashboard_metadata;

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        bg="$backgroundLight0"
        borderRadius="$lg"
        mb="$4"
        borderWidth={meta?.priority_level === 'urgent' ? 2 : 0}
        borderColor="$error500"
      >
        {/* Property Image */}
        <Image source={{ uri: property.image_url }} />

        {/* Property Info */}
        <Box p="$4">
          <Heading size="sm">{property.name}</Heading>

          {/* Session Status */}
          {meta && (
            <Box
              mt="$2"
              bg={getPriorityColor(meta.priority_level)}
              p="$2"
              borderRadius="$md"
            >
              <Text fontSize="$xs" color="$white">
                {meta.status_indicator === 'starting_soon'
                  ? `Starts in ${meta.time_until_start_minutes} min`
                  : meta.status_indicator}
              </Text>
            </Box>
          )}

          {/* Access Info */}
          <Box mt="$3" flexDirection="row" alignItems="center">
            <Icon name="key" size={16} />
            <Text ml="$2" fontSize="$sm">{property.access_method}</Text>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
```

**Key Patterns:**

- Conditional styling (urgent border)
- Metadata-driven UI (priority, time remaining)
- Icon + text combinations
- Dynamic background colors based on state

---

### Screen Layout Pattern

**Typical screen structure:**

```typescript
import { Box, Heading, Text, Spinner } from '@gluestack-ui/themed';
import { FlatList, RefreshControl } from 'react-native';

export default function PropertiesScreen() {
  const [properties, setProperties] = useState<EnhancedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Loading state
  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" p="$4">
        <Text color="$error500">{error}</Text>
        <Button mt="$4" onPress={retry}>
          <ButtonText>Try Again</ButtonText>
        </Button>
      </Box>
    );
  }

  // Content
  return (
    <Box flex={1} bg="$backgroundLight0">
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => router.push(`/properties/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Box p="$8" alignItems="center">
            <Text color="$textLight400">No properties found</Text>
          </Box>
        }
        contentContainerStyle={{ padding: 16 }}
      />
    </Box>
  );
}
```

**Key Patterns:**

- Three-state rendering (loading/error/content)
- Pull-to-refresh pattern
- Empty state handling
- FlatList for performance (not `.map()`)
- Proper keyExtractor

---

### Modal Pattern

**Bottom sheet style modal:**

```typescript
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody } from '@gluestack-ui/themed';

function MyModal({ isOpen, onClose, children }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader borderBottomWidth={1} borderBottomColor="$borderLight200">
          <Heading size="md">Modal Title</Heading>
        </ModalHeader>
        <ModalBody p="$4">
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
```

---

### Form Pattern

**With React Hook Form:**

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, FormControl, FormControlError, FormControlErrorText } from '@gluestack-ui/themed';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

function MyForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Box p="$4">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={!!errors.name} mb="$4">
            <Input>
              <InputField
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>
            {errors.name && (
              <FormControlError>
                <FormControlErrorText>{errors.name.message}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        )}
      />

      <Button onPress={handleSubmit(onSubmit)}>
        <ButtonText>Submit</ButtonText>
      </Button>
    </Box>
  );
}
```

---

### List Item Pattern

**Touchable list item with chevron:**

```typescript
<TouchableOpacity onPress={onPress}>
  <Box
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    p="$4"
    borderBottomWidth={1}
    borderBottomColor="$borderLight100"
    $web={{
      cursor: 'pointer',
      _hover: { bg: '$backgroundLight50' }
    }}
  >
    <Box flex={1}>
      <Heading size="sm">{title}</Heading>
      <Text fontSize="$sm" color="$textLight600">{subtitle}</Text>
    </Box>
    <Icon name="chevron-right" size={20} color="$textLight400" />
  </Box>
</TouchableOpacity>
```

---

### Badge/Pill Pattern

**Status indicators:**

```typescript
function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: { bg: '$success100', text: '$success700' },
    pending: { bg: '$warning100', text: '$warning700' },
    completed: { bg: '$info100', text: '$info700' },
  };

  const { bg, text } = colors[status] || colors.pending;

  return (
    <Box bg={bg} px="$3" py="$1" borderRadius="$full">
      <Text fontSize="$xs" color={text} fontWeight="$semibold">
        {status}
      </Text>
    </Box>
  );
}
```

---

### Avatar Pattern

```typescript
import { Avatar, AvatarImage, AvatarFallbackText } from '@gluestack-ui/themed';

<Avatar size="md">
  <AvatarFallbackText>{user.full_name}</AvatarFallbackText>
  {user.avatar_url && <AvatarImage source={{ uri: user.avatar_url }} />}
</Avatar>
```

---

## Theme Token Reference

### Colors

- **Background:** `$backgroundLight0`, `$backgroundLight50`, `$backgroundLight100`
- **Text:** `$textLight700`, `$textLight600`, `$textLight400`
- **Primary:** `$primary500`, `$primary600`
- **Error:** `$error500`, `$error600`
- **Success:** `$success500`, `$success600`
- **Warning:** `$warning500`, `$warning600`

### Spacing

- `$1` (4px), `$2` (8px), `$3` (12px), `$4` (16px), `$6` (24px), `$8` (32px), `$12` (48px)

### Border Radius

- `$sm` (4px), `$md` (8px), `$lg` (12px), `$xl` (16px), `$2xl` (24px), `$full` (9999px)

### Font Sizes

- `$xs`, `$sm`, `$md`, `$lg`, `$xl`, `$2xl`

### Font Weights

- `$normal`, `$medium`, `$semibold`, `$bold`

---

## Common Component Pitfalls

### ❌ Don't

```typescript
// Hard-coded colors
<Box backgroundColor="#3B82F6">

// Inline styles (loses theme tokens)
<Text style={{ color: 'red', fontSize: 14 }}>

// Using .map() for long lists
{items.map(item => <ItemCard key={item.id} item={item} />)}

// No loading states
<FlatList data={properties} ... />
```

### ✅ Do

```typescript
// Theme tokens
<Box bg="$primary500">

// Gluestack props
<Text color="$error500" fontSize="$sm">

// FlatList for performance
<FlatList data={items} renderItem={({ item }) => <ItemCard item={item} />} />

// Always handle loading/error states
{loading ? <Spinner /> : <FlatList data={properties} ... />}
```

---

## Accessibility Best Practices

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Delete property"
  accessibilityRole="button"
  accessibilityHint="Double tap to delete this property"
>
  <Icon name="trash" />
</TouchableOpacity>

<Text
  accessibilityRole="header"
  accessibilityLevel={1}
>
  Page Title
</Text>
```

---

## Platform-Specific Patterns

```typescript
import { Platform } from 'react-native';

<Box
  p="$4"
  sx={{
    '@web': {
      cursor: 'pointer',
      _hover: { bg: '$backgroundLight50' }
    }
  }}
>
  <Content />
</Box>

// Or use Platform.select
<Box
  shadowColor={Platform.select({
    ios: '$backgroundLight900',
    android: 'transparent'
  })}
  elevation={Platform.OS === 'android' ? 3 : 0}
>
```

---

## Quick Component Checklist

When creating a new component:

- [ ] Use Gluestack UI components (Box, Text, Button, etc.)
- [ ] Use theme tokens for colors, spacing, typography
- [ ] Provide TypeScript types for props
- [ ] Handle loading/error states if fetching data
- [ ] Use FlatList for lists > 10 items
- [ ] Add accessibility props (accessibilityLabel, accessibilityRole)
- [ ] Use TouchableOpacity or Pressable for touch interactions
- [ ] Responsive design with `sx` and breakpoints for web
- [ ] Platform-specific styling when needed (iOS shadows vs Android elevation)
- [ ] Test with Gluestack provider wrapper
