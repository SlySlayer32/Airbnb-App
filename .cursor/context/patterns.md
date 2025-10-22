# Common Coding Patterns

This document contains production-ready code patterns used throughout the Airbnb property management app.

## Custom Hooks Pattern

### Data Fetching Hook
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as User;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
}
```

### Form Hook Pattern
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const propertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().optional(),
});

type PropertyForm = z.infer<typeof propertySchema>;

export function usePropertyForm(initialData?: Partial<PropertyForm>) {
  return useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData,
    mode: 'onBlur',
  });
}
```

## Supabase Authentication Pattern

### Auth Hook
```typescript
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading, user: session?.user ?? null };
}
```

### Auth Service
```typescript
import { supabase } from '@/lib/supabase';

export class AuthService {
  async signUp(email: string, password: string, userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
}

export const authService = new AuthService();
```

## Realtime Subscriptions Pattern

### Realtime Hook
```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeMessages(channelId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  return messages;
}
```

### Realtime Service
```typescript
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToTable(
    table: string,
    filter: string,
    onUpdate: (payload: any) => void
  ): RealtimeChannel {
    const channelKey = `${table}:${filter}`;
    const channel = supabase
      .channel(channelKey)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        onUpdate
      )
      .subscribe();

    this.channels.set(channelKey, channel);
    return channel;
  }

  unsubscribeFromTable(table: string, filter: string): void {
    const channelKey = `${table}:${filter}`;
    const channel = this.channels.get(channelKey);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelKey);
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

## List Rendering with FlashList

### Performance List Pattern
```typescript
import { FlashList } from '@shopify/flash-list';
import { useCallback, memo } from 'react';
import { PropertyCard } from '@/components/PropertyCard';

interface Property {
  id: string;
  name: string;
  address: string;
}

function PropertyList({ properties }: { properties: Property[] }) {
  const renderItem = useCallback(({ item }: { item: Property }) => (
    <PropertyCard property={item} />
  ), []);

  const keyExtractor = useCallback((item: Property) => item.id, []);

  return (
    <FlashList
      data={properties}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={120}
      // Optimize with getItemType for heterogeneous lists
      getItemType={(item) => item.type || 'default'}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
}

// Memoize list items
const PropertyCard = memo(({ property }: { property: Property }) => {
  return (
    <Box className="p-4 border-b border-gray-200">
      <Text className="font-semibold">{property.name}</Text>
      <Text className="text-gray-600">{property.address}</Text>
    </Box>
  );
});
```

## Animation Patterns with Reanimated

### Gesture Animation
```typescript
import { Pressable } from 'react-native';
import { Box, Text } from '@gluestack-ui/themed';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const AnimatedBox = Animated.createAnimatedComponent(Box);

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function AnimatedButton({ 
  onPress, 
  children, 
  variant = 'primary',
  disabled = false 
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.95);
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
      onPress();
    });

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedBox style={animatedStyle}>
        <Pressable disabled={disabled}>
          <Box
            bg={variant === 'primary' ? '$primary600' : '$gray200'}
            py="$3"
            px="$6"
            borderRadius="$lg"
            opacity={disabled ? 0.5 : 1}
          >
            <Text color="$white" fontWeight="$semibold" textAlign="center">
              {children}
            </Text>
          </Box>
        </Pressable>
      </AnimatedBox>
    </GestureDetector>
  );
}
```

### Swipe Gesture Pattern
```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  runOnJS 
} from 'react-native-reanimated';

function SwipeableCard({ onSwipe }: { onSwipe: (direction: 'left' | 'right') => void }) {
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      translateX.value = context.value.x + event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > 100) {
        translateX.value = withSpring(event.translationX > 0 ? 500 : -500);
        runOnJS(onSwipe)(event.translationX > 0 ? 'right' : 'left');
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        {/* Card content */}
      </Animated.View>
    </GestureDetector>
  );
}
```

## Error Boundaries Pattern

### Error Boundary Component
```typescript
import { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react-native';
import { View, Text, Button } from '@gluestack-ui/themed';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-xl font-bold mb-2">Something went wrong</Text>
          <Text className="text-gray-600 text-center mb-4">
            {this.state.error?.message}
          </Text>
          <Button onPress={() => this.setState({ hasError: false })}>
            <ButtonText>Try Again</ButtonText>
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}
```

### Error Handling Hook
```typescript
import { useState, useCallback } from 'react';

export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    console.error('Error caught:', error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}
```

## Accessibility Patterns

### Accessible Button Component
```typescript
import { Pressable } from 'react-native';
import { Box, Text } from '@gluestack-ui/themed';

interface AccessibleButtonProps {
  onPress: () => void;
  label: string;
  hint?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function AccessibleButton({ 
  onPress, 
  label, 
  hint, 
  disabled = false,
  children 
}: AccessibleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      disabled={disabled}
    >
      <Box className="p-4 bg-blue-600 rounded-lg" opacity={disabled ? 0.5 : 1}>
        <Text className="text-white font-semibold text-center">
          {children}
        </Text>
      </Box>
    </Pressable>
  );
}
```

### Accessible Form Input
```typescript
import { useId } from 'react';
import { View, Text, TextInput } from 'react-native';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@gluestack-ui/themed';

interface AccessibleInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  hint?: string;
}

export function AccessibleInput({ 
  label, 
  value, 
  onChangeText, 
  error, 
  placeholder,
  hint 
}: AccessibleInputProps) {
  const inputId = useId();
  
  return (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText nativeID={inputId}>
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={label}
        accessibilityLabelledBy={inputId}
        accessibilityHint={hint}
        accessible={true}
        placeholder={placeholder}
        className="border border-gray-300 rounded p-3"
      />
      {error && (
        <FormControlError>
          <FormControlErrorText 
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {error}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
```

## Loading States Pattern

### Skeleton Loading
```typescript
import { VStack, HStack, Box } from '@gluestack-ui/themed';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

function SkeletonCard() {
  return (
    <Box bg="$white" p="$4" borderRadius="$lg" mb="$4">
      <VStack space="md">
        <Skeleton colorMode="light" width="100%" height={200} radius={8} />
        <Skeleton colorMode="light" width="60%" height={20} />
        <Skeleton colorMode="light" width="40%" height={16} />
        <HStack space="sm">
          <Skeleton colorMode="light" width={80} height={32} radius={16} />
          <Skeleton colorMode="light" width={80} height={32} radius={16} />
        </HStack>
      </VStack>
    </Box>
  );
}

function DataList() {
  const { data, isLoading } = useQuery(['data'], fetchData);

  if (isLoading) {
    return (
      <VStack space="md" p="$4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </VStack>
    );
  }

  return <>{/* Actual data */}</>;
}
```

### Loading States Hook
```typescript
import { useState, useCallback } from 'react';

export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);

  const executeWithLoading = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T> => {
    setIsLoading(true);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, executeWithLoading };
}
```

## Network State Management

### Network Status Hook
```typescript
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return unsubscribe;
  }, []);

  return { isConnected, isInternetReachable };
}
```

### Offline Mutation Pattern
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNetworkStatus } from '@/hooks/use-network-status';

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { isConnected } = useNetworkStatus();

  return useMutation({
    mutationFn: async (post: NewPost) => {
      if (!isConnected) {
        // Queue for later
        await queueMutation('createPost', post);
        return { ...post, id: `temp-${Date.now()}`, pending: true };
      }
      return createPost(post);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['posts'], (old: Post[] = []) => [data, ...old]);
    },
  });
}
```
