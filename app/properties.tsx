import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import PropertyCard from '@/components/PropertyCard';
import RoleBasedWrapper from '@/components/RoleBasedWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { propertyService } from '@/services';
import { EnhancedProperty } from '@/types';

export default function PropertiesScreen() {
  const { profile } = useAuth();
  const [properties, setProperties] = useState<EnhancedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadProperties();
  }, [profile?.role]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      let data: EnhancedProperty[] = [];
      
      if (profile?.role === 'cleaner') {
        data = await propertyService.getPropertiesForCleaner();
      } else if (profile?.role === 'property_owner' || profile?.role === 'co_host') {
        data = await propertyService.getPropertiesForOwner();
      }
      
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProperties();
    setRefreshing(false);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusFilters = () => {
    if (profile?.role === 'cleaner') {
      // For cleaners, show session-based filters
      return [
        { key: 'all', label: 'All', count: properties.length },
        { key: 'scheduled', label: 'Scheduled', count: properties.filter(p => p.current_session?.status === 'scheduled' || p.current_session?.status === 'confirmed').length },
        { key: 'in_progress', label: 'In Progress', count: properties.filter(p => p.current_session?.status === 'in_progress').length },
        { key: 'completed', label: 'Completed', count: properties.filter(p => p.current_session?.status === 'completed').length },
      ];
    } else {
      // For owners, show property status filters
      return [
        { key: 'all', label: 'All', count: properties.length },
        { key: 'active', label: 'Active', count: properties.filter(p => p.status === 'active').length },
        { key: 'occupied', label: 'Occupied', count: properties.filter(p => p.status === 'occupied').length },
        { key: 'maintenance', label: 'Maintenance', count: properties.filter(p => p.status === 'maintenance').length },
      ];
    }
  };

  const statusFilters = getStatusFilters();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {profile?.role === 'cleaner' ? 'My Cleaning Schedule' : 'Properties'}
        </Text>
        
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
        {profile?.role === 'cleaner' && (
          <View style={styles.cleanerInfo}>
            <Text style={styles.cleanerInfoText}>
              📍 Today's Schedule • Tap any property for details and updates
            </Text>
          </View>
        )}
        
        <Text style={styles.resultsText}>
          {filteredProperties.length} properties found
        </Text>
        
        {filteredProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {profile?.role === 'cleaner' ? 'No cleaning sessions assigned' : 'No properties found'}
            </Text>
            <Text style={styles.emptyStateText}>
              {profile?.role === 'cleaner' 
                ? 'Check back later for new cleaning assignments.'
                : 'Try adjusting your search or filters.'}
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onPress={() => {
                // TODO: Navigate to property details
                console.log('Property pressed:', property.name);
              }}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
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
  cleanerInfo: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  cleanerInfoText: {
    fontSize: 14,
    color: '#1e40af',
    textAlign: 'center',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});