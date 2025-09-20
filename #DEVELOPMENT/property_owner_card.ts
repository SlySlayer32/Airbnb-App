// components/PropertyOwnerCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, ScrollView } from 'react-native';

interface PropertyOwnerCardProps {
  property: EnhancedProperty;
  onPress: () => void;
  onEdit?: (propertyId: string) => void;
  onScheduleClean?: (propertyId: string) => void;
  onAssignCleaner?: (propertyId: string) => void;
  onUpdateSession?: (sessionId: string, updates: any) => void;
}

export default function PropertyOwnerCard({ 
  property, 
  onPress, 
  onEdit,
  onScheduleClean,
  onAssignCleaner,
  onUpdateSession 
}: PropertyOwnerCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  
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

  const getOccupancyStatus = () => {
    if (!currentSession) return 'available';
    const now = new Date();
    const checkin = new Date(currentSession.checkin_time);
    const checkout = new Date(currentSession.checkout_time);
    
    if (now >= checkin && now <= checkout) return 'occupied';
    if (now < checkin) return 'reserved';
    return 'available';
  };

  const getOccupancyColor = (status: string) => {
    switch (status) {
      case 'occupied': return '#ef4444';
      case 'reserved': return '#f59e0b';
      case 'available': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleCancelSession = () => {
    if (!currentSession) return;
    
    const now = new Date();
    const scheduledTime = new Date(currentSession.scheduled_cleaning_time);
    const hoursUntil = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    Alert.alert(
      'Cancel Cleaning Session',
      `Are you sure you want to cancel the cleaning for ${property.name}?\n\n${hoursUntil < 24 ? 'Warning: Less than 24 hours notice!' : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => setShowCancelModal(true) }
      ]
    );
  };

  const submitCancellation = () => {
    if (!currentSession || !onUpdateSession) return;
    
    const now = new Date();
    const scheduledTime = new Date(currentSession.scheduled_cleaning_time);
    const noticeHours = Math.max(0, (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    onUpdateSession(currentSession.id, {
      status: 'cancelled',
      cancelled_at: now.toISOString(),
      cancellation_reason: cancellationReason || 'No reason provided',
      cancellation_notice_hours: Math.round(noticeHours)
    });
    
    setShowCancelModal(false);
    setCancellationReason('');
  };

  const occupancyStatus = getOccupancyStatus();
  const isToday = currentSession && formatDate(currentSession.scheduled_cleaning_time) === 'Today';

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={{ uri: property.image_url }} style={styles.image} />
        
        <View style={styles.content}>
          {/* Header with property name and occupancy status */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.name}>{property.name}</Text>
              <View style={[styles.occupancyBadge, { backgroundColor: getOccupancyColor(occupancyStatus) }]}>
                <Text style={styles.occupancyText}>{occupancyStatus.toUpperCase()}</Text>
              </View>
            </View>
            {currentSession && (
              <View style={[styles.status, { backgroundColor: getStatusColor(currentSession.status) }]}>
                <Text style={styles.statusText}>{currentSession.status.replace('_', ' ')}</Text>
              </View>
            )}
          </View>

          <Text style={styles.address}>{property.address}</Text>
          <Text style={styles.details}>
            {property.rooms} bed • {property.bathrooms} bath • Max {property.max_occupancy} guests
          </Text>

          {/* Current/Next Session Info */}
          {currentSession && (
            <View style={styles.sessionSection}>
              <Text style={styles.sectionTitle}>
                {isToday ? 'Today\'s Session' : 'Next Session'} • {currentSession.guest_count} guests
              </Text>
              
              <View style={styles.sessionTimes}>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Check-out</Text>
                  <Text style={styles.timeValue}>{formatTime(currentSession.checkout_time)}</Text>
                </View>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Cleaning</Text>
                  <Text style={styles.timeValue}>{formatTime(currentSession.scheduled_cleaning_time)}</Text>
                </View>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Next Check-in</Text>
                  <Text style={styles.timeValue}>{formatTime(currentSession.checkin_time)}</Text>
                </View>
              </View>

              {currentSession.special_requests && (
                <View style={styles.requestsContainer}>
                  <Text style={styles.requestsLabel}>Special Requests:</Text>
                  <Text style={styles.requestsText}>{currentSession.special_requests}</Text>
                </View>
              )}
            </View>
          )}

          {/* Property Features Summary */}
          <View style={styles.featuresRow}>
            {property.has_pool && <Text style={styles.featureIcon}>🏊‍♂️</Text>}
            {property.has_hot_tub && <Text style={styles.featureIcon}>🛁</Text>}
            {property.has_bbq && <Text style={styles.featureIcon}>🔥</Text>}
            {property.has_balcony && <Text style={styles.featureIcon}>🌅</Text>}
            {property.special_areas?.length && (
              <Text style={styles.specialAreasCount}>+{property.special_areas.length} areas</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => onScheduleClean?.(property.id)}
            >
              <Text style={styles.primaryButtonText}>📅 Schedule</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => onAssignCleaner?.(property.id)}
            >
              <Text style={styles.secondaryButtonText}>👥 Assign</Text>
            </TouchableOpacity>
            
            {currentSession && currentSession.status !== 'cancelled' && currentSession.status !== 'completed' && (
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancelSession}
              >
                <Text style={styles.cancelButtonText}>✕ Cancel</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => onEdit?.(property.id)}
            >
              <Text style={styles.editButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Cancellation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Cleaning Session</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for cancellation. This will be sent to the cleaner.
            </Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Reason for cancellation..."
              multiline
              numberOfLines={3}
              value={cancellationReason}
              onChangeText={setCancellationReason}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton} 
                onPress={submitCancellation}
              >
                <Text style={styles.modalConfirmText}>Cancel Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  image: {
    width: '100%',
    height: 140,
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
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 8,
  },
  occupancyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  occupancyText: {
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
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
  },
  sessionSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sessionTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeItem: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  requestsContainer: {
    backgroundColor: '#ddd6fe',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  requestsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5b21b6',
    marginBottom: 2,
  },
  requestsText: {
    fontSize: 12,
    color: '#5b21b6',
    fontStyle: 'italic',
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  specialAreasCount: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  modalCancelText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalConfirmButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  modalConfirmText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});