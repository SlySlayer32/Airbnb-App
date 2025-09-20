// app/properties.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import CleanerPropertyCard from '@/components/CleanerPropertyCard';
import PropertyOwnerCard from '@/components/PropertyOwnerCard';
import { propertyService, cleaningSessionService, cleaningUpdateService, EnhancedProperty } from '@/services/propertyService';
import { router } from 'expo-router';

export default function PropertiesScreen() {
  const { profile } = useAuth();
  const [properties, setProperties] = useState<EnhancedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const isOwner = profile?.role === 'property_owner';
  const isCleaner = profile?.role === 'cleaner';

  // Load properties based on user role
  const loadProperties = async () => {
    try {
      setLoading(true);
      let data: EnhancedProperty[] = [];
      
      if (isOwner) {
        data = await propertyService.getPropertiesForOwner();
      } else if (isCleaner) {
        data = await propertyService.getPropertiesForCleaner();
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

  useEffect(() => {
    loadProperties();
  }, [profile?.role]);

  // Filter properties based on search and status
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (statusFilter !== 'all') {
        if (isOwner) {
          // For owners, filter by property status or session status
          matchesFilter = property.status === statusFilter ||
                         property.current_session?.status === statusFilter;
        } else {
          // For cleaners, filter by session status
          matchesFilter = property.current_session?.status === statusFilter;
        }
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [properties, searchQuery, statusFilter, isOwner]);

  // Get filter options based on role
  const getFilterOptions = () => {
    if (isOwner) {
      return [
        { key: 'all', label: 'All', count: properties.length },
        { key: 'active', label: 'Active', count: properties.filter(p => p.status === 'active').length },
        { key: 'occupied', label: 'Occupied', count: properties.filter(p => p.status === 'occupied').length },
        { key: 'scheduled', label: 'Scheduled', count: properties.filter(p => p.current_session?.status === 'scheduled').length },
        { key: 'in_progress', label: 'In Progress', count: properties.filter(p => p.current_session?.status === 'in_progress').length },
      ];
    } else {
      return [
        { key: 'all', label: 'All', count: properties.length },
        { key: 'scheduled', label: 'Scheduled', count: properties.filter(p => p.current_session?.status === 'scheduled').length },
        { key: 'confirmed', label: 'Confirmed', count: properties.filter(p => p.current_session?.status === 'confirmed').length },
        { key: 'in_progress', label: 'In Progress', count: properties.filter(p => p.current_session?.status === 'in_progress').length },
        { key: 'cancelled', label: 'Cancelled', count: properties.filter(p => p.current_session?.status === 'cancelled').length },
      ];
    }
  };

  // Handle property actions for owners
  const handleScheduleClean = (propertyId: string) => {
    router.push(`/schedule?property=${propertyId}`);
  };

  const handleAssignCleaner = (propertyId: string) => {
    router.push(`/team?assign=${propertyId}`);
  };

  const handleEditProperty = (propertyId: string) => {
    router.push(`/properties/${propertyId}/edit`);
  };

  const handleUpdateSession = async (sessionId: string, updates: any) => {
    try {
      if (updates.status === 'cancelled') {
        await cleaningSessionService.cancelSession(sessionId, updates);
      } else {
        await cleaningSessionService.updateSessionStatus(sessionId, updates);
      }
      
      // Refresh the properties list
      await loadProperties();
      
      Alert.alert('Success', 'Session updated successfully');
    } catch (error) {
      console.error('Error updating session:', error);
      Alert.alert('Error', 'Failed to update session');
    }
  };

  // Handle cleaner actions
  const handleStartCleaning = async (sessionId: string) => {
    try {
      await cleaningSessionService.startCleaning(sessionId);
      await loadProperties();
      Alert.alert('Success', 'Cleaning started! Don\'t forget to update your progress.');
    } catch (error) {
      console.error('Error starting cleaning:', error);
      Alert.alert('Error', 'Failed to start cleaning session');
    }
  };

  const handleReportIssue = (propertyId: string) => {
    router.push(`/properties/${propertyId}/report-issue`);
  };

  const getTodayCount = () => {
    const today = new Date().toDateString();
    return properties.filter(p => {
      if (!p.current_session) return false;
      const sessionDate = new Date(p.current_session.scheduled_cleaning_time).toDateString();
      return sessionDate === today;
    }).length;
  };

  const getUpcomingCount = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return properties.filter(p => {
      if (!p.current_session) return false;
      const sessionDate = new Date(p.current_session.scheduled_cleaning_time);
      return sessionDate >= tomorrow && sessionDate <= nextWeek;
    }).length;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header Statistics */}
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{properties.length}</Text>
            <Text style={styles.statLabel}>
              {isOwner ? 'Properties' : 'Assignments'}
            </Text>
          </View>
          
          {isCleaner && (
            <>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#ef4444' }]}>{getTodayCount()}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{getUpcomingCount()}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </>
          )}

          {isOwner && (
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#3b82f6' }]}>
                {properties.filter(p => p.current_session?.status === 'in_progress').length}
              </Text>
              <Text style={styles.statLabel}>Active Cleans</Text>
            </View>
          )}
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${isOwner ? 'properties' : 'assignments'}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        {/* Filter Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {getFilterOptions().map((filter) => (
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

        {/* Action Button for Owners */}
        {isOwner && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/properties/add')}
          >
            <Text style={styles.addButtonText}>+ Add Property</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Properties List */}
      <View style={styles.content}>
        <Text style={styles.resultsText}>
          {filteredProperties.length} {filteredProperties.length === 1 ? 'result' : 'results'}
        </Text>
        
        {filteredProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {properties.length === 0 ? 'No Properties Yet' : 'No Results Found'}
            </Text>
            <Text style={styles.emptyStateText}>
              {properties.length === 0 
                ? isOwner 
                  ? 'Add your first property to get started'
                  : 'No cleaning assignments found'
                : 'Try adjusting your search or filters'
              }
            </Text>
            {isOwner && properties.length === 0 && (
              <TouchableOpacity 
                style={styles.emptyActionButton}
                onPress={() => router.push('/properties/add')}
              >
                <Text style={styles.emptyActionText}>Add Property</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredProperties.map((property) => {
            if (isOwner) {
              return (
                <PropertyOwnerCard
                  key={property.id}
                  property={property}
                  onPress={() => router.push(`/properties/${property.id}`)}
                  onEdit={handleEditProperty}
                  onScheduleClean={handleScheduleClean}
                  onAssignCleaner={handleAssignCleaner}
                  onUpdateSession={handleUpdateSession}
                />
              );
            } else {
              return (
                <CleanerPropertyCard
                  key={property.id}
                  property={property}
                  onPress={() => router.push(`/properties/${property.id}`)}
                  onStartCleaning={handleStartCleaning}
                  onReportIssue={handleReportIssue}
                />
              );
            }
          })
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
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statsContainer: {
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
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  emptyActionButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});