import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MaintenanceCardProps {
  ticketNumber: string;
  title: string;
  propertyName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdDate: Date;
  onPress: () => void;
}

export default function MaintenanceCard({
  ticketNumber,
  title,
  propertyName,
  priority,
  status,
  assignedTo,
  createdDate,
  onPress
}: MaintenanceCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'open': return '#f59e0b';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysAgo = (date: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.ticketNumber}>#{ticketNumber}</Text>
        <View style={styles.badges}>
          <View style={[styles.priority, { backgroundColor: getPriorityColor(priority) }]}>
            <Text style={styles.priorityText}>{priority}</Text>
          </View>
          <View style={[styles.status, { backgroundColor: getStatusColor(status) }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.property}>{propertyName}</Text>
      
      <View style={styles.footer}>
        <View>
          <Text style={styles.assignedTo}>
            {assignedTo ? `Assigned to: ${assignedTo}` : 'Unassigned'}
          </Text>
          <Text style={styles.date}>
            Created {getDaysAgo(createdDate)}
          </Text>
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
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  badges: {
    flexDirection: 'row',
  },
  priority: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  status: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  property: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignedTo: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
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