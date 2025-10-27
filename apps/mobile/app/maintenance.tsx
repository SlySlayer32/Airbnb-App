import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaintenanceCard from '../components/MaintenanceCard';

export default function MaintenanceScreen() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Mock maintenance data
  const tickets = [
    {
      id: '1',
      ticketNumber: 'MT-001',
      title: 'Leaking faucet in master bathroom',
      propertyName: 'Sunset Villa',
      priority: 'high' as const,
      status: 'open' as const,
      assignedTo: 'Mike Wilson',
      createdDate: new Date(2024, 0, 18),
    },
    {
      id: '2',
      ticketNumber: 'MT-002',
      title: 'HVAC system not cooling properly',
      propertyName: 'Mountain Retreat',
      priority: 'urgent' as const,
      status: 'in-progress' as const,
      assignedTo: 'Sarah Johnson',
      createdDate: new Date(2024, 0, 19),
    },
    {
      id: '3',
      ticketNumber: 'MT-003',
      title: 'Light bulb replacement needed',
      propertyName: 'Urban Loft',
      priority: 'low' as const,
      status: 'resolved' as const,
      assignedTo: 'Maria Garcia',
      createdDate: new Date(2024, 0, 15),
    },
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const statusFilters = [
    { key: 'all', label: 'All', count: tickets.length },
    { key: 'open', label: 'Open', count: tickets.filter(t => t.status === 'open').length },
    { key: 'in-progress', label: 'In Progress', count: tickets.filter(t => t.status === 'in-progress').length },
    { key: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length },
  ];

  const priorityFilters = [
    { key: 'all', label: 'All Priorities' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length}
            </Text>
            <Text style={styles.statLabel}>Active Tickets</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#dc2626' }]}>
              {tickets.filter(t => t.priority === 'urgent').length}
            </Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                filterStatus === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus(filter.key)}
            >
              <Text style={[
                styles.filterText,
                filterStatus === filter.key && styles.filterTextActive
              ]}>
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {priorityFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.priorityButton,
                filterPriority === filter.key && styles.priorityButtonActive
              ]}
              onPress={() => setFilterPriority(filter.key)}
            >
              <Text style={[
                styles.priorityText,
                filterPriority === filter.key && styles.priorityTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>+ Create Ticket</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.resultsText}>
          {filteredTickets.length} maintenance tickets
        </Text>

        {filteredTickets.map((ticket) => (
          <MaintenanceCard
            key={ticket.id}
            ticketNumber={ticket.ticketNumber}
            title={ticket.title}
            propertyName={ticket.propertyName}
            priority={ticket.priority}
            status={ticket.status}
            assignedTo={ticket.assignedTo}
            createdDate={ticket.createdDate}
            onPress={() => {}}
          />
        ))}
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 12,
    color: '#374151',
  },
  filterTextActive: {
    color: 'white',
  },
  priorityButton: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  priorityButtonActive: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  priorityText: {
    fontSize: 12,
    color: '#6b7280',
  },
  priorityTextActive: {
    color: '#d97706',
  },
  content: {
    padding: 16,
  },
  actionBar: {
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
});