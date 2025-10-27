import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CleaningSession } from '@airbnb/core-models';
import { PhotoProofGate } from './PhotoProofGate';

interface CleanerActiveSessionCardProps {
  session: CleaningSession | null;
  onPauseSession?: (sessionId: string) => void;
  onResumeSession?: (sessionId: string) => void;
  onCompleteSession?: (sessionId: string, photos?: string[]) => void;
  onAddUpdate?: (sessionId: string) => void;
}

export default function CleanerActiveSessionCard({ 
  session,
  onPauseSession,
  onResumeSession,
  onCompleteSession,
  onAddUpdate
}: CleanerActiveSessionCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPhotoGate, setShowPhotoGate] = useState(false);
  const [completionPhotos, setCompletionPhotos] = useState<string[]>([]);
  const [photoRequirements, setPhotoRequirements] = useState({ required: false, completed: false });
  
  // Get pause state from session data instead of local state
  const isPaused = session?.is_currently_paused || false;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (session) {
      getPhotoRequirements().then(setPhotoRequirements);
    }
  }, [session]);

  if (!session || session.status !== 'in_progress') {
    return null;
  }

  const startTime = session.cleaner_started_at ? new Date(session.cleaner_started_at) : new Date();
  
  // Calculate elapsed time excluding breaks
  let elapsedTime = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
  
  // Subtract total break time
  const totalBreakSeconds = (session.total_break_minutes || 0) * 60;
  
  // If currently paused, subtract time since last pause
  if (isPaused && session.cleaner_paused_at) {
    const pauseTime = new Date(session.cleaner_paused_at);
    const currentPauseSeconds = Math.floor((currentTime.getTime() - pauseTime.getTime()) / 1000);
    elapsedTime = elapsedTime - totalBreakSeconds - currentPauseSeconds;
  } else {
    elapsedTime = elapsedTime - totalBreakSeconds;
  }
  
  // Ensure elapsed time is never negative
  elapsedTime = Math.max(0, elapsedTime);
  
  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getExpectedCompletionTime = () => {
    if (session.dashboard_metadata?.expected_completion_time) {
      const expectedTime = new Date(session.dashboard_metadata.expected_completion_time);
      return expectedTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    return null;
  };

  const getProgressPercentage = () => {
    // Placeholder calculation - in real implementation, this would be based on checklist completion
    const estimatedDuration = ((session.properties as any)?.estimated_cleaning_duration || 120) * 60; // Convert to seconds
    const progress = Math.min((elapsedTime / estimatedDuration) * 100, 100);
    return Math.round(progress);
  };

  const isRunningLate = () => {
    if (!session.dashboard_metadata?.expected_completion_time) return false;
    const expectedTime = new Date(session.dashboard_metadata.expected_completion_time);
    return currentTime > expectedTime;
  };

  // Photo requirements logic using PhotoProofService
  const getPhotoRequirements = async () => {
    if (!session) return { required: false, completed: false };
    
    try {
      const { PhotoProofService } = await import('../services/photoProofService');
      const hasRequirements = await PhotoProofService.hasPhotoRequirements(session.id);
      const status = await PhotoProofService.getPhotoProofStatus(session.id);
      
      return { 
        required: hasRequirements, 
        completed: status.is_complete 
      };
    } catch (error) {
      console.error('Error checking photo requirements:', error);
      return { required: false, completed: false };
    }
  };

  const canComplete = !photoRequirements.required || photoRequirements.completed;

  return (
    <View style={[styles.container, isRunningLate() && styles.containerLate]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusDot, { backgroundColor: isPaused ? '#f59e0b' : '#10b981' }]} />
          <Text style={styles.title}>
            {isPaused ? 'Paused' : 'Active Cleaning'}
          </Text>
        </View>
        
        {isRunningLate() && (
          <View style={styles.lateBadge}>
            <Ionicons name="time" size={12} color="#ef4444" />
            <Text style={styles.lateText}>Running Late</Text>
          </View>
        )}
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyName}>{session.properties?.name || 'Property'}</Text>
        <Text style={styles.guestInfo}>
          <Ionicons name="people" size={14} color="#6b7280" /> {session.guest_count} guests
        </Text>
      </View>

      <View style={styles.timerSection}>
        <View style={styles.timerDisplay}>
          <Text style={styles.timerText}>{formatElapsedTime(elapsedTime)}</Text>
          <Text style={styles.timerLabel}>Elapsed Time</Text>
        </View>
        
        {getExpectedCompletionTime() && (
          <View style={styles.expectedTime}>
            <Text style={styles.expectedTimeText}>Target: {getExpectedCompletionTime()}</Text>
          </View>
        )}
        
        {(session.total_break_minutes || 0) > 0 && (
          <View style={styles.breakTimeDisplay}>
            <Text style={styles.breakTimeText}>
              Break time: {session.total_break_minutes}min
              {isPaused && session.cleaner_paused_at && (
                <Text style={styles.currentBreakText}>
                  {' (break ongoing...)'}
                </Text>
              )}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercentage}>{getProgressPercentage()}%</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${getProgressPercentage()}%`,
                backgroundColor: isRunningLate() ? '#ef4444' : '#10b981'
              }
            ]} 
          />
        </View>
        
        <Text style={styles.progressNote}>
          Based on estimated completion time
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => onAddUpdate?.(session.id)}
        >
          <Ionicons name="camera-outline" size={16} color="#6b7280" />
          <Text style={styles.secondaryButtonText}>Add Update</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => {
            if (isPaused) {
              onResumeSession?.(session.id);
            } else {
              onPauseSession?.(session.id);
            }
          }}
        >
          <Ionicons 
            name={isPaused ? "play-outline" : "pause-outline"} 
            size={16} 
            color="#6b7280" 
          />
          <Text style={styles.secondaryButtonText}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.primaryButton, !canComplete && styles.primaryButtonDisabled]} 
          onPress={() => {
            if (photoRequirements.required && !photoRequirements.completed) {
              setShowPhotoGate(true);
            } else {
              onCompleteSession?.(session.id, completionPhotos);
            }
          }}
          disabled={!canComplete}
        >
          <Ionicons 
            name={photoRequirements.required && !photoRequirements.completed ? "camera" : "checkmark"} 
            size={16} 
            color={canComplete ? "#fff" : "#9ca3af"} 
          />
          <Text style={[styles.primaryButtonText, !canComplete && styles.primaryButtonTextDisabled]}>
            {photoRequirements.required && !photoRequirements.completed ? 'Photos Required' : 'Complete'}
          </Text>
        </TouchableOpacity>
      </View>

      {showPhotoGate && (
        <Modal
          visible={showPhotoGate}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <PhotoProofGate
            sessionId={session.id}
            sessionType={session.session_type}
            propertyRooms={(session.properties as any)?.rooms || 0}
            onPhotoProofComplete={(isComplete) => {
              if (isComplete) {
                setPhotoRequirements(prev => ({ ...prev, completed: true }));
                setShowPhotoGate(false);
                onCompleteSession?.(session.id, completionPhotos);
              }
            }}
            onCompleteSession={() => {
              setShowPhotoGate(false);
              onCompleteSession?.(session.id, completionPhotos);
            }}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerLate: {
    borderLeftColor: '#ef4444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  lateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  lateText: {
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '700',
  },
  propertyInfo: {
    marginBottom: 20,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  guestInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  timerDisplay: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  expectedTime: {
    marginTop: 8,
  },
  expectedTimeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  breakTimeDisplay: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  breakTimeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  currentBreakText: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressNote: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#10b981',
    gap: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  primaryButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  primaryButtonTextDisabled: {
    color: '#9ca3af',
  },
});
