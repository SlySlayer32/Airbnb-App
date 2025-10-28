import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InvoiceCardProps {
  invoiceNumber: string;
  propertyName: string;
  cleanerName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  onPress: () => void;
}

export default function InvoiceCard({
  invoiceNumber,
  propertyName,
  cleanerName,
  amount,
  status,
  dueDate,
  onPress,
}: InvoiceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'overdue':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    return `Due in ${diffDays} days`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
        <View
          style={[styles.status, { backgroundColor: getStatusColor(status) }]}
        >
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <Text style={styles.property}>{propertyName}</Text>
      <Text style={styles.cleaner}>{cleanerName}</Text>

      <View style={styles.footer}>
        <View>
          <Text style={styles.amount}>{formatCurrency(amount)}</Text>
          <Text
            style={[
              styles.dueDate,
              { color: status === 'overdue' ? '#ef4444' : '#6b7280' },
            ]}
          >
            {getDaysUntilDue(dueDate)}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          {status !== 'paid' && (
            <TouchableOpacity style={[styles.actionButton, styles.payButton]}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          )}
        </View>
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
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  property: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  cleaner: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dueDate: {
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginLeft: 8,
  },
  actionText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  payButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
