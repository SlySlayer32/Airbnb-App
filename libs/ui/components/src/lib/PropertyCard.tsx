import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@airbnb/data-access-auth';
import { EnhancedProperty, Property } from '../types';
import CleanerPropertyCard from './CleanerPropertyCard';

interface PropertyCardProps {
  property: Property | EnhancedProperty;
  onPress: () => void;
}

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  const { profile } = useAuth();

  // Use cleaner-focused card for cleaner role
  if (profile?.role === 'cleaner' && 'current_session' in property) {
    return (
      <CleanerPropertyCard
        property={property as EnhancedProperty}
        onPress={onPress}
      />
    );
  }

  // Default owner/manager view
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'occupied':
        return '#f59e0b';
      case 'maintenance':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle both Property and EnhancedProperty interfaces
  const imageUrl =
    'imageUrl' in property ? property.imageUrl : property.image_url;
  const nextClean = 'nextClean' in property ? property.nextClean : undefined;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{property.name}</Text>
          <View
            style={[
              styles.status,
              { backgroundColor: getStatusColor(property.status) },
            ]}
          >
            <Text style={styles.statusText}>{property.status}</Text>
          </View>
        </View>
        <Text style={styles.address}>{property.address}</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>
            {property.rooms} bed • {property.bathrooms} bath
          </Text>
          {nextClean && (
            <Text style={styles.nextClean}>
              Next clean: {formatDate(nextClean)}
            </Text>
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
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
  address: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  nextClean: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
});
