import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EnhancedProperty, CleaningSession } from '@/types';
import { cleaningSessionService } from '@/services';
import CleaningUpdates from './CleaningUpdates';

interface CleanerPropertyCardProps {
  property: EnhancedProperty;
  onPress: () => void;
}

export default function CleanerPropertyCard({ property, onPress }: CleanerPropertyCardProps) {
  const [showUpdates, setShowUpdates] = useState(false);
  const session = property.current_session;
  
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const handleStartCleaning = async () => {
    if (!session) return;
    
    try {
      await cleaningSessionService.startCleaning(session.id);
      Alert.alert('Success', 'Cleaning session started!');
    } catch (error) {
      Alert.alert('Error', 'Failed to start cleaning session');
    }
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Report Issue',
      'What type of issue would you like to report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Minor Issue', 
          onPress: () => reportIssue('minor', 'Minor maintenance or cleaning issue') 
        },
        { 
          text: 'Urgent Issue', 
          onPress: () => reportIssue('urgent', 'Urgent issue requiring immediate attention'),
          style: 'destructive'
        },
      ]
    );
  };

  const reportIssue = async (severity: 'minor' | 'urgent', description: string) => {
    if (!session) return;
    
    try {
      const { cleaningUpdateService } = await import('@/services/cleaningUpdateService');
      await cleaningUpdateService.reportIssue(session.id, {
        message: description,
        is_urgent: severity === 'urgent'
      });
      
      Alert.alert(
        'Issue Reported', 
        `${severity === 'urgent' ? 'Urgent issue' : 'Issue'} has been reported to the property owner.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to report issue. Please try again.');
    }
  };

  const getLinenSummary = () => {
    if (!session?.linen_requirements) return 'Standard linen set';
    
    const linen = session.linen_requirements;
    const totalSheets = linen.bed_sheets_single + linen.bed_sheets_double + linen.bed_sheets_queen + linen.bed_sheets_king;
    const totalTowels = linen.towels_bath + linen.towels_hand + linen.towels_face;
    
    return `${totalSheets} sheet sets, ${totalTowels} towels`;
  };

  const isCancelled = session?.status === 'cancelled';
  const isShortNotice = session?.cancellation_notice_hours && session.cancellation_notice_hours < 24;

  return (
    <TouchableOpacity style={[styles.card, isCancelled && styles.cancelledCard]} onPress={onPress}>
      {/* Cancellation Overlay */}
      {isCancelled && (
        <View style={styles.cancellationOverlay}>
          <View style={styles.cancellationBanner}>
            <Ionicons name="close-circle" size={20} color="#ef4444" />
            <Text style={styles.cancellationText}>
              CANCELLED {isShortNotice && '(SHORT NOTICE)'}
            </Text>
          </View>
          <Text style={styles.cancellationReason}>
            Reason: {session?.cancellation_reason}
          </Text>
          {session?.cancelled_at && (
            <Text style={styles.cancellationTime}>
              Cancelled: {formatDate(session.cancelled_at)} at {formatTime(session.cancelled_at)}
            </Text>
          )}
        </View>
      )}

      <Image source={{ uri: property.image_url }} style={styles.image} />
      
      <View style={styles.content}>
        {/* Header with property name and guest count */}
        <View style={styles.header}>
          <Text style={styles.propertyName}>{property.name}</Text>
          {session && (
            <View style={styles.guestCountBadge}>
              <Ionicons name="people" size={16} color="white" />
              <Text style={styles.guestCountText}>{session.guest_count}</Text>
            </View>
          )}
        </View>

        {/* Essential Times */}
        {session && (
          <View style={styles.timingSection}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Check-out:</Text>
              <Text style={styles.timeValue}>{formatTime(session.checkout_time)}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Cleaning:</Text>
              <Text style={styles.timeValue}>{formatTime(session.scheduled_cleaning_time)}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Next check-in:</Text>
              <Text style={styles.timeValue}>{formatTime(session.checkin_time)}</Text>
            </View>
          </View>
        )}

        {/* Access Information */}
        <View style={styles.accessSection}>
          <Text style={styles.sectionTitle}>Access</Text>
          <View style={styles.accessInfo}>
            <Ionicons name="key" size={16} color="#374151" />
            <Text style={styles.accessMethod}>
              {property.access_method?.replace('_', ' ').toUpperCase()}
            </Text>
            {property.access_code && (
              <Text style={styles.accessCode}>Code: {property.access_code}</Text>
            )}
          </View>
          {property.access_instructions && (
            <Text style={styles.accessInstructions}>{property.access_instructions}</Text>
          )}
        </View>

        {/* Linen Requirements */}
        <View style={styles.linenSection}>
          <Text style={styles.sectionTitle}>🛏️ Linen Requirements ({session?.guest_count || property.max_occupancy} guests)</Text>
          {session?.linen_requirements ? (
            <View style={styles.linenGrid}>
              {session.linen_requirements.bed_sheets_queen > 0 && (
                <Text style={styles.linenItem}>• {session.linen_requirements.bed_sheets_queen} Queen sheets</Text>
              )}
              {session.linen_requirements.bed_sheets_king > 0 && (
                <Text style={styles.linenItem}>• {session.linen_requirements.bed_sheets_king} King sheets</Text>
              )}
              {session.linen_requirements.bed_sheets_double > 0 && (
                <Text style={styles.linenItem}>• {session.linen_requirements.bed_sheets_double} Double sheets</Text>
              )}
              {session.linen_requirements.pillow_cases > 0 && (
                <Text style={styles.linenItem}>• {session.linen_requirements.pillow_cases} Pillowcases</Text>
              )}
              {session.linen_requirements.duvet_covers > 0 && (
                <Text style={styles.linenItem}>• {session.linen_requirements.duvet_covers} Duvet covers</Text>
              )}
              {session.linen_requirements.towels_bath > 0 && (
                <Text style={styles.linenItem}>• {session.linen_requirements.towels_bath} Bath towels</Text>
              )}
              {session.linen_requirements.towels_hand > 0 && (
                <Text style={styles.linenItem}>• {session.linen_requirements.towels_hand} Hand towels</Text>
              )}
              {session.linen_requirements.kitchen_towels > 0 && (
                <Text style={styles.linenItem}>• {session.linen_requirements.kitchen_towels} Kitchen towels</Text>
              )}
              {session.linen_requirements.bath_mats > 0 && (
                <Text style={styles.linenItem}>• {session.linen_requirements.bath_mats} Bath mats</Text>
              )}
            </View>
          ) : (
            <Text style={styles.linenSummary}>{getLinenSummary()}</Text>
          )}
        </View>

        {/* Special Areas and Requests */}
        {(property.special_areas?.length || session?.special_requests) && (
          <View style={styles.specialSection}>
            <Text style={styles.sectionTitle}>Special Areas</Text>
            {property.special_areas?.map((area, index) => (
              <Text key={index} style={styles.specialArea}>• {area}</Text>
            ))}
            {session?.special_requests && (
              <Text style={styles.specialRequests}>{session.special_requests}</Text>
            )}
          </View>
        )}

        {/* WiFi Info */}
        {property.wifi_name && (
          <View style={styles.wifiSection}>
            <Ionicons name="wifi" size={16} color="#374151" />
            <Text style={styles.wifiInfo}>
              {property.wifi_name} / {property.wifi_password}
            </Text>
          </View>
        )}

        {/* Emergency Contact */}
        {property.emergency_contact_name && (
          <View style={styles.emergencyContact}>
            <Ionicons name="call" size={16} color="#ef4444" />
            <Text style={styles.emergencyText}>
              Emergency: {property.emergency_contact_name} - {property.emergency_contact_phone}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        {session && !isCancelled && (
          <View style={styles.actionButtons}>
            {session.status === 'confirmed' && (
              <TouchableOpacity style={styles.startButton} onPress={handleStartCleaning}>
                <Text style={styles.startButtonText}>Start Cleaning</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.issueButton} onPress={handleReportIssue}>
              <Ionicons name="warning" size={16} color="#ef4444" />
              <Text style={styles.issueButtonText}>Report Issue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updatesButton} onPress={() => setShowUpdates(true)}>
              <Ionicons name="chatbubbles" size={16} color="#007AFF" />
              <Text style={styles.updatesButtonText}>Updates</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status Badge */}
        {session && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
            <Text style={styles.statusText}>{session.status.replace('_', ' ').toUpperCase()}</Text>
          </View>
        )}
      </View>

      {/* Cleaning Updates Modal */}
      {showUpdates && session && (
        <CleaningUpdates
          sessionId={session.id}
          onClose={() => setShowUpdates(false)}
        />
      )}
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
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  cancellationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fef2f2',
    padding: 12,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  cancellationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cancellationText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  cancellationReason: {
    fontSize: 12,
    color: '#7f1d1d',
    marginBottom: 2,
  },
  cancellationTime: {
    fontSize: 11,
    color: '#7f1d1d',
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  guestCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestCountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timingSection: {
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  accessSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  accessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  accessMethod: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  accessCode: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  accessInstructions: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  linenSection: {
    marginBottom: 12,
  },
  linenSummary: {
    fontSize: 14,
    color: '#374151',
  },
  linenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  linenItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    width: '48%',
  },
  specialSection: {
    marginBottom: 12,
  },
  specialArea: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  specialRequests: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '500',
    marginTop: 4,
  },
  wifiSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wifiInfo: {
    marginLeft: 6,
    fontSize: 14,
    color: '#374151',
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
  },
  emergencyText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  issueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  issueButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  updatesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginLeft: 8,
  },
  updatesButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});