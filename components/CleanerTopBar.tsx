import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationBadge from './NotificationBadge';

export default function CleanerTopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
      </View>
      
      <View style={styles.rightSection}>
        <NotificationBadge />
        <View style={styles.statusIndicator}>
          <Ionicons name="radio-button-on" size={16} color="#10b981" />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  leftSection: {
    flex: 1,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
});
