import { CleaningSession } from '@airbnb/core-models';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import TodayJobCard from './TodayJobCard';

interface TodayJobsSectionProps {
  sessions: CleaningSession[];
  isLoading: boolean;
}

export default function TodayJobsSection({ sessions, isLoading }: TodayJobsSectionProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'directions' | 'access' | 'requirements' | null>(null);

  const handleDirections = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const property = (session as any).properties || (session as any).property;
    const propertyName = property?.name || 'Property';
    const propertyAddress = property?.address || 'No address';

    Alert.alert(
      'Directions',
      `Navigate to ${propertyName}\n${propertyAddress}`,
      [
        { text: 'Copy Address', onPress: () => console.log('Copy address') },
        { text: 'Open Maps', onPress: () => console.log('Open maps') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAccessInfo = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    setSelectedSessionId(sessionId);
    setModalType('access');
  };

  const handleRequirements = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    setSelectedSessionId(sessionId);
    setModalType('requirements');
  };

  const closeModal = () => {
    setSelectedSessionId(null);
    setModalType(null);
  };

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>TODAY'S JOBS</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>TODAY'S JOBS</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No jobs scheduled for today</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>TODAY'S JOBS</Text>
          <Text style={styles.subtitle}>{sessions.length} job{sessions.length !== 1 ? 's' : ''} scheduled</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {sessions.map((session, index) => (
            <View key={session.id} style={[styles.cardWrapper, index === 0 && styles.firstCard]}>
              <TodayJobCard
                session={session}
                isNextJob={index === 0}
                onPressDirections={handleDirections}
                onPressAccessInfo={handleAccessInfo}
                onPressRequirements={handleRequirements}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Access Info Modal */}
      <Modal visible={modalType === 'access'} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Access Information</Text>
              <Pressable onPress={closeModal}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            {selectedSession && (() => {
              const property = (selectedSession as any).properties || (selectedSession as any).property;
              return (
                <ScrollView style={styles.modalBody}>
                  <Text style={styles.propertyName}>{property?.name || 'Property'}</Text>

                  <View style={styles.infoSection}>
                    <Text style={styles.sectionLabel}>Access Method</Text>
                    <Text style={styles.infoText}>
                      {property?.access_method?.replace('_', ' ').toUpperCase() || 'N/A'}
                    </Text>
                  </View>

                  {property?.access_code && (
                    <View style={styles.infoSection}>
                      <Text style={styles.sectionLabel}>Access Code</Text>
                      <Text style={styles.infoText}>{property.access_code}</Text>
                    </View>
                  )}

                  {property?.access_instructions && (
                    <View style={styles.infoSection}>
                      <Text style={styles.sectionLabel}>Instructions</Text>
                      <Text style={styles.infoText}>{property.access_instructions}</Text>
                    </View>
                  )}

                  {property?.wifi_name && (
                    <View style={styles.infoSection}>
                      <Text style={styles.sectionLabel}>WiFi Network</Text>
                      <Text style={styles.infoText}>{property.wifi_name}</Text>
                      {property.wifi_password && (
                        <Text style={styles.infoText}>Password: {property.wifi_password}</Text>
                      )}
                    </View>
                  )}
                </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>

      {/* Requirements Modal */}
      <Modal visible={modalType === 'requirements'} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cleaning Requirements</Text>
              <Pressable onPress={closeModal}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            {selectedSession && (() => {
              const property = (selectedSession as any).properties || (selectedSession as any).property;
              return (
                <ScrollView style={styles.modalBody}>
                  <Text style={styles.propertyName}>{property?.name || 'Property'}</Text>

                  <View style={styles.infoSection}>
                    <Text style={styles.sectionLabel}>Guest Count</Text>
                    <Text style={styles.infoText}>{selectedSession.guest_count || 'N/A'} guests</Text>
                  </View>

                  {selectedSession.linen_requirements && typeof selectedSession.linen_requirements === 'object' && (
                    <View style={styles.infoSection}>
                      <Text style={styles.sectionLabel}>Linen Requirements</Text>
                      <Text style={styles.infoText}>
                        • {selectedSession.guest_count * 1} bath towels
                      </Text>
                      <Text style={styles.infoText}>
                        • {selectedSession.guest_count * 1} hand towels
                      </Text>
                      <Text style={styles.infoText}>
                        • {selectedSession.guest_count * 2} pillow cases
                      </Text>
                      <Text style={styles.infoText}>
                        • 2 kitchen towels
                      </Text>
                      <Text style={styles.infoText}>
                        • 1 bath mat
                      </Text>
                    </View>
                  )}

                  {property?.special_areas && Array.isArray(property.special_areas) && property.special_areas.length > 0 && (
                    <View style={styles.infoSection}>
                      <Text style={styles.sectionLabel}>Special Areas</Text>
                      {property.special_areas.map((area: string, index: number) => (
                        <Text key={index} style={styles.infoText}>
                          • {area}
                        </Text>
                      ))}
                    </View>
                  )}

                  {property?.cleaning_supplies_location && (
                    <View style={styles.infoSection}>
                      <Text style={styles.sectionLabel}>Supplies Location</Text>
                      <Text style={styles.infoText}>{property.cleaning_supplies_location}</Text>
                    </View>
                  )}

                  {selectedSession.special_requests && (
                    <View style={styles.infoSection}>
                      <Text style={styles.sectionLabel}>Additional Notes</Text>
                      <Text style={styles.infoText}>{selectedSession.special_requests}</Text>
                    </View>
                  )}
                </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  scrollView: {
    paddingLeft: 16,
  },
  cardWrapper: {
    width: 320,
    marginRight: 16,
  },
  firstCard: {
    marginLeft: 0,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalBody: {
    padding: 20,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
  },
});

