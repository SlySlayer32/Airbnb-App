import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  title: string;
  value: string;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, color, subtitle }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );
}

export default function DashboardStats() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard
          title="Active Properties"
          value="12"
          color="#10b981"
          subtitle="2 occupied"
        />
        <StatCard
          title="Upcoming Cleans"
          value="8"
          color="#3b82f6"
          subtitle="Next 7 days"
        />
      </View>
      <View style={styles.row}>
        <StatCard
          title="Pending Invoices"
          value="$2,450"
          color="#f59e0b"
          subtitle="5 overdue"
        />
        <StatCard
          title="Open Tickets"
          value="3"
          color="#ef4444"
          subtitle="1 urgent"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
});