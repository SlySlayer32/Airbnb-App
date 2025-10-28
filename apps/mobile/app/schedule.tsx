import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScheduleCard from '../components/ScheduleCard';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  // Mock schedule data
  const schedules = [
    {
      id: '1',
      propertyName: 'Sunset Villa',
      cleanerName: 'Sarah Johnson',
      date: new Date(2024, 0, 20, 10, 0),
      type: 'checkout' as const,
      status: 'pending' as const,
    },
    {
      id: '2',
      propertyName: 'Mountain Retreat',
      cleanerName: 'Maria Garcia',
      date: new Date(2024, 0, 20, 14, 0),
      type: 'checkin' as const,
      status: 'in-progress' as const,
    },
    {
      id: '3',
      propertyName: 'Urban Loft',
      cleanerName: 'Sarah Johnson',
      date: new Date(2024, 0, 21, 9, 0),
      type: 'deep-clean' as const,
      status: 'pending' as const,
    },
  ];

  const viewModes = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ];

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateTitle}>{formatSelectedDate(selectedDate)}</Text>

        <View style={styles.viewModeContainer}>
          {viewModes.map(mode => (
            <TouchableOpacity
              key={mode.key}
              style={[
                styles.viewModeButton,
                viewMode === mode.key && styles.viewModeButtonActive,
              ]}
              onPress={() => setViewMode(mode.key as any)}
            >
              <Text
                style={[
                  styles.viewModeText,
                  viewMode === mode.key && styles.viewModeTextActive,
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Schedule Cleaning</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.syncButton}>
            <Text style={styles.syncButtonText}>🔄 Sync Airbnb</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Today's Schedule</Text>

        {schedules.map(schedule => (
          <ScheduleCard
            key={schedule.id}
            propertyName={schedule.propertyName}
            cleanerName={schedule.cleanerName}
            date={schedule.date}
            type={schedule.type}
            status={schedule.status}
            onPress={() => {}}
          />
        ))}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Tasks:</Text>
            <Text style={styles.summaryValue}>3</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Completed:</Text>
            <Text style={[styles.summaryValue, { color: '#10b981' }]}>0</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>In Progress:</Text>
            <Text style={[styles.summaryValue, { color: '#3b82f6' }]}>1</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pending:</Text>
            <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>2</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  viewModeContainer: {
    flexDirection: 'row',
  },
  viewModeButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  viewModeButtonActive: {
    backgroundColor: '#2563eb',
  },
  viewModeText: {
    fontSize: 14,
    color: '#374151',
  },
  viewModeTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  syncButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  syncButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
});
