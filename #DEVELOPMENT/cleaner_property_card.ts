// components/CleanerPropertyCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

interface LinenRequirement {
  bed_sheets_queen: number;
  bed_sheets_king: number;
  bed_sheets_double: number;
  bed_sheets_single: number;
  pillow_cases: number;
  duvet_covers: number;
  towels_bath: number;
  towels_hand: number;
  towels_pool: number;
  kitchen_towels: number;
  bath_mats: number;
}

interface CleaningSession {
  id: string;
  guest_count: number;
  checkin_time: string;
  checkout_time: string;
  scheduled_cleaning_time: string;
  session_type: 'checkout_clean' | 'checkin_prep' | 'maintenance_clean' | 'deep_clean';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  special_requests?: string;
  guest_notes?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  linen_requirements?: LinenRequirement;
}

interface EnhancedProperty {
  id: string;
  name: string;
  address: string;
  rooms: number;
  bathrooms: number;
  image_url: string;
  max_occupancy: number;
  
  // Access info
  access_method: 'key_lockbox' | 'smart_lock' | 'doorman' | 'owner_present' | 'other';
  access_code?: string;
  access_instructions?: string;
  wifi_name?: string;
  wifi_password?: string;
  
  // Property features affecting cleaning
  has_pool: boolean;
  has_hot_tub: boolean;
  has_bbq: boolean;
  has_balcony: boolean;
  special_areas?: string[];
  
  // Cleaning logistics
  cleaning_supplies_location?: string;
  vacuum_location?: string;
  linen_storage_location?: string;
  estimated_cleaning_duration: number;
  
  // Current/next session
  current_session?: CleaningSession;
  next_session?: CleaningSession;
}

interface CleanerPropertyCardProps {
  property: EnhancedProperty;
  onPress: () => void;
  onStartCleaning?: (sessionId: string) => void;
  onReportIssue?: (propertyId: string) => void;
}

export default function CleanerPropertyCard({ 
  property, 
  onPress, 
  onStartCleaning,
  onReportIssue 
}: CleanerPropertyCardProps) {
  const { profile } = useAuth();
  const isOwner = profile?.role === 'property_owner';
  
  const currentSession = property.current_session || property.next_session;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'in_progress': return '#8b5cf6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'checkout_clean': return 'Checkout Clean';
      case 'checkin_prep': return 'Check-in Prep';
      case 'maintenance_clean': return 'Maintenance';
      case 'deep_clean': return 'Deep Clean';
      default: return type;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getTotalLinenItems = (linen?: LinenRequirement) => {
    if (!linen) return 0;
    return Object.values(linen).reduce((sum: number, count: number) => sum + count, 0);
  };

  const handleStartCleaning = () => {
    if (currentSession && onStartCleaning) {
      Alert.alert(
        'Start Cleaning',
        `Begin ${getSessionTypeLabel(currentSession.session_type).toLowerCase()} for ${property.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start', onPress: () => onStartCleaning(currentSession.id) }
        ]
      );
    }
  };

  const isCancelled = currentSession?.status === 'cancelled';
  const isToday = currentSession && formatDate(currentSession.scheduled_cleaning_time) === 'Today';

  return (
    <TouchableOpacity style={[styles.card, isCancelled && styles.cancelledCard]} onPress={onPress}>
      <Image source={{ uri: property.image_url }} style={styles.image} />
      
      {/* Cancelled overlay */}
      {isCancelled && (
        <View style={styles.cancelledOverlay}>
          <Text style={styles.cancelledText}>CANCELLED</Text>
          {currentSession?.cancelled_at && (
            <Text style={styles.cancelledTime}>
              {new Date(currentSession.cancelled_at).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              })}
            </Text>
          )}
        </View>
      )}

      <View style={styles.content}>
        {/* Header with property name and urgency indicator */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{property.name}</Text>
            {isToday && !isCancelled && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayText}>TODAY</Text>
              </View>
            )}
          </View>
          {currentSession && (
            <View style={[styles.status, { backgroundColor: getStatusColor(currentSession.status) }]}>
              <Text style={styles.statusText}>{currentSession.status.replace('_', ' ')}</Text>
            </View>
          )}
        </View>

        <Text style={styles.address}>{property.address}</Text>

        {/* Critical Info Row */}
        {currentSession && (
          <View style={styles.criticalInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Guests</Text>
              <Text style={styles.infoValue}>{currentSession.guest_count}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Check-out</Text>
              <Text style={styles.infoValue}>{formatTime(currentSession.checkout_time)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Clean Time</Text>
              <Text style={styles.infoValue}>{formatTime(currentSession.scheduled_cleaning_time)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{property.estimated_cleaning_duration}min</Text>
            </View>
          </View>
        )}

        {/* Linen Requirements */}
        {currentSession?.linen_requirements && (
          <View style={styles.linenSection}>
            <Text style={styles.sectionTitle}>Linen Required ({getTotalLinenItems(currentSession.linen_requirements)} items)</Text>
            <View style={styles.linenGrid}>
              {currentSession.linen_requirements.bed_sheets_queen > 0 && (
                <Text style={styles.linenItem}>🛏️ Queen sheets: {currentSession.linen_requirements.bed_sheets_queen}</Text>
              )}
              {currentSession.linen_requirements.towels_bath > 0 && (
                <Text style={styles.linenItem}>🛁 Bath towels: {currentSession.linen_requirements.towels_bath}</Text>
              )}
              {currentSession.linen_requirements.pillow_cases > 0 && (
                <Text style={styles.linenItem}>🪶 Pillow cases: {currentSession.linen_requirements.pillow_cases}</Text>
              )}
              {currentSession.linen_requirements.kitchen_towels > 0 && (
                <Text style={styles.linenItem}>🧽 Kitchen towels: {currentSession.linen_requirements.kitchen_towels}</Text>
              )}
            </View>
          </View>
        )}

        {/* Access Information */}
        <View style={styles.accessSection}>
          <Text style={styles.sectionTitle}>Access</Text>
          <View style={styles.accessInfo}>
            <Text style={styles.accessMethod}>
              {property.access_method.replace('_', ' ').toUpperCase()}
              {property.access_code && ` • Code: ${property.access_code}`}
            </Text>
            {property.access_instructions && (
              <Text style={styles.accessInstructions}>{property.access_instructions}</Text>
            )}
          </View>
        </View>

        {/* Special Areas & Features */}
        {(property.special_areas?.length || property.has_pool || property.has_hot_tub) && (
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Special Areas</Text>
            <View style={styles.featuresGrid}>
              {property.has_pool && <Text style={styles.feature}>🏊‍♂️ Pool</Text>}
              {property.has_hot_tub && <Text style={styles.feature}>🛁 Hot Tub</Text>}
              {property.has_bbq && <Text style={styles.feature}>🔥 BBQ</Text>}
              {property.has_balcony && <Text style={styles.feature}>🌅 Balcony</Text>}
              {property.special_areas?.map((area, index) => (
                <Text key={index} style={styles.feature}>📍 {area}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Special Requests */}
        {currentSession?.special_requests && (
          <View style={styles.requestsSection}>
            <Text style={styles.sectionTitle}>Special Requests</Text>
            <Text style={styles.requestsText}>{currentSession.special_requests}</Text>
          </View>
        )}

        {/* Cancellation Notice */}
        {isCancelled && currentSession?.cancellation_reason && (
          <View style={styles.cancellationSection}>
            <Text style={styles.cancellationTitle}>Cancellation Reason</Text>
            <Text style={styles.cancellationReason}>{currentSession.cancellation_reason}</Text>
          </View>
        )}

        {/* Action Buttons */}
        {!isOwner && (
          <View style={styles.actionButtons}>
            {currentSession?.status === 'confirmed' && !isCancelled && (
              <TouchableOpacity style={styles.startButton} onPress={handleStartCleaning}>
                <Text style={styles.startButtonText}>Start Cleaning</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.issueButton} 
              onPress={() => onReportIssue?.(property.id)}
            >
              <Text style={styles.issueButtonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        )}
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
    overflow: 'hidden',
  },
  cancelledCard: {
    opacity: 0.8,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  image: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  cancelledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cancelledText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelledTime: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  todayBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  todayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
    marginBottom: 12,
  },
  criticalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  linenSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  linenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  linenItem: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accessSection: {
    marginBottom: 12,
  },
  accessInfo: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 6,
  },
  accessMethod: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400e',
  },
  accessInstructions: {
    fontSize: 12,
    color: '#92400e',
    marginTop: 2,
  },
  featuresSection: {
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  feature: {
    fontSize: 12,
    color: '#059669',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requestsSection: {
    marginBottom: 12,
  },
  requestsText: {
    fontSize: 13,
    color: '#374151',
    backgroundColor: '#ddd6fe',
    padding: 8,
    borderRadius: 6,
    fontStyle: 'italic',
  },
  cancellationSection: {
    marginBottom: 12,
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 6,
  },
  cancellationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  cancellationReason: {
    fontSize: 12,
    color: '#dc2626',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  issueButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    flex: 1,
  },
  issueButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },