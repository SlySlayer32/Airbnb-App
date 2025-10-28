import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TodoTaskItem from './TodoTaskItem';

interface TodoTask {
  id: string;
  title: string;
  isUrgent?: boolean | undefined;
  isCompleted: boolean;
}

interface TodoTasksSectionProps {
  tasks: TodoTask[];
  onToggleTask: (taskId: string) => void;
  isLoading: boolean;
}

export default function TodoTasksSection({
  tasks,
  onToggleTask,
  isLoading,
}: TodoTasksSectionProps) {
  const completedCount = tasks.filter(task => task.isCompleted).length;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>TO-DO TASKS</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>TO-DO TASKS</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>
            All caught up! No tasks to complete.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TO-DO TASKS</Text>
        <Text style={styles.counter}>
          {completedCount} of {tasks.length} completed
        </Text>
      </View>

      <View style={styles.tasksList}>
        {tasks.map(task => (
          <TodoTaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            isUrgent={task.isUrgent}
            isCompleted={task.isCompleted}
            onToggle={onToggleTask}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  counter: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tasksList: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
});
