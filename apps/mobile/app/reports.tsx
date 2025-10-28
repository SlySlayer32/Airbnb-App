import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter' | 'year'
  >('month');

  const periods = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'quarter', label: 'This Quarter' },
    { key: 'year', label: 'This Year' },
  ];

  // Mock report data
  const reportData = {
    cleaningStats: {
      totalCleans: 45,
      completedOnTime: 42,
      averageRating: 4.8,
      totalRevenue: 6750,
    },
    maintenanceStats: {
      totalTickets: 12,
      resolvedTickets: 9,
      averageResolutionTime: 2.3,
      maintenanceCosts: 1250,
    },
    propertyPerformance: [
      { name: 'Sunset Villa', cleans: 15, revenue: 2250, rating: 4.9 },
      { name: 'Mountain Retreat', cleans: 18, revenue: 2700, rating: 4.8 },
      { name: 'Urban Loft', cleans: 12, revenue: 1800, rating: 4.7 },
    ],
    expenses: [
      { category: 'Cleaning Supplies', amount: 450 },
      { category: 'Equipment', amount: 200 },
      { category: 'Maintenance', amount: 1250 },
      { category: 'Team Payments', amount: 4500 },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPercentage = (value: number, total: number) => {
    return Math.round((value / total) * 100);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance Reports</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}
        >
          {periods.map(period => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.key && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {/* Cleaning Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cleaning Overview</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {reportData.cleaningStats.totalCleans}
              </Text>
              <Text style={styles.metricLabel}>Total Cleanings</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: '#10b981' }]}>
                {getPercentage(
                  reportData.cleaningStats.completedOnTime,
                  reportData.cleaningStats.totalCleans
                )}
                %
              </Text>
              <Text style={styles.metricLabel}>On-Time Rate</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: '#f59e0b' }]}>
                {reportData.cleaningStats.averageRating}
              </Text>
              <Text style={styles.metricLabel}>Avg Rating</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: '#3b82f6' }]}>
                {formatCurrency(reportData.cleaningStats.totalRevenue)}
              </Text>
              <Text style={styles.metricLabel}>Revenue</Text>
            </View>
          </View>
        </View>

        {/* Maintenance Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maintenance Overview</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {reportData.maintenanceStats.totalTickets}
              </Text>
              <Text style={styles.metricLabel}>Total Tickets</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: '#10b981' }]}>
                {getPercentage(
                  reportData.maintenanceStats.resolvedTickets,
                  reportData.maintenanceStats.totalTickets
                )}
                %
              </Text>
              <Text style={styles.metricLabel}>Resolution Rate</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: '#8b5cf6' }]}>
                {reportData.maintenanceStats.averageResolutionTime}d
              </Text>
              <Text style={styles.metricLabel}>Avg Resolution</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: '#ef4444' }]}>
                {formatCurrency(reportData.maintenanceStats.maintenanceCosts)}
              </Text>
              <Text style={styles.metricLabel}>Costs</Text>
            </View>
          </View>
        </View>

        {/* Property Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Performance</Text>
          {reportData.propertyPerformance.map((property, index) => (
            <View key={index} style={styles.propertyCard}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <View style={styles.propertyStats}>
                <Text style={styles.propertyStat}>
                  {property.cleans} cleans
                </Text>
                <Text style={styles.propertyStat}>
                  {formatCurrency(property.revenue)}
                </Text>
                <Text style={[styles.propertyStat, { color: '#f59e0b' }]}>
                  ★ {property.rating}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Expense Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expense Breakdown</Text>
          {reportData.expenses.map((expense, index) => (
            <View key={index} style={styles.expenseRow}>
              <Text style={styles.expenseCategory}>{expense.category}</Text>
              <Text style={styles.expenseAmount}>
                {formatCurrency(expense.amount)}
              </Text>
            </View>
          ))}
          <View style={[styles.expenseRow, styles.expenseTotal]}>
            <Text style={styles.expenseTotalLabel}>Total Expenses</Text>
            <Text style={styles.expenseTotalAmount}>
              {formatCurrency(
                reportData.expenses.reduce((sum, e) => sum + e.amount, 0)
              )}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>📊 Export Full Report</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
  },
  periodButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  periodButtonActive: {
    backgroundColor: '#2563eb',
  },
  periodText: {
    fontSize: 14,
    color: '#374151',
  },
  periodTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  propertyCard: {
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
  propertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  propertyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyStat: {
    fontSize: 14,
    color: '#6b7280',
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#374151',
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  expenseTotal: {
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    borderBottomWidth: 0,
    marginTop: 8,
  },
  expenseTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  expenseTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  exportButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
