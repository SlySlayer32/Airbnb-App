import { Stack, router, usePathname, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Check if we're in demo mode (no Supabase configured)
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      const isDemoMode = !supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder');
      
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
      else if (user && profile && !profile.onboarded && pathname !== '/onboarding') {
        router.replace('/onboarding');
      }
      // If user is authenticated and onboarded, ensure they're on a valid page
      else if (user && profile && profile.onboarded && pathname.startsWith('/auth')) {
        router.replace('/');
      }
    }
  }, [user, profile, loading, pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AuthGuard>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Dashboard', headerShown: false }} />
          <Stack.Screen name="properties" options={{ title: 'Properties' }} />
          <Stack.Screen name="team" options={{ title: 'Team' }} />
          <Stack.Screen name="schedule" options={{ title: 'Schedule' }} />
          <Stack.Screen name="invoices" options={{ title: 'Invoices' }} />
          <Stack.Screen name="maintenance" options={{ title: 'Maintenance' }} />
          <Stack.Screen name="reports" options={{ title: 'Reports' }} />
          <Stack.Screen name="profile" options={{ title: 'Profile' }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
  );
}