import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { cleaningSessionService } from '@/services';
import {
  realtimeService,
  RealtimeSubscriptionConfig,
} from '@/services/realtimeService';
import { CleaningSession } from '@airbnb/core-domain-models';
import { useAuth } from '@airbnb/data-access-auth';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import TodayJobsSection from './TodayJobsSection';
import TodoTasksSection from './TodoTasksSection';

interface TodoTask {
  id: string;
  title: string;
  isUrgent?: boolean;
  isCompleted: boolean;
}

export default function CleanerDashboard() {
  const { profile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [todaySessions, setTodaySessions] = useState<CleaningSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [tasks, setTasks] = useState<TodoTask[]>([
    {
      id: '1',
      title: 'Pick up cleaning supplies from warehouse',
      isUrgent: true,
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Submit timesheet for last week',
      isUrgent: false,
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Check inventory before Office Complex job',
      isUrgent: true,
      isCompleted: false,
    },
    {
      id: '4',
      title: "Confirm tomorrow's schedule",
      isUrgent: false,
      isCompleted: false,
    },
    {
      id: '5',
      title: 'Review eco-friendly products request for Tech Hub',
      isUrgent: false,
      isCompleted: false,
    },
  ]);

  const loadTodaySessions = async () => {
    try {
      setIsLoadingSessions(true);
      const sessions = await cleaningSessionService.getTodaySessions();
      setTodaySessions(sessions);
    } catch (error) {
      console.error('[CleanerDashboard.loadTodaySessions]', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTodaySessions();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
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
          onSessionUpdate: () => {
            loadTodaySessions();
          },
          onSessionInsert: () => {
            loadTodaySessions();
          },
          onSessionDelete: () => {
            loadTodaySessions();
          },
          onUpdateInsert: () => {},
          onError: handleRealtimeError,
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

  // Load initial data
  useEffect(() => {
    loadTodaySessions();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Good morning, {profile?.full_name?.split(' ')[0] || 'Cleaner'}!
          </Text>
          <Text style={styles.subtitle}>Your cleaning schedule for today</Text>
        </View>

        <DashboardStats />

        <TodayJobsSection
          sessions={todaySessions}
          isLoading={isLoadingSessions}
        />

        <TodoTasksSection
          tasks={tasks}
          onToggleTask={handleToggleTask}
          isLoading={false}
        />

        <QuickActions />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {realtimeConnected ? '● Live' : '○ Offline'}
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
    paddingTop: 72, // Add space for hamburger button
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
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
