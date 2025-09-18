import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import PropertyCard from '@/components/PropertyCard';
import RoleBasedWrapper from '@/components/RoleBasedWrapper';
import { properties } from '@/data/mockData';

export default function PropertiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const statusFilters = [
    { key: 'all', label: 'All', count: properties.length },
    { key: 'active', label: 'Active', count: properties.filter(p => p.status === 'active').length },
    { key: 'occupied', label: 'Occupied', count: properties.filter(p => p.status === 'occupied').length },
    { key: 'maintenance', label: 'Maintenance', count: properties.filter(p => p.status === 'maintenance').length },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                statusFilter === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setStatusFilter(filter.key)}
            >
              <Text style={[
                styles.filterText,
                statusFilter === filter.key && styles.filterTextActive
              ]}>
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <Text style={styles.resultsText}>
          {filteredProperties.length} properties found
        </Text>
        
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
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
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
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
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
});