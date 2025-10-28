import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PhotoProofService } from '../services/photoProofService';
import {
  PhotoCaptureResult,
  PhotoProofRequirement,
  PhotoProofStatus,
} from '../types';

interface PhotoProofGateProps {
  sessionId: string;
  sessionType: string;
  propertyRooms: number;
  onPhotoProofComplete: (isComplete: boolean) => void;
  onCompleteSession: () => void;
}

/**
 * PhotoProofGate Component - Ensures cleaning completion with photo evidence
 *
 * Business Purpose: Blocks session completion until required photos are captured,
 * providing property owners with visual proof of completed cleaning work.
 */
export const PhotoProofGate: React.FC<PhotoProofGateProps> = ({
  sessionId,
  sessionType,
  propertyRooms,
  onPhotoProofComplete,
  onCompleteSession,
}) => {
  const [photoStatus, setPhotoStatus] = useState<PhotoProofStatus | null>(null);
  const [requirements, setRequirements] = useState<PhotoProofRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [capturingPhoto, setCapturingPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPhotoRequirements();
  }, [sessionId]);

  const loadPhotoRequirements = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate requirements for this session
      const generatedRequirements =
        await PhotoProofService.generatePhotoRequirements(
          sessionId,
          sessionType,
          propertyRooms
        );

      // Get current status
      const status = await PhotoProofService.getPhotoProofStatus(sessionId);

      setRequirements(generatedRequirements);
      setPhotoStatus(status);
      onPhotoProofComplete(status.is_complete);
    } catch (err) {
      setError('Failed to load photo requirements');
      console.error('Error loading photo requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = async (requirement: PhotoProofRequirement) => {
    try {
      setCapturingPhoto(requirement.id);
      setError(null);

      const result: PhotoCaptureResult = await PhotoProofService.capturePhoto(
        sessionId,
        requirement.category,
        requirement.area_name
      );

      if (result.success && result.photo_url) {
        // Mark requirement as completed
        const success = await PhotoProofService.markPhotoCompleted(
          sessionId,
          requirement.id,
          result.photo_url
        );

        if (success) {
          // Update local state
          const updatedRequirements = requirements.map(req =>
            req.id === requirement.id
              ? { ...req, is_completed: true, photo_url: result.photo_url }
              : req
          );

          setRequirements(updatedRequirements);

          // Recalculate status
          const totalRequired = updatedRequirements.filter(
            req => req.is_required
          ).length;
          const totalCompleted = updatedRequirements.filter(
            req => req.is_completed
          ).length;
          const isComplete = totalCompleted >= totalRequired;

          setPhotoStatus({
            session_id: sessionId,
            total_required: totalRequired,
            total_completed: totalCompleted,
            is_complete: isComplete,
            missing_categories: updatedRequirements
              .filter(req => req.is_required && !req.is_completed)
              .map(req => req.category),
            requirements: updatedRequirements,
          });

          onPhotoProofComplete(isComplete);

          Alert.alert(
            'Photo Captured!',
            `Photo for ${requirement.area_name} has been captured successfully.`
          );
        } else {
          setError('Failed to save photo. Please try again.');
        }
      } else {
        setError(result.error || 'Failed to capture photo. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while capturing the photo.');
      console.error('Error capturing photo:', err);
    } finally {
      setCapturingPhoto(null);
    }
  };

  const handleCompleteSession = async () => {
    try {
      const validation = await PhotoProofService.validatePhotoProof(sessionId);

      if (validation.can_complete_session) {
        Alert.alert(
          'Complete Session',
          'All required photos have been captured. Are you sure you want to complete this session?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Complete',
              style: 'default',
              onPress: onCompleteSession,
            },
          ]
        );
      } else {
        Alert.alert('Photos Required', validation.validation_message, [
          { text: 'OK' },
        ]);
      }
    } catch (err) {
      setError('Failed to validate photo proof');
      console.error('Error validating photo proof:', err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'before_cleaning':
        return 'camera-outline';
      case 'after_cleaning':
        return 'checkmark-circle-outline';
      case 'specific_area':
        return 'location-outline';
      case 'issue_report':
        return 'warning-outline';
      default:
        return 'camera-outline';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'before_cleaning':
        return '#FF9500';
      case 'after_cleaning':
        return '#34C759';
      case 'specific_area':
        return '#007AFF';
      case 'issue_report':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading photo requirements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadPhotoRequirements}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photo Proof Required</Text>
        <Text style={styles.subtitle}>
          Capture photos to complete this cleaning session
        </Text>
      </View>

      {photoStatus && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round((photoStatus.total_completed / photoStatus.total_required) * 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {photoStatus.total_completed} of {photoStatus.total_required} photos
            captured
          </Text>
        </View>
      )}

      <ScrollView style={styles.requirementsList}>
        {requirements.map(requirement => (
          <View key={requirement.id} style={styles.requirementCard}>
            <View style={styles.requirementHeader}>
              <View style={styles.requirementInfo}>
                <Ionicons
                  name={getCategoryIcon(requirement.category)}
                  size={24}
                  color={getCategoryColor(requirement.category)}
                />
                <View style={styles.requirementDetails}>
                  <Text style={styles.areaName}>{requirement.area_name}</Text>
                  <Text style={styles.categoryText}>
                    {requirement.category.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              {requirement.is_completed ? (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                  <Text style={styles.completedText}>Done</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.captureButton,
                    capturingPhoto === requirement.id &&
                      styles.captureButtonDisabled,
                  ]}
                  onPress={() => capturePhoto(requirement)}
                  disabled={capturingPhoto === requirement.id}
                >
                  {capturingPhoto === requirement.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="camera" size={20} color="#FFFFFF" />
                      <Text style={styles.captureButtonText}>Capture</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {requirement.photo_url && (
              <View style={styles.photoPreview}>
                <Image
                  source={{ uri: requirement.photo_url }}
                  style={styles.photoImage}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            !photoStatus?.is_complete && styles.completeButtonDisabled,
          ]}
          onPress={handleCompleteSession}
          disabled={!photoStatus?.is_complete}
        >
          <Text
            style={[
              styles.completeButtonText,
              !photoStatus?.is_complete && styles.completeButtonTextDisabled,
            ]}
          >
            Complete Session
          </Text>
        </TouchableOpacity>

        {!photoStatus?.is_complete && (
          <Text style={styles.completionHint}>
            Complete all required photos to finish the session
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  requirementsList: {
    flex: 1,
    padding: 20,
  },
  requirementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requirementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requirementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requirementDetails: {
    marginLeft: 12,
    flex: 1,
  },
  areaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  categoryText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  photoPreview: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: 120,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  completeButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  completeButtonTextDisabled: {
    color: '#8E8E93',
  },
  completionHint: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
