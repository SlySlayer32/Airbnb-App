import { useAuth } from '@/contexts/AuthContext';
import { realtimeService, RealtimeSubscriptionConfig } from '@/services/realtimeService';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';

export default function OwnerDashboard() {
  const { profile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Add data refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleRealtimeError = useCallback((error: Error) => {
    console.error('Real-time connection error:', error);
    setRealtimeConnected(false);
  }, []);

  // Setup real-time subscriptions
  useEffect(() => {
    const setupRealtime = async () => {
      try {
        const config: RealtimeSubscriptionConfig = {
          onSessionUpdate: () => {},
          onSessionInsert: () => {},
          onSessionDelete: () => {},
          onUpdateInsert: () => {},
          onError: handleRealtimeError
        };

        await realtimeService.subscribe(config);
        setRealtimeConnected(true);
      } catch (error) {
        console.error('Failed to setup real-time subscriptions:', error);
        setRealtimeConnected(false);
      }
    };

    setupRealtime();

    return () => {
      realtimeService.unsubscribe();
      setRealtimeConnected(false);
    };
  }, [handleRealtimeError]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, {profile?.full_name?.split(' ')[0] || 'Owner'}!</Text>
          <Text style={styles.subtitle}>Manage your properties and cleanings</Text>
        </View>

        <DashboardStats />

        <QuickActions />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.activityText}>
            Welcome to your dashboard! Start by adding your first property or scheduling a cleaning.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

