import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CleaningSession } from '@/types';

interface CleanerNextJobCardProps {
  session: CleaningSession | null;
  onStartCleaning?: (sessionId: string) => void;
  onViewDetails?: (sessionId: string) => void;
}

export default function CleanerNextJobCard({ 
  session, 
  onStartCleaning, 
  onViewDetails 
}: CleanerNextJobCardProps) {
  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={48} color="#10b981" />
          <Text style={styles.emptyTitle}>No upcoming cleanings</Text>
          <Text style={styles.emptySubtitle}>
            Enjoy your free time! Check back later for new assignments.
          </Text>
        </View>
      </View>
    );
  }

  const { dashboard_metadata, properties } = session;
  const scheduledTime = new Date(session.scheduled_cleaning_time);
  const isOverdue = dashboard_metadata?.is_overdue || false;
  const isStartingSoon = dashboard_metadata?.status_indicator === 'starting_soon';
  const timeUntilStart = dashboard_metadata?.time_until_start_minutes || 0;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatTimeUntil = (minutes: number) => {
    if (minutes <= 0) return 'Now';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getPriorityColor = () => {
    switch (dashboard_metadata?.priority_level) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = () => {
    if (isOverdue) return '#ef4444';
    if (isStartingSoon) return '#f59e0b';
    return '#10b981';
  };

  const canStartCleaning = () => {
    return timeUntilStart <= 30 && session.status === 'scheduled';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Next Cleaning</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
          <Text style={styles.priorityText}>
            {dashboard_metadata?.priority_level?.toUpperCase() || 'NORMAL'}
          </Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyName}>{properties?.name || 'Property'}</Text>
        <Text style={styles.scheduledTime}>Scheduled: {formatTime(scheduledTime)}</Text>
        
        {dashboard_metadata?.is_within_cleaning_window === false && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning-outline" size={16} color="#f59e0b" />
            <Text style={styles.warningText}>Outside 11 AM - 3 PM window</Text>
          </View>
        )}
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusLeft}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {isOverdue ? 'Overdue' : 
             isStartingSoon ? 'Starting Soon' : 
             `Starts in ${formatTimeUntil(timeUntilStart)}`}
          </Text>
        </View>
        
        <View style={styles.guestInfo}>
          <Ionicons name="people-outline" size={16} color="#6b7280" />
          <Text style={styles.guestText}>{session.guest_count} guests</Text>
        </View>
      </View>

      <View style={styles.metaInfo}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.metaText}>
            Est. {(properties as any)?.estimated_cleaning_duration || 120}min
          </Text>
        </View>
        
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text style={styles.metaText} numberOfLines={1}>
            {(properties as any)?.address || 'Address not available'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => onViewDetails?.(session.id)}
        >
          <Text style={styles.secondaryButtonText}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.primaryButton, 
            canStartCleaning() ? styles.primaryButtonActive : styles.primaryButtonDisabled
          ]}
          disabled={!canStartCleaning()}
          onPress={() => canStartCleaning() && onStartCleaning?.(session.id)}
        >
          <Text style={[
            styles.primaryButtonText,
            canStartCleaning() ? styles.primaryButtonTextActive : styles.primaryButtonTextDisabled
          ]}>
            {canStartCleaning() ? 'Start Cleaning' : `Wait ${formatTimeUntil(timeUntilStart)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  propertyInfo: {
    marginBottom: 16,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  scheduledTime: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  warningText: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guestText: {
    fontSize: 14,
    color: '#6b7280',
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonActive: {
    backgroundColor: '#10b981',
  },
  primaryButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonTextActive: {
    color: '#fff',
  },
  primaryButtonTextDisabled: {
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
