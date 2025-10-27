import { CleaningSession } from '@airbnb/core-models';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TodayJobCardProps {
  session: CleaningSession;
  isNextJob?: boolean;
  onPressDirections: (sessionId: string) => void;
  onPressAccessInfo: (sessionId: string) => void;
  onPressRequirements: (sessionId: string) => void;
}

export default function TodayJobCard({
  session,
  isNextJob = false,
  onPressDirections,
  onPressAccessInfo,
  onPressRequirements,
}: TodayJobCardProps) {
  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Invalid time';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#007AFF';
      case 'cancelled':
        return '#ef4444';
      case 'scheduled':
      case 'confirmed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const property = (session as any).properties || (session as any).property;
  const propertyName = property?.name || 'Property';
  const propertyAddress = property?.address || 'No address';

  return (
    <View style={[styles.card, isNextJob && styles.nextJobCard]}>
      {isNextJob && (
        <View style={styles.nextJobBadge}>
          <Text style={styles.nextJobText}>NEXT JOB</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.propertyName} numberOfLines={2}>
          {propertyName}
        </Text>
        {session.status && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
            <Text style={styles.statusText}>{session.status.replace('_', ' ').toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#6b7280" />
          <Text style={styles.detailText} numberOfLines={2}>
            {propertyAddress}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            {formatTime(session.scheduled_cleaning_time)} - {formatTime(session.checkin_time)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => onPressDirections(session.id)}
          accessibilityLabel="Get directions"
        >
          <Ionicons name="navigate-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Directions</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => onPressAccessInfo(session.id)}
          accessibilityLabel="View access information"
        >
          <Ionicons name="eye-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Access Info</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => onPressRequirements(session.id)}
          accessibilityLabel="View requirements"
        >
          <Ionicons name="document-text-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Requirements</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextJobCard: {
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  nextJobBadge: {
    position: 'absolute',
    top: -1,
    left: 12,
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  nextJobText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingTop: 4,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 6,
  },
});

