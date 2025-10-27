import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ScheduleCardProps {
  propertyName: string;
  cleanerName: string;
  date: Date;
  type: 'checkout' | 'checkin' | 'maintenance' | 'deep-clean';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  onPress: () => void;
}

export default function ScheduleCard({ 
  propertyName, 
  cleanerName, 
  date, 
  type, 
  status, 
  onPress 
}: ScheduleCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checkout': return '#ef4444';
      case 'checkin': return '#10b981';
      case 'maintenance': return '#f59e0b';
      case 'deep-clean': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.dateTime}>
          <Text style={styles.date}>{formatDate(date)}</Text>
          <Text style={styles.time}>{formatTime(date)}</Text>
        </View>
        <View style={[styles.type, { backgroundColor: getTypeColor(type) }]}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
      </View>
      
      <Text style={styles.property}>{propertyName}</Text>
      <Text style={styles.cleaner}>Assigned to: {cleanerName}</Text>
      
      <View style={styles.footer}>
        <View style={[styles.status, { backgroundColor: getStatusColor(status) }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  dateTime: {
    alignItems: 'flex-start',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  time: {
    fontSize: 14,
    color: '#6b7280',
  },
  type: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  property: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  cleaner: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  actionText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },
});