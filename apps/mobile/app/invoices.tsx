import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import InvoiceCard from '../components/InvoiceCard';

export default function InvoicesScreen() {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock invoice data
  const invoices = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      propertyName: 'Sunset Villa',
      cleanerName: 'Sarah Johnson',
      amount: 150,
      status: 'pending' as const,
      dueDate: new Date(2024, 0, 25),
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      propertyName: 'Mountain Retreat',
      cleanerName: 'Maria Garcia',
      amount: 200,
      status: 'overdue' as const,
      dueDate: new Date(2024, 0, 15),
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      propertyName: 'Urban Loft',
      cleanerName: 'Sarah Johnson',
      amount: 120,
      status: 'paid' as const,
      dueDate: new Date(2024, 0, 10),
    },
  ];

  const filteredInvoices = invoices.filter(invoice => {
    return filterStatus === 'all' || invoice.status === filterStatus;
  });

  const statusFilters = [
    { key: 'all', label: 'All', count: invoices.length },
    { key: 'pending', label: 'Pending', count: invoices.filter(i => i.status === 'pending').length },
    { key: 'overdue', label: 'Overdue', count: invoices.filter(i => i.status === 'overdue').length },
    { key: 'paid', label: 'Paid', count: invoices.filter(i => i.status === 'paid').length },
  ];

  const totalPending = invoices
    .filter(i => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Outstanding Balance</Text>
          <Text style={styles.summaryAmount}>
            ${totalPending.toLocaleString()}
          </Text>
          <Text style={styles.summarySubtitle}>
            {invoices.filter(i => i.status === 'overdue').length} overdue invoices
          </Text>
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
      </View>

      <View style={styles.content}>
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>+ Create Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportButtonText}>📊 Export</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.resultsText}>
          {filteredInvoices.length} invoices
        </Text>

        {filteredInvoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoiceNumber={invoice.invoiceNumber}
            propertyName={invoice.propertyName}
            cleanerName={invoice.cleanerName}
            amount={invoice.amount}
            status={invoice.status}
            dueDate={invoice.dueDate}
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
  summaryCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 12,
    color: '#ef4444',
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
  },
  filterTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  exportButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
});