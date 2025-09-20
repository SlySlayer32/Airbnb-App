import { Stack, router, usePathname, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Temporarily allow properties page without auth for demo
      if (!user && pathname !== '/properties') {
        router.replace('/auth/login');
      } else if (user && profile && !profile.onboarded) {
        router.replace('/onboarding');
      }
    }
  }, [user, profile, loading, pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
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
          <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
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