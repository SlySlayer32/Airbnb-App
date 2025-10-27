import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { EnhancedProperty, mockEnhancedProperties } from '@airbnb/core-models';
import { propertyService } from '@airbnb/data-access-api';
import { useAuth } from '@airbnb/data-access-auth';
import {
  CleanerPropertyCard,
  NotificationBadge,
  OwnerPropertyCard,
} from '@airbnb/ui-components';

export default function PropertiesScreen() {
  const { user, profile } = useAuth();
  const [properties, setProperties] = useState<EnhancedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // For demo purposes when not logged in
  const [demoMode, setDemoMode] = useState<'owner' | 'cleaner'>('cleaner');

  const loadProperties = useCallback(async () => {
    if (!user || !profile) return;

    try {
      setRefreshing(true);
      let props: EnhancedProperty[] = [];
      if (profile.role === 'property_owner') {
        props = await propertyService.getPropertiesForOwner();
      } else if (profile.role === 'cleaner') {
        props = await propertyService.getPropertiesForCleaner();
      }
      setProperties(props);
    } catch (_error) {
      // console.error('Error loading properties:', error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [profile, user]);

  useEffect(() => {
    if (user && profile) {
      loadProperties();
    } else {
      // Handle demo mode
      setProperties(mockEnhancedProperties);
      setIsLoading(false);
    }
  }, [user, profile, loadProperties]);

  const handleRefresh = async () => {
    if (user && profile) {
      await loadProperties();
    }
  };

  const filteredProperties = (
    user ? properties : mockEnhancedProperties
  ).filter(property => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());

    // Enhanced filtering based on role
    const effectiveRole = user ? profile?.role : demoMode;

    if (effectiveRole === 'cleaner') {
      // For cleaners, filter by session status
      if (statusFilter === 'all') return matchesSearch;
      if (statusFilter === 'scheduled') {
        return (
          matchesSearch &&
          (property.current_session?.status === 'scheduled' ||
            property.current_session?.status === 'confirmed')
        );
      }
      if (statusFilter === 'in_progress') {
        return (
          matchesSearch && property.current_session?.status === 'in_progress'
        );
      }
      if (statusFilter === 'completed') {
        return (
          matchesSearch && property.current_session?.status === 'completed'
        );
      }
    } else {
      // For owners, filter by property status
      const matchesFilter =
        statusFilter === 'all' || property.status === statusFilter;
      return matchesSearch && matchesFilter;
    }

    return matchesSearch;
  });

  const getStatusFilters = () => {
    const effectiveRole = user ? profile?.role : demoMode;
    const sourceProperties = user ? properties : mockEnhancedProperties;

    if (effectiveRole === 'cleaner') {
      // For cleaners, show session-based filters
      return [
        { key: 'all', label: 'All', count: sourceProperties.length },
        {
          key: 'scheduled',
          label: 'Scheduled',
          count: sourceProperties.filter(
            p =>
              p.current_session?.status === 'scheduled' ||
              p.current_session?.status === 'confirmed'
          ).length,
        },
        {
          key: 'in_progress',
          label: 'In Progress',
          count: sourceProperties.filter(
            p => p.current_session?.status === 'in_progress'
          ).length,
        },
        {
          key: 'completed',
          label: 'Completed',
          count: sourceProperties.filter(
            p => p.current_session?.status === 'completed'
          ).length,
        },
      ];
    } else {
      // For owners, show property status filters
      return [
        { key: 'all', label: 'All', count: sourceProperties.length },
        {
          key: 'active',
          label: 'Active',
          count: sourceProperties.filter(p => p.status === 'active').length,
        },
        {
          key: 'occupied',
          label: 'Occupied',
          count: sourceProperties.filter(p => p.status === 'occupied').length,
        },
        {
          key: 'maintenance',
          label: 'Maintenance',
          count: sourceProperties.filter(p => p.status === 'maintenance')
            .length,
        },
      ];
    }
  };

  const handleScheduleClean = (propertyId: string) => {
    // TODO: Navigate to scheduling screen
    Alert.alert(
      'Schedule Clean',
      `Scheduling cleaning for property ${propertyId}`
    );
  };

  const handleAssignCleaner = (propertyId: string) => {
    // TODO: Navigate to cleaner assignment screen
    Alert.alert(
      'Assign Cleaner',
      `Assigning cleaner for property ${propertyId}`
    );
  };

  const handleEditProperty = (propertyId: string) => {
    // TODO: Navigate to property edit screen
    Alert.alert('Edit Property', `Editing property ${propertyId}`);
  };

  const statusFilters = getStatusFilters();
  const effectiveRole = user ? profile?.role : demoMode;

  if (isLoading) {
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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#007AFF"
        />
      }
    >
      <View style={styles.header}>
        {!user && (
          <>
            <Text style={styles.demoTitle}>
              🎯 Cleaner-Focused Property Management Demo
            </Text>
            <Text style={styles.demoSubtitle}>
              Real-world solution for cleaner workflow problems
            </Text>

            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  demoMode === 'cleaner' && styles.modeButtonActive,
                ]}
                onPress={() => setDemoMode('cleaner')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    demoMode === 'cleaner' && styles.modeButtonTextActive,
                  ]}
                >
                  🧹 Cleaner View
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  demoMode === 'owner' && styles.modeButtonActive,
                ]}
                onPress={() => setDemoMode('owner')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    demoMode === 'owner' && styles.modeButtonTextActive,
                  ]}
                >
                  🏠 Owner View
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {effectiveRole === 'cleaner'
              ? 'My Cleaning Schedule'
              : 'Properties'}
          </Text>
          {user && <NotificationBadge />}
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {statusFilters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                statusFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === filter.key && styles.filterTextActive,
                ]}
              >
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {effectiveRole === 'cleaner' && (
          <View style={styles.cleanerInfo}>
            <Text style={styles.cleanerInfoTitle}>
              {user ? "📍 Today's Schedule" : '👋 Welcome Maria!'}
            </Text>
            <Text style={styles.cleanerInfoText}>
              {user
                ? 'Tap any property for details and updates'
                : 'Here are your assigned cleaning sessions. All essential information is displayed upfront.'}
            </Text>
          </View>
        )}

        <Text style={styles.resultsText}>
          {filteredProperties.length} properties found
        </Text>

        {filteredProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {effectiveRole === 'cleaner'
                ? 'No cleaning sessions assigned'
                : 'No properties found'}
            </Text>
            <Text style={styles.emptyStateText}>
              {effectiveRole === 'cleaner'
                ? 'Check back later for new cleaning assignments.'
                : 'Try adjusting your search or filters.'}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredProperties.map(property =>
            effectiveRole === 'cleaner' ? (
              <CleanerPropertyCard
                key={property.id}
                property={property}
                onPress={() => {
                  // console.log('Property pressed:', property.name);
                  router.push(`/property/${property.id}`);
                }}
              />
            ) : (
              <OwnerPropertyCard
                key={property.id}
                property={property}
                onPress={() => {
                  // console.log('Property pressed:', property.name);
                  router.push(`/property/${property.id}`);
                }}
              />
            )
          )
        )}

        {!user && (
          <View style={styles.features}>
            <Text style={styles.featuresTitle}>
              ✨ Key Features Demonstrated
            </Text>
            <Text style={styles.featureItem}>
              • 👥 Guest count prominently displayed for linen preparation
            </Text>
            <Text style={styles.featureItem}>
              • 🔑 Access codes and instructions clearly visible
            </Text>
            <Text style={styles.featureItem}>
              • 🛏️ Automatic linen requirements based on guest count
            </Text>
            <Text style={styles.featureItem}>
              • ❌ Clear cancellation handling with notice period
            </Text>
            <Text style={styles.featureItem}>
              • 📍 Special areas and cleaning requirements highlighted
            </Text>
            <Text style={styles.featureItem}>
              • 🆘 Emergency contact information readily available
            </Text>
            <Text style={styles.featureItem}>
              • 📱 WiFi credentials for cleaner mobile access
            </Text>
          </View>
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
  demoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  demoSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  modeButtonTextActive: {
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cleanerInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  cleanerInfoText: {
    fontSize: 14,
    color: '#1e40af',
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
  features: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 6,
    lineHeight: 20,
  },
});
