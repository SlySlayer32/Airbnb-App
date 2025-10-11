import CleanerDashboard from '@/components/CleanerDashboard';
import DashboardStats from '@/components/DashboardStats';
import DebugPanel from '@/components/DebugPanel';
import QuickActions from '@/components/QuickActions';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
  const { profile, isDemoMode } = useAuth();

  // Show cleaner dashboard for cleaner role
  if (profile?.role === 'cleaner') {
    return (
      <View style={{ flex: 1 }}>
        <CleanerDashboard />
        <DebugPanel />
      </View>
    );
  }

  // Show owner/co-host dashboard for other roles
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
      {isDemoMode && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>
            🚀 Demo Mode - Configure Supabase to enable full functionality
          </Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.greeting}>
          Good morning, {profile?.full_name?.split(' ')[0] || 'User'}!
        </Text>
        <Text style={styles.subtitle}>
          {profile?.role === 'property_owner' && 'Manage your properties'}
          {profile?.role === 'co_host' && 'Property coordination'}
          {isDemoMode && ' (Demo Mode)'}
        </Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.profileButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>

      <DashboardStats />
      <QuickActions />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text style={styles.activityText}>
          {isDemoMode
            ? 'Welcome to your dashboard! This is demo mode. Configure Supabase to enable full functionality.'
            : 'Welcome to your dashboard! Start by adding your first property.'
          }
        </Text>
      </View>
      </ScrollView>
      <DebugPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  demoBanner: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f59e0b',
  },
  demoBannerText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 15,
  },
  profileButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  activityText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
});
