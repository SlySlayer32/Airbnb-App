import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth/login');
      } else if (profile && !profile.onboarded) {
        router.replace('/onboarding');
      }
    }
  }, [user, profile, loading]);

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