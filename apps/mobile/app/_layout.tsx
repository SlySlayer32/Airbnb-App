import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { ActivityIndicator, LogBox, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { router, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@airbnb/data-access-auth';
import { ErrorBoundary } from '@airbnb/ui-components';

// Suppress network errors in demo mode
LogBox.ignoreLogs([
  'Network request failed',
  'TypeError: Network request failed',
]);

// Keep the splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Check if we're in demo mode (no Supabase configured)
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      const isDemoMode =
        !supabaseUrl ||
        !supabaseKey ||
        supabaseUrl.includes('placeholder') ||
        supabaseKey.includes('placeholder');

      if (isDemoMode) {
        // In demo mode, always show the dashboard
        if (pathname.startsWith('/auth') || pathname === '/onboarding') {
          router.replace('/');
        }
        return;
      }

      // If user is not authenticated and not on auth pages, redirect to login
      if (!user && !pathname.startsWith('/auth')) {
        router.replace('/auth/login');
      }
      // If user is authenticated but not onboarded, redirect to onboarding
      else if (
        user &&
        profile &&
        !profile.onboarded &&
        pathname !== '/onboarding'
      ) {
        router.replace('/onboarding');
      }
      // If user is authenticated and onboarded, ensure they're on a valid page
      else if (
        user &&
        profile &&
        profile.onboarded &&
        pathname.startsWith('/auth')
      ) {
        router.replace('/');
      }
    }
  }, [user?.id, profile?.id, profile?.onboarded, loading, pathname]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Loading...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AuthProvider>
          <StatusBar style="auto" />
          <AuthGuard>
            <Stack>
              <Stack.Screen
                name="index"
                options={{ title: 'Dashboard', headerShown: false }}
              />
              <Stack.Screen
                name="properties"
                options={{ title: 'Properties', headerShown: false }}
              />
              <Stack.Screen
                name="team"
                options={{ title: 'Team', headerShown: false }}
              />
              <Stack.Screen
                name="schedule"
                options={{ title: 'Schedule', headerShown: false }}
              />
              <Stack.Screen
                name="invoices"
                options={{ title: 'Invoices', headerShown: false }}
              />
              <Stack.Screen
                name="maintenance"
                options={{ title: 'Maintenance', headerShown: false }}
              />
              <Stack.Screen
                name="reports"
                options={{ title: 'Reports', headerShown: false }}
              />
              <Stack.Screen
                name="profile"
                options={{ title: 'Profile', headerShown: false }}
              />
              <Stack.Screen
                name="onboarding"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/login"
                options={{ headerShown: false, presentation: 'modal' }}
              />
              <Stack.Screen
                name="auth/register"
                options={{ headerShown: false, presentation: 'modal' }}
              />
              <Stack.Screen
                name="auth/forgot-password"
                options={{ headerShown: false, presentation: 'modal' }}
              />
            </Stack>
          </AuthGuard>
        </AuthProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
