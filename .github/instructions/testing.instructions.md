---
applyTo: '{**/__tests__/**,**/*.test.ts,**/*.test.tsx,jest.config.js,jest.setup.js,e2e/**}'
description: 'Testing patterns, mocking strategies, and coverage requirements'
---

# Testing Guidelines

## Testing Philosophy

- **Test behavior, not implementation** - Focus on what users/consumers experience
- **Test at the right level** - Unit for logic, integration for flows, E2E for critical paths
- **Maintain test independence** - Each test should be runnable in isolation
- **Keep tests readable** - Tests are documentation of expected behavior

## Test Organization

### File structure

```
services/
  propertyService.ts
  __tests__/
    propertyService.test.ts      # Unit tests for service

components/
  PropertyCard.tsx
  PropertyCard.test.tsx          # Component tests adjacent to source

e2e/
  auth-flow.test.ts              # End-to-end tests
  cleaning-session.test.ts
```

### Naming conventions

```typescript
// ✅ Descriptive test names
describe('cleaningSessionService', () => {
  describe('startSession', () => {
    it('should create session with scheduled times', async () => {});
    it('should throw error when property not found', async () => {});
    it('should validate time window before starting', async () => {});
  });
});

// ❌ Vague test names
it('works', () => {});
it('test1', () => {});
```

## Unit Testing Services

### Setup pattern

```typescript
import { supabase } from '@/utils/supabase';

import { propertyService } from '../propertyService';

// Mock Supabase client
jest.mock('@/utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe('propertyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch properties with filters', async () => {
    // Arrange
    const mockProperties = [
      { id: '1', name: 'Property 1', status: 'active' },
      { id: '2', name: 'Property 2', status: 'active' },
    ];

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({
      data: mockProperties,
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
    });

    // Act
    const result = await propertyService.getProperties({ status: 'active' });

    // Assert
    expect(supabase.from).toHaveBeenCalledWith('properties');
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('status', 'active');
    expect(result).toEqual(mockProperties);
  });

  it('should handle errors gracefully', async () => {
    // Arrange
    const mockError = { message: 'Database error' };
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      }),
    });

    // Act & Assert
    await expect(propertyService.getProperties()).rejects.toThrow('Failed to fetch properties');
  });
});
```

### Testing async operations

```typescript
// ✅ Use async/await
it('should complete session successfully', async () => {
  const result = await cleaningSessionService.completeSession(sessionId);
  expect(result.status).toBe('completed');
});

// ✅ Test error cases
it('should throw when session not found', async () => {
  await expect(
    cleaningSessionService.completeSession('invalid-id')
  ).rejects.toThrow('Session not found');
});

// ✅ Use waitFor for eventual consistency
import { waitFor } from '@testing-library/react-native';

it('should update state after data loads', async () => {
  render(<PropertiesScreen />);

  await waitFor(() => {
    expect(screen.getByText('Property 1')).toBeTruthy();
  });
});
```

## Component Testing

### Basic component test

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@/gluestack-ui.config';
import PropertyCard from '../PropertyCard';

// Provider wrapper for Gluestack UI
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GluestackUIProvider config={config}>
    {children}
  </GluestackUIProvider>
);

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    name: 'Sunset Villa',
    address: '123 Beach Rd',
    bedrooms: 3,
    bathrooms: 2,
    status: 'active',
  };

  it('should render property details', () => {
    render(<PropertyCard property={mockProperty} />, { wrapper });

    expect(screen.getByText('Sunset Villa')).toBeTruthy();
    expect(screen.getByText('123 Beach Rd')).toBeTruthy();
    expect(screen.getByText('3 bed, 2 bath')).toBeTruthy();
  });

  it('should call onPress when tapped', () => {
    const mockOnPress = jest.fn();
    render(
      <PropertyCard property={mockProperty} onPress={mockOnPress} />,
      { wrapper }
    );

    fireEvent.press(screen.getByTestId('property-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockProperty);
  });

  it('should show active status badge', () => {
    render(<PropertyCard property={mockProperty} />, { wrapper });
    expect(screen.getByText('Active')).toBeTruthy();
  });
});
```

### Testing hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';

import { useProperties } from '../useProperties';

describe('useProperties', () => {
  it('should fetch properties on mount', async () => {
    const { result } = renderHook(() => useProperties());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.properties).toHaveLength(3);
  });

  it('should refetch when refetch called', async () => {
    const { result } = renderHook(() => useProperties());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.refetch();

    expect(result.current.isLoading).toBe(true);
  });
});
```

### Testing with navigation

```typescript
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

it('should navigate to property details on press', () => {
  render(<PropertyCard property={mockProperty} />, { wrapper });

  fireEvent.press(screen.getByTestId('property-card'));

  expect(router.push).toHaveBeenCalledWith('/properties/1');
});
```

## Mocking Strategies

### Mock Supabase client

```typescript
// __mocks__/utils/supabase.ts
export const supabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  })),
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    }),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  })),
};
```

### Mock context providers

```typescript
// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    profile: { role: 'cleaner', full_name: 'Test User' },
    isDemoMode: false,
    signOut: jest.fn(),
  }),
}));
```

### Mock react-native modules

```typescript
// jest.setup.js
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: () => ({}),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

## Test Coverage Requirements

### Coverage targets

```json
// jest.config.js
{
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 75,
      "lines": 80,
      "statements": 80
    },
    "services/**/*.ts": {
      "branches": 80,
      "functions": 85,
      "lines": 90,
      "statements": 90
    }
  }
}
```

### What to prioritize for coverage

1. **Services** (high priority) - Business logic, data operations
2. **Utilities** - Cross-cutting concerns, helpers
3. **Complex components** - Stateful, conditional rendering
4. **Custom hooks** - Data fetching, side effects

### What can have lower coverage

- Simple presentational components
- Type definitions
- Configuration files
- Simple wrappers

## E2E Testing with Detox

### Test structure

```typescript
// e2e/cleaning-session.test.ts
describe('Cleaning Session Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete full cleaning session', async () => {
    // Login
    await element(by.id('email-input')).typeText('cleaner@test.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Navigate to properties
    await element(by.text('Properties')).tap();

    // Select property
    await element(by.id('property-card-0')).tap();

    // Start session
    await element(by.id('start-session-button')).tap();

    // Verify session started
    await expect(element(by.text('Session In Progress'))).toBeVisible();

    // Complete session
    await element(by.id('complete-session-button')).tap();

    // Add photo proof
    await element(by.id('add-photo-button')).tap();
    // ... photo selection flow

    // Confirm completion
    await element(by.id('confirm-completion-button')).tap();

    // Verify completed
    await expect(element(by.text('Session Completed'))).toBeVisible();
  });
});
```

### E2E best practices

- Test critical user journeys only
- Keep tests independent
- Use test IDs (`testID` prop) for reliable selection
- Reset state between tests
- Avoid testing implementation details

## Snapshot Testing

### When to use snapshots

- Component rendering output
- API response structures
- Complex data transformations

```typescript
it('should match snapshot', () => {
  const { toJSON } = render(<PropertyCard property={mockProperty} />, { wrapper });
  expect(toJSON()).toMatchSnapshot();
});
```

### Snapshot best practices

- Keep snapshots small and focused
- Review snapshot changes carefully in PRs
- Update snapshots intentionally, not reflexively
- Don't snapshot entire screens (too brittle)

## Testing Checklist

Before submitting a PR:

- [ ] All new services have unit tests (>80% coverage)
- [ ] Complex components have tests
- [ ] Error cases are tested
- [ ] Async operations are tested with proper waits
- [ ] Mocks are properly reset between tests
- [ ] Tests are independent (can run in any order)
- [ ] Test names clearly describe behavior
- [ ] No commented-out tests
- [ ] Snapshots updated if intentional UI changes
- [ ] E2E tests added for new critical flows

## Common Testing Anti-Patterns

### ❌ Avoid

```typescript
// Testing implementation details
it('should call setState', () => {
  expect(component.setState).toHaveBeenCalled();
});

// Brittle selectors
await element(by.text('Submit')).tap(); // Breaks if text changes

// Testing too much in one test
it('should do everything', () => {
  // 100 lines of test code
});

// Not cleaning up mocks
// Mocks leak between tests
```

### ✅ Better

```typescript
// Test behavior/output
it('should update displayed count when incremented', () => {
  expect(screen.getByText('Count: 5')).toBeTruthy();
});

// Stable selectors
await element(by.id('submit-button')).tap();

// Focused tests
it('should increment count by 1', () => {});
it('should reset count to 0', () => {});

// Proper cleanup
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Debugging Tests

### Common issues

```bash
# Tests timing out
# Increase timeout for specific test
it('slow operation', async () => {
  // test code
}, 10000); // 10 second timeout

# Clear Jest cache
npx jest --clearCache

# Run specific test
npx jest PropertyCard.test.tsx

# Run in watch mode
npm run test:watch

# See console logs
npx jest --verbose

# Debug in VS Code
# Add to launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```
