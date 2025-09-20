import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EnhancedProperty, CleaningSession } from '@/types';
import { cleaningSessionService } from '@/services';

interface OwnerPropertyCardProps {
  property: EnhancedProperty;
  onPress: () => void;
  onEdit?: (propertyId: string) => void;
  onScheduleClean?: (propertyId: string) => void;
  onAssignCleaner?: (propertyId: string) => void;
}

export default function OwnerPropertyCard({ 
  property, 
  onPress, 
  onEdit,
  onScheduleClean,
  onAssignCleaner
}: OwnerPropertyCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [loading, setLoading] = useState(false);
  
  const currentSession = property.current_session;
  
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

  const getPropertyStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'occupied': return '#f59e0b';
      case 'maintenance': return '#ef4444';
      case 'inactive': return '#6b7280';
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
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const calculateNoticeHours = () => {
    if (!currentSession?.scheduled_cleaning_time) return 0;
    const now = new Date();
    const sessionTime = new Date(currentSession.scheduled_cleaning_time);
    return Math.max(0, Math.floor((sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60)));
  };

  const handleCancelSession = async () => {
    if (!currentSession || !cancellationReason.trim()) {
      Alert.alert('Error', 'Please provide a cancellation reason');
      return;
    }

    const noticeHours = calculateNoticeHours();
    const isShortNotice = noticeHours < 24;

    if (isShortNotice) {
      Alert.alert(
        'Short Notice Warning',
        `You are cancelling with only ${noticeHours} hours notice. This may affect your cleaner's schedule and compensation.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Proceed', onPress: () => executeCancellation(noticeHours) }
        ]
      );
    } else {
      executeCancellation(noticeHours);
    }
  };

  const executeCancellation = async (noticeHours: number) => {
    try {
      setLoading(true);
      await cleaningSessionService.cancelSession(currentSession!.id, {
        cancelled_by: 'owner',
        cancellation_reason: cancellationReason,
        cancellation_notice_hours: noticeHours
      });
      
      setShowCancelModal(false);
      setCancellationReason('');
      Alert.alert('Success', 'Cleaning session cancelled successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={{ uri: property.image_url }} style={styles.image} />
        
        {/* Property Status Badge */}
        <View style={[styles.propertyStatusBadge, { backgroundColor: getPropertyStatusColor(property.status) }]}>
          <Text style={styles.propertyStatusText}>{property.status.toUpperCase()}</Text>
        </View>

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <Text style={styles.address}>{property.address}</Text>
            </View>
            <View style={styles.propertyDetails}>
              <Text style={styles.detailText}>{property.rooms}BR • {property.bathrooms}BA</Text>
              <Text style={styles.detailText}>Max: {property.max_occupancy} guests</Text>
            </View>
          </View>

          {/* Current Session Info */}
          {currentSession && (
            <View style={styles.sessionSection}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTitle}>Current Session</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentSession.status) }]}>
                  <Text style={styles.statusText}>{currentSession.status.replace('_', ' ').toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={styles.sessionDetails}>
                <View style={styles.sessionInfo}>
                  <Ionicons name="people" size={16} color="#374151" />
                  <Text style={styles.sessionText}>
                    {currentSession.guest_count} guests • {currentSession.session_type.replace('_', ' ')}
                  </Text>
                </View>
                
                <View style={styles.sessionInfo}>
                  <Ionicons name="time" size={16} color="#374151" />
                  <Text style={styles.sessionText}>
                    {formatDate(currentSession.scheduled_cleaning_time)} at {formatTime(currentSession.scheduled_cleaning_time)}
                  </Text>
                </View>

                {currentSession.team_members && (
                  <View style={styles.sessionInfo}>
                    <Ionicons name="person" size={16} color="#374151" />
                    <Text style={styles.sessionText}>
                      Assigned: {currentSession.team_members.name}
                    </Text>
                  </View>
                )}

                {currentSession.special_requests && (
                  <View style={styles.specialRequests}>
                    <Text style={styles.specialRequestsText}>
                      Special requests: {currentSession.special_requests}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{property.property_type}</Text>
              <Text style={styles.statLabel}>Type</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{property.estimated_cleaning_duration}min</Text>
              <Text style={styles.statLabel}>Est. Clean</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{property.access_method.replace('_', ' ')}</Text>
              <Text style={styles.statLabel}>Access</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!currentSession && (
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={() => onScheduleClean?.(property.id)}
              >
                <Ionicons name="add" size={16} color="white" />
                <Text style={styles.primaryButtonText}>Schedule Clean</Text>
              </TouchableOpacity>
            )}
            
            {currentSession && currentSession.status !== 'cancelled' && currentSession.status !== 'completed' && (
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowCancelModal(true)}
              >
                <Ionicons name="close" size={16} color="#ef4444" />
                <Text style={styles.cancelButtonText}>Cancel Session</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => onEdit?.(property.id)}
            >
              <Ionicons name="create" size={16} color="#374151" />
              <Text style={styles.secondaryButtonText}>Edit</Text>
            </TouchableOpacity>

            {currentSession && !currentSession.assigned_cleaner_id && (
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={() => onAssignCleaner?.(property.id)}
              >
                <Ionicons name="person-add" size={16} color="#374151" />
                <Text style={styles.secondaryButtonText}>Assign</Text>
              </TouchableOpacity>
            )}
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
            
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color="#f59e0b" />
              <Text style={styles.warningText}>
                {calculateNoticeHours() < 24 
                  ? `Short notice: Only ${calculateNoticeHours()} hours until cleaning`
                  : `${calculateNoticeHours()} hours notice provided`
                }
              </Text>
            </View>

            <Text style={styles.modalLabel}>Reason for cancellation:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Please provide a reason..."
              value={cancellationReason}
              onChangeText={setCancellationReason}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalConfirmButton, loading && styles.modalButtonDisabled]}
                onPress={handleCancelSession}
                disabled={loading}
              >
                <Text style={styles.modalConfirmText}>
                  {loading ? 'Cancelling...' : 'Cancel Session'}
                </Text>
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
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  propertyStatusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  sessionSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sessionDetails: {
    gap: 8,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  specialRequests: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  specialRequestsText: {
    fontSize: 14,
    color: '#92400e',
    fontStyle: 'italic',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    minWidth: 80,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 16,
    textAlign: 'center',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  warningText: {
    color: '#92400e',
    fontSize: 14,
    flex: 1,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
});