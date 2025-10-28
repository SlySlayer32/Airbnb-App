import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TodoTaskItemProps {
  id: string;
  title: string;
  isUrgent?: boolean | undefined;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}

export default function TodoTaskItem({
  id,
  title,
  isUrgent = false,
  isCompleted,
  onToggle,
}: TodoTaskItemProps) {
  return (
    <Pressable
      style={[styles.container, isCompleted && styles.completedContainer]}
      onPress={() => onToggle(id)}
      accessibilityLabel={
        isCompleted
          ? `Mark ${title} as incomplete`
          : `Mark ${title} as complete`
      }
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isCompleted }}
    >
      <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
        {isCompleted && <Ionicons name="checkmark" size={16} color="#ffffff" />}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {isUrgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>Urgent</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  completedContainer: {
    opacity: 0.6,
    backgroundColor: '#f9fafb',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    color: '#1f2937',
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  urgentBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#fee2e2',
    borderRadius: 4,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#dc2626',
  },
});
