import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface ActionButtonProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

function ActionButton({ title, icon, color, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'Add Property',
      icon: '🏠',
      color: '#3b82f6',
      onPress: () => router.push('/properties'),
    },
    {
      title: 'Schedule Clean',
      icon: '🧹',
      color: '#10b981',
      onPress: () => router.push('/schedule'),
    },
    {
      title: 'Invite Team',
      icon: '👥',
      color: '#8b5cf6',
      onPress: () => router.push('/team'),
    },
    {
      title: 'New Invoice',
      icon: '💳',
      color: '#f59e0b',
      onPress: () => router.push('/invoices'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            title={action.title}
            icon={action.icon}
            color={action.color}
            onPress={action.onPress}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});