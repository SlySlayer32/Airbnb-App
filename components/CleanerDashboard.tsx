import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { CleaningSession } from '@/types';
import { cleaningSessionService } from '@/services';
import { realtimeService, RealtimeSubscriptionConfig } from '@/services/realtimeService';
import CleanerTopBar from './CleanerTopBar';
import CleanerStatusBanner, { CleanerStatus } from './CleanerStatusBanner';
import CleanerNextJobCard from './CleanerNextJobCard';
import CleanerActiveSessionCard from './CleanerActiveSessionCard';

export default function CleanerDashboard() {
  const [sessions, setSessions] = useState<CleaningSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  // Determine dashboard state
  const activeSession = sessions.find(s => s.status === 'in_progress');
  const nextSession = sessions
    .filter(s => s.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_cleaning_time).getTime() - new Date(b.scheduled_cleaning_time).getTime())[0];
  
  const getCurrentStatus = (): CleanerStatus => {
    if (activeSession) {
      // Check if we're waiting for photos (placeholder logic)
      return 'active';
    }
    
    if (nextSession?.dashboard_metadata) {
      const { status_indicator } = nextSession.dashboard_metadata;
      switch (status_indicator) {
        case 'overdue':
        case 'starting_soon':
          return 'ready';
        case 'scheduled':
          return 'scheduled';
        default:
          return 'scheduled';
      }
    }
    
    if (sessions.length === 0 || sessions.every(s => s.status === 'completed')) {
      const now = new Date();
      const hour = now.getHours();
      // If it's after 3 PM and all sessions are complete, show day wrap
      return hour >= 15 ? 'day_wrap' : 'relax';
    }
    
    return 'relax';
  };

  const getStatusMessage = (): string | undefined => {
    const status = getCurrentStatus();
    
    if (status === 'ready' && nextSession?.dashboard_metadata) {
      const { time_until_start_minutes, is_overdue } = nextSession.dashboard_metadata;
      if (is_overdue) {
        return `Your cleaning at ${nextSession.properties?.name} is overdue!`;
      }
      if (time_until_start_minutes <= 30) {
        return `Ready to start cleaning at ${nextSession.properties?.name}`;
      }
    }
    
    if (status === 'active' && activeSession) {
      return `Currently cleaning ${activeSession.properties?.name}`;
    }
    
    if (status === 'scheduled' && sessions.length > 0) {
      return `${sessions.filter(s => s.status === 'scheduled').length} cleaning(s) scheduled for today`;
    }
    
    return undefined;
  };

  const loadTodaySessions = async () => {
    try {
      const todaySessions = await cleaningSessionService.getTodaySessions();
      setSessions(todaySessions);
    } catch (error) {
      console.error('Error loading today sessions:', error);
      Alert.alert('Error', 'Failed to load today\'s sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTodaySessions();
    setRefreshing(false);
  };

  const handleStartCleaning = async (sessionId: string) => {
    try {
      await cleaningSessionService.startCleaning(sessionId);
      await loadTodaySessions(); // Refresh the data
      Alert.alert('Success', 'Cleaning session started!');
    } catch (error) {
      console.error('Error starting cleaning:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start cleaning session. Please try again.';
      Alert.alert('Cannot Start Session', errorMessage);
    }
  };

  const handlePauseSession = async (sessionId: string) => {
    try {
      await cleaningSessionService.pauseSession(sessionId, 'Break taken from dashboard');
      await loadTodaySessions(); // Refresh the data
      Alert.alert('Paused', 'Session paused. Take your time and resume when ready!');
    } catch (error) {
      console.error('Error pausing session:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to pause session.');
    }
  };

  const handleResumeSession = async (sessionId: string) => {
    try {
      await cleaningSessionService.resumeSession(sessionId);
      await loadTodaySessions(); // Refresh the data
      Alert.alert('Resumed', 'Session resumed. Keep up the great work!');
    } catch (error) {
      console.error('Error resuming session:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to resume session.');
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      // For now, just show alert - full completion flow comes in Phase 2
      Alert.alert(
        'Complete Cleaning',
        'Ready to complete this session?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Complete', 
            onPress: async () => {
              try {
                await cleaningSessionService.completeCleaning(sessionId, {
                  notes: 'Session completed via dashboard',
                  photosComplete: true, // Placeholder - would be determined by actual photo status
                  checklistComplete: true // Placeholder - would be determined by actual checklist status
                });
                await loadTodaySessions();
                Alert.alert('Success', 'Cleaning session completed!');
              } catch (completionError) {
                console.error('Error completing session:', completionError);
                const errorMessage = completionError instanceof Error ? completionError.message : 'Failed to complete session.';
                Alert.alert('Cannot Complete Session', errorMessage);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error completing session:', error);
      Alert.alert('Error', 'Failed to complete session.');
    }
  };

  const handleViewDetails = (sessionId: string) => {
    // Placeholder - would navigate to detailed session view
    Alert.alert('View Details', 'Session details view will be implemented in Phase 2');
  };

  const handleAddUpdate = (sessionId: string) => {
    // Placeholder - would open update/photo modal
    Alert.alert('Add Update', 'Update and photo functionality will be implemented in Phase 2');
  };

  // Real-time subscription handlers
  const handleSessionUpdate = useCallback((updatedSession: CleaningSession) => {
    console.log('Real-time session update received:', updatedSession);
    setSessions(prevSessions => {
      const updatedSessions = prevSessions.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      );
      
      // If this was a new session, add it
      if (!prevSessions.find(s => s.id === updatedSession.id)) {
        updatedSessions.push(updatedSession);
      }
      
      return updatedSessions;
    });
  }, []);

  const handleSessionInsert = useCallback((newSession: CleaningSession) => {
    console.log('Real-time new session received:', newSession);
    setSessions(prevSessions => {
      // Check if session already exists to avoid duplicates
      if (prevSessions.find(s => s.id === newSession.id)) {
        return prevSessions;
      }
      return [...prevSessions, newSession];
    });
  }, []);

  const handleSessionDelete = useCallback((sessionId: string) => {
    console.log('Real-time session deletion received:', sessionId);
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
  }, []);

  const handleUpdateInsert = useCallback((newUpdate: any) => {
    console.log('Real-time new update received:', newUpdate);
    // For now, just refresh the sessions to get updated data
    // In a more sophisticated implementation, we'd update specific session data
    loadTodaySessions();
  }, []);

  const handleRealtimeError = useCallback((error: Error) => {
    console.error('Real-time connection error:', error);
    setRealtimeConnected(false);
    // Don't show error to user unless it's critical - real-time is enhancement
  }, []);

  // Setup real-time subscriptions
  useEffect(() => {
    const setupRealtime = async () => {
      try {
        const config: RealtimeSubscriptionConfig = {
          onSessionUpdate: handleSessionUpdate,
          onSessionInsert: handleSessionInsert,
          onSessionDelete: handleSessionDelete,
          onUpdateInsert: handleUpdateInsert,
          onError: handleRealtimeError
        };

        await realtimeService.subscribe(config);
        setRealtimeConnected(true);
        console.log('Real-time subscriptions established for dashboard');
      } catch (error) {
        console.error('Failed to setup real-time subscriptions:', error);
        setRealtimeConnected(false);
      }
    };

    setupRealtime();

    // Cleanup on unmount
    return () => {
      realtimeService.unsubscribe();
      setRealtimeConnected(false);
    };
  }, [handleSessionUpdate, handleSessionInsert, handleSessionDelete, handleUpdateInsert, handleRealtimeError]);

  useEffect(() => {
    loadTodaySessions();
  }, []);

  return (
    <View style={styles.container}>
      <CleanerTopBar realtimeConnected={realtimeConnected} />
      
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <CleanerStatusBanner 
          status={getCurrentStatus()}
          message={getStatusMessage()}
          timeRemaining={nextSession?.dashboard_metadata?.time_until_start_minutes}
        />
        
        {activeSession && (
          <CleanerActiveSessionCard
            session={activeSession}
            onPauseSession={handlePauseSession}
            onResumeSession={handleResumeSession}
            onCompleteSession={handleCompleteSession}
            onAddUpdate={handleAddUpdate}
          />
        )}
        
        {!activeSession && (
          <CleanerNextJobCard
            session={nextSession || null}
            onStartCleaning={handleStartCleaning}
            onViewDetails={handleViewDetails}
          />
        )}
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
});
